import {useState, useEffect } from "react"
import {useWeb3Contract, useMoralis} from "react-moralis"
import nftabi from "../constants/CCNFT.json"
import marketplaceabi from "../constants/CCMarketplace.json"
import {Card, useNotification } from "web3uikit"
import {ethers} from "ethers"
import BuyNFT from "./BuyNFT"



export default function NFTBox(props){

    const nftaddr = ethers.utils.getAddress("0x8318E2B7F120F44FeA59A3394E9E5857FdAb16DE")
    console.log(nftaddr)

    const[tokenId, setTokenId] = useState("")
    const[quantity, setQuantity] = useState("")
    const[seller, setSeller] = useState("")
    const[marketAddress, setMarketAddress] = useState("")
    const[showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    

    const {isWeb3Enabled} = useMoralis()

    const {runContractFunction : getTokenURI} = useWeb3Contract({
        abi: nftabi,
        contractAddress:nftaddr,
        functionName: "tokenURI",
        params: {
            tokenId: props.tokenId,
            },
    })

    

    async function UpdateUI () {
        const tokenURI = await getTokenURI()
        console.log(props.tokenId)
        setTokenId(props.tokenId)
        setQuantity(props.quantity)
        setSeller(props.seller)
        setMarketAddress(props.marketAddress)
        console.log(tokenURI)

    }

    useEffect (()=> {
        if(isWeb3Enabled){
            UpdateUI()
            console.log("got here")
        }
    }, [isWeb3Enabled] )

    const handleCardClick = () => {
        setShowModal(true)
    }

    return (
        <div>
            <div>
                <BuyNFT 
                    isVisible={showModal}
                    tokenId={tokenId}
                    marketplaceAddress={marketAddress}
                    onClose={hideModal}                    
                />
                <Card title ={tokenId} onClick={handleCardClick}>
                    <div>#{tokenId}</div>
                    <div className="itlaic-text-sm"> {seller}</div>
                    <div>Carbon Credit : {quantity}</div>
                    
                </Card>
            </div>
        </div>
    )

    
}