import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.scss';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/context/cartContext';
import { UserProvider } from '@/context/userContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import '@mdi/font/css/materialdesignicons.min.css';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	// 使用自訂在頁面層級的版面(layout)
	const getLayout = Component.getLayout || ((page) => page);

	return (
		<SessionProvider session={session}>
		<UserProvider>
			<CartProvider>
				<FavoritesProvider>{getLayout(<Component {...pageProps} />)}</FavoritesProvider>
			</CartProvider>
		</UserProvider>
		</SessionProvider>
	);
}
