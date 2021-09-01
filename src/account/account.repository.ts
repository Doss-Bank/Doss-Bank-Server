import Account from "src/entities/Account";
import { EntityManager, EntityRepository, Repository, TransactionManager } from "typeorm";

@EntityRepository(Account)
export default class AccountRepository extends Repository<Account> {

	public saveAccount(@TransactionManager() manager: EntityManager, account: Account): Promise<Account> {
		return manager.save<Account>(account);
	}
}