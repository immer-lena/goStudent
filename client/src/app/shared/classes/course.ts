import {Study} from "./study";

export class Course {
  constructor(public id:number, public title:string, public semester:number, public study_id:number,
              public study:Study) {
  }
}
