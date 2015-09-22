@extends('layouts.site')

@section('content')

  <div class="container">
    <header class="header layout layout-row layout-align-center-center">
      <div class="__logo flex flex-70 flex-md flex-md-80 flex-sm flex-sm-100">
        HUNGRY
        <span class="__subtitle">Cosmic</span>
      </div>
    </header>
    
    <div class="footer layout layout-row layout-align-center-center">
      <div class="flex flex-70 flex-md flex-md-80 flex-sm flex-sm-100">
        <h3>Hello, are you hungry?</h3>
        <p>To get started just login with Google. Pick your account and you'll be ordering food in no time!</p>
        <a href="/auth/google" class="md-raised md-primary md-button ng-scope md-default-theme">Login with Google</a>
      </div>
    </div>

    <div class="footer layout layout-row layout-align-center-center">
      <div class="flex flex-70 flex-md flex-md-80 flex-sm flex-sm-100">
        <div flex>
          <h3>
            Made with lots of <i class="material-icons">favorite</i> and lots of <i class="material-icons">local_cafe</i> 
            <br>
            @ Cosmic Development!
          </h3>
        </div>
        <div flex>
          <h3>Please contribute!</h3>
          <p>
            Request features, report bugs and develop your own code! <i class="material-icons">bug_report</i>
          </p>
          <a href="https://github.com/petarslovic/web-hungry">https://github.com/petarslovic/web-hungry</a>
          <br><br>
          <b>We're open source and open to pull requests!</b>
        </div>
      </div>
    </div>
  </div>
@endsection
