import Header from "@/components/header"
import ItemOrder from "@/components/orderandcart/order"
import Head from "next/head"

const Order : React.FC = () => {


    return (

        <>

    <Head>
        <title>Courses</title>
        <meta name="description" content="Courses app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <main>
        <ItemOrder />
      </main>
        </>
    )
}

export default Order