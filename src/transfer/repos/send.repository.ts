import Send from 'src/entities/Send';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Send)
export default class SendRepository extends Repository<Send> {}
