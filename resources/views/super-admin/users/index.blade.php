@extends('layouts.default')

@section('content')
  <h2>Manage Users</h2>

  <table class="striped bordered">
    <thead>
      <th>ID</th>
      <th>Name</th>
      <th>Email</th>
      <th>Manage Roles</th>
    </thead>
    <tbody>
      @foreach($users as $user)
        <tr>
          <td>{{ $user->id }}</td>
          <td>
            <img src="{{ $user->avatar }}" alt="">
            {{ $user->name }}
          </td>
          <td>{{ $user->email }}</td>
          <td>
            @foreach($roles as $role)
              <a class="btn" href="{{ action('SuperAdmin\UserController@getToggleRole', [$user->id, 'role_id' => $role->id]) }}">
                @if($user->hasRole($role->name ))
                  <i class="fa fa-minus"></i>
                @else
                  <i class="fa fa-plus"></i>
                @endif
                {{ $role->display_name }}
              </a>
            @endforeach
          </td>
        </tr>
      @endforeach
    </tbody>
  </table>
@stop