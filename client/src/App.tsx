import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';

function App() {
  const [address, setAddress] = useState('');

  // Au montage du composant, vérifiez si l'adresse est stockée dans le localStorage
  useEffect(() => {
    const savedAddress = localStorage.getItem('connectedAddress');
    if (savedAddress) {
      setAddress(savedAddress);
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
    localStorage.removeItem('connectedAddress'); // Retirer l'adresse du localStorage
  };

  return (
    <Router>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-24 flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold"> Decentralized Library</h1>
          <div className="connectBtns text-white">
            {address ? (
              <>
                <span className="text-white mr-2">{address.slice(0, 10)}...</span>
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

      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Router>
  );
}

export default App;
