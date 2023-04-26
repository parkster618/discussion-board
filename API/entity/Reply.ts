import { Entity, Column, ManyToOne, Relation, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { WithId } from './WithId.js';
import { Prompt } from './Prompt.js';
import validator from 'validator';
import { dataSource } from '../data-source.js';
import { format } from 'date-and-time';

@Entity()
export class Reply extends WithId {
    @Column({ length: '10000' })
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

    static async buildHtmlFromReply(replyId: number): Promise<[string, string]> {
        const rxReply = await dataSource.manager.createQueryBuilder(Reply, 'r')
            .leftJoinAndSelect('r.prompt', 'p')
            .leftJoinAndSelect('r.parentReply', 'pr')
            .leftJoinAndSelect('pr.childReplies', 'pcr')
            .leftJoinAndSelect('r.childReplies', 'cr')
            .where('r.id = :id', { id: replyId })
            .orderBy('pcr.createDate')
            .addOrderBy('cr.createDate')
            .getOne();

        let toReturn = `<div style="font-family: arial">`;
        toReturn = `<h2 style="text-decoration: underline; margin: 0">${rxReply.prompt.promptText}</h2>`;
        if (!rxReply.parentReply) { // If there's no parent reply, this is a top-level reply
            toReturn += '<div style="padding: 1em 0 1em 0;">';
            toReturn += `<h3 style="margin: 0">${rxReply.replierName} — ${format(rxReply.createDate, 'M/D/YY, h:mm A')}</h3>`;
            toReturn += `<h3 style="margin: 0">${rxReply.replyText}</h3>`;
            toReturn += '</div>';
        } else { // If there is a parent reply, this is a child reply. Show the parent, then all the children
            toReturn += '<div style="padding: 1em 0 1em 0;">';
            toReturn += `<h3 style="margin: 0">${rxReply.parentReply.replierName} — ${format(rxReply.parentReply.createDate, 'M/D/YY, h:mm A')}</h3>`;
            toReturn += `<h3 style="margin: 0">${rxReply.parentReply.replyText}</h3>`;
            toReturn += '</div>';
            for (const childReply of rxReply.parentReply.childReplies) {
                toReturn += '<div style="margin-left: 3em; padding: 1em 0 1em 0; border-left: solid black 2px;">';
                childReply.id === rxReply.id && (toReturn += `<div style="margin: -1em 0 -1em 0; padding: 1em 0 1em 0; background-color: lightblue; border-radius: 15px;">`);
                toReturn += `<h3 style="margin: 0; text-indent: 3em">${childReply.replierName} — ${format(childReply.createDate, 'M/D/YY, h:mm A')}</h3>`;
                toReturn += `<h3 style="margin: 0; text-indent: 4em">${childReply.replyText}</h3>`;
                childReply.id === rxReply.id && (toReturn += '</div>');
                toReturn += '</div>';
            }
        }
        toReturn += '</div>';
        return [toReturn, rxReply.prompt.promptText];
    }
    
    /*-------------- CRUD --------------*/

    static async createOrUpdate(reply: Reply): Promise<Reply> {
        reply.replyText = validator.escape(reply.replyText);
        reply.replierName = validator.escape(reply.replierName);
        const rxReply = await dataSource.manager.save(reply);
        rxReply.replyText = validator.unescape(rxReply.replyText);
        rxReply.replierName = validator.unescape(rxReply.replierName);
        return rxReply;
    }
}
