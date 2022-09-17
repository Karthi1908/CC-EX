// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

import "usingtellor/contracts/UsingTellor.sol";

contract PriceRT is UsingTellor {

  

  constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) {} 

   

  function getSpotPrice(string memory fst, string memory snd) public view returns(uint256) {


    
      bytes memory _queryData = abi.encode("SpotPrice", abi.encode(fst, snd));
      bytes32 _queryId = keccak256(_queryData);
      
      (bool ifRetrieve, bytes memory _value, ) =
          getDataBefore(_queryId, block.timestamp - 1 hours);
      if (!ifRetrieve) return 0;
      return abi.decode(_value, (uint256));
    }

    function calcCarbonQuantity(string memory _currency, uint256 _quantity) public view returns(uint256){
       uint256 carbonPrice = getSpotPrice('kcca', 'usd');
       uint256 currencySpot = getSpotPrice(_currency, 'usd');

       return (currencySpot * _quantity * 100 / carbonPrice);

    }


    

  

}