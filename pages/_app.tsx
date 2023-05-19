import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { LoaderProvider } from '../contexts/loader'
import { UserProvider } from '../contexts/userContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <LoaderProvider value={false}>
        <Component {...pageProps} />
      </LoaderProvider>
    </UserProvider>
  )
}

export default MyApp
