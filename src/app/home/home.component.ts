import { Component, OnInit } from '@angular/core';
import { ContractsService } from "../contracts.service";
import { EthAccount } from "../models/eth-account";
// import { Btc } from "bitcoinjs-lib";
import * as Btc from 'bitcoinjs-lib'
// import * as bip39 from 'bip39'
// import * as request from "request";
// import { request } from "request";
import { HttpClient } from '@angular/common/http';
// import * as sha256 from 'js-sha256';
const sha256 = require('js-sha256')
const ripemd160 = require('ripemd160')
import * as sipemd160 from 'ripemd160';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [ContractsService],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public rawCustomTokenBalance: number

  public customTokenBalance: string

  public tokenSymbol: string

  public etherBalance: number

  public sendAmount: number = 1

  public customTokenDecimal: number

  // private btc = new Btc()

  public bitCoinAccount: Object = {
    address: "n45rRGoLVk3L3VsSjQnWjxkRGwfPTgH6Vg",
    privateKey: "cSExqzWt5Ja4ufMxDUg1FxAXxn1jKVv8t5SbLcSdTmVYw9WjKHV3",
  }

  public bitCoinAmount: number

  private TestNet = Btc.networks.testnet

  public account: EthAccount = {
    address: "0xEEf4880E9Eb3ad610253926c9883c86b7623Bc1d",
    privateKey: "aa67e048dc6c0a079c710138329a846df2495c273851eb110a429cff7247a0e1",
  };

  public recevingEthAccount: EthAccount = {
    address: "0xFaF77E4584fE0dF6e859eCC54648837267E50558",
  }

  constructor(private readonly cs: ContractsService, private http: HttpClient) {
  }

  ngOnInit() {
    this.getAccounts()
    this.onNewBlock()
  }

  getAccounts() {
    this.getRawCustomTokenBalance()
    this.getCustomTokenDecimal()
    this.getEtherBalance()
  }

  async createPublicAddress() {
    // var hash = sha256(Buffer.from(msg, 'hex'))
  }

  async getBitcoinAmount() {
    var addr = this.bitCoinAccount["address"]
    console.log("address", addr)
    // console.log(JSON)
    var res = await this.http.get(`https://testnet.blockexplorer.com/api/addr/${addr}/balance`).toPromise()
    console.log("res", res)
    return res.toString()
    // this..get(`https://testnet.blockexplorer.com/api/${addr}/balance`, (err, req, body) => {
    // //   console.log(JSON.parse(body))
    // })
  }

  async sendBitcoin() {
    var currentAmount = parseInt(await this.getBitcoinAmount())
    var sendAmount = 2000 //in satoshi
    var fee = 1000 //in satoshi
    var amountToKeep = currentAmount - sendAmount - fee
    console.log("currentAmount", currentAmount, "sendAmount", sendAmount, "fee", fee, "amountToKeep", amountToKeep)
    var tx = new Btc.TransactionBuilder(this.TestNet)
    console.log("tx", tx)

    // this.http.post(`https://testnet.blockexplorer.com/api/tx/send`, )
  }

  createNewBitcoinAccount() {
    // console.log(Btc)
    var keyPair = Btc.ECPair.makeRandom({network: this.TestNet})
    Btc.ECPair.fromWIF("")
    var publicKey = keyPair.publicKey

    var p2pkh = Btc.payments.p2pkh({ pubkey: keyPair.publicKey, network: this.TestNet }) //public key hash
    var address = p2pkh.address
    var privateKey = keyPair.toWIF()
    console.log("address inside", address)
    console.log("keypair", keyPair)
    console.log("address", address)
    console.log("privateKey", privateKey)
    console.log("publicKey", publicKey)

    for(var i = 0; i < 10; i++) {
      var p2pkh = Btc.payments.p2pkh({ pubkey: keyPair.publicKey, network: this.TestNet }) //public key hash
      var address = p2pkh.address
      console.log("address", address)
    }
    // console.log("pkh", pkh)
    // var hash = sha256(Buffer.from(pkh.address, "hex"))
    // console.log("hash", hash)
    // var publicKeyHash = new ripemd160().update(Buffer.from(hash, "hex")).digest()
    // console.log("public key hash", publicKeyHash)
    // var step1 = Buffer.from(`00${publicKeyHash}`, "hex")
    // console.log("step1", step1)
    // var step2 = sha256(step1)
    // console.log("step2", step2)
    // const step1 = Buffer.from(`00${pkh.hash}`, 'hex')
    // console.log("step1", step1)
    // this.bitCoinAccount["address"] = address
    // this.bitCoinAccount["privateKey"] = privateKey
    // console.log("bitcoin account", this.bitCoinAccount)
  }

  onNewBlock() {
    try {
      const that = this
      console.log("on new block")
      this.cs.newBlockSubscription.subscribe((e, res) => {
        // console.log(res)
        if (e) return console.error(e)
      }).on('data', async (res) => {
        that.etherBalance = await that.cs.getEtherBalance(that.account.address)
        that.rawCustomTokenBalance = await that.cs.getRawCustomTokenBalance(that.account.address)
        that.calculateCustomTokenBalance()
      })
    } catch (e) {
      return console.error(e)
    }
  }

  async sendCustomTokenTo() {
    try {
      var decimalZero = ""
      for (var i = 0; i < this.customTokenDecimal; i++) {
        decimalZero += "0"
      }
      const amount = this.sendAmount + decimalZero
      console.log(amount)
      await this.cs.sendCustomToken(this.account, this.recevingEthAccount, amount)
      this.getAccounts()
      console.log("custom token send request sent")
    } catch (e) {
      alert(e)
      return console.error(e)
    }
  }

  async sendEtherTo() {
    try {
      const amount = this.sendAmount.toString()
      console.log(amount)
      await this.cs.sendEther(this.account, this.recevingEthAccount, amount)
      this.getAccounts()
      console.log("ether send request sent")
    } catch (e) {
      alert(e)
      return console.error(e)
    }
  }

  private async createAccount() {
    try {
      this.account = await this.cs.createAccount()
      console.log(this.account)
    } catch (e) {
      alert(e)
      return console.error(e)
    }
  }

  private async getEtherBalance() {
    try {
      this.etherBalance = await this.cs.getEtherBalance(this.account.address)
    } catch (e) {
      // alert(e)
      return console.error(e)
    }
  }

  private async getRawCustomTokenBalance() {
    try {
      this.rawCustomTokenBalance = await this.cs.getRawCustomTokenBalance(this.account.address)
      this.calculateCustomTokenBalance()
    } catch (e) {
      // alert(e)
      return console.error(e)
    }
  }

  private async getCustomTokenDecimal() {
    try {
      this.customTokenDecimal = await this.cs.getCustomTokenDecimal()
      this.calculateCustomTokenBalance()
    } catch (e) {
      alert(e)
      return console.error(e)
    }
  }

  private calculateCustomTokenBalance() {
    if (this.rawCustomTokenBalance && this.customTokenDecimal) {
      var rawCustomTokenBalance: number = +this.rawCustomTokenBalance
      var decimals: number = +this.customTokenDecimal
      this.customTokenBalance = (rawCustomTokenBalance / (Math.pow(10, decimals))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
  }
}
