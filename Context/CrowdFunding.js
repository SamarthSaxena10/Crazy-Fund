import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
//Internal Import
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./contants";

// fetching Smart Contract
const fetchContract = (signOrProvider) =>
  new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signOrProvider);

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({ children }) => {
  const titledata = "Crowd Funding Contract";
  const [currentAccount, setCurrentAccount] = useState("");

  const createCampaign = async (campaign) => {
    const { title, description, amount, deadline } = campaign;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    console.log(currentAccount);
    try {
      const transaction = await contract.createCampaign(
        title,
        description,
        currentAccount,
        ethers.utils.parseUnits(amount, 18),
        new Date(deadline).getTime()
      );

      await transaction.wait();

      console.log("contract call successfull", transaction);
    } catch (error) {
      console.log("contract call failed", error);
    }
  };

  const getCampaigns = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);
    const campaigns = await contract.getCampaigns();

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatUnits(campaign.target, toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      pId: i,
    }));

    return parsedCampaigns;
  };

  const getuserCampaigns = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);
    const allCampaigns = await contract.getUserCampaigns();
    const account = await window.ethereum.request({ method: "eth_accounts" });

    const currentAccount = account[0];
    const filteredCampaigns = allCampaigns.filter(
      (campaign) =>
        campaign.owner === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    );

    const userData = filteredCampaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatUnits(campaign.target, toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      pId: i,
    }));

    return userData;
  };

  const donate = async (pId, amount) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const campaignData = await contract.donateToCampaign(pId, {
      value: ethers.utils.parseEther(amount),
    });

    await campaignData.wait();
    location.reload();

    return campaignData;
  };

  const getDonations = async (pId) => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);
    const donations = await contract.getDonations(pId);

    const numbeerOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numbeerOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donations: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum)
        return setOpenErrorModal(true), setError("Install metamask");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No account found");
      }
    } catch (error) {
      console.log("Something wrong while connectiing to wallet");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return console.log("Install metamask");

      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(account[0]);
    } catch (error) {
      console.log("Something wrong while connectiing to wallet");
    }
  };

  return (
    <CrowdFundingContext.Provider
      value={{
        titledata,
        currentAccount,
        connectWallet,
        createCampaign,
        getCampaigns,
        getuserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};
