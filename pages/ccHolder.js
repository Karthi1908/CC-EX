import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/CCNFT.json"
import nftMarketplaceAbi from "../constants/CCMarketplace.json"
import contracts from "../constants/contracts.json"
import { useEffect, useState } from "react"
import  Withdrawal  from "../components/Withdrawal"

export default function Home() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "80001"
    console.log(chainId , chainString)
    const marketplaceAddress = contracts[chainString].NftMarket[0]
    const dispatch = useNotification()
    const [proceeds, setProceeds] = useState("0")

    const { runContractFunction } = useWeb3Contract()

    async function approveAndList(data) {
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        
        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    async function handleApproveSuccess(nftAddress, tokenId, price) {
        console.log("Ok! Now time to list")
        
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listCCNFT",
            params: {                
                _tokenId: tokenId,                
            },
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: handleListSuccess,
            onError: (error) => console.log(error),
        })
    }

    async function handleListSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "NFT listing",
            title: "NFT listed",
            position: "topR",
        })
    }

    const handleWithdrawSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Withdrawing proceeds",
            position: "topR",
        })
    }

    async function setupUI() {
        const returnedProceeds = await runContractFunction({
            params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "getProceeds",
                params: {
                    seller: account,
                },
            },
            onError: (error) => console.log(error),
        })
        if (returnedProceeds) {
            setProceeds(returnedProceeds.toString())
        }
    }

    useEffect(() => {
        if(isWeb3Enabled){
            setupUI()
        }
    }, [proceeds, account, isWeb3Enabled, chainId])

    return (
        <div>
        <div className={styles.container}>
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "35%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },

                ]}
                title="List your NFT!"
                id="Main Form"
            />
                    
        </div>
        <Withdrawal />
        </div>
    )
}