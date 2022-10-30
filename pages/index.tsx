import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/layout/layout'
import UserTable from '../components/userTable'

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
                    <UserTable />
                </Layout>
            </main>
        </>
    )
}

export default Index

