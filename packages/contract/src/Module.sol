// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Module is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    string public uri;
    uint256 public price;

    constructor(address initialOwner, string memory _name, string memory _symbol, string memory _uri, uint256 _price)
        ERC721(_name, _symbol)
        Ownable(initialOwner)
    {
        uri = _uri;
        price = _price;
    }

    function safeMint(address _to, uint256 _amount) public payable {
        require(msg.value == _amount, "Values do not match");
        require(_amount == price, "Values do not match price");
        uint256 tokenId = _nextTokenId++;
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function withdraw(uint256 _amount) public onlyOwner {
        payable(owner()).transfer(_amount);
    }
}