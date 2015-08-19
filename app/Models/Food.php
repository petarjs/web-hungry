<?php

namespace Hungry\Models;

use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
  public function likedBy() {
    return $this->belongsToMany('Hungry\Models\User', 'likes');
  }
}
