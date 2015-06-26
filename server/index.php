<?php

require_once('bower_components/idiorm/idiorm.php');
require_once('bower_components/flight/flight/Flight.php');
require_once('classes/sqlhelper.class.php');
require_once('classes/util.class.php');
require_once('conf.php');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  // return only the headers and not the content
  // only allow CORS if we're doing a GET - i.e. no saving for now.
  //if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']) && $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] == 'GET') {
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, User, Password');
  //}
  exit;
}
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, User, Password');

Flight::route('POST /feedback', function(){
	// $data = json_decode( file_get_contents('php://input') );
	$request = Flight::request()->data->getData();
	Flight::json( $request );
});

Flight::route('GET /', function(){
	Flight::json( array('ok'=>true) );
});

Flight::start();