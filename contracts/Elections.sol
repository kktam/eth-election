pragma solidity ^0.4.17;

contract Elections {
    // Model a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    // Store candidate
    // Fetch candidate
    mapping(uint => Candidate) public candidates;
    // Keep track of Candidate counts
    uint public candidatesCount;

    string public candidate;
    // Constructor
    constructor() public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");        
    }

    function addCandidate (string _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }
}