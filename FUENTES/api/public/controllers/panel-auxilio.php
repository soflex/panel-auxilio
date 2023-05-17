<?php
include_once 'model/panel-auxilio.php';

$app->post('/lista-panel-auxilio', function ($request, $response, $args) {
    
    $token = G::Autenticar($request);
    $data= (object)$request->getParsedBody();

    $model = new Auxilio();
    $results = $model->getAuxilio($data, $token->data->usuario_id);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response->withHeader('Content-Type', 'application/json');
});