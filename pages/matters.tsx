import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Layout from "../components/layout/layout";
import MattersWidget from "../components/widgets/matters";

const Matters: NextPage = () => {
  return (
    <>
      <Head>
        <title>Faltas docentes - Materias</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <MattersWidget />
        </Layout>
      </main>
    </>
  );
};

export default Matters;
