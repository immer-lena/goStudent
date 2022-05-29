import {Course} from "./course";
import {MeetingDates} from "./meeting-dates";
import {User} from "./user";

export class Ad {
  constructor(public id:string, public title:string, public description:string,
              public active:boolean, public created_at:string, public offer:boolean,
              public user_id:string, public course_id:number, public study_id:number,
              public course:Course, public user:User, public meeting_dates:MeetingDates[]){
  }
}
