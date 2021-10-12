import Transfer from "src/entities/Transfer";
import { EntityManager, EntityRepository, Repository, TransactionManager } from "typeorm";

@EntityRepository(Transfer)
export default class TransferRepository extends Repository<Transfer> {

	public createTransferRecord(@TransactionManager() manager: EntityManager, transfer: Transfer): Promise<Transfer> {
		return manager.save<Transfer>(transfer);
	}
}