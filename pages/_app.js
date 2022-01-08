import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../styles/globals.css";

import { useEffect } from "react";
import Layout from "../components/layout";

export default function App({ Component, pageProps }) {
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap");
    }, []);

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}