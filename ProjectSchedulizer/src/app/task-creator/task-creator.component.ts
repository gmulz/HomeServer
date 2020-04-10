import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Task, RepeatingTask, DueTask} from '../task';
import { DAY_IN_MS } from '../constants';
// const DAY_IN_MS = 86400000;
// const DAY_IN_MS = 60000;

@Component({
  selector: 'app-task-creator',
  templateUrl: './task-creator.component.html',
  styleUrls: ['./task-creator.component.css']
})
export class TaskCreatorComponent implements OnInit {
  public priority: number = 999;
  public timeConstraint: string = "none";
  public taskName: string;
  public repeatWeek: number;
  public dueDate: string;

  @Output() taskCreated = new EventEmitter<Task>();

  constructor() { }

  ngOnInit() {
  }

  createTask = () => {
    let task = null;
    switch (this.timeConstraint) {
      case "daily":
        task = new RepeatingTask(this.taskName, Number(this.priority), DAY_IN_MS, new Date().getTime(), 0);
        break;
      case "weekly":
        task = new RepeatingTask(this.taskName, Number(this.priority), DAY_IN_MS * 7, new Date().getTime(), this.repeatWeek * DAY_IN_MS);
        break;
      case "due":
        task = new DueTask(this.taskName, Number(this.priority), new Date(this.dueDate).getTime());
        break;
      default:
        task = new Task(this.taskName, Number(this.priority));
        break;
    }
    this.taskCreated.emit(task);
    this.resetState();
  }

  resetState = () => {
    this.priority = 999;
    this.timeConstraint = "none";
    this.taskName = "";
    this.repeatWeek = 0;
    this.dueDate = '';
  }

}
