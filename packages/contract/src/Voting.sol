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
