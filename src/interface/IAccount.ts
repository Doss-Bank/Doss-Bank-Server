import Account from "src/entities/Account";
import Other from "src/entities/Other";

export interface IAccount {
	accounts: Account[],
	others: Other[]
}