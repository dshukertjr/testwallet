import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
// import { Web3 } from "web3";
// import { EtherTx } from "ethereumjs-tx";
import * as Tx from 'ethereumjs-tx'
import { EthAccount } from "./models/eth-account";
import { toDate } from '@angular/common/src/i18n/format_date';



@Injectable()
export class ContractsService {

  web3 = new Web3("https://ropsten.infura.io/v3/befb2a49776a49cfa3556ad3bd045ae2")
  web3socket = new Web3(new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/befb2a49776a49cfa3556ad3bd045ae2"))
  // contractABI = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }]
  contractABI = [{ "constant": true, "inputs": [], "name": "mintingFinished", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "unpause", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "paused", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "finishMinting", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "pause", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }, { "name": "_releaseTime", "type": "uint256" }], "name": "mintTimelocked", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "remaining", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Mint", "type": "event" }, { "anonymous": false, "inputs": [], "name": "MintFinished", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Pause", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Unpause", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }]
  // contractABI = [ { "constant": false, "inputs": [ { "name": "from", "type": "address" }, { "name": "tokens", "type": "uint256" }, { "name": "token", "type": "address" }, { "name": "data", "type": "bytes" } ], "name": "receiveApproval", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]
  contractAddress: string = "0xB1Ef691806FBccc3B84F46186827ef883c33BccE"
  tokenContract = new this.web3.eth.Contract(this.contractABI, this.contractAddress)
  newBlockSubscription = this.web3socket.eth.subscribe('newBlockHeaders')
  pendingTransactionsSubscription = this.web3socket.eth.subscribe('pendingTransactions')


  constructor() {
  }

  // watchEtherTransfers() {
  //   this.pendingTransactionsSubscription.subscribe((e, result) => {
  //     if (e) console.error(e)
  //   })
  //     .on('data', async (txHash) => {
  //       try {
  //         const trx = await this.web3.eth.getTransaction(txHash)

  //         // const valid = this.validateTransaction(trx)
  //         // // If transaction is not valid, simply return
  //         // if (!valid) {
  //         //   console.log("invalid transaction")
  //         //   return
  //         // }

  //         console.log('Found incoming Ether transaction from ' + process.env.WALLET_FROM + ' to ' + process.env.WALLET_TO);
  //         console.log('Transaction value is: ' + process.env.AMOUNT)
  //         console.log('Transaction hash is: ' + txHash + '\n')

  //         // Initiate transaction confirmation
  //         this.confirmEtherTransaction(txHash)

  //         // Unsubscribe from pending transactions.
  //         this.subscription.unsubscribe()
  //       }
  //       catch (error) {
  //         console.log(error)
  //       }
  //     })
  // }

  // async getConfirmations(txHash) {
  //   try {
  //     const trx = await this.web3socket.eth.getTransaction(txHash)

  //     // Get current block number
  //     const currentBlock = await this.web3socket.eth.getBlockNumber()

  //     // When transaction is unconfirmed, its block number is null.
  //     // In this case we return 0 as number of confirmations
  //     return trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // confirmEtherTransaction(txHash, confirmations = 10) {
  //   setTimeout(async () => {

  //     // Get current number of confirmations and compare it with sought-for value
  //     const trxConfirmations = await this.getConfirmations(txHash)

  //     console.log('Transaction with hash ' + txHash + ' has ' + trxConfirmations + ' confirmation(s)')

  //     if (trxConfirmations >= confirmations) {
  //       // Handle confirmation event according to your business logic

  //       console.log('Transaction with hash ' + txHash + ' has been successfully confirmed')

  //       return
  //     }
  //     // Recursive call
  //     return this.confirmEtherTransaction(txHash, confirmations)
  //   }, 30 * 1000)
  // }

  // watchTokenTransfers(fromAccount: EthAccount, toAccount: EthAccount, sentAmount: string) {
  //   // Instantiate token contract object with JSON ABI and address
  //   const tokenContract = new this.web3socket.eth.Contract(
  //     this.contractABI, this.contractAddress,
  //     (error, result) => { if (error) console.log(error) }
  //   )

  //   // Generate filter options
  //   const options = {
  //     filter: {
  //       _from: fromAccount.address,
  //       _to: toAccount.address,
  //       _value: sentAmount
  //     },
  //     fromBlock: 'latest'
  //   }

  //   // Subscribe to Transfer events matching filter criteria
  //   tokenContract.events.Transfer(options, async (error, event) => {
  //     if (error) {
  //       console.log(error)
  //       return
  //     }

  //     console.log('Found incoming Pluton transaction from ' + process.env.WALLET_FROM + ' to ' + process.env.WALLET_TO + '\n');
  //     console.log('Transaction value is: ' + process.env.AMOUNT)
  //     console.log('Transaction hash is: ' + txHash + '\n')

  //     // Initiate transaction confirmation
  //     this.confirmEtherTransaction(event.transactionHash)

  //     return
  //   })
  // }

  public async sendCustomToken(fromAccount: EthAccount, toAccount: EthAccount, transfferAmount: string): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        this.web3.eth.getTransactionCount(fromAccount.address, (e, txCount) => {
          if (e) reject(e)
          const txObject = {
            "nonce": this.web3.utils.toHex(txCount),
            "gasPrice": this.web3.utils.toHex(this.web3.utils.toWei('4', 'gwei')),
            "gasLimit": this.web3.utils.toHex(200000),
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
          transaction.sign(fromPrivateKey)

          const serializedTx = transaction.serialize()
          const raw = '0x' + serializedTx.toString('hex')
          this.web3.eth.sendSignedTransaction(raw, (e, txHash) => {
            if (e) reject(e)
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
      return new Promise((resolve, reject) => {
        this.tokenContract.methods.balanceOf(publicAddress).call((e, result) => {
          if (e) reject(e)
          resolve(result)
        })
      })
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