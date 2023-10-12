import React from 'react';

interface ModalAddBookProps {
  title: string;
  setTitle: (value: string) => void;
  author: string;
  setAuthor: (value: string) => void;
  loading: boolean;
  addBook: () => void;
  closeModal: () => void;
}

const ModalAddBook: React.FC<ModalAddBookProps> = ({ title, setTitle, author, setAuthor, loading, addBook, closeModal }) => {
  return (
    <div className="relative z-10">
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
                onClick={closeModal}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalAddBook;
