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
