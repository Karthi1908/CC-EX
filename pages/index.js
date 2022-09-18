import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>CC-EX</title>
        <meta name="description" content="Carbon Credits Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      Hi !
    </div>
  )
}
