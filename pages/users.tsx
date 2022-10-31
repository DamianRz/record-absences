import { Button } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/layout/layout'
import TitleSection from '../components/title-section'
import UserTable from '../components/userTable'

const Index: NextPage = () => {
    return (
        <>
            <Head>
                <title>Usuarios - ITS</title>
                <meta name="description" content="Administracion de usuarios" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Layout>
                    <>
                        <TitleSection title="Lista de Usuarios" />
                        <UserTable />
                    </>
                </Layout>
            </main>
        </>
    )
}

export default Index
