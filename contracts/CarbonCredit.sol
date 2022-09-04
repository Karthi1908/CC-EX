// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract CarbonCredit is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct CC {
        string name;
        uint256 quantity;
    }

    mapping(uint256 => CC) private metadata;

    constructor() ERC1155('') {}

    function mint(
        address account,
        uint256 amount,
        string memory name,
        uint256 quantity,
        bytes memory data
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        metadata[newTokenId] = CC(name, quantity);
        _mint(account, newTokenId, amount, data);
        return newTokenId;
    }

    function mintBatch(
        address to,
        uint256[] memory amounts,
        string[] memory names,
        uint256[] memory quantities,
        bytes memory data
    ) public returns (uint256[] memory) {
        require(amounts.length == names.length, 'array length mismatch');
        uint256[] memory ids = new uint256[](amounts.length);
        for (uint256 i = 0; i < amounts.length; i++) {
            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();
            metadata[newTokenId] = CC(names[i], quantities[i]);
            ids[i] = newTokenId;
        }
        _mintBatch(to, ids, amounts, data);
        return ids;
    }

    function getMetadata(uint256 tokenId) public view returns (CC memory) {
        return metadata[tokenId];
    }
}