//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract CCNFT is ERC1155 , Ownable {
    constructor() ERC1155("") {
    }
    uint public counter ;

    function mintCarbonCredit(address _to) public{
        counter++;
        _mint(_to,counter,1,"0x000");
    }

    

}