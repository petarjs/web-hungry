<?php

namespace Hungry\Handlers\Events;

use Hungry\Events;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

use Hungry\Events\MenuWasPublished;

use Hungry\Models\User;

class EmailNewMenu
{
    /**
     * Create the event handler.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  Events  $event
     * @return void
     */
    public function handle(MenuWasPublished $event)
    {
        $menu = $event->menu;
        $allUsers = User::all()->lists('email')->toArray();
        $userVars = User::all()->map(function($user) {
          return [$user->email => [
            'name' => $user->name
          ]];
        })->collapse()->toArray();

        $data = ['menu' => $menu];

        \Mailgun::send('emails.menu-was-published', $data, function ($m) use ($menu, $allUsers, $userVars) {
          $m->to($userVars)->subject('New Menu for ' . $menu->date->format('d.m.Y'));
          // $m->recipientVariables($userVars);
        });
    }
}
