import Receive from "src/entities/Receive";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Receive)
export default class ReceiveRepository extends Repository<Receive>{
}