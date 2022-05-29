<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'semster', "study_id"];

    //course has one Study
    public function study():BelongsTo{
        return $this->belongsTo(Study::class);
    }

    //course belongs to many users
    public function users():BelongsToMany{
        return $this->belongsToMany(User::class);
    }

    //Course has many Ads
    public function ads():HasMany{
        return $this->hasMany(Ad::class);
    }

}
