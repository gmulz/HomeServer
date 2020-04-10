import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';



import { AppComponent } from './app.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { TaskRowComponent } from './task-row/task-row.component';
import { TaskCreatorComponent } from './task-creator/task-creator.component';


@NgModule({
  declarations: [
    AppComponent,
    ChecklistComponent,
    TaskRowComponent,
    TaskCreatorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
