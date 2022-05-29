<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Study extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'type_of_study'];

    //Study has many Users
    public function users():HasMany{
        return $this->belongsToMany(User::class);
    }

    //Study has n Courses
    public function courses():HasMany{
        return $this->hasMany(Course::class);
    }

    //Study has n Ads
    public function ads():HasMany{
        return $this->hasMany(Ad::class);
    }
}
