import { Component, OnInit } from '@angular/core';
import { ContractsService } from "../contracts.service";
import { EthAccount } from "../models/eth-account";
import { REACTIVE_DRIVEN_DIRECTIVES } from '@angular/forms/src/directives';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [ContractsService],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public rawCustomTokenBalance: number

  public customTokenBalance: number

  public tokenSymbol: string

  public etherBalance: number

  public sendAmount: number = 1

  public customTokenDecimal: number

  public account: EthAccount = {
    address: "0xEEf4880E9Eb3ad610253926c9883c86b7623Bc1d",
    privateKey: "aa67e048dc6c0a079c710138329a846df2495c273851eb110a429cff7247a0e1",
  };

  public recevingEthAccount: EthAccount = {
    address: "0xFaF77E4584fE0dF6e859eCC54648837267E50558",
  }

  constructor(private readonly cs: ContractsService) {
  }

  ngOnInit() {
    this.getAccounts()
  }

  getAccounts() {
    this.getRawCustomTokenBalance()
    this.getCustomTokenDecimal()
    this.getEtherBalance()
  }

  async sendCustomTokenTo() {
    try {
      await this.cs.sendCustomToken(this.account, this.recevingEthAccount, this.sendAmount.toString())
      this.getAccounts()
      console.log("done sending custom token")
    } catch (e) {
      alert(e)
      return console.error(e)
    }
  }

  async sendEtherTo() {
    try {
      await this.cs.sendEther(this.account, this.recevingEthAccount, this.sendAmount.toString())
      this.getAccounts()
      console.log("done sending custom token")
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
      alert(e)
      return console.error(e)
    }
  }

  private async getRawCustomTokenBalance() {
    try {
      this.rawCustomTokenBalance = await this.cs.getRawCustomTokenBalance(this.account.address)
      this.calculateCustomTokenBalance()
    } catch (e) {
      alert(e)
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
      this.customTokenBalance = rawCustomTokenBalance / (Math.pow(10, decimals))
    }
  }
}
