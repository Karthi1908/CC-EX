// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;


import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import './CCNFT.sol';


error ItemNotForSale(uint256 tokenId);
error NotListed(uint256 tokenId);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();

contract CCMarketplace is ReentrancyGuard, Ownable{
    
    
    CCNFT public ccNFT;

    struct CCredits{
        address user;
        uint quantity;

    }

    mapping(uint256 => CCredits) public creditDetails;

    function setCCNFTAddress(address _ccNFTAddress) public  onlyOwner {
        ccNFT = CCNFT(_ccNFTAddress);
    
    }

    function listCCNFT(uint256 _tokenId) external {

        uint creditQuantity = _tokenId % 1000;        
        creditDetails[_tokenId] = CCredits( msg.sender , creditQuantity);
        ccNFT.safeTransferFrom(msg.sender, address(this), _tokenId);

    }



}



