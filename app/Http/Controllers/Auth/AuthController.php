<?php

namespace Hungry\Http\Controllers\Auth;

use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Hungry\Models\User;
use Validator;
use Hungry\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Registration & Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users, as well as the
    | authentication of existing users. By default, this controller uses
    | a simple trait to add these behaviors. Why don't you explore it?
    |
    */

    use AuthenticatesAndRegistersUsers, ThrottlesLogins;

    /**
     * Create a new authentication controller instance.
     *
     */
    public function __construct()
    {
        $this->middleware('guest', ['except' => 'getLogout']);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|confirmed|min:6',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
    }

    /**
     * Redirect the user to the GitHub authentication page.
     *
     * @param $provider
     * @return Response
     */
    public function redirectToProvider($provider)
    {
        if(!$provider) {
            return \View::make('auth.login');
        }
        return Socialite::with($provider)->redirect();
    }

    public function getGoogle(){
        return $this->redirectToProvider('google');
    }

    public function getGoogleCallback(){
        return $this->handleProviderCallback('google');
    }

    /**
     * Obtain the user information from Google.
     *
     * @Get("/auth/google/callback")
     * @return Response
     */
    public function handleProviderCallback($provider)
    {
        try {
            $user = Socialite::with($provider)->user();
        } catch (Exception $e) {
            return Redirect::to($provider . '/google');
        }

        $authUser = $this->findOrCreateUser($user);

        if($authUser->roles->isEmpty()) {
          return redirect('/user-unauthorized');
        } else {
          Auth::login($authUser, true);
        }

        return redirect('/#/');
    }

    /**
     * Return user if exists; create and return if doesn't
     *
     * @param $user
     * @return User
     */
    private function findOrCreateUser($user)
    {
        if ($authUser = User::where('google_id', $user->id)->first()) {
            return $authUser;
        }

        return User::create([
          'name' => $user->name ? $user->name : $userData->user['name']['givenName'] . ' ' . $userData->user['name']['familyName'],
          'email' => $user->email,
          'google_id' => $user->id,
          'avatar' => $user->avatar
        ]);
    }

    public function logout() {
        Auth::logout();
        return redirect('/');
    }
}
