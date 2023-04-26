import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, concat, forkJoin, merge } from 'rxjs';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { PromptService } from '../_services/prompt.service';
import { ReplyService } from '../_services/reply.service';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-discussion-board',
    styleUrls: ['discussion-board.component.less'],
    templateUrl: './discussion-board.component.html',
})
export class DiscussionBoardComponent implements OnInit {
    prompts!: any[];
    newChildReplies: (string | undefined)[][] = [];
    newParentReplies!: (string | undefined)[];
    visiblePrompts: boolean[] = [];
    visibleParentReplies: boolean[][] = [];
    username: string | undefined;
    goToReplyId: { i: string | undefined, k: string | undefined, j: string | undefined } = { i: undefined, k: undefined, j: undefined };

    constructor(
        private _promptService: PromptService,
        private _replyService: ReplyService,
        private _cookieService: CookieService,
        private _route: ActivatedRoute,
        public datePipe: DatePipe,
    ) {}

    ngOnInit(): void {
        this.username = this._cookieService.get('username');
        if (!this.username) {
            this._setUsername();
        }

        combineLatest([this._getPrompts(), this._route.queryParams]).subscribe(([_, params]) => {
            this._navigateToReply(params['i'], params['k'], params['j']);
        });
    }

    private _getPrompts(): Observable<any> {
        return this._promptService.getAll().pipe(
            tap((prompts) => {
                this.prompts = prompts;
                this.newParentReplies = new Array<string>(this.prompts.length);
                this.newChildReplies = new Array<string[]>(this.prompts.length);
                for (let i = 0; i < this.prompts.length; i++) {
                    this.visibleParentReplies[i] = [];
                    this.newChildReplies[i] = [];
                }
            }),
        );
    }

    private _navigateToReply(i?: string, k?: string, j?: string): void {
        if (i && k) {
            this.visiblePrompts[+i] = true;
            this.visibleParentReplies[+i][+k] = true;
            setTimeout(() => this.scrollTo(i, k, j || ''));
        }
    }

    viewChildReplies(i: number, k: number): void {
        this.visibleParentReplies[i][k] = !this.visibleParentReplies[i][k];
        setTimeout(() => this.scrollTo(i, k, 0));
    }

    openReply(i: number, k: number): void {
        this.newChildReplies[i][k] = '';
        setTimeout(() => {
            document.getElementById('discussion-textarea-' + i + '-' + k)!.focus();
        });
    }

    addFirstChildReply(i: number, k: number): void {
        this.visibleParentReplies[i][k] = true;
        this.openReply(i, k);
        setTimeout(() => this.scrollTo(i, k, 'new'));
    }

    cancelNewChildReply(i: number, k: number): void {
        this.newChildReplies[i][k] = undefined;
        if (!this.prompts[i].replies[k].childReplies.length) {
            this.visibleParentReplies[i][k] = false;
        }
    }

    addNewParentReply(i: number, event?: any): void {
        if (!event || (event.ctrlKey && event.keyCode === 13)) {
            this.newParentReplies[i] = this.newParentReplies[i]?.trim();
            if (this.newParentReplies[i]) {
                let newReply = this._createNewReply();
                newReply.prompt = { id: this.prompts[i].id };
                newReply.replyText = this.newParentReplies[i];
                newReply.replierName = this.username;
                this._replyService.addReply(newReply).pipe(
                    tap((rxReply: any) => {
                        rxReply.DateCreated = new Date(rxReply.DateCreated);
                        rxReply.childReplies = rxReply.childReplies || [];
                        this.prompts[i].replies.push(rxReply);
                        this.newParentReplies[i] = undefined;
                        this._successPopup();
                    }),
                ).subscribe();
            } else {
                this._errorPopup('Please enter a text to post');
            }
        }
    }

    addNewChildReply(i: number, k: number, parentReplyId: number, event?: any): void {
        if (!event || (event.ctrlKey && event.keyCode === 13)) {
            this.newChildReplies[i][k] = this.newChildReplies[i][k]?.trim();
            if (this.newChildReplies[i][k]) {
                let newReply = this._createNewReply();
                newReply.prompt = { id: this.prompts[i].id };
                newReply.parentReply = { id: parentReplyId };
                newReply.replyText = this.newChildReplies[i][k];
                newReply.replierName = this.username;
                this._replyService.addReply(newReply).subscribe((rxReply: any) => {
                    rxReply.DateCreated = new Date(rxReply.DateCreated);
                    this.prompts[i].replies[k].childReplies.push(rxReply);
                    this.newChildReplies[i][k] = undefined;
                    this._successPopup();
                });
            } else {
                this._errorPopup('Please enter a text to reply');
            }
        }
    }

    saveEditedReply(reply: any, event?: any): void {
        if (!event || (event.ctrlKey && event.keyCode === 13)) {
            if (reply.replyText) {
                reply.isEditing = false;
                reply.isHovered = false;
                this._replyService.updateReply(reply).subscribe((rxReply: any) => {
                    rxReply.DateModified = new Date(rxReply.DateModified);
                    reply = rxReply;
                    this._successPopup();
                });
            } else {
                this._errorPopup('Please enter text to update this reply');
            }
        }
    }

    deleteReply(reply: any): void {
        Swal.fire({
            title: 'Delete?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result: any) => {
            if (result.isConfirmed) {
                reply.isDeleted = true;
                this._replyService.updateReply(reply).subscribe(() => this._successPopup('Deleted!'));
            }
        });
    }

    /* ------------ Page interaction -------------- */

    scrollTo(i: number | string, k: number | string, j: number | string): void {
        const element = document.getElementById(`reply-${i}-${k}-${j}`);
        element?.scrollIntoView({ behavior: 'smooth' });
    }

    /* ------------ Template rendering -------------- */

    showReplyButton(i: number, k: number): boolean {
        return this.newChildReplies[i][k] == null;
    }

    numberOfReplies(i: number): number {
        return (this.prompts[i].replies as any[]).reduce<number>((sum, reply) => sum + 1 + reply.childReplies.length, 0);
    }

    newReplies(i: number): boolean {
        return false;
    }

    userDateMargin(reply: any): number {
        let toReturn = 0;
        if (reply.replierName === this.username) {
            toReturn += 60;
        }
        return toReturn + this.editButtonsMargin(reply);
    }

    editButtonsMargin(reply: any): number {
        if (!reply.childReplies) {
            return 0;
        }
        if (reply.childReplies?.length) {
            return 90;
        }
        return 55;
    }

    /* ------------ Popups -------------- */

    private _createNewReply(): any {
        return {
            replyText: '',
            replierName: '',
            promptId: undefined,
            replyId: undefined,
        }
    }

    private _successPopup(message = 'Saved!') {
        let timerInterval!: number;
        Swal.fire({
            icon: 'success',
            title: message,
            timer: 1100,
            timerProgressBar: false,
            showConfirmButton: false,
            width: 180,
            willClose: () => {
                clearInterval(timerInterval);
            }
        });
    }

    private _errorPopup(text: string) {
        let timerInterval!: number;
        Swal.fire({
            icon: 'error',
            html: text,
            timer: 1500,
            timerProgressBar: false,
            showConfirmButton: false,
            width: 180,
            willClose: () => {
                clearInterval(timerInterval);
            }
        });
    }

    private async _setUsername() {
        let defaultUsername = 'user' + Math.floor(Math.random() * 1000000);
        let { value: username } = await Swal.fire({
          title: 'Hey new user!',
          html: 'Enter your name below. If you\'ve been here before, re-enter the same name you used before.',
          input: 'text',
          inputLabel: 'Your Name',
          inputValue: defaultUsername,
          showCancelButton: true,
        });
        username = username || defaultUsername;
        username = username.charAt(0).toUpperCase() + username.substring(1).toLowerCase();
        this.username = username;
        this._cookieService.set('username', username);
    }
}
