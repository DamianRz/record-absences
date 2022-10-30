import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/layout/layout'

const Index: NextPage = () => {
    return (
        <>
            <Head>
                <title>Usuarios - ITS</title>
                <meta name="description" content="Administracion de usuarios" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Layout />
            </main>
        </>
    )
}

export default Index
