import { MINUTE_IN_MS } from './constants';

export interface TaskAndPosition {
  task: Task;
  pos: number;
}

export class Task {
  title: string;
  priority: number; // 0 highest

  constructor(title: string, priority: number) {
    this.title = title;
    this.priority = priority;
  }
}

export class RepeatingTask extends Task{
  resetInterval: number;//milliseconds between intervals
  dateCreated: number; //date represented in milliseconds. time from this date divided by reset interval will be the number of times completed
  weirdOffset: number; //offset to do stuff with days of the week and that and that. absval should be less than resetinterval
  reappearDate: number;
  //maybe reappear date? that's timetodue plus now. used for completion bookkeeping. need to set when completed.

  complete() {
    let time = new Date().getTime();
    this.reappearDate = this.getTimeToDue() + time;
  }

  constructor(title: string, priority: number, resetInterval: number, dateCreated: number, weirdOffset: number, reappearDate = 0) {
    super(title, priority);
    this.resetInterval = resetInterval;
    this.dateCreated = dateCreated;
    this.weirdOffset = weirdOffset;
    this.reappearDate = reappearDate;

  }

  getTimeToDue = () => {
    let time = new Date().getTime();
    let timeZoneMinutes = new Date().getTimezoneOffset() + 120;//why is it in minutes
    //time we really want is the GMT time offset by whatever and put in our timezone, modulo the reset interval
    //to give us time it's been from the previous reset interval, then subtract from the interval to get
    //time until next interval
    return (this.resetInterval - ((time - this.weirdOffset - (timeZoneMinutes * MINUTE_IN_MS)) % this.resetInterval));// + (timeZoneMinutes * MINUTE_IN_MS)) % this.resetInterval;
  }

}

export class DueTask extends Task {
  dueDate: number; //milliseconds of due date

  constructor(title: string, priority: number, dueDate: number) {
    super(title, priority);
    this.dueDate = dueDate;
  }

  formatDate = () => {
    return new Date(this.dueDate).toLocaleDateString();
  }
  
}
