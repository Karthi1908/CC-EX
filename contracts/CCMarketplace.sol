// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import './CCNFT.sol';
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./PriceRT.sol";
import "./MiniCC.sol";


error ItemNotForSale(uint256 tokenId);
error NotListed(uint256 tokenId);
error AlreadyListed(uint256 tokenId);
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
    mapping(string => address) public tokenList;
    mapping(address => mapping(string => uint)) public balances;

    modifier notListed(uint256 tokenId)  {

      address owner = ccNFT.ownerOf(tokenId);
        if (owner == address(this)) {
            revert AlreadyListed(tokenId);
        }
        _;
    }

    modifier isListed( uint256 tokenId) {
        address owner = ccNFT.ownerOf(tokenId);
        if (owner != address(this)) {
            revert NotListed(tokenId);
        }
        _;
    }

    modifier isOwner(uint256 tokenId,   address spender ) {

        address owner = ccNFT.ownerOf(tokenId);
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    event CCListed(
        address indexed seller,
        uint256 indexed tokenId,
        uint256 quantity
    );

    event MiniCCMinted(
        address indexed minter,
        uint256 indexed tokenId,
        uint256 quantity,
        string currency,
        uint256 amount
    );

    event WithdrawProceeds(
        address indexed user,
        string indexed currency,
        uint256 amount        
    );

    function addsupportedCurrencies(string memory _name, address _tokenContract) public onlyOwner {
        tokenList[_name] = _tokenContract;
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


    function listCCNFT(uint256 _tokenId) external nonReentrant notListed(_tokenId) isOwner(_tokenId, msg.sender) {

        uint creditQuantity = _tokenId % 1000;        
        creditDetails[_tokenId] = CCredits( msg.sender , creditQuantity * 100); //1 Carbon credit = 100 Mini Carbon Credits
        ccNFT.safeTransferFrom(msg.sender, address(this), _tokenId);

        emit CCListed(msg.sender, _tokenId, creditQuantity * 100 );

    }

    function buyFixedCC(uint256 _quantity, string memory _currency ,  uint256 _tokenId) external payable nonReentrant isListed(_tokenId) {

        //quantity has 2 decimals
        uint256 carbonPriceInUSD = getPrice('kcca','usd');
        uint256 currencyRatePerUSD = getPrice(_currency, 'usd');
        uint256 amountToBePaid = carbonPriceInUSD * _quantity * 10000 / currencyRatePerUSD ; // accounting for 6 decimals (2 decimanls for quantity)
        creditDetails[_tokenId].quantity = creditDetails[_tokenId].quantity - _quantity;
        balances[creditDetails[_tokenId].user][_currency] += amountToBePaid ;
        if (keccak256(abi.encodePacked((_currency))) == keccak256(abi.encodePacked(('matic')))) {

            require( msg.value  >= amountToBePaid , "Insufficient Amount");

        } else {

            require(getBalanceOfToken(tokenList[_currency], msg.sender) > amountToBePaid);
            IERC20(tokenList[_currency]).transferFrom(msg.sender, address(this), amountToBePaid);

        }


        miniCC.mint(msg.sender, _tokenId, _quantity , '');

        emit MiniCCMinted(msg.sender, _tokenId, _quantity, _currency, amountToBePaid);

    }

    function getBalanceOfToken(address _address, address _user) public view returns (uint) {
        return IERC20(_address).balanceOf(_user);
    }
    
    function buyForFixedAmount(uint256 _amount, string memory _currency ,  uint256 _tokenId) external payable nonReentrant isListed(_tokenId) {
        //amount has 6 decimals


        uint256 carbonPriceInUSD = getPrice('kcca','usd');
        uint256 currencyRatePerUSD = getPrice(_currency, 'usd');
        uint256 miniCarbonQuantity = _amount * currencyRatePerUSD * 100 / carbonPriceInUSD / 1000000;
        creditDetails[_tokenId].quantity = creditDetails[_tokenId].quantity - miniCarbonQuantity;
        balances[creditDetails[_tokenId].user][_currency] += _amount;

        miniCC.mint(msg.sender, _tokenId, miniCarbonQuantity, '');
        
        if (keccak256(abi.encodePacked((_currency))) == keccak256(abi.encodePacked(('matic')))) {
            require( msg.value  >= _amount , "Insufficient Amount");

        } else {

            require(getBalanceOfToken(tokenList[_currency], msg.sender) > _amount, " Insufficent token balance");
            IERC20(tokenList[_currency]).transferFrom(msg.sender, address(this), _amount);

        }

        emit MiniCCMinted(msg.sender, _tokenId, miniCarbonQuantity, _currency, _amount);

    }

    function withdrawProceeds(string memory _currency, uint _amount) external nonReentrant {

        require(balances[msg.sender][_currency] >= _amount, "Not enough balance for User");
        balances[msg.sender][_currency] -= _amount;

        if (keccak256(abi.encodePacked((_currency))) == keccak256(abi.encodePacked(('matic')))) {

            require(address(this).balance > _amount, "Not enough balance in contract");
            
            (bool success, ) = payable(msg.sender).call{value: _amount}("");
            require(success, "Transfer failed");

        } else {

            require(getBalanceOfToken(tokenList[_currency], address(this)) > _amount, "Not enough balance in contract");
            IERC20(tokenList[_currency]).transferFrom(address(this), msg.sender, _amount);

        }

    }

}