import { Entity, Column, OneToMany } from 'typeorm';
import { WithId } from './WithId.js';
import { Reply } from './Reply.js';

@Entity()
export class Prompt extends WithId {
    @Column()
    promptText: string;

    @Column()
    dueDate: string;

    @OneToMany(() => Reply, (reply) => reply.prompt)
    replies: Reply[];
}
