import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.scss';
import '@mdi/font/css/materialdesignicons.min.css';


export default function MyApp({ Component, pageProps }) {
	// 使用自訂在頁面層級的版面(layout)
	const getLayout = Component.getLayout || ((page) => page);

	return getLayout(<Component {...pageProps} />);
}
