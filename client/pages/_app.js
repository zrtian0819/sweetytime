import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.scss';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/context/cartContext';
import { UserProvider } from '@/context/userContext';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import '@mdi/font/css/materialdesignicons.min.css';
import { Toaster } from 'react-hot-toast';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	// 使用自訂在頁面層級的版面(layout)
	const getLayout = Component.getLayout || ((page) => page);

	return (
		<SessionProvider session={session}>
			<UserProvider>
				<AdminRouteGuard>
					<Toaster />
					<CartProvider>{getLayout(<Component {...pageProps} />)}</CartProvider>
				</AdminRouteGuard>
			</UserProvider>
		</SessionProvider>
	);
}
