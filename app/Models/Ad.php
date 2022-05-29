<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use DateTime;

class Ad extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'active', 'offer',
        'user_id', 'course_id', 'study_id'];

    //Ad has one Course
    public function course():BelongsTo{
        return $this->belongsTo(Course::class);
    }

    //Ad has one Study
    public function study():BelongsTo{
        return $this->belongsTo(Study::class);
    }

    //Ad has one User
    public function user():BelongsTo{
        return $this->belongsTo(User::class);
    }

    //Ad has many meeting_dates
    public function meeting_dates():HasMany{
        return $this->hasMany(MeetingDate::class);
    }
}
