import '../styles/globals.css'
import Head from 'next/head'
import { MoralisProvider } from 'react-moralis'
import Header from '../components/Header'
const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
const SERVER_ID = process.env.NEXT_PUBLIC_MORALIS_SERVER

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>CC-EX</title>
        <meta name="description" content="Carbon Credits Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MoralisProvider appId={APP_ID} serverUrl={SERVER_ID}>
        <Header />
        <Component {...pageProps} />
      </MoralisProvider>
    </div>
  )
}

export default MyApp
