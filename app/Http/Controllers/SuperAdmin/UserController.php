<?php

namespace Hungry\Http\Controllers\SuperAdmin;

use Illuminate\Http\Request;

use Hungry\Http\Requests;
use Hungry\Http\Controllers\Controller;
use Hungry\Models\User;
use Hungry\Models\Role;

/**
 * @Middleware("super-admin")
 * @Controller(prefix="super-admin/users")
 */
class UserController extends Controller
{
    /**
     * @Get("/")
     */
    public function getIndex() {
      $users = User::all();
      $roles = Role::all();

      return view('super-admin.users.index', compact('users', 'roles'));
    }

    /**
     * @Get("/toggle-role/{id}")
     */
    public function getToggleRole($id) {
      $role = Role::findOrFail(\Input::get('role_id'));
      $user = User::findOrFail($id);

      if($user->roles->where('id', $role->id)->isEmpty()) {
        $user->attachRole($role);
      } else {
        $user->detachRole($role);
      }

      return redirect(action('SuperAdmin\UserController@getIndex'));
    }

    
}
