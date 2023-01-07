import type { NextPage } from "next";
import Head from "next/head";
import Absences from "../components/widgets/absences";
import Layout from "../components/layout/layout";

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>Inasistencias - Inasistencias</title>
        <meta name="description" content="Administracion de usuarios" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Absences />
        </Layout>
      </main>
    </>
  );
};

export default Index;
