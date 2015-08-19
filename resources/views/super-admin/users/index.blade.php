@extends('layouts.default')

@section('content')
  @foreach($users as $user)
    <div>
      <img src="{{ $user->avatar }}" alt="">
      {{ $user->name }}
      {{ $user->email }}
      {{ $user->roles()->first()->name }}
    </div>
  @endforeach
@stop