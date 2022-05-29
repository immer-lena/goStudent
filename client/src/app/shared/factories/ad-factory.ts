import {Ad} from "../classes/ad";
import {Course} from "../classes/course";
import {MeetingDates} from "../classes/meeting-dates";
import {Study} from "../classes/study";
import {User} from "../classes/user";

export class AdFactory {

  static empty():Ad{
    return new Ad('0','','',false, '',
      false, "0", 0,0,
      new Course(0, '', 0, 0,new Study(0,'','')),
      new User('', '','','','',false,
        '',false,'', 0,new Study(0,'',''),
        [],[]),[{id: 0, date: new Date(), time: '', state:'', ad_id: "0"}])
  }

  static formObject(rawAd:any):Ad{
    return new Ad(
      rawAd.id,
      rawAd.title,
      rawAd.description,
      rawAd.active,
      typeof (rawAd.created)==='string' ?
        new Date(rawAd.created) : rawAd.created,
      rawAd.offer,
      rawAd.user_id,
      rawAd.course_id,
      rawAd.study_id,
      rawAd.course,
      rawAd.user,
      rawAd.meeting_dates
    );
  }


}
