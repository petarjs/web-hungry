<?php

namespace Hungry;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    public function menuFoods() {
      return $this->hasMany('Hungry\Models\MenuFood');
    }
}
