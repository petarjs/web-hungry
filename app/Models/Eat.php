<?php

namespace Hungry\Models;

use Illuminate\Database\Eloquent\Model;

class Eat extends Model
{
    protected $fillable = [
        'user_id',
        'menu_food_id'
    ];
}
