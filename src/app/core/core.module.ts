import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthModule } from '../features/auth/auth.module';
import { CommonModule } from '@angular/common';

@NgModule({
  
  imports: [
    CommonModule,BrowserModule,
    
    HttpClientModule, 
    FormsModule, BrowserAnimationsModule,  NgxPaginationModule,AuthModule
  ],
 
})

export class CoreModule { }


