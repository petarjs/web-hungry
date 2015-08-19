<?php

namespace Hungry;

use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
  public function likedBy() {
    return $this->belongsToMany('Hungry\Models\User', 'likes');
  }
}
