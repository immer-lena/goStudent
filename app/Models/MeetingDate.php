<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeetingDate extends Model
{
    use HasFactory;

    protected $fillable = ['date', 'time', 'state', 'comment', 'ad_id', 'user_id'];

    //meeting_date has one Ad
    public function ad():BelongsTo{
    return $this->belongsTo(Ad::class);
    }

    //meeting_date has one User
    public function user():BelongsTo{
        return $this->belongsTo(User::class);
    }
}
