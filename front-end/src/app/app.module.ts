import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APIInterceptor } from './_services/http.interceptor';
import { DiscussionBoardModule } from './discussion-board/discussion-board.module';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    /*-- AppRoutingModule should always be first --*/
    AppRoutingModule,
    /*-- AppRoutingModule should always be first --*/
    BrowserModule,
    HttpClientModule,
    DiscussionBoardModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: APIInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
