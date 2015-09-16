<?php
require 'vendor/autoload.php';

$app = new \Slim\Slim();

 //Mon dieu que les arrays 2d php sont horribles
$personnes = array(
array("id"=> "0", "Identifiant"=> 'ghaag', "Nom"=> 'Haag', "Prenom"=> 'Guillaume', "Mail"=> 'haag.guillaume@gmail.com', "Matiere"=> 'AngularJS', "Roles" => array ( "admin" => true, "planificateur" => true , "enseignant" => true), "Statut" => true),
array("id"=> "1", "Identifiant"=> 'ndeu', "Nom"=> 'Deutschmann', "Prenom"=> 'Nicolas', "Mail"=> 'd.nico@gmail.com', "Matiere"=> 'Django', "Roles" => array ( "admin" => false, "planificateur" => true , "enseignant" => true), "Statut" => true),
array("id"=> "2", "Identifiant"=> 'srom', "Nom"=> 'Spielmann', "Prenom"=> 'Romain', "Mail"=> 's.romain@gmail.com', "Matiere"=> 'Django', "Roles" => array ( "admin" => false, "planificateur" => true , "enseignant" => true), "Statut" => true),
array("id"=> "3", "Identifiant"=> 'nkev', "Nom"=> 'Niva', "Prenom"=> 'Kevin', "Mail"=> 'k.niva@yahoo.com', "Matiere"=> 'Cisp (lisp & C)', "Roles" => array ( "admin" => false, "planificateur" => true , "enseignant" => true), "Statut" => true)
);

$app->get('/', function () {
    echo "Hello, it works!";
});

$app->get('/hello/:name', function ($name) {
    echo "Hello, $name";
});

$app->get('/admin/personnes', function () use ($app,$personnes) {
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->setBody(json_encode($personnes));
});

$app->get('/admin/personnes/:id', function($id) use ($app,$personnes) {
    $personne = null;
    foreach($personnes as $i=>$item) {
        if ($item['id'] == $id){
            $personne = $item;
            break;       
        }
    }
    if ($personne !== null) {
        $app->response->headers->set('Content-Type', 'application/json');
        $app->response->setBody(json_encode($personne));
    }
    else {
        $app->response()->status(404);
    }
        
});

$app->run();
?>