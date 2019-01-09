import { Component, OnInit } from '@angular/core';
import { ContractsService } from "../contracts.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [ContractsService],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public balance: number;

  constructor(private readonly cs: ContractsService) {
  }

  private async getBalance() {
    this.balance = await this.cs.getBalance()
  }

  ngOnInit() {
    this.getBalance()
  }

}
