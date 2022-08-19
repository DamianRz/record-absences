import type { NextPage } from 'next'
import Head from 'next/head'
import LoginPage from '../containers/loginPage'

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>RecordAbsences</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-screen h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
        {/* <LoginPage /> */}
      </main>
    </>
  )
}

export default Index
