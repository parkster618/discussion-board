import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  constructor(private _http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this._http.get<any[]>('prompts');
  }

}
