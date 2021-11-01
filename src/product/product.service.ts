import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Product from 'src/entities/Product';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product)
		private productRepo: Repository<Product>,
	) { }
}
