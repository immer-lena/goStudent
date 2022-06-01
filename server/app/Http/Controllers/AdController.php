<?php

namespace App\Http\Controllers;

use App\Models\Study;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent;
use Illuminate\Support\Facades\DB;

use App\Models\Ad;
use App\Models\User;
use App\Models\Course;
use App\Models\MeetingDate;


class AdController extends Controller
{
    public function index(){
        $ads = Ad::with(['user', 'course', 'meeting_dates'])->where('active', true)->get();
        return $ads;
    }

    public function find_ad_by_id($id){
        $ad = Ad::where('id', $id)->with(['user', 'course', 'meeting_dates'])->first();
        return $ad != null ? response()->json($ad,200) :
            response()->json(false,200);
    }

    public function find_ads_for_course($id){
        $ads = Ad::where('course_id', $id)->with(['user', 'course', 'meeting_dates'])->get();
        return $ads;
    }

    public function find_ads_for_study($id){
        $ads = Ad::where('study_id', $id)->with(['user', 'course', 'meeting_dates'])->get();
        return $ads;
    }

    public function create_ad(Request $request):JsonResponse{
        $request = $this->parseRequest($request);

        //use transaction for saving model including relations
        DB::beginTransaction();
        try {
            //Buch an sich anlegen
            $ad = Ad::create($request->all());
            //save meeting dates
            if(isset($request['meeting_dates']) && is_array($request['meeting_dates'])){
                foreach ($request['meeting_dates'] as $meeting_date){
                    $new_meeting_date = MeetingDate::firstOrNew([
                        'date'=>$meeting_date['date'],
                        'time'=>$meeting_date['time'],
                        'state'=>$meeting_date['state'],
                        'ad_id' =>$ad['id']]);
                    $ad->meeting_dates()->save($new_meeting_date);
                }
            }
            DB::commit();
            return response()->json($ad, 200);
        } catch (\Exception $e){
            DB::rollBack();
            return response()->json("saving ad failed".$e->getMessage(),420);
        }

    }

    public function delete_ad(string $id){
        $ad = Ad::where('id', $id)->first();
        if($ad != null){
            $ad->delete();
        } else {
            throw new Exception("ad could not be deleted - it does not exist");
        }
        return response()->json('ad ('.$id.') successfully deleted', 200);
    }

    public function update_ad(Request $request, string $id) : JsonResponse
    {
        DB::beginTransaction();
        try {
            $ad = Ad::with(['course', 'meeting_dates'])
                ->where('id', $id)->first();
            if ($ad != null) {
                $request = $this->parseRequest($request);
                $ad->update($request->all());
                $ad->meeting_dates()->delete();
                // save dates
                if (isset($request['meeting_dates']) && is_array($request['meeting_dates'])) {
                    foreach ($request['meeting_dates'] as $meeting_date) {
                        $new_meeting_date = MeetingDate::firstOrNew([
                            'date'=>$meeting_date['date'],
                            'time'=>$meeting_date['time'],
                            'state' =>$meeting_date['state'],
                            ]);
                        if(isset($meeting_date['comment']))
                            $new_meeting_date->comment = $meeting_date['comment'];
                        if(isset($meeting_date['user_id']))
                            $new_meeting_date->user_id = $meeting_date['user_id'];
                        $ad->meeting_dates()->save($new_meeting_date);
                    }
                }

                $ad->save();
            }
            DB::commit();
            $ad1 = Ad::with(['course', 'meeting_dates'])
                ->where('id', $id)->first();
            // return a vaild http response
            return response()->json($ad1, 201);
        }
        catch (\Exception $e) {
            // rollback all queries
            DB::rollBack();
            return response()->json("updating ad failed: " . $e->getMessage(), 420);
        }
    }


    //MEETING_DATES
    public function meeting_dates(){
        $meeting_dates = MeetingDate::with(['user'])->get();
        return $meeting_dates;
    }

    public function create_meeting_date(Request $request):JsonResponse{
        $request = $this->parseRequest($request);
        //use transaction for saving model including relations
        DB::beginTransaction();
        try {
            $meeting_date = MeetingDate::create($request->all());
            DB::commit();
            return response()->json($meeting_date, 200);
        } catch (\Exception $e){
            DB::rollBack();
            return response()->json("saving meeting date failed ".$e->getMessage(),420);
        }

    }

    public function delete_meeting_date(string $id){
        $meeting_date = MeetingDate::where('id', $id)->first();
        if($meeting_date != null){
            $meeting_date->delete();
        } else {
            throw new Exception("meeting_date could not be deleted - it does not exist");
        }
        return response()->json('meeting_date ('.$id.') successfully deleted', 200);
    }

    public function update_meeting_date(Request $request, string $id) : JsonResponse
    {
        DB::beginTransaction();
        try {
            $meeting_date = MeetingDate::where('id', $id)->first();
            if ($meeting_date != null) {
                $request = $this->parseRequest($request);
                $meeting_date->update($request->all());
                $meeting_date->save();
            }
            DB::commit();
            $meeting_date1 = MeetingDate::where('id', $id)->first();
            // return a vaild http response
            return response()->json($meeting_date1, 201);
        }
        catch (\Exception $e) {
            // rollback all queries
            DB::rollBack();
            return response()->json("updating meeting_date failed: " . $e->getMessage(), 420);
        }
    }

    public function get_single_meeting_date($id){
        $meeting_date = MeetingDate::with('user')
            ->where('id', $id)->first();
        return $meeting_date != null ? response()->json($meeting_date,200) :
            response()->json(false,200);
    }

    public function get_meeting_dates_of_ad($id){
        $meeting_dates = MeetingDate::with('user')
            ->where('ad_id', $id)->get();
        return $meeting_dates != null ? response()->json($meeting_dates,200) :
            response()->json(false,200);
    }

    public function find_ads_for_user($id){
        $ads = Ad::with(['course', 'user', 'meeting_dates'])->where('user_id', $id)->get();
        return $ads != null ? response()->json($ads,200) :
            response()->json(false,200);
    }

    public function find_INactive_ads_for_user($id, $state){
        $ads = Ad::with(['course', 'user', 'meeting_dates'])->where('user_id', $id)
            ->where('active', true)->get();
        return $ads != null ? response()->json($ads,200) :
            response()->json(false,200);
    }

    public function get_sent_request_for_user($id, $state){
        if($state == "all")
            $requests = MeetingDate::with('user')->where('user_id', $id)->get();
        else
            $requests = MeetingDate::with('user')->where('user_id', $id)->where('state', $state)->get();
        return $requests != null ? response()->json($requests,200) :
            response()->json(false,200);
    }

    public function has_open_requests($id){
        $ads = Ad::with('meeting_dates')->where('user_id', $id)->get();
        foreach ($ads as $ad){
            foreach ($ad->meeting_dates as $date){
                if($date->state == "requested" || $date->state == "suggested")
                    return true;
            }
            return false;
        }

        return false;
    }


    private function parseRequest(Request $request){
        //get data and convert it - ISO 8601  --> "2022-03-11T14:51:00.00Z"
//        $date = new DateTime($request->published);
//        $request['published'] = $date;
        return $request;
    }


}
