<?php

namespace Hungry\Models;

use Illuminate\Database\Eloquent\Model;

class MenuFood extends Model
{
    protected $table = 'menu_foods';

    protected $fillable = [
      'menu_id',
      'food_id'
    ];

    public function menu() {
      return $this->belongsTo('Hungry\Models\Menu');
    }

    public function food() {
      return $this->belongsTo('Hungry\Models\Food');
    }

    public function eatenBy() {
      return $this->belongsToMany('Hungry\Models\User');
    }
}
