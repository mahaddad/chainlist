
//This creates an abstraction of the contract for truffle
// to modify
var ChainList = artifacts.require("./ChainList.sol");

//test suite (name of contract, function())
contract('ChainList', function(accounts) {
  var chainListInstance;
  var seller = accounts[1];
  var articleName = "article 1";
  var articleDescription = "Description for article 1";
  var articlePrice = 10;

    it("should be initialized with empty values", function() {
      //Truffle contract deploy function to get an instance of contract
      //We get the contract asynchronously (mining delay?)
      return ChainList.deployed().then(function(instance) {
        //Once the promise is met, we use the instance and .getArticle
        return instance.getArticle();
        //Then we use chai assertions on the article instance
      }).then(function(data) {
        //Chai assertion framework
        console.log("data[3]=", data[3]);
        assert.equal(data[0], 0x0, "seller must be empty");
        assert.equal(data[1], "", "article name must be empty");
        assert.equal(data[2], "", "article description must be empty");
        assert.equal(data[3].toNumber(), 0, "article price must be zero");
      })
    });

    it("should sell an article", function() {
      return ChainList.deployed().then(function(instance) {
        chainListInstance = instance;
        return chainListInstance.sellArticle(articleName,
        articleDescription, web3.toWei(articlePrice, "ether"), {from: seller});
      }).then(function() {
        return chainListInstance.getArticle();
      }).then(function(data) {
        assert.equal(data[0], seller, "seller must be " + seller);
        assert.equal(data[1], articleName, "article name must be" + articleName);
        assert.equal(data[2], articleDescription, "article description must be" + articleDescription);
        assert.equal(data[3].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be" + web3.toWei(articlePrice, "ether"));
      });
    });
});
