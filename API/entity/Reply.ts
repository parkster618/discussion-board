import { Entity, Column, ManyToOne, Relation, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { WithId } from './WithId.js';
import { Prompt } from './Prompt.js';
import validator from 'validator';
import { dataSource } from '../data-source.js';

@Entity()
export class Reply extends WithId {
    @Column()
    replyText: string;

    @Column()
    replierName: string;

    @ManyToOne(() => Prompt, (prompt) => prompt.replies)
    prompt: Relation<Prompt>;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;
}

export class ReplyCRUD {

    static sanitize(reply: Reply) {
        reply.replyText = validator.escape(reply.replyText);
        reply.replierName = validator.escape(reply.replierName);
    }

    static unsanitize(reply: Reply) {
        reply.replyText = validator.unescape(reply.replyText);
        reply.replierName = validator.unescape(reply.replierName);
    }
    
    /*-------------- CRUD --------------*/

    static createOrUpdate(reply: Reply): void {
        reply.replyText = validator.escape(reply.replyText);
        reply.replierName = validator.escape(reply.replierName);
        dataSource.manager.save(reply);
    }

    static update(reply: Reply): void {
        reply.replyText = validator.escape(reply.replyText);
        reply.replierName = validator.escape(reply.replierName);
        dataSource.manager.save(reply);
    }
}
