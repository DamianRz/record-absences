import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Layout from "../components/layout";
import Groups from "../components/widgets/groups";

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
          <Groups />
        </Layout>
      </main>
    </>
  );
};

export default Index;
