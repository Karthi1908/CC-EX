import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/CCNFT.json"
import nftMarketplaceAbi from "../constants/CCMarketplace.json"
import contracts from "../constants/contracts.json"
import { useEffect, useState } from "react"
import  Withdrawal  from "../components/Withdrawal"

const nftport = process.env.NEXT_PUBLIC_NFTPORT_KEY

export default function Home() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "80001"
    console.log(chainId , chainString)
    const certifierAddress = contracts[chainString].Certifier[0]
    const dispatch = useNotification()
    const [proceeds, setProceeds] = useState("0")
    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

    const { runContractFunction } = useWeb3Contract()

    async function applyAndList(data) {
        console.log("Approving...")
        const projectName = data.data[0].inputResult
        const projectDetails = data.data[1].inputResult
        const projectLoc = data.data[2].inputResult
        const projectIpfs = getIpfsUrl()
        console.log("IPFS AT APPLY" , projectIpfs)
        
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

    const handleFileChange = async (event) => {
        setSelectedFile(event.target.files[0]);
        console.log( "NFTPORT " )
        dispatch({
            type: "success",
            message: "File Attached ",
            position: "topR",
        })
    }
    
    function getIpfsUrl  ()  {
        const form = new FormData();
        form.append("file", selectedFile);

        const options = {
            method: 'POST',
            body : form,
            headers: {
                Authorization:'fc93ae18-1d07-425a-b9c2-3f7496b9448f'
            }
        };

        
        fetch('https://api.nftport.xyz/v0/files', options)
            .then(response => response.json())
            .then(response => console.log(response.ipfs_url))
            .catch(err => console.error(err));

        return response.ipfs_url
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
                onSubmit={applyAndList}
                data={[
                    {
                        name: "Project Name",
                        type: "text",
                        inputWidth: "35%",
                        value: "",
                        key: "pName",
                    },
                    {
                        name: "Project Details",
                        type: "text",
                        value: "",
                        key: "pDetails",
                    },
                    {
                        name: "Location",
                        type: "text",
                        value: "",
                        key: "pLoc",
                    },
                    
                ]}
                
                title="Apply For Carbon Credits"
                id="Main Form"
            />
            <div className="form-group mt-3">
                    <label className="mr-2">Upload Documents for verification</label>
                    <input name="file" type="file" onChange={handleFileChange}/>
            </div>
                    
        </div>
        
        </div>
    )
}
