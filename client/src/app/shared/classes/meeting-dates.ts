import {User} from "./user";

export class MeetingDates {

  constructor(public id:number, public date:Date, public time:string,
              public state:string, public ad_id:string, public comment?:string,
              public user_id?:string, public user?:User) {
  }
}
