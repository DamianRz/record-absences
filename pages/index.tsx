import type { NextPage } from "next";
import Head from "next/head";
import Layout from "../components/layout/layout";
import UserTable from "../components/userTable";
import TeachersWidget from "../components/widgets/teachers";

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
          <TeachersWidget />
        </Layout>
      </main>
    </>
  );
};

export default Index;
