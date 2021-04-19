import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AceComponent } from './components/ace.component';


@NgModule({
  declarations: [
    AceComponent,
  ],
  exports: [
    AceComponent,
  ],
  imports: [
    BrowserModule,
  ],
})
export class AceModule { }
