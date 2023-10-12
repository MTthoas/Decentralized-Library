// SPSX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Library {
    
    struct Book {
        uint256 bookId;
        string title;
        string author;
        uint256 pages;
        bool exist;
        bool isAvailable;
        bool isApproved;
        address borrower;
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

    function getOwner() public view returns (address) {
        return owner;
    }

    function isOwner () public view returns (bool) {
        return msg.sender == owner;
    }


    // Ajouter un livre

    function addBook(string memory _title, string memory _author) public onlyOwner{
        bookCount++;
        books[bookCount] = Book(bookCount, _title, _author, 0, true, true, false, msg.sender);
    }


    // Récupérer un livre

    function getBook(uint256 _id) public view returns (Book memory) {
        require(books[_id].exist == true, "Book does not exist");
        return books[_id];
    }

    function getAllBooks() public view returns (Book[] memory) {
        uint256 existingBooksCount = 0;
        
        // Compter combien de livres ont la propriété 'exist' à 'true'
        for (uint256 i = 1; i <= bookCount; i++) {
            if (books[i].exist) {
                existingBooksCount++;
            }
        }

        // Créer un tableau dynamique de la taille du nombre de livres existants
        Book[] memory allBooks = new Book[](existingBooksCount);
        
        uint256 j = 0; // Index pour le tableau allBooks
        for (uint256 i = 1; i <= bookCount; i++) {
            if (books[i].exist) {
                allBooks[j] = books[i];
                j++;
            }
        }
        return allBooks;
    }



    // Louer un livre

    function loanBook(uint256 _id) public {
        require(books[_id].exist == true, "Book does not exist");
        require(books[_id].isAvailable == true, "Book is not available");
        loanCount++;
        loans[loanCount] = Loan(_id, msg.sender, false);
        borrowerLoans[msg.sender].push(loanCount);
        books[_id].isAvailable = false;
        books[_id].borrower = msg.sender;
    }

    function BookIsLoan(uint256 _id) public view returns (bool) {
        require(books[_id].exist == true, "Book does not exist");
        return books[_id].isAvailable;
    }

    // Approver un prêt

    function approveLoan(uint256 _id) public onlyOwner {
        require(loans[_id].isApproved == false, "Loan is already approved");
        loans[_id].isApproved = true;
        books[_id].isApproved = true;
    }

    // Récupérer un livre

    function removeBook(uint256 _id) public onlyOwner {
        require(books[_id].exist == true, "Book does not exist");
        require(books[_id].isAvailable == false, "Book is available");
        books[_id].isAvailable = true;
    }

    function deleteBook(uint256 _id) public onlyOwner() {
        require(books[_id].exist == true, "Book does not exist");
        delete books[_id];
    }

    function returnBook(uint256 _id) public {
        require(loans[_id].isApproved == true, "Loan is not approved");
        require(loans[_id].borrower == msg.sender, "You are not the borrower");
        books[loans[_id].bookId].isAvailable = true;
        books[loans[_id].bookId].borrower = owner;
    }

    function getBorrowerLoans(address _borrower) public view returns (uint256[] memory) {
        return borrowerLoans[_borrower];
    }
    
}