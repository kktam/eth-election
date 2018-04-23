var Elections = artifacts.require("./Elections.sol");

contract("Elections", function(accounts){
    var candidateInstance;
    var candidateId;

    it("initializes with two candidates", function() {
        return Elections.deployed().then(function(instance){
            return instance.candidatesCount();
        }).then(function(count) {
            assert.equal(count, 2);
        })
    });

    it("it initializates the candidates with correct values", function(){
        return Elections.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate) {
            assert.equal(candidate[0], 1, "contains the correct id");
            assert.equal(candidate[1], "Candidate 1", "contains the correct name");
            assert.equal(candidate[2], 0, "contains the correct vote count");
            return electionInstance.candidates(2);                                
        }).then(function(candidate) {
            assert.equal(candidate[0], 2, "contains the correct id");
            assert.equal(candidate[1], "Candidate 2", "contains the correct name");
            assert.equal(candidate[2], 0, "contains the correct vote count");                        
        });
    });

    it("allows a voter to cast a vote", function(){
        return Elections.deployed().then(function(instance){
            electionInstance = instance;
            candidateId = 1;
            return electionInstance.vote(candidateId, { from: accounts[0] });
        }).then(function(receipt) {
            return electionInstance.voters(accounts[0]);                                
        }).then(function(voted) {
            assert(voted, "the user was marked as voted");
            return electionInstance.candidates(candidateId);                                
        }).then(function(candidate) {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "increments the candidate's vote count");                        
        });
    });  
    
    it("throws an exception for invalid candidates", function(){
        return Elections.deployed().then(function(instance){
            electionInstance = instance;
            candidateId = 99;
            return electionInstance.vote(candidateId, { from: accounts[1] });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert' >= 0), "error message must contain revert");
            return electionInstance.candidates(1);                                
        }).then(function(candidate) {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "candidate 1 did not receive any vote");
            return electionInstance.candidates(2);                                    
        }).then(function(candidate) {
            var voteCount = candidate[2];
            assert.equal(voteCount, 0, "candidate 2 did not receive any vote");                        
        });
    });
    
    it("throws an exception for double voting", function(){
        return Elections.deployed().then(function(instance){
            electionInstance = instance;
            candidateId = 2;
            return electionInstance.vote(candidateId, { from: accounts[1] });
        }).then(function(receipt) {
            return electionInstance.voters(accounts[1]);                                
        }).then(function(candidate) {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "candidate 2 accepted first vote");
            return electionInstance.vote(candidateId, { from: accounts[1] });                                   
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert' >= 0), "error message must contain revert");
            return electionInstance.candidates(1);                                
        }).then(function(candidate) {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "candidate 1 did not receive any vote");
            return electionInstance.candidates(2);                                    
        }).then(function(candidate) {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "candidate 2 did not receive any vote");                        
        });
    });      
});
