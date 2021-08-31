import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Transfer from 'src/entities/Transfer';
import { Repository } from 'typeorm';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(Transfer)
    private transRepo: Repository<Transfer>,
  ) { }

}
