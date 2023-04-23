import { Entity, Column, OneToMany } from 'typeorm';
import { WithId } from './WithId.js';
import { Reply } from './Reply.js';
import { dataSource } from '../data-source.js';

@Entity()
export class Prompt extends WithId {
    @Column()
    promptText: string;

    @Column()
    dueDate: string;

    @OneToMany(() => Reply, (reply) => reply.prompt)
    replies: Reply[];

    /*-------------- CRUD --------------*/

    static async getAll(): Promise<Prompt[]> {
        const prompts = await dataSource.manager.createQueryBuilder(Prompt, 'p')
            .leftJoinAndSelect('p.replies', 'r', 'r.parentReplyId IS NULL')
            .leftJoinAndSelect('r.childReplies', 'cr')
            .orderBy('p.dueDate')
            .getMany();
        for (const prompt of prompts) {
            for (const reply of prompt.replies) {
                Reply.unsanitize(reply);
                for (const childReply of reply.childReplies) {
                    Reply.unsanitize(childReply);
                }
            }
        }
        return prompts;
    }

}