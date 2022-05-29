<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent;
use Illuminate\Support\Facades\DB;

use App\Models\Study;
use App\Models\Ad;
use App\Models\User;
use App\Models\Course;
use App\Models\MeetingDate;

class UserController extends Controller
{
    public function index(){
        $users = User::with(['study', 'courses', 'ads'])->get();
        return $users;
    }

    public function getSingle($id){
        $user = User::with(['study', 'courses', 'ads'])->where('id', $id)->first();
        return $user;
    }

    public function register(Request $request):JsonResponse{
        $request = $this->parseRequest($request);
        DB::beginTransaction();
        try {
            $user = User::create($request->all());
            if($request["courses"] && is_array($request["courses"])){
                $new_courses = [];
                foreach ($request["courses"] as $course) {
                    array_push($new_courses, Course::find($course));
                }
                $user->courses()->saveMany($new_courses);
                $user->save();
            }
            DB::commit();
            return response()->json($user, 200);
        } catch (\Exception $e){
            DB::rollBack();
            return response()->json("Registering user failed ".$e->getMessage(),420);
        }
    }

    public function updateUser(Request $request, string $id):JsonResponse{
        DB::beginTransaction();
        try {
            $user = User::with(['courses', 'study'])
                ->where('id', $id)->first();

            if ($user != null) {
                $request = $this->parseRequest($request);
                $user->update($request->all());
                $user->save();
            }
            $user->courses()->detach();
            if($request["courses"] && is_array($request["courses"])){
                $new_courses = [];
                foreach ($request["courses"] as $course) {
                    array_push($new_courses, Course::find($course));
                }
                $user->courses()->saveMany($new_courses);
                $user->save();
            }
            DB::commit();
            $user1 = User::with(['courses', 'study'])
                ->where('id', $id)->first();
            // return a vaild http response
            return response()->json($user1, 201);
        }
        catch (\Exception $e) {
            // rollback all queries
            DB::rollBack();
            return response()->json("updating user failed: " . $e->getMessage(), 420);
        }
    }

    public function courses(){
        $courses = Course::with(['study'])->get();
        return $courses;
    }

    public function course($id){
        $course = Course::with(['study'])->where('id', $id)->first();
        return $course;
    }

    public function course_of_study($id){
        $courses = Course::where('study_id', $id)->get();
        return $courses;
    }


    public function studies(){
        $studies = Study::all();
        return $studies;
    }

    public function study($id){
        return Study::where('id',$id)->first();
    }

    public function get_requested_meeting_dates(){
        $meeting_dates = MeetingDate::with(['user'])
            ->where('state', 'requested')
            ->orWhere ('state', 'suggested')
            ->get();
        return $meeting_dates;
    }

    private function parseRequest(Request $request){
        $request["password"] = bcrypt($request["password"]);
        return $request;
    }


}
