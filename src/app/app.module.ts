import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CompilerComponent } from '../components/compiler.component';
import { CompilerService } from '../services/compiler.service';

@NgModule({
  declarations: [
    AppComponent,
    CompilerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [CompilerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
