import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Contracts from "../contracts/contracts.json";

export function UseWeb3() {
  const [hasProvider, setHasProvider] = useState(false);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      const { ethereum } = window;

      if (ethereum) {
        setHasProvider(true);

        const web3Provider : any = new ethers.providers.Web3Provider(ethereum);
        setProvider(web3Provider);
      }
    };

    initializeWeb3();
  }, []);

  return { hasProvider, provider };
}

// Utilisez le composant useWeb3 dans votre Homepage ou d'autres composants nécessitant Web3.
