import type { NextPage } from 'next'
import Head from 'next/head'
import Absences from '../components/widgets/absences'
import Layout from '../components/layout'

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>Faltas docentes - admin</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Absences />
        </Layout>
      </main>
    </>
  )
}

export default Index
