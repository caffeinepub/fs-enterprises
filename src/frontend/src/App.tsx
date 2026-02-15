import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import ProtectedAdminRoute from './components/Auth/ProtectedAdminRoute';
import ProfileSetupModal from './components/Auth/ProfileSetupModal';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/catalog',
  component: CatalogPage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$productId',
  component: ProductDetailsPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <ProtectedAdminRoute>
      <AdminPage />
    </ProtectedAdminRoute>
  ),
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders',
  component: () => (
    <ProtectedAdminRoute>
      <AdminOrdersPage />
    </ProtectedAdminRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  catalogRoute,
  productRoute,
  cartRoute,
  checkoutRoute,
  aboutRoute,
  adminRoute,
  adminOrdersRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <ProfileSetupModal />
      <Toaster />
    </ThemeProvider>
  );
}
