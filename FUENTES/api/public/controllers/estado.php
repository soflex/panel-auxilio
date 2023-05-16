<?php
include_once 'model/estado.php';

$app->get('/estado', function ($request, $response, $args) {
    
    $token = G::Autenticar($request);
    $data= (object)$request->getParsedBody();

    $model = new Estado();
    $results = $model->getEstados($data, $token->data->usuario_id);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/update-estado', function ($request, $response, $args) {

    $token = G::Autenticar($request);

    $data= (object)$request->getParsedBody()["data"];

    $model = new Estado();
    $results = $model->updateEstado($data, $token->data->usuario_id);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/save-estado', function ($request, $response, $args) {

    $token = G::Autenticar($request);

    $data= (object)$request->getParsedBody()["data"];

    $model = new Estado();
    $results = $model->saveEstado($data, $token->data->usuario_id);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/delete-estado', function ($request, $response, $args) {

    $token = G::Autenticar($request);

    $data= (object)$request->getParsedBody()["data"];

    $model = new Estado();
    $results = $model->deleteEstado($data, $token->data->usuario_id);

    $payload = json_encode($results);

    $response->getBody()->write($payload);
    return $response->withHeader('Content-Type', 'application/json');
});