import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  login: string;
  @Column()
  password: string;
  @Column({ default: 1 })
  version: number;
  @CreateDateColumn({
    type: 'bigint',
    transformer: {
      to: (value: Date) => value.getTime(),
      from: (value: string) => new Date(parseInt(value, 10)),
    },
  })
  createdAt: number;
  @UpdateDateColumn({
    type: 'bigint',
    transformer: {
      to: (value: Date) => value.getTime(),
      from: (value: string) => new Date(parseInt(value, 10)),
    },
  })
  updatedAt: number;
}
