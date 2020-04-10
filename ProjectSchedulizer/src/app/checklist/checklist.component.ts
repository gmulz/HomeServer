import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Task, RepeatingTask, TaskAndPosition } from '../task';
import { TaskRowComponent } from '../task-row/task-row.component';


@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {

  @Input() tasks: Task[];
  @Input() title: string;

  
  @Input() completed: number;
  @Input() historical: number;

  @Output() taskComplete = new EventEmitter<TaskAndPosition>();
  @Output() taskDelete = new EventEmitter<TaskAndPosition>();

  constructor() { }

  ngOnInit() {
  
  }

  taskCompleted = (e : TaskAndPosition) => {
    this.taskComplete.emit(e);
  }

  taskDeleted = (e: TaskAndPosition) => {
    this.taskDelete.emit(e);
  }

}