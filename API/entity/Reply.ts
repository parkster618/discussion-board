import { Entity, Column, ManyToOne, Relation, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { WithId } from './WithId';
import { Prompt } from './Prompt';

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
