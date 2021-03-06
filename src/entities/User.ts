import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import Account from './Account';

@Entity('user')
export default class User {
  @ApiProperty({ description: 'id' })
  @PrimaryColumn()
  id!: string;

  @ApiProperty({ description: 'pw' })
  @Column({ select: false })
  pw!: string;

  @ApiProperty({ description: 'nick' })
  @Column()
  nick!: string;

  @ApiProperty()
  @Column()
  name!: string;

  @ApiProperty({ description: 'phone-number' })
  @Column()
  phone!: string;

  @ApiProperty({ description: 'birth' })
  @Column()
  birth!: string;

  @ApiProperty({ description: 'profile_image' })
  @Column({
    name: 'profile_image',
  })
  profileImage: string;

  @ApiProperty({ description: 'account', type: [Account] })
  @OneToMany(() => Account, (account) => account.user)
  account!: Account[];
}
