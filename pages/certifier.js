import Head from 'next/head'
import { useEffect, useState } from "react"
//import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useMoralis, useWeb3Contract } from "react-moralis"
import  AddCertifier  from "../components/AddCertifier"
import  ApproveApplication  from "../components/ApproveApplication"
import  AssignCertifer  from "../components/AssignCertifier"



export default function Home() {

    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "80001"
    console.log(chainId , chainString)

    async function setupUI() {
        
    }

    useEffect(() => {
        if(isWeb3Enabled){
            setupUI()
        }
    }, [account, isWeb3Enabled, chainId])

   
  return (
    <div className="container mx-auto">
        <h1 className="py-4 px-4 font-bold text-2xl">Certifier Page</h1>
        <h1 className="py-4 px-4 ">Need Certifier Unlock Token to perfrom below</h1>
            <div className="flex flex-wrap">
                <div>
                    <AddCertifier />
                </div>
                <div>
                    <AssignCertifer />
                </div>
                <div>
                    <ApproveApplication />
                </div>   
            </div>
    </div>
    
  )
}
