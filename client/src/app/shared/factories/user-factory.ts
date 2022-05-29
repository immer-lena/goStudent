import {Study} from "../classes/study";
import {User} from "../classes/user";

export class UserFactory {

  static empty():User{
    return new User('', '','','', '', false,
      '',false, '', 0,new Study(0,'',''),
      [],[]);
  }

  static formObject(rawUser:any):User{
    return new User(
      rawUser.id,
      rawUser.name,
      rawUser.email,
      rawUser.password,
      rawUser.semester,
      rawUser.graduated,
      rawUser.introduction,
      rawUser.tutor,
      rawUser.profile_pic,
      rawUser.study_id,
      rawUser.study,
      rawUser.courses,
      rawUser.ads
    )

  }
}
