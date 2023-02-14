import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { LoaderProvider } from '../contexts/loader'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LoaderProvider value={false}>
      <Component {...pageProps} />
    </LoaderProvider>)
}

export default MyApp
