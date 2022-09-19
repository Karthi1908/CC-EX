// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;


import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import './CCNFT.sol';
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./PriceRT.sol";
import "./MiniCC.sol";


error ItemNotForSale(uint256 tokenId);
error NotListed(uint256 tokenId);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();

contract CCMarketplace is ERC721Holder, ReentrancyGuard, Ownable{
    
    
    CCNFT public ccNFT;
    PriceRT public priceRT;
    MiniCC public miniCC;
    



    struct CCredits{
        address user;
        uint quantity;

    }

    mapping(uint256 => CCredits) public creditDetails;
    mapping(string => address) public supportedCurrencies;

    function addsupportedCurrencies(string memory _name, address _tokenContract) public onlyOwner {
        supportedCurrencies[_name] = _tokenContract;
    }

    function setCCNFTAddress(address _ccNFTAddress) public  onlyOwner {
        ccNFT = CCNFT(_ccNFTAddress);
    
    }

    function setRTPricesAddress(address _priceRTAddress) public  onlyOwner {
        priceRT = PriceRT(_priceRTAddress);
    
    }

    function setMiniCCAddress(address _miniCCAddress) public  onlyOwner {
        miniCC = MiniCC(_miniCCAddress);
    
    }

    function getPrice(string memory fst, string memory snd) public view returns(uint256) {
        return priceRT.getSpotPrice(fst,snd);
    
    }


    function listCCNFT(uint256 _tokenId) external nonReentrant {

        uint creditQuantity = _tokenId % 1000;        
        creditDetails[_tokenId] = CCredits( msg.sender , creditQuantity);
        ccNFT.safeTransferFrom(msg.sender, address(this), _tokenId);

    }

    function buyFixedCC(uint256 _quantity, string memory _currency ,  uint256 _tokenId) external nonReentrant {

        uint256 carbonPrice = getPrice('kcca','usd');
        uint256 currencyRatePerUSD = getPrice(_currency, 'usd');
        uint256 amountToBePaid = carbonPrice * _quantity / currencyRatePerUSD;
        creditDetails[_tokenId].quantity = creditDetails[_tokenId].quantity - _quantity;

        miniCC.mint(msg.sender, _tokenId, _quantity * 100, '');

    }
    
    function buyForFixedAmount(uint256 amount, string memory _currency ,  uint256 _tokenId) external nonReentrant {

        
    }



}