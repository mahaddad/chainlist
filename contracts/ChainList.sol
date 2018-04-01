pragma solidity ^0.4.18;

contract ChainList {
  // state variables
  address seller;
  string name;
  string description;
  uint256 price; //unsigned integer of 256 bits, security concern?

  //sell article
  function sellArticle(string _name, string _descrption, uint256 _price) public {
    seller = msg.sender;
    name = _name;
    description = _descrption;
    price = _price;
  }

  // get an article
  function getArticle() public view returns (
    address _seller,
    string _name,
    string _descrption,
    uint256 _price
) {
  return(seller, name, description, price);
 }
}
