import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/CCNFT.json"
import certifierAbi from "../constants/CertiferABI.json"
import nftMarketplaceAbi from "../constants/CCMarketplace.json"
import contracts from "../constants/contracts.json"


export default function AssignCertifer () {

    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "80001"
    console.log(chainId , chainString)
    const certifierAddress = contracts[chainString].Certifier[0]
    const dispatch = useNotification()
    

    const { runContractFunction } = useWeb3Contract()
    
    async function assign(data){

        const certifier = data.data[0].inputResult
        const projectName = data.data[1].inputResult

        await runContractFunction({
            params: {
                abi: certifierAbi,
                contractAddress: certifierAddress,
                functionName: "assignApplication",
                params: {
                    _projectName: projectName,
                    _certifier: certifier
                },
            },
            onSuccess: handleAssignSuccess,
            onError: (error) => console.log(error),
            
        })

        const handleAssignSuccess = async (tx) => {
            await tx.wait(1)
            dispatch({
            type: "success",
            message: "Assignment Successful",
            position: "topR",
            })
        }

    }
    return (
        <div className={styles.container}>
            
            <Form 
                onSubmit={assign}
                data={[
                    {
                        name: "Certifier Wallet Address",
                        type: "text",
                        value: "",
                        key: "certifier",
                    },
                    {
                        name: "Project Name",
                        type: "text",
                        value: "",
                        key: "project",
                    },

                ]}
                title="Assign Certifier to project"
                id="Assignment Form"
            />
        </div>
    )   
}
