<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddWeekAndPublishedToMenus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('menus', function (Blueprint $table) {
            /**
             * Timestamp of the start of the week (Monday)
             */
            $table->string('week');

            /**
             * If the menu should be shown to users
             */
            $table->boolean('published');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('menus', function (Blueprint $table) {
        $table->dropColumn(['week', 'published']);
      });
    }
}
