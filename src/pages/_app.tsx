import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "../../contexts/CartContext";
import { AdminProvider } from "../../contexts/AdminContext";
import { useRouter } from "next/router";

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  return (
    <SessionProvider session={session}>
      {isAdminRoute ? (
        <AdminProvider>
          <Component {...pageProps} />
        </AdminProvider>
      ) : (
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      )}
    </SessionProvider>
  );
}
