import { Entity, Column, ManyToOne, Relation, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
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

    @ManyToOne(() => Reply, (reply) => reply.childReplies)
    parentReply: Reply;

    @OneToMany(() => Reply, (reply) => reply.parentReply)
    childReplies: Reply[];

    @Column({ default: false })
    isDeleted: boolean;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    static sanitize(reply: Reply) {
        reply.replyText = validator.escape(reply.replyText);
        reply.replierName = validator.escape(reply.replierName);
    }

    static unsanitize(reply: Reply) {
        reply.replyText = validator.unescape(reply.replyText);
        reply.replierName = validator.unescape(reply.replierName);
    }
    
    /*-------------- CRUD --------------*/

    static createOrUpdate(reply: Reply): Promise<Reply> {
        reply.replyText = validator.escape(reply.replyText);
        reply.replierName = validator.escape(reply.replierName);
        return dataSource.manager.save(reply);
    }

    static update(reply: Reply): Promise<Reply> {
        reply.replyText = validator.escape(reply.replyText);
        reply.replierName = validator.escape(reply.replierName);
        return dataSource.manager.save(reply);
    }
}
