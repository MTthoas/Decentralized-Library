import React, { useState, useEffect } from "react"; // Ajoutez useEffect ici
import { ethers } from "ethers";
import { UseWeb3 } from "../hooks/UseWeb3";
import Contracts from "../contracts/contracts.json";

interface Book {
  id: number;
  title: string;
  author: string;
  isAvailable: boolean;
  owner: string;
}

export default function Homepage() {
  const { hasProvider } = UseWeb3();
  const [books, setBooks] = useState<Book[]>([]); // Ceci est un exemple, dans la réalité, vous allez probablement récupérer ces données de votre contrat Ethereum
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const [isModalOpen, setIsModalOpen] = useState(false);

  let provider: any;

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      // MetaMask is connected
      const selectedAddress = window.ethereum.selectedAddress;
      console.log(`Connected to MetaMask with address: ${selectedAddress}`);

      

    } else {
      // MetaMask is not connected
      console.log("MetaMask is not connected");
    }
    getBooks();
  }, []);

  const getBooks = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        Contracts.Library.address,
        Contracts.Library.abi,
        signer
      );

      try {
        const books = await contract.getAllBooks();

        console.table(books)


        const booksFormatted = books.map((book: any, index: number) => ({
          id: index,
          title: book.title,
          author: book.author,
          isAvailable: book.isAvailable,
          owner: book.borrower,
        }));

        // console.table(booksFormatted);

        setBooks(booksFormatted);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }
  };
  

  const addBook = async () => {
    setError(null);

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        Contracts.Library.address,
        Contracts.Library.abi,
        signer
      );

      const currentAddress = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Current address:", currentAddress[0]);
      
      const contractOwner = await contract.getOwner();
      console.log("Contract owner:", contractOwner);
  
      try {
        setLoading(true);
        const tx = await contract.addBook(title, author);
        // Attendez que la transaction soit minée
        await tx.wait();
        // Après avoir ajouté un livre et la transaction a été minée, rafraîchissez la liste des livres
        getBooks();
        setTitle("");
        setAuthor("");
        setIsModalOpen(false);
      } catch (error : any) {
        if (error.message && error.message.includes("Only owner can call this function")) {
          setError("Seul le propriétaire peut ajouter des livres!");
        } else {
          console.error("Error adding book:", error);
          setError("Une erreur s'est produite lors de l'ajout du livre");
        }
      } finally {
        setLoading(false);
      }
    } 
  };

  const borrowBook = async (id: number) => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        Contracts.Library.address,
        Contracts.Library.abi,
        signer
      );

      console.log("Borrowing book with id:", id);
  
      try {
        const tx = await contract.loanBook(id);
        // Attendez que la transaction soit minée
        await tx.wait();
        // Rafraîchissez la liste des livres
        getBooks();
      } catch (error) {
        console.error("Error borrowing book:", error);
        setError("Une erreur s'est produite lors de l'emprunt du livre");
      }
    }
  };

  const waitForApproval = async (bookId: number) => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        Contracts.Library.address,
        Contracts.Library.abi,
        signer
      );
  
      try {
        const isApproved = await contract.BookIsLoan(bookId);
        if (isApproved) {
          // Continuez votre logique ici si le livre est approuvé pour être emprunté
        }
      } catch (error) {
        console.error("Error checking approval:", error);
      }
    }
  };

  const deleteBook = async (id: number) => {

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        Contracts.Library.address,
        Contracts.Library.abi,
        signer
      );

      const currentAddress = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Current address:", currentAddress[0]);
      
      const contractOwner = await contract.getOwner();
      console.log("Contract owner:", contractOwner);
  
      try {
        const tx = await contract.deleteBook(id);
        // Attendez que la transaction soit minée
        await tx.wait();
        // Après avoir ajouté un livre et la transaction a été minée, rafraîchissez la liste des livres
        getBooks();
        setTitle("");
        setAuthor("");
        setIsModalOpen(false);
      } catch (error : any) {
        if (error.message && error.message.includes("Only owner can call this function")) {
          setError("Seul le propriétaire peut ajouter des livres!");
        } else {
          console.error("Error adding book:", error);
          setError("Une erreur s'est produite lors de l'ajout du livre");
        }
      }
    } 
  }

  return (
    <div className="App p-8 mx-12">
      <h1 className="text-2xl mb-4">Librairie Décentralisée</h1>

      {hasProvider && (
        <div>
          <table className="min-w-full table-auto mb-8">
            <thead>
              <tr>
                <th className="border p-2">Title</th>
                <th className="border p-2">Author</th>
                <th className="border p-2">Owner</th>
                <th className="border p-2">isAvailable</th>
                <th className="border p-2"></th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td className="border p-2">{book.title}</td>
                  <td className="border p-2">{book.author}</td>
                  <td className="border p-2">{book.owner}</td>
                  <td className="border p-2">{String(book.isAvailable)}</td>

                  <td className="border p-2">
                    {!book.isAvailable && (
                      <button
                        className="bg-blue-500 text-white p-2 rounded"
                        onClick={() => {
                          borrowBook(book.id);
                        }}
                      >
                        Emprunter
                      </button>
                    )}
                    {book.isAvailable && (
                      <button
                        className="bg-red-500 text-white p-2 rounded mx-2"
                        onClick={() => {
                          deleteBook(book.id);
                        }}
                      >
                        Supprimer
                      </button>
                    )}
                    {
                      book.isAvailable && (
                        <button
                          className="bg-green-500 text-white p-2 rounded  mx-2"
                          onClick={() => {
                            /* handle borrow logic */
                          }}
                        >
                          Rendre
                        </button>
                      )
                    }
                    {
                      book.isAvailable && (
                        <button
                          className="bg-yellow-500 text-white p-2 rounded mx-2"
                          onClick={() => {
                            /* handle borrow logic */
                          }}
                        >
                          Emprunter
                        </button>
                      )
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 text-white p-2 rounded"
          >
            Ajouter un livre
          </button>
        </div>
      )}

      {isModalOpen && (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="flex items-center justify-center">
                  <div className="bg-white p-8 rounded">
                    <h2 className="text-xl mb-4">Ajouter un livre</h2>
                    <input
                      className="border p-2 mb-4 w-full"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Titre du livre"
                    />
                    <input
                      className="border p-2 mb-4 w-full"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Auteur du livre"
                    />

                  </div>
                </div>
                <div className=" px-4 py-3 sm:flex sm:flex-row-reverse px-5">
                  <button onClick={addBook} disabled={loading} className="bg-blue-50 border px-3 mx-3 rounded-md">
                      {loading ? "Ajout du livre en cours..." : "Ajouter un livre"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
