import "../styles/globals.css";
import { Provider } from "react-redux";
import store from "../redux/store";
import Layout from "../components/Layout";
import { CookiesProvider } from "react-cookie";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <CookiesProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CookiesProvider>
    </Provider>
  );
}

export default MyApp;
