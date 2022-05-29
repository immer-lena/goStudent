import {MeetingDates} from "../classes/meeting-dates";

export class DateFactory {

  static empty():MeetingDates{
    return new MeetingDates(0, new Date(),'','','',"","0");
  }

  static formObject(rawDate:any|MeetingDates):MeetingDates{
    return new MeetingDates(
      rawDate.id,
      rawDate.date,
      rawDate.time,
      rawDate.state,
      rawDate.comment,
      rawDate.ad_id,
      rawDate.user_id
    )

  }


}
