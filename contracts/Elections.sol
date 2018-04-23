pragma solidity ^0.4.17;

contract Elections {
    // Model a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;
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

    function vote (uint _candidateId) public {
        // require that they have not voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record voter has voted
        voters[msg.sender] = true;

        // update candidate vote count
        candidates[_candidateId].voteCount++; 
    }
}