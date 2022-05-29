<?php

namespace Database\Seeders;

use App\Models\Ad;
use App\Models\Course;
use App\Models\MeetingDate;
use App\Models\Study;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $url = __DIR__ . '/ads.json';
        $json = file_get_contents($url);
        $data = json_decode($json, true);

        foreach ($data as $results){
            foreach ($results as $result) {
                $ad = new Ad();
                $ad->title = $result["title"];
                $ad->description = $result["description"];
                $ad->offer = $result["offer"];

                $study = Study::find($result["study_id"]);
                $ad->study()->associate($study);

                $user = User::find($result["user_id"]);
                $ad->user()->associate($user);

                $course = Course::find($result["course_id"]);
                $ad->course()->associate($course);

                $ad->save();

                foreach ($result["meeting_dates"] as $meeting_date) {
                    $new_date = new MeetingDate();
                    $new_date->date = $meeting_date["date"];
                    $new_date->time = $meeting_date["time"];
                    $new_date->state = $meeting_date["state"];

                    $ad->meeting_dates()->saveMany([$new_date]);
                }

                $ad->save();

            }

        }

    }
}
