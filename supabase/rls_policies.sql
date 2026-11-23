-- BuildBazaar: Row Level Security. NOT applied yet: run only AFTER the matching code is live on Vercel.
-- Re-runnable. Server code (app/api/**) uses the secret key and bypasses RLS.
-- Browser / mobile clients use the publishable key and are limited to:
--   * anyone:   read products & categories
--   * buyer:    read own orders + items; move own order Dispatched -> Delivered/Disputed
--   * seller:   insert/update/delete own products (seller_id = auth.uid())
--   * admin:    read/update everything (email below)
-- Order INSERTs happen only via POST /api/checkout (server-side price validation).
-- Keep 'Delivered','Disputed' in sync with BUYER_STATUSES in lib/orderStatus.js.

begin;

create or replace function public.is_admin()
returns boolean
language sql stable
set search_path = ''
as $$
  select coalesce(lower(auth.jwt() ->> 'email') = 'saroshaasim@gmail.com', false)
$$;

alter table public.categories  enable row level security;
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.sellers     enable row level security;  -- no policies: server-only

-- Clean up policy names from earlier drafts (none were ever live)
drop policy if exists "Public Read Products"        on public.products;
drop policy if exists "Seller Insert Products"      on public.products;
drop policy if exists "Seller Update Products"      on public.products;
drop policy if exists "Users Read Own Orders"       on public.orders;
drop policy if exists "Insert Orders Policy"        on public.orders;
drop policy if exists "Admin Update Orders"         on public.orders;
drop policy if exists "Users Read Own Order Items"  on public.order_items;
drop policy if exists "Insert Order Items Policy"   on public.order_items;

-- categories
drop policy if exists categories_read on public.categories;
create policy categories_read on public.categories for select using (true);

-- products
drop policy if exists products_read   on public.products;
drop policy if exists products_insert on public.products;
drop policy if exists products_update on public.products;
drop policy if exists products_delete on public.products;
create policy products_read on public.products for select using (true);
create policy products_insert on public.products for insert to authenticated
  with check (seller_id = auth.uid() or public.is_admin());
create policy products_update on public.products for update to authenticated
  using (seller_id = auth.uid() or public.is_admin())
  with check (seller_id = auth.uid() or public.is_admin());
create policy products_delete on public.products for delete to authenticated
  using (seller_id = auth.uid() or public.is_admin());

-- Only the admin (or server code) may change verified / rating / reviews.
create or replace function public.products_guard()
returns trigger language plpgsql set search_path = '' as $$
begin
  if current_user in ('anon', 'authenticated') and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.verified := false; new.rating := 0; new.reviews := 0;
    else
      new.verified := old.verified; new.rating := old.rating; new.reviews := old.reviews;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists products_guard on public.products;
create trigger products_guard before insert or update on public.products
  for each row execute function public.products_guard();

-- orders
drop policy if exists orders_read   on public.orders;
drop policy if exists orders_update on public.orders;
create policy orders_read on public.orders for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
create policy orders_update on public.orders for update to authenticated
  using (public.is_admin() or (user_id = auth.uid() and status = 'Dispatched'))
  with check (public.is_admin() or (user_id = auth.uid() and status in ('Delivered', 'Disputed')));
-- Clients may only ever change the status column (never totals, fees, user_id)
revoke insert, update, delete on public.orders from anon, authenticated;
grant update (status) on public.orders to authenticated;

-- order_items
drop policy if exists order_items_read on public.order_items;
create policy order_items_read on public.order_items for select to authenticated
  using (exists (
    select 1 from public.orders o
    where o.id = order_items.order_id and (o.user_id = auth.uid() or public.is_admin())
  ));
revoke insert, update, delete on public.order_items from anon, authenticated;

commit;
