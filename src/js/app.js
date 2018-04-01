App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // initialize web3
    if(typeof web3 != 'undefined') {
      //reuse the provider of the Web3 object injected by MetaMask
      App.web3Provider = web3.currentProvider;
    } else {
      //create new provider and plug it directly into our local node
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    App.displayAccountInfo();

    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account =account;
        $('#account').text(account);
        web3.eth.getBalance(account, function(err, balance) {
          if(err === null) {
            $('#accountBalance').text(web3.fromWei(balance, "ether") + "ETH");
          }
        });
      }
    });
  },

  initContract: function() {
    //get the contract artifact file...
    $.getJSON('ChainList.json', function(chainListArtifact) {
        //... and use it to instantiate a truffle contract abstraction
        //ChainList.json was created by truffle during the migration and put into
        // the build/contracts folder.
        //truffle did this for us before, here we do it ourselves!
        App.contracts.ChainList = TruffleContract(chainListArtifact);
        //wraps our contract artifact into truffle contract object under App object
        // set the provider for our baseContracts using setProvider
        App.contracts.ChainList.setProvider(App.web3Provider);
        // retreive the article from the contracts
        return App.reloadArticles();
    });
  },

  reloadArticles: function() {
    // refresh account information because the balance might have changed
    App.displayAccountInfo();

    // retreive the article placeholder and clear inspect
    $('#articlesRow').empty();

    App.contracts.ChainList.deployed().then(function(instance) {
      return instance.getArticle();
    }).then(function(article) {
      if (article[0] == 0x0) {
        //no article
        return;
      }

      var articleTemplate = $('#articleTemplate');
      articleTemplate.find('.panel-title').text(article[1]);
      articleTemplate.find('.article-description').text(article[2]);
      articleTemplate.find('.article_price').text(web3.fromWei(article[3], "ether"));

      var seller = article[0];
      if (seller == App.account) {
        seller = "You";
      }
      articleTemplate.find('.article-seller').text(seller);

      //add this article to articlesRow
      $('#articlesRow').append(articleTemplate.html());
    }).catch(function(err) {
      console.error(err.message);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
