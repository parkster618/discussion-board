import { PrimaryGeneratedColumn } from 'typeorm';

export class WithId {
    @PrimaryGeneratedColumn()
    id: number;
}