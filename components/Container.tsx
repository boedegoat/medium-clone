import Head from 'next/head'
import { FC } from 'react'
import Header from './Header'

interface Props {
  title: string
  className?: string
}

const Container: FC<Props> = ({ title, children, className }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={className}>{children}</main>
    </>
  )
}

export default Container
