@extends('layouts.print')

@section('content')
  <h1>Food Orders {{ $dateFormatted }}</h1>
  <br>
  <table class="table table-bordered table-striped">
    <thead>
      <th>Name</th>
      <th>Food</th>
    </thead>

    <tbody>
      @foreach($users as $user)
        <tr>
          <td>{{ $user['name'] }}</td>
          <td>{{ $user['ordered_food'] }}</td>
        </tr>
      @endforeach
    </tbody>
  </table>
@stop