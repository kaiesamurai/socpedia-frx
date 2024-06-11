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
