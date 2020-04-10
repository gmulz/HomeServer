import { Component } from '@angular/core';

import { Task, RepeatingTask, DueTask, TaskAndPosition } from './task';

import { ProjectFetchService } from './project-fetch.service';

import { DAY_IN_MS } from './constants';

// const DAYS_IN_MS = 86400000;
// const DAYS_IN_MS = 60 * 60000;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ProjectFetchService]
})
export class AppComponent {

  repeatingTasks: RepeatingTask[] = [];
  genericTasks: Task[] = [];
  dailyTasks: RepeatingTask[] = [];
  weeklyTasks: RepeatingTask[] = [];
  dueTasks: DueTask[] = [];

  constructor(private projectFetchService: ProjectFetchService) { 
    //global set interval to check the repeating tasks for renewal
    this.fetchData();
    setInterval(() => this.resetRepeatingTasks(), 60000);
  }

  formatData = () => {
    return {  genericTasks: this.genericTasks, 
              dailyTasks: this.dailyTasks,
              weeklyTasks: this.weeklyTasks,
              dueTasks: this.dueTasks,
              repeatingTasks: this.repeatingTasks
            }
  }


  saveData = () => {
    this.projectFetchService.sendAllData(this.formatData())
              .subscribe(value => console.log(value), error => console.error(error));
  }

  fetchData = () => {
    this.projectFetchService.getData().subscribe(data => {
      let dataObj = data['data'];
      this.genericTasks = dataObj.genericTasks || [];
      this.dailyTasks = this.repeatingTasksFromData(dataObj.dailyTasks);
      this.dailyTasks.sort(this.repeatingSort);
      this.weeklyTasks = this.repeatingTasksFromData(dataObj.weeklyTasks);
      this.weeklyTasks.sort(this.repeatingSort);
      console.log(this.weeklyTasks.map(t => t.getTimeToDue()));
      this.dueTasks = this.dueTasksFromData(dataObj.dueTasks);
      this.repeatingTasks = this.repeatingTasksFromData(dataObj.repeatingTasks);
    })
  }

  dueTasksFromData = (objArr: any[]) => {
    return objArr ? objArr.map((t) => this.dueTaskFromData(t) ) : [];
  }

  dueTaskFromData = (obj: any) => {
    return new DueTask(obj.title, obj.priority, obj.dueDate);
  }

  repeatingTasksFromData = (objArr: any[]) => {
    return objArr ? objArr.map( (t) => this.repeatingTaskFromData(t) ) : [];
  }

  repeatingTaskFromData = (obj: any) => {
    return new RepeatingTask(obj.title, obj.priority, obj.resetInterval, obj.dateCreated, obj.weirdOffset, obj.reappearDate);
  }

  resetRepeatingTasks = () => {
    let time = new Date().getTime();
    let tempArray = [];
    this.repeatingTasks.forEach((t) => {
      // console.log(t.reappearDate < time);
      if (t.reappearDate < time) {
        let newT = new RepeatingTask(t.title, t.priority, t.resetInterval, new Date().getTime(), t.weirdOffset);
        if (t.resetInterval === DAY_IN_MS) {
          this.addTaskToArrayAndSort(newT, this.dailyTasks, this.repeatingSort);
        } else if (t.resetInterval === DAY_IN_MS * 7) {
          this.addTaskToArrayAndSort(newT, this.weeklyTasks, this.repeatingSort);
        }
      } else {
        tempArray.push(t);
      }
    });
    this.repeatingTasks = tempArray;
    this.weeklyTasks.sort(this.repeatingSort);
    this.saveData();
  }


  addTaskToArrayAndSort(t: Task, tArray: Task[], compare: (a: Task, b: Task) => number) {
    //probably should just do insertion instead of resorting but whatever
    if (tArray.includes(t)) {
      return;
    }
    tArray.push(t);
    tArray.sort(compare);
  }

  spliceTaskFromArray(t: Task, tArray: Task[], position: number) {
    tArray.splice(position, 1);
  }

  addTask(t: Task) {
    if (t instanceof RepeatingTask) {
       // console.log(`${t.getTimeToDue()} ${t.title}`);
      if (t.resetInterval === DAY_IN_MS){
        this.addTaskToArrayAndSort(t, this.dailyTasks, this.repeatingSort);
      } else if (t.resetInterval === DAY_IN_MS * 7) {
        this.addTaskToArrayAndSort(t, this.weeklyTasks, this.repeatingSort);
      } else {
        this.addTaskToArrayAndSort(t, this.repeatingTasks, this.repeatingSort);
      }
    } else if (t instanceof DueTask) {
      this.addTaskToArrayAndSort(t, this.dueTasks, this.dueSort);
    } else {
      this.addTaskToArrayAndSort(t, this.genericTasks, this.prioritySort);
    }
    this.saveData();
  }

  completeTask = (e: TaskAndPosition) => {
    const t = e.task;
    const pos = e.pos;
    if (t instanceof RepeatingTask) {
      if (t.resetInterval === DAY_IN_MS) {
        this.completeRepeatingTask(t, this.dailyTasks, pos);
      } else if (t.resetInterval === DAY_IN_MS * 7) {
        this.completeRepeatingTask(t, this.weeklyTasks, pos);
      }
    } else if (t instanceof DueTask) {
      this.spliceTaskFromArray(t, this.dueTasks, pos);
    } else {
      this.spliceTaskFromArray(t, this.genericTasks, pos);
    }
    this.saveData();
  }

  completeRepeatingTask = (task: RepeatingTask, tArray: RepeatingTask[], position: number) => {
    this.spliceTaskFromArray(task, tArray, position);
    task.complete();
    this.repeatingTasks.push(task);
  }

  deleteTask = (e: TaskAndPosition) => {
    const t = e.task;
    const pos = e.pos;
    if (t instanceof RepeatingTask) {
      if (t.resetInterval === DAY_IN_MS) {
        this.spliceTaskFromArray(t, this.dailyTasks, pos);
      } else if (t.resetInterval === DAY_IN_MS * 7) {
        this.spliceTaskFromArray(t, this.weeklyTasks, pos);
      }
    } else if (t instanceof DueTask) {
      this.spliceTaskFromArray(t, this.dueTasks, pos);
    } else {
      this.spliceTaskFromArray(t, this.genericTasks, pos);
    }
    this.saveData();
  }


  //prolly needs to be a util but whatevs
  repeatingSort = (a: RepeatingTask, b: RepeatingTask) => {
    let aTime = a.getTimeToDue();
    let bTime = b.getTimeToDue();
    // if (a.priority === b.priority) {
    //   return aTime - bTime;
    // }
    // return a.priority - b.priority;
    
    if (Math.abs(aTime - bTime) < 1000) {
      return a.priority - b.priority;
    }
    return aTime - bTime;
  }

  prioritySort = (a: Task, b: Task) => {
    return a.priority - b.priority;
  }

  dueSort = (a: DueTask, b: DueTask) => {
    return a.dueDate - b.dueDate;
  }



}
