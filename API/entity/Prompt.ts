import { Entity, Column, OneToMany } from 'typeorm';
import { WithId } from './WithId';
import { Reply } from './Reply';

@Entity()
export class Prompt extends WithId {
    @Column()
    promptText: string;

    @Column()
    dueDate: string;

    @OneToMany(() => Reply, (reply) => reply.prompt)
    replies: Reply[];
}
