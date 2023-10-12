import { useState, useEffect } from "react"; // Ajoutez useEffect ici
import { UseWeb3 } from "../hooks/UseWeb3";

import ModalAddBook from "../components/ModalAddBook";
import { UseEthereum } from "../hooks/UseEthereum";

interface Book {
  id: number;
  title: string;
  author: string;
  pages: number;
  exist : boolean;
  isAvailable: boolean;
  isApproved: boolean;
  owner: string;
}

export default function Homepage() {
  const { hasProvider } = UseWeb3();
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isOwnerOfSite, setIsOwnerOfSite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { provider, signer, contract } = UseEthereum();

  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingBorrow, setLoadingBorrow] = useState<number | null>(null);
  const [loadingApprove, setLoadingApprove] = useState<number | null>(null);
  const [loadingReturn, setLoadingReturn] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);

  useEffect(() => {
    getBooks();
    checkSelectedAddress();
  }, []);

  const checkSelectedAddress = async () => {

    if (window.ethereum && window.ethereum.selectedAddress) {

      const selectedAddress = window.ethereum.selectedAddress;
      console.log(`Connected to MetaMask with address: ${selectedAddress}`);

      const contractOwner = await contract.isOwner();

      console.log("Contract owner:", contractOwner);

      if (contractOwner == true) {
        setIsOwnerOfSite(true);
        console.log("Le propriétaire est connecté")
      } else {
        setIsOwnerOfSite(false);
      }
   }

  }

  const getBooks = async () => {
    if (window.ethereum) {
      try {
        const books = await contract.getAllBooks();

        console.table(books)


        const booksFormatted = books.map((book: any, index: number) => ({
          id: index,
          title: book.title,
          author: book.author,
          isAvailable: book.isAvailable,
          isApproved: book.isApproved,
          owner: book.borrower,
        }));

        setBooks(booksFormatted);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }
  };
  

  const addBook = async () => {
    setError(null);
    setLoadingAdd(true);

    if (window.ethereum) {
     
  
      try {
        const tx = await contract.addBook(title, author);
        await tx.wait();

        getBooks();
        setTitle("");
        setAuthor("");
        setIsModalOpen(false);
      } catch (error : any) {
        if (error.message && error.message.includes("You are not the borrower")) {
          setError("Seul le propriétaire peut ajouter des livres!");
        } else {
          console.error("Error adding book:", error);
          setError("Une erreur s'est produite lors de l'ajout du livre");
        }
      } finally {
        setLoadingAdd(false);
        getBooks()
      }
    } 
  };

  const borrowBook = async (id: number) => {
    if (window.ethereum) {
      setLoadingBorrow(id);
  
      try {
        const tx = await contract.loanBook(id);
        await tx.wait();

        getBooks();
      } catch (error : any) {
        console.error("Error borrowing book:", error);
        setError("Une erreur s'est produite lors de l'emprunt du livre");
        setLoadingBorrow(id);
      } finally {
        getBooks()
      }
      
      setLoadingBorrow(id);
    }
  };

  const approveLoan = async (bookId: number) => {

    setLoadingBorrow(bookId);

    try {

      console.log("Approve loan for book with id:", bookId);
      const isApproved = await contract.approveLoan(bookId);
      if (isApproved) {
        setLoadingApprove(null);
      }
    } catch (error : any) {
      console.error("Error checking approval:", error);
      setLoadingApprove(null);
      setError("Une erreur s'est produite lors de l'approbation du livre");
    } finally {
      getBooks()
    }

  }

  const returnBook = async (bookId: number) => {

    try {

      setLoadingReturn(bookId);
      console.log("Return book with id:", bookId);
      const isReturned = await contract.returnBook(bookId);
      if (isReturned) {
        setLoadingReturn(bookId);
      }
      
    } catch (error : any) {
      console.error("Error returning book:", error);
      let errorMessage = "Une erreur s'est produite lors du retour du livre.";

      if (error.error && error.error.message) {
        errorMessage += ` Détails: ${error.error.message}`;
      }
    
      setError("Une erreur s'est produite lors du retour du livre");
      setLoadingReturn(null);

    } finally {
      getBooks()
    }

  }


  const deleteBook = async (id: number) => {

    if (window.ethereum) {
  
      try {
        setLoadingDelete(id);
        const tx = await contract.deleteBook(id);
        await tx.wait();

        getBooks();
        setTitle("");
        setAuthor("");
        setIsModalOpen(false);
      } catch (error : any) {
        setLoadingDelete(id);
        if (error.message && error.message.includes("You are not the borrower")) {
          setError("Seul le propriétaire peut ajouter des livres!");
        } else {
          console.error("Error adding book:", error);
          setError("Une erreur s'est produite lors de l'ajout du livre");
        }
      } finally {
        getBooks()
      }
      setLoadingDelete(id);
    } 
  }

  return (
    <div className="App p-8 mx-24">
      <h1 className="text-2xl mb-8"> List of books </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {hasProvider && (
        <div>
          <table className="min-w-full table-auto mb-8">
            <thead>
              <tr>
                <th className="border p-2 text-left">Title</th>
                <th className="border p-2 text-left">Author</th>
                <th className="border p-2 text-left">Owner</th>
                <th className="border p-2 text-left">isAvailable</th>
                <th className="border p-2 text-left"></th>
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
                    {!book.isAvailable && isOwnerOfSite && !book.isApproved && (
                      <button
                        className="bg-blue-500 text-white p-2 rounded mx-2"
                        onClick={ () => { approveLoan(book.id + 1) } }
                        disabled = { loadingApprove === book.id + 1}
                      >
                        { loadingApprove === book.id + 1 ? "Chargement..." : "Approuver l'emprunt"}
                      </button>
                    )}
                    {!book.isAvailable && isOwnerOfSite && book.isApproved && (
                      <button
                        className="bg-red-500 text-white p-2 rounded mx-2"
                      >
                        Récupérer le livre
                      </button>
                    )}
                    {!book.isAvailable && !isOwnerOfSite && !book.isApproved && (
                      <button
                        className="bg-blue-500 text-white p-2 rounded mx-2"
                      >
                        Demande d'emprunt en cours au libraire..
                      </button>
                    )}
                    {book.isAvailable && isOwnerOfSite && (
                      <button
                        className="bg-red-500 text-white p-2 rounded mx-2"
                        onClick={() => {
                          deleteBook(book.id + 1)
                        }}
                        disabled = { loadingDelete === book.id + 1}
                      >
                        { loadingDelete === book.id + 1 ? "Chargement..." : "Supprimer"}
                      </button>
                    )}
                    {
                      window.ethereum && 
                      window.ethereum.selectedAddress?.toLowerCase() === book.owner.toLowerCase() && book.isApproved && (
                        <button
                          className="bg-green-500 text-white p-2 rounded  mx-2"
                          onClick={() => {
                            returnBook(book.id + 1)
                          }}
                          disabled = {loadingReturn === book.id + 1}
                        >
                          { loadingReturn === book.id + 1 ? "Chargement..." : "Rendre"}
                        </button>
                      )
                    }
                    {
                      book.isAvailable && (
                        <button
                          className={`bg-yellow-500 text-white p-2 rounded mx-2 ${loadingBorrow === book.id + 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => borrowBook(book.id + 1)}
                          disabled={loadingBorrow === book.id + 1}
                        >
                          {loadingBorrow === book.id + 1 ? "Chargement..." : "Emprunter"}
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
        <ModalAddBook 
          title={title} 
          setTitle={setTitle} 
          author={author}
          setAuthor={setAuthor}
          loadingAdd={loadingAdd}
          addBook={addBook}
          error={error}
          closeModal={() => setIsModalOpen(false)}
           />
      )}
    </div>
  );
}
