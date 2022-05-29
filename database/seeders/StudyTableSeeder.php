<?php

namespace Database\Seeders;

use App\Models\Study;
use Illuminate\Database\Seeder;

class StudyTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $url = __DIR__ . '/studies.json';
        $json = file_get_contents($url);
        $data = json_decode($json, true);

        foreach ($data as $results){
            foreach ($results as $result){
                $study = new Study();
                $study->title = $result["title"];
                $study->type_of_study = $result["type_of_study"];

                $study->save();
            }
        }

    }
}
