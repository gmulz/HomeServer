import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';

import { Task, TaskAndPosition } from '../task';

@Component({
  selector: 'app-task-row',
  templateUrl: './task-row.component.html',
  styleUrls: ['./task-row.component.scss']
})
export class TaskRowComponent implements OnInit {

  @Input() task: Task;

  @Input() position: number;

  @Output() done = new EventEmitter<TaskAndPosition>();

  @Output() deleted = new EventEmitter<TaskAndPosition>();

  hovering: boolean;

  @HostBinding('style.background-color') 
  get backgroundColor() {
    return `rgba(0,0,0,${(this.position % 2)/20})`;
  }

  constructor() { 
  }

  ngOnInit() {
  }

  onChecked(event: Event) {
    this.done.emit({task: this.task, pos: this.position});
  }

  hover() {
    this.hovering = true;
  }

  noHover() {
    this.hovering = false;
  }

  deleteMe(event: Event) {
    this.deleted.emit({task: this.task, pos: this.position});
  }

}