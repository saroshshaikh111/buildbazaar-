# Product Detail Page (PDP) Implementation Plan

Build a premium, high-conversion product page for construction materials that acts as a technical resource for contractors and a simple buying guide for homeowners.

## User Review Required

> [!IMPORTANT]
> This feature introduces a new `product_specs` JSONB column to the `products` table. This allows us to store varying data (like Concrete Grade vs. Pipe Diameter) without rigid schema changes.

> [!TIP]
> We will implement a "Smart Material Calculator" on the page. For Cement, it will calculate bags needed based on area/volume. For Bricks, it will estimate piece count based on wall dimensions.

## Proposed Changes

### Database Layer

#### [MODIFY] [supabase_init.sql](file:///c:/Users/Hp/.gemini/antigravity/scratch/buildbazaar/buildbazaar-app/supabase_init.sql)
Add support for rich product content:
- Add `description` (TEXT).
- Add `images` (TEXT[]).
- Add `product_specs` (JSONB) for technical metrics.
- Add `features` (TEXT[]) for bullet points.

### Components Layer

#### [NEW] [ProductGallery.js](file:///c:/Users/Hp/.gemini/antigravity/scratch/buildbazaar/buildbazaar-app/app/components/ProductGallery.js)
- Responsive image slider/thumbnails.
- Zoom functionality for inspecting material textures.

#### [NEW] [MaterialCalculator.js](file:///c:/Users/Hp/.gemini/antigravity/scratch/buildbazaar/buildbazaar-app/app/components/MaterialCalculator.js)
- Conditional logic based on category (Cement vs. Bricks vs. Paint).
- Input fields for Dimensions (Length, Width, Thickness).
- Auto-calculation of total quantity and estimated cost.

#### [NEW] [ProductSpecs.js](file:///c:/Users/Hp/.gemini/antigravity/scratch/buildbazaar/buildbazaar-app/app/components/ProductSpecs.js)
- Clean tabular view for JSONB specs.
- Download link placeholders for Data Sheets.

### Application Layer (Pages)

#### [NEW] [app/products/[id]/page.js](file:///c:/Users/Hp/.gemini/antigravity/scratch/buildbazaar/buildbazaar-app/app/products/[id]/page.js)
- Server Component to fetch product by ID.
- Layout: 2-column on desktop (Media / Actions + Info).
- Integration with `CartContext` for quantity selection and adding to cart.

## Open Questions

- Do we want to show "Related Products" based on category or "Frequently Bought Together" (e.g., Cement + Sand)?
- Should the calculator results automatically update the "Quantity" input for the Add to Cart button?

## Verification Plan

### Automated Tests
- Browser test: Navigate to `/products/p1`.
- Verify item details match the SQL seed data.
- Test calculator: Input "10m x 10m x 0.1m" for cement and verify it suggests ~130-150 bags.

### Manual Verification
- Verify mobile responsiveness of the image gallery.
- Check "Add to Cart" functionality from the PDP correctly updates the global `CartDrawer`.
