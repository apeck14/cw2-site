import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../styles/globals.css";
import { BreakpointProvider } from 'react-socks';

import { useEffect } from "react";
import Layout from "../components/Layout";

export default function App({ Component, pageProps }) {
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap");
    }, []);

    return (
        <BreakpointProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </BreakpointProvider>
    );
}