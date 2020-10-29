"use strict";

const BigNumber = require('bignumber.js');
const fetch = require('node-fetch');


const abis = require('./abis');

const contractAddress = process.env.CONTRACT;
const daiContractAddress = process.env.DAI;
const marketMakerContractAddress = process.env.MARKET;
const agentContractAddress = process.env.AGENT;

let tokenContract, daiContract, marketMakerContract;

module.exports = async function (web3, amount = "300") {
    let price, abi, c;    

    try {
        // get contracts
        if (!tokenContract) {
            abi = abis('erc20');
            tokenContract = new web3.eth.Contract(abi, contractAddress)
            // console.log('Token contract Initiated successfully!')
        }
        if (!daiContract) {
            abi = abis('erc20');
            daiContract = new web3.eth.Contract(abi, daiContractAddress)
            // console.log('DAI contract Initiated successfully!')
        }
        if (!marketMakerContract) {
            abi = abis('marketmaker');
            marketMakerContract = new web3.eth.Contract(abi, marketMakerContractAddress)
            // console.log('Market contract Initiated successfully!')
        }

        
        // get PPM
        const PPM = await marketMakerContract.methods.PPM().call();
        const PPMBN = new BigNumber(PPM);
        // console.log(PPM, 'ppm');
        
        // overallBalance(reserve, collateral): balanceOf(reserve, collateral) + virtualBalance(collateral) + collateralsToBeClaimed(collateral)
        // balanceOf(reserve, collateral)
        const reserveBalance = await daiContract.methods.balanceOf(agentContractAddress).call();
        const reserveBalanceBN = new BigNumber(reserveBalance);    
        // get the collateral token
        const collateralToken = await marketMakerContract.methods.getCollateralToken(daiContractAddress).call();
        // get the virtualBalance and the reserveRatio
        const virtualSupply = new BigNumber(collateralToken[1]);
        // console.log(web3.utils.fromWei(virtualSupply.toFixed()), "collateral.virtualSupply");
        const virtualBalance = new BigNumber(collateralToken[2]);
        // console.log(web3.utils.fromWei(virtualBalance.toFixed()), "collateral.virtualBalance");
        const reserveRatioBN = new BigNumber(collateralToken[3]);
        // console.log(reserveRatioBN.toString(), "reserveRatio");
        const collateral = new BigNumber(web3.utils.toWei(amount));
        const overallBalance = reserveBalanceBN.plus(virtualBalance).plus(collateral);
        // console.log(overallBalance.toFixed(), "overallBalance");
        
        // overallSupply(collateral): bondedToken.totalSupply + bondedToken.tokensToBeMinted + virtualSupply(collateral)
        const totalSupply = await tokenContract.methods.totalSupply().call();
        const tokensToBeMinted = await marketMakerContract.methods.tokensToBeMinted().call()
        // console.log(tokensToBeMinted, "tokensToBeMinted");
        const overallSupply = new BigNumber(totalSupply).plus(new BigNumber(tokensToBeMinted)).plus(virtualSupply)        
        // console.log(overallSupply.toFixed(), "overallSupply");
        
        const n = PPMBN.times(overallBalance);
        const d = overallSupply.times(reserveRatioBN);
        
        price = n.dividedBy(d);
        
    } catch (error) {
        // console.log(error);
        throw new Error('Price not found');
    }
    
    let eudol, euros;
    const response = await fetch('https://api.exchangeratesapi.io/latest');
    
    if (response && response.status !== 200) {
        throw new Error('EUR/DOLAR exchange not found');
    }
    if (response) {
        const eudolJSON = await response.json();
        eudol = new BigNumber(eudolJSON.rates.USD);
    }

    euros = price.dividedBy(eudol);
    // console.log(price.toFixed(4), "price $");
    // console.log(euros.toFixed(4), "price €");
    
    return {
        EUR: parseFloat(euros.toFixed(4)),
        USD: parseFloat(price.toFixed(4))
    };
};
