import { Component, OnInit } from '@angular/core';
import { ContractsService } from "../contracts.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [ContractsService],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  publicAddress:string = "0xEEf4880E9Eb3ad610253926c9883c86b7623Bc1d"


  public customTokenBalance: number;

  public tokenSymbol: string;

  public etherBalance: number;

  public account: any;

  constructor(private readonly cs: ContractsService) {
  }

  ngOnInit() {
    this.getCustomTokenBalance()
    this.getEtherBalance()
  }

  private async createAccount() {
    try {
      this.account = await this.cs.createAccount()
      console.log(this.account)
    }catch(e) {
      return console.error(e)
      //handle error here
    }
  }

  private async getEtherBalance() {
    try{
      this.etherBalance = await this.cs.getEtherBalance(this.publicAddress)
    }catch(e) {
      return console.error(e)
      //handle error here
    }
  }

  private async getCustomTokenBalance() {
    try{
      this.customTokenBalance = await this.cs.getCustomTokenBalance(this.publicAddress)
    }catch(e) {
      return console.error(e)
      //handle error here
    }
  }
}
