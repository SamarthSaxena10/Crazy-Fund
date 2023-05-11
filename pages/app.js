import "../styles/globals.css";

//Internal Import
import { Navbar, Footer } from "../Components";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
