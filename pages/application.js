import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import Apply from "../components/Apply"



const nftport = process.env.NEXT_PUBLIC_NFTPORT_KEY

export default function Home () {

    const { chainId, account, isWeb3Enabled } = useMoralis()
    const dispatch = useNotification()    
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const [ipfsUrl, setIpfsUrl] = useState("");
    const [ipfs, setIpfs] = useState(false);


    const handleFileChange = async (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
        
        console.log( "NFTPORT " )
        dispatch({
            type: "success",
            message: "File Attached ",
            position: "topR",
        })

        
    }
    
    const getIpfsUrl  =async () => {
        const form = new FormData();
        form.append("file", selectedFile);

        const options = {
            method: 'POST',
            body : form,
            headers: {
                Authorization:'fc93ae18-1d07-425a-b9c2-3f7496b9448f'
            }
        };

        
         await fetch("https://api.nftport.xyz/v0/files", options)
        .then(response => { return response.json()})
        .then(responseJson => {
          // Handle the response
          ipfsUrl = responseJson.ipfs_url
          setIpfs(true)
          console.log(responseJson);
        })

        console.log("RESPONSE", ipfsUrl)
        

        
    }
    async function setupUI() {
        
    }

    useEffect(() => {
        if(isWeb3Enabled){
            setupUI()
        }
    }, [account, isWeb3Enabled, chainId])

    

    return (
        
        <div className={styles.container}>
            
                <div className={styles.container}>  
                         
                    <label className="mr-2">Upload Project Documents to proceed</label>
                    <input name="file" type="file" onChange={handleFileChange}/>
                    <Button theme="primary" type="button" text="Upload" onClick={getIpfsUrl}/>      
                    
                </div>
                    
                {ipfs ? <div className={styles.container}> <Apply ipfsUrl={ipfsUrl}/> </div> : (<div> loading....  </div>) }
                
               
                 
                    
        </div>

        
        
    )
}
