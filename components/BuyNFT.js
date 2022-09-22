import { Modal, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import CCMarketplaceAbi from "../constants/CCMarketplace.json"
import { ethers } from "ethers"

export default function BuyNFT({
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose
}) {  
    

    const [amount, setAmount] = useState(0)
    const [currency, setCurrency] = useState(0)

    const handleUpdateListingSuccess = async (tx) => {
        await tx.wait(1)

        onClose && onClose()
        setCurrency(" ")
        setAmount("0")
    }

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: CCMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyForFixedAmount",
        params: {
            _amount : amount,
            _currency : currency,
            _tokenId: tokenId,
        },
    })

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                updateListing({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: handleUpdateListingSuccess,
                })
            }}
        >
            Token Id : {tokenId}
            <Input
                label="Enter Currency"
                name="Currency/token"
                type="sting"
                onChange={(event) => {
                    setCurrency(event.target.value)
                }}
            />
            <Input
                label="Enter Amount"
                name="Amount"
                type="sting"
                onChange={(event) => {
                    setAmount(event.target.value)
                }}
            />
        </Modal>
    )
}