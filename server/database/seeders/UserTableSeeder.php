<?php

namespace Database\Seeders;

use App\Models\Ad;
use App\Models\Course;
use App\Models\Study;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $url = __DIR__ . '/users.json';
        $json = file_get_contents($url);
        $data = json_decode($json, true);

        foreach ($data as $results) {
            foreach ($results as $result) {
                $user = new User();
                $user->name = $result["name"];
                $user->email = $result["email"];
                $user->password = bcrypt($result["password"]);
                $user->semester = $result["semester"];
                $user->graduated = $result["graduated"];
                $user->introduction = $result["introduction"];
                $user->profile_pic = $result["profile_pic"];
                $user->tutor = $result["tutor"];
                $user->study_id= $result["study_id"];

                $study = Study::find($result["study_id"]);
                $user->study()->associate($study);

                $user->save();

                $new_courses = [];
                foreach ($result["courses"] as $course) {
                    array_push($new_courses, Course::find($course));
                }
                $user->courses()->saveMany($new_courses);
                $user->save();
            }
        }
    }
}
