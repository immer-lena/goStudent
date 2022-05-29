<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'email', 'password', 'semester',
        'graduated', 'introduction', 'tutor', 'profile_pic', 'study_id'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    //User has many Ads
    public function ads():HasMany {
        return $this->hasMany(Ad::class);
    }

    //User has one study
    public function study():BelongsTo{
        return $this->belongsTo(Study::class);
    }

    //user belongs to many courses
    public function courses():BelongsToMany{
        return $this->belongsToMany(Course::class);
    }

    //user has many meeting_dates
    public function meeting_dates():HasMany{
        return $this->hasMany(MeetingDate::class);
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'user'=>['id'=> $this->id, 'tutor' => $this->tutor]
        ];
    }
}
