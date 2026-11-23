// Old seller products page (listed every product, could not save or edit correctly).
// Sellers manage products in the dashboard at /seller.
import { redirect } from 'next/navigation';

export default function SellerProducts() {
    redirect('/seller');
}
