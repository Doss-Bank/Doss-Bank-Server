export enum TransferTo {
  Toss = 'http://localhost:8080/transfer/get',
  KaKao = 'http://34.64.165.105:8080/remittance/receive',
  Minkyun = '',
}

export enum GetAccount {
  Toss = 'http://localhost:8080/',
  KaKao = 'http://34.64.165.105:8080/account/find/phone'
}

export enum BringAccountInfo {
  KaKao = 'http://34.64.165.105:8080/account/find/id'
}