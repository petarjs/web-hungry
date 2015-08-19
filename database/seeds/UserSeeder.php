<?php

use Hungry\Models\Role;
use Hungry\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder {
  public function run() {
    DB::table('role_user')->truncate();
    DB::table('users')->truncate();
    DB::table('roles')->truncate();

    // Roles

    $superAdminRole = Role::create([
      'name' => 'super-admin',
      'display_name' => 'Super Admin',
      'description' => 'Can manage admins'
    ]);

    $adminRole = Role::create([
      'name' => 'admin',
      'display_name' => 'Admin',
      'description' => 'Can manage food, make menus, manage users'
    ]);

    $userRole = Role::create([
      'name' => 'user',
      'display_name' => 'User',
      'description' => 'Can order food, mark favorites'
    ]);

    // Users

    $superAdmin = User::create([
      'email' => 'petar.slovic@cosmicdevelopment.com',
      'google_id' => '116501228635594035629',
      'avatar' => 'https://lh3.googleusercontent.com/-fDXQyzytF68/AAAAAAAAAAI/AAAAAAAAABY/AkUw0AA5x3o/photo.jpg?sz=50'
    ]);

    $admin = User::create([
      'email' => 'petar.slovic@gmail.com',
      'google_id' => '113124672295594628556',
      'avatar' => 'https://lh4.googleusercontent.com/-m9sxqfJhgq8/AAAAAAAAAAI/AAAAAAAAEMk/rtpNg9O9RUU/photo.jpg?sz=50'
    ]);

    $superAdmin->attachRole($superAdminRole);
    $superAdmin->attachRole($adminRole);
    $superAdmin->attachRole($userRole);

    $admin->attachRole($adminRole);
    $admin->attachRole($userRole);
  }
}