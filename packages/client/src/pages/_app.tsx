import { AppProps } from 'next/app';
import { ToastContainer } from "react-toastify";

import '@/styles/globals.css';
import '@/styles/colors.css';
import "react-toastify/ReactToastify.min.css";

import Header from '@/components/layout/Header';
import Providers from '@/components/Providers';

import { useIsSsr } from '../utils/ssr';

function MyApp({ Component, pageProps }: AppProps) {
  const isSsr = useIsSsr();
  if (isSsr) {
    return <div></div>;
  }

  return (
    <Providers data-theme="dark">
      <Header />
        <Component {...pageProps} />
      <ToastContainer position="bottom-right" newestOnTop />
    </Providers>
  );
}

export default MyApp;
