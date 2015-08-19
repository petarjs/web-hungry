@extends('layouts.default')

@section('content')
  <h2>Manage Food</h2>

  <a href="#" class="btn">Add</a>

  <table class="striped bordered">
    <thead>
      <th>ID</th>
      <th>Image</th>
      <th>Name</th>
      <th>Description</th>
    </thead>
    <tbody>
      @foreach($food as $dish)
        <tr>
          <td>{{ $dish->id }}</td>
          <td></td>
          <td>{{ $dish->name }}</td>
          <td>{{ $dish->description }}</td>
          <td>
            <a href="#">Edit</a>
            <a href="#">Delete</a>
          </td>
        </tr>
      @endforeach
    </tbody>
  </table>
@stop