import { Entity, Column, OneToMany } from 'typeorm';
import { WithId } from './WithId.js';
import { Reply, ReplyCRUD } from './Reply.js';
import { dataSource } from '../data-source.js';

@Entity()
export class Prompt extends WithId {
    @Column()
    promptText: string;

    @Column()
    dueDate: string;

    @OneToMany(() => Reply, (reply) => reply.prompt)
    replies: Reply[];
}

export class PromptCRUD {

    /*-------------- CRUD --------------*/

    static async getAll(): Promise<Prompt[]> {
        const prompts = await dataSource.manager.find(Prompt, { relations: { replies: true }});
        for (const prompt of prompts) {
            for (const reply of prompt.replies) {
                ReplyCRUD.unsanitize(reply);
            }
        }
        return prompts;
    }

}