import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
// import { Web3 } from "web3";
import { EthereumTx } from "ethereumjs-tx";


// declare let require: any;
// declare let window: any;


@Injectable()
export class ContractsService {

  rpcURL: string = "https://ropsten.infura.io/v3/befb2a49776a49cfa3556ad3bd045ae2"
  web3 = new Web3(this.rpcURL)
  contractABI = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }]
  contractAddress: string = "0xB1Ef691806FBccc3B84F46186827ef883c33BccE"
  tokenContract = new this.web3.eth.Contract(this.contractABI, this.contractAddress)

  constructor() {
  }

  public sendCustomTokenTo(fromAddress: string, toAddress: string): Promise<any> {
    try{
      return new Promise((resolve, reject) => {
        resolve("success")
      })
    }catch(e) {
      return Promise.reject(e)
    }
  }

  public async createAccount() {
    var account = await this.web3.eth.accounts.create()
    return account
  }

  public getEtherBalance(publicAddress: string): Promise<number> {
    try{
      return new Promise((resolve, reject) => {
        this.web3.eth.getBalance(publicAddress, (e, wei) => {
          if(e) reject(e)
          let balance: number = this.web3.utils.fromWei(wei, 'ether')
          resolve(balance);
        })
      })
        }catch(e) {
    }
  }

  public getCustomTokenBalance(publicAddress: string): Promise<number> {
    try {
      // console.log(this.tokenContract)
      var balancePromise = new Promise((resolve, reject) => {
        this.tokenContract.methods.balanceOf(publicAddress).call((e, result) => {
          if(e) reject(e)
          resolve(result)
        })
      })
      var decimalsPromise = new Promise((resolve, reject) => {
        this.tokenContract.methods.decimals().call((e, result) => {
          if(e) reject(e)
          resolve(result)
        })
      })
      return Promise.all([balancePromise, decimalsPromise]).then(res => {
        // console.log(res)
        var balanceWei: number = +res[0]
        var decimals: number = +res[1]
        // console.log(balanceWei, decimals)
        var balanceToken = balanceWei / (Math.pow(10, decimals))
        // console.log(balanceToken)
        return Promise.resolve(balanceToken)
      })
    } catch (e) {
      return Promise.reject(e)
    }
  }
}