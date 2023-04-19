import { Entity, Column, ManyToOne, Relation, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { WithId } from './WithId.js';
import { Prompt } from './Prompt.js';

@Entity()
export class Reply extends WithId {
    @Column({ unique: true })
    replyText: string;

    @ManyToOne(() => Prompt, (prompt) => prompt.replies)
    prompt: Relation<Prompt>;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;
}
