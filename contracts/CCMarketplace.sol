// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;


import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import './CCNFT.sol';


error ItemNotForSale(uint256 tokenId);
error NotListed(uint256 tokenId);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();

contract CCMarketplace is ReentrancyGuard {
    
    
    CCNFT public ccNFT;

    function setCCNFTAddress(address _ccNFTAddress) public  onlyOwner {
        ccNFT = CCNFT(_ccNFTAddress);
    
    }


}



