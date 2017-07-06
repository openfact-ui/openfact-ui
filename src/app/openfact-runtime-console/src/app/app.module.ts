import './rxjs-extensions';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { OnLogin } from './shared/onlogin.service';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    OnLogin,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
