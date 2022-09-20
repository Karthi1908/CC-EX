// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract CCNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;
    bool public paused = false;
    mapping(uint256 => Word) public wordsToTokenId;
   
   
    struct Word {
        string name;
        string description;
        string issuer;
        string project;
        string location;
        string ccAmount;
        string bgHue;
        string textHue;
        
    }

    //string[] public wordValues = ["accomplish", "accepted", "absolutely", "admire", "achievment", "active"];

    constructor() ERC721("CC-EX", "Carbon") {}

    // public
    function mint(string memory _certifier,string memory _project, string memory _location , uint _quantity, address _applicant) public payable {
        uint256 supply = totalSupply() * 1000 + _quantity;    

        Word memory newWord = Word(
            string(abi.encodePacked("Carbon Credit - ", uint256(supply).toString())),
            "Carbon Credits generated at CC-EX Dapp ", _certifier, _project , _location , _quantity.toString(),
            randomNum(361, block.difficulty, supply).toString(),
            randomNum(361, block.timestamp, supply).toString()
        );


        wordsToTokenId[supply] = newWord; //Add word to mapping @tokenId
        _safeMint(_applicant, supply);
    }

    

    function randomNum(
        uint256 _mod,
        uint256 _seed,
        uint256 _salt
    ) public view returns (uint256) {
        uint256 num = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, msg.sender, _seed, _salt)
            )
        ) % _mod;
        return num;
    }

    function buildImage(uint256 _tokenId) private view returns (string memory) {
        Word memory currentWord = wordsToTokenId[_tokenId];
        string memory random = randomNum(361, 3, 3).toString();
        return
            Base64.encode(
                bytes(
                    abi.encodePacked(
                        '<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">',
                        '<rect id="svg_11" height="600" width="503" y="0" x="0" fill="hsl(',
                        currentWord.bgHue,
                        ',50%,25%)"/>',
                        '<text font-size="18" y="20%" x="50%"  text-anchor="middle" fill="hsl(',
                        random,
                        ',100%,80%)">The certifier</text>',
                        '<text font-size="18" y="25%" x="50%" text-anchor="middle"  fill="hsl(',
                        random,
                        ',100%,80%)">', currentWord.issuer, "</text>",
                        '<text font-size="18" y="30%" x="50%" text-anchor="middle"  fill="hsl(',
                        random,
                        ',100%,80%)">has issued </text>',
                        '<text font-size="18" y="10%" x="50%"  text-anchor="middle" fill="hsl(',
                        random,
                        ',100%,80%)">ID: ',
                        _tokenId.toString(),
                        "</text>",
                        '<text font-size="18" y="50%" x="50%" text-anchor="middle" fill="hsl(',
                        random,
                        ',100%,80%)">',
                        currentWord.ccAmount,
                        "</text>",
                        '<text font-size="18" y="60%" x="50%" text-anchor="middle"  fill="hsl(',
                        random,
                        ',100%,80%)">Carbon Credits </text>',
                        "</svg>"
                    )
                )
            );
    }

    function buildMetadata(uint256 _tokenId)
        private
        view
        returns (string memory)
    {
        Word memory currentWord = wordsToTokenId[_tokenId];
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                currentWord.name,
                                '", "description":"',
                                currentWord.description,
                                '", "image": "',
                                "data:image/svg+xml;base64,",
                                buildImage(_tokenId),
                                '", "attributes": ',
                                "[",
                                '{"trait_type": "Issued by",',
                                '"value":"',
                                currentWord.issuer,
                                '"},',
                                '{"trait_type": "Project",',
                                '"value":"',
                                currentWord.project,
                                '"},',
                                '{"trait_type": "Location",',
                                '"value":"',
                                currentWord.location,
                                '"},',
                                '{"trait_type": "Carbon Credits",',
                                '"value":"',
                                currentWord.ccAmount,
                                '"}',
                                "]",
                                "}"
                            )
                        )
                    )
                )
            );
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return buildMetadata(_tokenId);
    }

    //only owner
    function withdraw() public payable onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }
}