import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@NgModule({

  imports: [
    CommonModule,

    HttpClientModule,
  ],
  exports: [
    HttpClientModule
  ]

})

export class CoreModule { }


