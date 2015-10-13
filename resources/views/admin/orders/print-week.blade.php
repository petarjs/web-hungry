@extends('layouts.print')

@section('content')
  <h1>Food Orders for Week {{ $dateFormatted }} - {{ $dateFormatted2 }}</h1>
  <br>
  <table class="table table-bordered table-condensed">
    <thead>
      <th>Name</th>
      <th>Monday</th>
      <th>Tuesday</th>
      <th>Wednesday</th>
      <th>Thursday</th>
      <th>Friday</th>
    </thead>

    <tbody>
      @foreach($users as $user)
        <tr>
          <td>{{ $user['name'] }}</td>
          @foreach($user['ordered_food'] as $food)
            <td>{{ $food ? $food : '-' }}</td>
          @endforeach
        </tr>
      @endforeach
    </tbody>
  </table>
@stop