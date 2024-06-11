# Socpedia

Socpedia is a decentralized social network built on the Frax Testnet. We create specific actions on social networks to bring the most meaningful experiences.

## What's New on My Social Network?
We focus on two things: meaningful posts and module checks.

- **Currently, we provide three types of posts**: Vote, Fundings, and Calls for Investment.
  - **Vote**: When a user creates a vote post, it will automatically create a contract with the poster as the owner.
  - **Fundings**: When a user creates a Funding post, it will automatically create a contract with the poster as the owner. Only the owner can withdraw funds.
  - **Calls for Investment**: This function is for traders to share investment tokens. With the help of **Chainlink Datafeed**, we save the roundId at the time of writing. When users view the post, they will see the current price compared to the price at the time the writer wrote the post to evaluate whether the writer's comments are correct.
- **Check Modules**: These are pieces of code contributed and created by the community in the form of NFTs. Anyone who owns the NFT will be able to use that code to check the information posted. For example, there is a call to invest in token A. If you want to know if they actually own that token to make sure this is not a fake call, the modules contributed by the community will be effective.

## Link DataFeed
- [Chainlink Datafeed Documentation](https://docs.chain.link/data-feeds/price-feeds/addresses?network=scroll&page=1)

Socpedia uses Chainlink Datafeed to get the price of the token and compare it between the time the article was written and now, thereby creating trust between influencers and users.

## How I Built It
I built the application with Hardhat and Next.js.

I use web3.storage to store post information and module metadata.

Posts' CIDs will be saved in smart contracts.

## How to Use Module
I referenced code from [Metamask documentation](https://docs.metamask.io/wallet/reference/eth_gasprice/):
```javascript
await window.ethereum.request({
  "method": "eth_gasPrice",
  "params": []
});
```

## Contract Addresses
| Network | Address | Link |
|---|---|---|
| Frax Testnet | 0x4d16abab0af777275cfb196571b21eb4723bbe2f162f36833786bc2d025c80b8 | https://holesky.fraxscan.com/tx/0x4d16abab0af777275cfb196571b21eb4723bbe2f162f36833786bc2d025c80b8 |




### Contacts:-

#### Factbook.sol
```
// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./Funding.sol";
import "./Voting.sol";
import "./Module.sol";

contract Factbook {
    struct Feed {
        uint8 feedType;
        string content;
        address feedContract;
        uint256 createdTime;
        uint80 roundId;
    }

    uint256 public count;
    mapping(uint256 => Feed) public feeds;
    address[] public modules;

    function addNewFeed(uint8 _type, string memory _content, uint256 _endtime, uint80 _roundId) public {
        address _feedContract;
        if (_type == uint8(0)) {
            _feedContract = address(new Voting(msg.sender, _endtime));
        } else if (_type == uint8(1)) {
            _feedContract = address(new Funding(msg.sender, _endtime));
        } else if (_type == uint8(2)) {
            _feedContract = address(0);
        }else {
            revert();
        }

        Feed memory newFead;
        newFead.feedType = _type;
        newFead.content = _content;
        newFead.feedContract = _feedContract;
        newFead.createdTime = block.timestamp;
        newFead.roundId = _roundId;
        feeds[count] = newFead;
        count ++;
    }

    function createModule(string memory _name, string memory _symbol, string memory _uri, uint256 _price) public {
        address _moduleAddress = address(new Module(msg.sender, _name, _symbol, _uri, _price));
        modules.push(_moduleAddress);
    }

    function getModules() public view returns(address[] memory) {
        return modules;
    }
}

```
#### Funding.sol

```
// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

contract Funding {
    address public owner;
    uint256 public endtime;
    mapping(address => uint256) public balanceOf;

    constructor(address _owner, uint256 _endtime) {
        owner = _owner;
        endtime = _endtime;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Not owner");
        _;
    }

    function funding(uint256 _amount) public payable {
        require(msg.value == _amount, "Wrong amount");
        require(block.timestamp < endtime, "Over time");
        balanceOf[msg.sender] += _amount;
    }

    function withdraw(uint256 _amount) public onlyOwner {
        require(block.timestamp >= endtime, "Not over time");
        payable(owner).transfer(_amount);
    }
}
```
#### Module.sol

```
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

```
#### Voting.sol
```
// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

contract Voting {
    address public owner;
    uint256 public endtime;
    mapping(address => bool) public voters;
    mapping(uint256 => address[]) public options;

    constructor(address _owner, uint256 _endtime) {
        owner = _owner;
        endtime = _endtime;
    }

    function vote(uint256 _option)
        public
    {
        require(block.timestamp < endtime, "Over time");
        require(!voters[msg.sender], "You already voted");
        options[_option].push(msg.sender);
        voters[msg.sender] = true;
    }

    function totalVote(uint256 _option)
        public
        view
        returns (uint256)
    {
        return options[_option].length;
    }
}

```


## Getting Started with Socpedia (Local Host Using Hardhat)
1. **Install all dependencies**:
    ```bash
    npm install
    ```

2. **Run the Hardhat local node**:
    ```bash
    npx hardhat node
    ```

3. **Deploy the contract on the local network**:
    ```bash
    npx hardhat run --network localhost scripts/deploy.js
    ```

4. **Update the CrowdFunding.json file**:
    - This will generate two folders: `artifacts` and `cache`.
    - Delete the `CrowdFunding.json` file from the `Context` folder.
    - Go to `artifacts/contracts`, copy the new `CrowdFunding.json` from there, and paste it into the `Context` folder.

5. **Run the development server**:
    ```bash
    npm run dev
    ```

Thank you for using our Socpedia DApp.