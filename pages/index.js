import Head from 'next/head'
//import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useMoralisQuery } from "react-moralis"
import { NFTBox } from "../components/Nftbox"
import React from 'react'


export default function Home() {

    const {data : ccListings, isFetching: FetchingccListings} = useMoralisQuery(

    "ccListings" ,
    (query) => query.limit(10).descending("tokenId")
    )
    
    console.log(ccListings)


  return (
    <div className={styles.container}>Listings
    
    {FetchingccListings ? (<div> loading....  </div>) : ccListings.map((cc) => {
        console.log(cc.attributes)
        const {tokenId, quantity, seller} = cc.attributes
        return (
          <div> 
            Token Id : {tokenId}.
            quantity : {quantity}.
            seller : {seller}.

            
          </div>
        )

    })}
    
    </div>
    
  )
}
