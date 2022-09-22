import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/CCNFT.json"
import nftMarketplaceAbi from "../constants/CCMarketplace.json"
import contracts from "../constants/contracts.json"
import { useEffect, useState } from "react"


export default function Withdrawal () {

    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "80001"
    console.log(chainId , chainString)
    const marketplaceAddress = contracts[chainString].NftMarket[0]
    const dispatch = useNotification()
    

    const { runContractFunction } = useWeb3Contract()
    
    async function performWithdrawal(data){

        const currency = data.data[0].inputResult
        const amount = data.data[1].inputResult

        await runContractFunction({
            params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "withdrawProceeds",
                params: {
                    _currency : currency,
                    _amount: amount
                },
            },
            onError: (error) => console.log(error),
            onSuccess: handleWithdrawSuccess,
        })

        const handleWithdrawSuccess = async (tx) => {
            await tx.wait(1)
            dispatch({
            type: "success",
            message: "Withdrawing proceeds",
            position: "topR",
            })
        }

    }
    return (
        <div className={styles.container}>
            
            <Form 
                onSubmit={performWithdrawal}
                data={[
                    {
                        name: "Currency",
                        type: "text",
                        value: "",
                        key: "currency",
                    },
                    {
                        name: "Amount",
                        type: "number",
                        value: "",
                        key: "amount",
                    },

                ]}
                title="Withdraw your Proceeds!"
                id="Withdrawal Form"
            />
        </div>
    )   
}
