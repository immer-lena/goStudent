<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Study;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\App;

class CourseTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $url = __DIR__ . '/courses.json';
        $json = file_get_contents($url);
        $data = json_decode($json, true);

        foreach ($data as $results){
            foreach ($results as $result){
                $course = new Course();
                $course->title = $result["title"];
                $course->semester = $result["semester"];

                $study = Study::find($result["study_id"]);
                $course->study()->associate($study);

                $course->save();
            }
        }

//        $user = Study::all()->first();
//        $course->users()->sync($user);
//
//        $course->save();
    }
}
