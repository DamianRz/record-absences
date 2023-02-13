import type { NextPage } from "next";
import Head from "next/head";
import Carousell from "../components/widgets/carousel";

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>Lista - Inasistencias</title>
        <meta name="description" content="Lista de inasistencias" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="mx-4">
          <Carousell />
        </div>
      </main>
    </>
  );
};

export default Index;
