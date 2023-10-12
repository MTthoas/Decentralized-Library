import { ethers } from "ethers";
import Contracts from "../contracts/contracts.json";

export const useEthereum = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    Contracts.Library.address,
    Contracts.Library.abi,
    signer
  );
  return { provider, signer, contract };
};
