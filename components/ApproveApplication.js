import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/CCNFT.json"
import certifierAbi from "../constants/CertiferABI.json"
import nftMarketplaceAbi from "../constants/CCMarketplace.json"
import contracts from "../constants/contracts.json"


export default function ApproveApplication () {

    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "80001"
    console.log(chainId , chainString)
    const certifierAddress = contracts[chainString].Certifier[0]
    const dispatch = useNotification()
    

    const { runContractFunction } = useWeb3Contract()
    
    async function applicationResult(data){
        let cdecision = 2
        const projectName = data.data[0].inputResult
        const decision = data.data[1].inputResult
        if (decision == 'Rejected'){
            cdecision = 3
        }
        const carbonCredits = data.data[2].inputResult

        await runContractFunction({
            params: {
                abi: certifierAbi,
                contractAddress: certifierAddress,
                functionName: "applicationDecision",
                params: {
                    _projectName: projectName,
                    _status: cdecision,
                    _creditsIssued: carbonCredits
                },
            },
            onSuccess: applicationDecision,
            onError: (error) => console.log(error),
            
        })

        const applicationDecision = async () => {
            
            dispatch({
            type: "success",
            message: "Application - Decision is made",
            position: "topR",
            })
        }

    }
    return (
        <div className={styles.container}>
            
            <Form 
                onSubmit={applicationResult}
                data={[
                    {
                        name: "Project Name",
                        type: "text",
                        value: "",
                        key: "projectName",
                    },
                    {
                        name: "Application Decision : Accepted/Rejected",
                        type: "text",
                        value: "",
                        key: "decision",
                    },
                    {
                        name: "Carbon Credits Awarded",
                        type: "number",
                        value: "",
                        key: "carbonCredits",
                    },

                ]}
                title="Application Approval"
                id="Approve Application"
            />
        </div>
    )   
}
