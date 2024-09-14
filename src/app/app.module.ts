import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyLibModule } from 'my-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Firestore } from 'firebase/firestore/lite';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MyLibModule,
    FormsModule,
    ReactiveFormsModule,
    // Firestore
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
