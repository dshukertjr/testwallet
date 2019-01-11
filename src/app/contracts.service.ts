import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
// import { Web3 } from "web3";
// import { EtherTx } from "ethereumjs-tx";
import * as Tx from 'ethereumjs-tx'
import { EthAccount } from "./models/eth-account";


// declare let require: any;
// declare let window: any;


@Injectable()
export class ContractsService {

  rpcURL: string = "https://ropsten.infura.io/v3/befb2a49776a49cfa3556ad3bd045ae2"
  web3 = new Web3(this.rpcURL)
  // contractABI = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }]
  contractABI = [{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_releaseTime","type":"uint256"}],"name":"mintTimelocked","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
// contractABI = [ { "constant": false, "inputs": [ { "name": "from", "type": "address" }, { "name": "tokens", "type": "uint256" }, { "name": "token", "type": "address" }, { "name": "data", "type": "bytes" } ], "name": "receiveApproval", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]
  contractAddress: string = "0xB1Ef691806FBccc3B84F46186827ef883c33BccE"
  tokenContract = new this.web3.eth.Contract(this.contractABI, this.contractAddress)


  constructor() {
  }

  public async sendCustomToken(fromAccount: EthAccount, toAccount: EthAccount, transfferAmount: string): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        this.web3.eth.getTransactionCount(fromAccount.address, (e, txCount) => {
          if(e) reject(e)
          console.log(this.web3)
          // const tokenContract = new this.web3.eth.Contract(this.contractABI, this.contractAddress)
          // const tokenContract = this.web3.eth.Contract(this.contractABI)
          // console.log(this.contractABI)
          console.log(this.tokenContract)
          const txObject = {
            "nonce": this.web3.utils.toHex(txCount),
            "gasPrice": this.web3.utils.toHex(this.web3.utils.toWei('10', 'gwei')),
            "gasLimit": this.web3.utils.toHex(50000),
            "to": this.contractAddress,
            "data": this.tokenContract.methods.transfer(toAccount.address, transfferAmount).encodeABI(),
          }

          const fromPrivateKey = Buffer.from(fromAccount.privateKey, 'hex')
          const transaction = new Tx(txObject)
          transaction.sign(fromPrivateKey);
          const serializedTx = transaction.serialize();

          const raw = '0x' + serializedTx.toString('hex')
          this.web3.eth.sendSignedTransaction(raw, (e, txHash) => {
            if (e) reject(e)
            console.log('txHash:', txHash)
            resolve(txHash)
          })
        })
      })
    } catch (e) {
      return Promise.reject(e)
    }
  }

  public sendEther(fromAccount: EthAccount, toAccount: EthAccount, tokenAmount: string): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        console.log(fromAccount.address)
        this.web3.eth.getTransactionCount(fromAccount.address, (e, txCount) => {
          if (e) reject(e)
          const txObject = {
            nonce: this.web3.utils.toHex(txCount),
            to: toAccount.address,
            value: this.web3.utils.toHex(this.web3.utils.toWei(tokenAmount, 'ether')),
            gasLimit: this.web3.utils.toHex(21000),
            gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('10', 'gwei'))
          }
          const transaction = new Tx(txObject)
          var fromPrivateKey = Buffer.from(fromAccount.privateKey, 'hex')
          console.log(fromPrivateKey)
          transaction.sign(fromPrivateKey)

          const serializedTx = transaction.serialize()
          const raw = '0x' + serializedTx.toString('hex')
          this.web3.eth.sendSignedTransaction(raw, (e, txHash) => {
            if (e) reject(e)
            console.log('txHash:', txHash)
            resolve(txHash)
          })
        })
      })
    } catch (e) {
      return Promise.reject(e)
    }
  }

  public async createAccount() {
    var account = await this.web3.eth.accounts.create()
    return account
  }

  public getEtherBalance(publicAddress: string): Promise<number> {
    try {
      return new Promise((resolve, reject) => {
        this.web3.eth.getBalance(publicAddress, (e, wei) => {
          if (e) reject(e)
          let balance: number = this.web3.utils.fromWei(wei, 'ether')
          resolve(balance);
        })
      })
    } catch (e) {
    }
  }

  public getRawCustomTokenBalance(publicAddress: string): Promise<number> {
    try {
      // console.log(this.tokenContract)
      return new Promise((resolve, reject) => {
        this.tokenContract.methods.balanceOf(publicAddress).call((e, result) => {
          if (e) reject(e)
          resolve(result)
        })
      })
      // var decimalsPromise = new Promise((resolve, reject) => {
      //   this.tokenContract.methods.decimals().call((e, result) => {
      //     if (e) reject(e)
      //     resolve(result)
      //   })
      // })
      // return Promise.all([balancePromise, decimalsPromise]).then(res => {
      //   // console.log(res)
      //   var balanceWei: number = +res[0]
      //   var decimals: number = +res[1]
      //   // console.log(balanceWei, decimals)
      //   var balanceToken = balanceWei / (Math.pow(10, decimals))
      //   // console.log(balanceToken)
      //   return Promise.resolve(balanceToken)
      // })
    } catch (e) {
      return Promise.reject(e)
    }
  }

  public getCustomTokenDecimal(): Promise<number> {
    try {
      return new Promise((resolve, reject) => {
        this.tokenContract.methods.decimals().call((e, result) => {
          if (e) reject(e)
          resolve(result)
        })
      })
    } catch (e) {
      return Promise.reject(e)
    }
  }
}