import { NgModule } from '@angular/core';
import { MyLibComponent } from './my-lib.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Firestore } from 'firebase/firestore/lite';



@NgModule({
  declarations: [
    MyLibComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    // Firestore
  ],
  exports: [
    MyLibComponent
  ]
})
export class MyLibModule { }
