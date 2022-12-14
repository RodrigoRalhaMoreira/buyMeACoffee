// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract BuyMeACoffee {
    // event to emit when a Memo is created.
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    Memo[] memos;

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function changeOwner(address _new_owner) public {
        require(msg.sender == owner, "only owner can change address");
        owner = payable(_new_owner);
    }

    function buyCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value > 0, "can't buy coffee with 0 eth");
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
