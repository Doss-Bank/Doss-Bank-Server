import Other from 'src/entities/Other';
import {
  EntityManager,
  EntityRepository,
  Repository,
  TransactionManager,
} from 'typeorm';

@EntityRepository(Other)
export default class OtherRepository extends Repository<Other> {
  public saveAccount(
    @TransactionManager() manager: EntityManager,
    other: Other,
  ): Promise<Other> {
    return manager.save<Other>(other);
  }
}
