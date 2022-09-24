import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/CCNFT.json"
import certifierAbi from "../constants/CertiferABI.json"
import nftMarketplaceAbi from "../constants/CCMarketplace.json"
import contracts from "../constants/contracts.json"


export default function AddCertifier () {

    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "80001"
    console.log(chainId , chainString)
    const certifierAddress = contracts[chainString].Certifier[0]
    const dispatch = useNotification()
    

    const { runContractFunction } = useWeb3Contract()
    
    async function addCertifier(data){

        const company = data.data[0].inputResult
        

        await runContractFunction({
            params: {
                abi: certifierAbi,
                contractAddress: certifierAddress,
                functionName: "addApprover",
                params: {
                    _company:company
                },
            },
            onSuccess: addCertifierSucess,
            onError: (error) => console.log(error),
            
        })

        const addCertifierSucess = async () => {
            
            dispatch({
            type: "success",
            message: "Certifier Enrolled Scucessfully",
            position: "topR",
            })
        }

    }
    return (
        <div className={styles.container}>
            
            <Form 
                onSubmit={addCertifier}
                data={[
                    {
                        name: "Enter your Company Name",
                        type: "text",
                        value: "",
                        key: "company",
                    },
                    

                ]}
                title="Enroll as a Certifier!"
                id="Enroll Form"
            />
        </div>
    )   
}
