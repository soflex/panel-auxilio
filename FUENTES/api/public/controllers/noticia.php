<?php
include_once 'model/noticia.php';

$app->post('/lista-noticia', function ($request, $response, $args) {
    
    $token = G::Autenticar($request);
    $data= (object)$request->getParsedBody();

    $model = new Noticia();
    $results = $model->getNoticias($data, $token->data->usuario_id);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response->withHeader('Content-Type', 'application/json');
});