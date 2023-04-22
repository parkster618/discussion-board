import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReplyService {

  constructor(private _http: HttpClient) { }

  addReply(reply: any): Observable<any> {
    return this._http.post('replies', reply);
  }

  updateReply(reply: any): Observable<any> {
    return this._http.post('replies', reply);
  }

}
