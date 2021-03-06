App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 != 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);      
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Elections.json", function(election) {
      // instantiate a new truffle contract from the artifact
      App.contracts.Elections = TruffleContract(election);
      // connect provider to interact with contract
      App.contracts.Elections.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
      var electionInstance;
      var loader = $("#loader");
      var content = $("#content");

      loader.show();
      content.hide();

      // load account data
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          $("#accountAddress").html("Your Account:" + account);
        }
      });

      App.contracts.Elections.deployed().then(function(instance) {
        electionInstance = instance;
        return electionInstance.candidatesCount();
      }).then(function(candidatesCount){
        var candidatesResults = $("#candidatesResults");
        candidatesResults.empty();

        for (var i = 1; i <= candidatesCount; i++) {
          electionInstance.candidates(i).then(function(candidate) {
            var id = candidate[0];
            var name = candidate[1];
            var voteCount = candidate[2];

            // render candidates result
            var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td>";
            candidatesResults.append(candidateTemplate);
          });
        }

        loader.hide();
        content.show();
      }).catch(function(error) {
        console.warn(error);
      });      
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    /*
     * Replace me...
     */
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    /*
     * Replace me...
     */
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
