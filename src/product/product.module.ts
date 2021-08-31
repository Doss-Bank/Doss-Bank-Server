import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Transfer from 'src/entities/Transfer';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer])],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule { }
