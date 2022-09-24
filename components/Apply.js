import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/CCNFT.json"
import certifierAbi from "../constants/CertiferABI.json"
import nftMarketplaceAbi from "../constants/CCMarketplace.json"
import contracts from "../constants/contracts.json"
import { useEffect, useState } from "react"
import { responseSymbol } from "next/dist/server/web/spec-compliant/fetch-event"


const nftport = process.env.NEXT_PUBLIC_NFTPORT_KEY

export default function Apply(ipfsUrl) {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "80001"    
    const certifierAddress = contracts[chainString].Certifier[0]
    console.log(chainId , chainString, certifierAddress)
    const dispatch = useNotification()    
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    

    const { runContractFunction } = useWeb3Contract()

    async function applyAndList(data) {
        console.log("Applying...")
        const projectName = data.data[0].inputResult
        const projectDetails = data.data[1].inputResult
        const projectLoc = data.data[2].inputResult
        console.log("DATA",projectName ,projectDetails, projectLoc)
        const projectIpfs = ipfsUrl 
        
        console.log("IPFS AT APPLY" , projectIpfs)
        
        const approveOptions = {
            abi: certifierAbi,
            contractAddress: certifierAddress,
            functionName: "applyForCertification",
            params: {
                _projectName: projectName,
                _projectDetails: projectDetails,
                _location: projectLoc,
                _ipfsUrl: projectIpfs

            },
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: handleListSuccess,
            onError: (error) => {
                console.log(error)
            },
        })
    }


    async function handleListSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Application Completed",
            title: "Application",
            position: "topR",
        })
    }

    

    async function setupUI() {
        
    }

    useEffect(() => {
        if(isWeb3Enabled){
            setupUI()
        }
    }, [account, isWeb3Enabled, chainId])

    return (
        <div>
        <div className={styles.container}>
            <Form
                onSubmit={applyAndList}
                data={[
                    {
                        name: "Project Name",
                        type: "text",
                        inputWidth: "35%",
                        value: "",
                        key: "projectName",
                    },
                    {
                        name: "Project Details",
                        type: "text",
                        value: "",
                        key: "projectDetails",
                    },
                    {
                        name: "Location",
                        type: "text",
                        value: "",
                        key: "projectLoc",
                    },
                    
                ]}
                
                title="Apply For Carbon Credits"
                id="Main Form"
            />           
                    
        </div>
        
        </div>
    )
}
