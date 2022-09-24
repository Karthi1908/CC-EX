import Head from 'next/head'
import {React} from 'react'
//import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useMoralisQuery } from "react-moralis"
import  AddCertifier  from "../components/AddCertifier"
import  ApproveApplication  from "../components/ApproveApplication"
import  AssignCertifer  from "../components/AssignCertifier"



export default function Home() {

   
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
