import {Study} from "./study";
import {Course} from "./course";
import {Ad} from "./ad";

export class User {
  constructor(public id:string, public name:string, public email:string, public password:string,
              public semester: string, public graduated:boolean, public introduction: string,
              public tutor:boolean, public profile_pic:string, public study_id:number,
              public study: Study, public courses:Course[], public ads:Ad[]) {
  }
}
