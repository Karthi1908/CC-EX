import Head from 'next/head'
import {React} from 'react'
//import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useMoralisQuery } from "react-moralis"
import  NFTBox  from "../components/NFTBox"



export default function Home() {

    const {data : ccListings, isFetching: FetchingccListings} = useMoralisQuery(

    "ccListings" ,
    (query) => query.limit(10).descending("tokenId")
    )
    
    console.log(ccListings)


  return (
    <div className="container mx-auto">
        <h1 className="py-4 px-4 font-bold text-2xl">Listings</h1>
            <div className="flex flex-wrap">
    
                {FetchingccListings ? (<div> loading....  </div>) : ccListings.map((cc) => {
                    console.log(cc.attributes)
                    const {tokenId, quantity, seller, address} = cc.attributes
                return (
                      <div> 
                        <NFTBox tokenId={tokenId} quantity={quantity} seller={seller} marketAddress={address}/>
         
                      </div>
                  )

    })}
    
    </div>
    </div>
    
  )
}
