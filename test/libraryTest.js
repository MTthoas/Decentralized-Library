// import { ethers } from "hardhat";
// import { expect } from "chai";
// import {
//     time,
//     loadFixture,
//   } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

// describe("Library", function () {
//     let library: any;
//     let lock: any;
//     let owner: any;
//     let addr1: any;
//     let unlockTime: any;
//     let lockedAmount: any;

//     async function deployOneYearLockFixture() {
//         const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//         const ONE_GWEI = 1_000_000_000;
    
//         const lockedAmount = ONE_GWEI;
//         unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

//         const [deployer, addr1] = await ethers.getSigners();

//         const Lock = await ethers.getContractFactory("Lock");
//         lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//         const Library = await ethers.getContractFactory("Library");
//         library = await Library.deploy();

//         return { library, lock, unlockTime, lockedAmount, deployer, addr1 };
//     }

//     beforeEach(async function () {
//         const fixture = await loadFixture(deployOneYearLockFixture);
//         library = fixture.library;
//         lock = fixture.lock;
//         unlockTime = fixture.unlockTime;
//         lockedAmount = fixture.lockedAmount;
//         owner = fixture.deployer;
//         addr1 = fixture.addr1;
//     });

//     describe("Add a book", function () {
//         it("Should add a book", async function () {
//             await library.connect(owner).addBook("Harry Potter", "J.K. Rowling");
//             const book = await library.getBook(1);
//             expect(book.title).to.equal("Harry Potter");
//             expect(book.author).to.equal("J.K. Rowling");
//             expect(book.exist).to.be.true;
//         });

//         it("Non-owner should not add a book", async function () {
//             await expect(library.connect(addr1).addBook("Another Book", "Another Author")).to.be.revertedWith("Only owner can call this function");
//         });

//     });

//     describe("Loan book", function () {
//         it("Should allow users to loan an available book", async function () {
//             await library.connect(owner).addBook("Harry Potter", "J.K. Rowling");
//             await library.connect(addr1).loanBook(1);
//             const book = await library.getBook(1);
//             expect(book.isAvailable).to.be.false;
//         });

//         it("Should not allow users to loan an unavailable book", async function () {
//             await library.connect(owner).addBook("Harry Potter", "J.K. Rowling");
//             await library.connect(addr1).loanBook(1);
//             await expect(library.connect(addr1).loanBook(1)).to.be.revertedWith("Book is not available");
//         });
//     });

//     describe("Approve Loan", function () {
//         it("Should allow the owner to approve a loan", async function () {
//             await library.connect(owner).addBook("Harry Potter", "J.K. Rowling");
//             await library.connect(addr1).loanBook(1);
//             await library.connect(owner).approveLoan(1);
//             const loan = await library.loans(1);
//             expect(loan.isApproved).to.be.true;
//         });

//         it("Should not allow non-owner to approve a loan", async function () {
//             await library.connect(owner).addBook("Harry Potter", "J.K. Rowling");
//             await library.connect(addr1).loanBook(1);
//             await expect(library.connect(addr1).approveLoan(1)).to.be.revertedWith("Only owner can call this function");
//         });
//     });

    




// });
