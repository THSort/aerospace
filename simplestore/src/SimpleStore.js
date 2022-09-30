// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

import React, {useState} from 'react'
import {ethers} from 'ethers'
import SimpleStore_abi from './SimpleStore_abi.json'

const SimpleStorage = () => {

	// deploy simple storage contract and paste deployed contract address here. This value is local ganache chain
	let contractAddress = '0x6f6beFcD19aB0F203F46Dc2C551E4Dd960D192d1';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [currentContractVal, setCurrentContractVal] = useState(null);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers();
	}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}


	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers = () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(contractAddress, SimpleStore_abi, tempSigner);
		setContract(tempContract);	
	}

	const setPartName = (event) => {
		event.preventDefault();
		console.log('sending ' + event.target.setPart.value + ' to the contract');
		contract.set_Part(event.target.setPart.value);
	}

    const setTechName = (event) => {
		event.preventDefault();
		console.log('sending ' + event.target.setTech.value + ' to the contract');
		contract.set_Tech(event.target.setTech.value);
	}

    const setLoc = (event) => 
    {
		event.preventDefault();
		console.log('sending ' + event.target.setLoc.value + ' to the contract');
		contract.set_Loc(event.target.setLoc.value);
	}

    const setNewContract = (event) =>
    {
        setPartName(event);
        setTechName(event);
        setLoc(event);
    }

	const getCurrentVal = async () => {
		let val = await contract.get();
		setCurrentContractVal(val);
	}
	
	return (
		<div>
		<h4> {"Get/Set Contract interaction"} </h4>
			<button onClick={connectWalletHandler}>{connButtonText}</button>
			<div>
				<h3>Address: {defaultAccount}</h3>
			</div>
			<form onSubmit={setNewContract}>
				<input id="setPart" type="text" placeholder='Enter part name'/>
                <input id="setTech" type="text" placeholder='Enter technician name'/>
                <input id="setLoc" type="text" placeholder='Enter location'/>
				<button type={"submit"}> Update Contract </button>
			</form>
			<div>
			<button onClick={getCurrentVal} style={{marginTop: '5em'}}> Get Current Contract Value </button>
			</div>
			{currentContractVal}
			{errorMessage}
		</div>
	);
}

export default SimpleStorage;
