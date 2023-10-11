import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';

function App() {
  const [address, setAddress] = useState('');

  const ConnectToMetaMask = async () => {
    try {
      if (window.ethereum) {
        // Set MetaMask to use Sepolia
        const SEPOLIA_CHAIN_ID = '0xaa36a7'; // Replace XX with the correct chain ID for Sepolia
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
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
  }

  return (
    <Router>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">Votre Librairie</h1>
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
