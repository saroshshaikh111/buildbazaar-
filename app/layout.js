import './globals.css';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import CartDrawer from './components/CartDrawer';

export const metadata = {
  title: 'BuildBazaar — Construction Materials Marketplace',
  description: "India's trusted digital marketplace for construction materials.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
            <CartProvider>
                {children}
                <CartDrawer />
            </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
