import Account from 'src/entities/Account';
import Send from 'src/entities/Send';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Send)
export default class SendRepository extends Repository<Send> {
  public async getLog(account: Account): Promise<any[]> {
    return this.createQueryBuilder()
      .select('SUM(money)', 'sum')
      .where('account = :account', { account })
      .where('created_at > LAST_DAY(NOW() - interval 1 month)')
      .andWhere('created_at <= LAST_DAY(NOW())')
      .getRawMany();
  }
}
