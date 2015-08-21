<?php

namespace Hungry\Http\Controllers\Api;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;
use Hungry\Models\User;
use Hungry\Models\Role;

/**
 * @Controller(prefix="api/roles")
 */
class RolesController extends Controller
{

    /**
     * @Get("/")
     */
    public function getRoles() {
      $roles = Role::all();

      return \Response::json($roles, 200);
    }

    
}
