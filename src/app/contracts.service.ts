import { Injectable } from '@angular/core';
import * as Web3 from 'web3';

declare let require: any;
declare let window: any;

const rpcURL: string = "https://ropsten.infura.io/v3/befb2a49776a49cfa3556ad3bd045ae2";
const web3 = new Web3(rpcURL)
const account = "0xEEf4880E9Eb3ad610253926c9883c86b7623Bc1d"

@Injectable()
export class ContractsService {


  constructor() {
  }

  public getBalance(): Promise<number> {
    return Promise.resolve(3)
    // return new Promise((resolve, reject) => {
    //   web3.eth.getBalance(account, (err, wei) => {
    //     let balance: number = web3.utils.fromWei(wei, 'ether')
    //     resolve(balance);
    //   })
    // })
  }

}