import React from 'react'
import type { NextPage } from 'next'
import { Head } from 'next/document';
import Login from '../components/widgets/login';

const Index: NextPage = () => {
  return (
    <>
      <main>
        <Login />
      </main>
    </>
  );
};

export default Index
