import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
// import { Prompt } from '../../../../../API/entity/Prompt';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  constructor(private _http: HttpClient) { }

  async getAll(): Promise<any> {
    this._http.get<any>('prompts').subscribe(result => console.log(result));
  }

}
