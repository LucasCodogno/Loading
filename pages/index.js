import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from "@/components/PersistentDrawerRight";
import Page from '@/pages/LineChart';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verifica se está no cliente e não no servidor
    if (typeof window !== 'undefined' && !sessionStorage.getItem('authenticated')) {
      router.push('/login');
    }
  }, []);

  return (
    <>
      <Sidebar />
      <Page/>
    </>
  )
}