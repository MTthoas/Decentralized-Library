// SPSX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Library {
    
    struct Book {
        string title;
        string author;
        uint256 pages;
        bool exist;
        bool isAvailable;
    }

    struct Loan {
        uint256 bookId;
        address borrower;
        bool isApproved;
    }

    mapping(uint256 => Book) public books;
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public borrowerLoans; 

    uint256 public bookCount = 0;
    uint256 public loanCount = 0;
    address public owner;

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Ajouter un livre

    function addBook(string memory _title, string memory _author) public onlyOwner{
        bookCount++;
        books[bookCount] = Book(_title, _author, 0, true, true);
    }

    // Récupérer un livre

    function getBook(uint256 _id) public view returns (Book memory) {
        require(books[_id].exist == true, "Book does not exist");
        return books[_id];
    }

    // Louer un livre

    function loanBook(uint256 _id) public {
        require(books[_id].exist == true, "Book does not exist");
        require(books[_id].isAvailable == true, "Book is not available");
        loanCount++;
        loans[loanCount] = Loan(_id, msg.sender, false);
        borrowerLoans[msg.sender].push(loanCount);
        books[_id].isAvailable = false;
    }

    // Approver un prêt

    function approveLoan(uint256 _id) public onlyOwner {
        require(loans[_id].isApproved == false, "Loan is already approved");
        loans[_id].isApproved = true;
    }

    // Récupérer un livre

    function removeBook(uint256 _id) public onlyOwner {
        require(books[_id].exist == true, "Book does not exist");
        require(books[_id].isAvailable == false, "Book is available");
        books[_id].isAvailable = true;
    }

    function returnBook(uint256 _id) public {
        require(loans[_id].isApproved == true, "Loan is not approved");
        require(loans[_id].borrower == msg.sender, "You are not the borrower");
        books[loans[_id].bookId].isAvailable = true;
    }

    function getBorrowerLoans(address _borrower) public view returns (uint256[] memory) {
        return borrowerLoans[_borrower];
    }
    
}