<?php

namespace Hungry\Models;

use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
  protected $fillable = [
    'image',
    'description'
  ];
  
  public function likedBy() {
    return $this->belongsToMany('Hungry\Models\User', 'likes');
  }

  public function getImageUrl() {
    return 'uploads/' . $this->id;
  }

  public function toggleDefault() {
    $this->default = !$this->default;
    $this->save();
  }
}
