import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';

function App() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);  


  useEffect(() => {
    const savedAddress = localStorage.getItem('connectedAddress');
    if (savedAddress) {
      setAddress(savedAddress);
    }

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts: string[]) => {
        setAddress(accounts[0]);
        localStorage.setItem('connectedAddress', accounts[0]);
      });
    }
  }, []);

  const ConnectToMetaMask = async () => {
    try {
      if (window.ethereum) {
        const SEPOLIA_CHAIN_ID = '0xaa36a7';
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
        localStorage.setItem('connectedAddress', accounts[0]); // Stocker l'adresse dans localStorage
        console.log('Connected to MetaMask on Sepolia!', accounts);
      } else {
        console.error('MetaMask not found. Please install MetaMask to use this application.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  

  const DisconnectMetaMask = () => {
    setAddress('');
    setBalance(0);
    localStorage.removeItem('connectedAddress');
  };

  return (
    <Router>
       <div className="flex flex-col min-h-screen">
        <nav className="bg-gray-800 p-4">
          <div className="container mx-24 flex justify-between items-center">
            <h1 className="text-white text-2xl font-semibold">Decentralized Library</h1>
            <div className="connectBtns text-white">
              {address ? (
                <>
                  <span className="text-white mr-2">{address.slice(0, 10)}... ({balance} ETH)</span>
                  <button onClick={DisconnectMetaMask}>X</button>
                </>
              ) : (
                <button className="btn text-white" onClick={ConnectToMetaMask}>
                  Connect To MetaMask
                </button>
              )}
            </div>
          </div>
        </nav>

        <div className="flex-grow">
          {!address ? (
            <div className="mt-4 mx-24 p-4 border bg-white text-dark text-center">
              <p>Please connect to MetaMask to access the Homepage and view books in English.</p>
            </div>
          ) : ( 
            <Routes>
              <Route path="/" element={<Homepage />} />
            </Routes>
          )}
        </div>

        <footer className="bg-gray-800 p-4 mt-8">
          <div className="container mx-24 text-white ">
            <p>Decentralized Library - 2021</p>
            <p> Developped by Pecquery Matthias @https://github.com/MTthoas</p>
          </div>
          
        </footer>
      </div>
      
    </Router>
  );

}

export default App;
