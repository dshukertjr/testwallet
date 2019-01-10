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


  public balance: number;

  public tokenSymbol: string;

  constructor(private readonly cs: ContractsService) {
  }

  ngOnInit() {
    this.getBalance()
    // this.getTokenSymbol()
  }

  private async getBalance() {
    try{
      this.balance = await this.cs.getBalance(this.publicAddress)
    }catch(e) {
      return console.error(e)
      //handle error here
    }
  }

  private async getTokenSymbol() {
    try{
      this.tokenSymbol = await this.cs.getSymbol()
    }catch(e) {
      return console.error(e)
      // handle error here
    }
  }
}
