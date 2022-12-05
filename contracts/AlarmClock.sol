pragma solidity ^0.8.0;

contract AlarmClock {
    // Address of the contract owner
    address public owner;

    // Timestamp of the timeout
    uint256 public timeout;

    // Constructor to set the contract owner and initial timeout
    constructor() {
        owner = msg.sender;
        timeout = block.timestamp + 24 hours;
    }

    // Function to remove funds by anyone after the timeout
    function removeFunds() public {
        // Require that the current time is greater than the timeout
        require(block.timestamp >= timeout, "Timeout has not occurred");

        // Get the current balance of the contract
        uint256 balance = address(this).balance;

        // Transfer the entire balance to the caller
        payable(msg.sender).transfer(balance);
    }

    // Function to set the timeout
    function setTimeout(uint256 newTimeout) public {
        // Require that the caller is the contract owner
        require(msg.sender == owner, "Only the contract owner can set the timeout");

        // Set the timeout to the specified value
        timeout = newTimeout;
    }

    // Function to postpone the timeout by 24 hours
    function postponeTimeout() public {
        // Require that the caller is the contract owner
        require(msg.sender == owner, "Only the contract owner can postpone the timeout");

        // Add 24 hours to the current timeout
        timeout += 24 hours;
    }
}
