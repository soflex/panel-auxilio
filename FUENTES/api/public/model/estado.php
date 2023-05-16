<?php

class Estado 
{
    public function getEstados($filtros, $usuarioId) {
        
        $db = SQLSRV::connect();
        $results = array();

        $stmt = sqlsrv_query($db, "EXEC dbo.getEstado", array());

        if ($stmt === false) {
            SQLSRV::error(500, 'Error interno del servidor al obtener la persona', $db);
        }

        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        }

        sqlsrv_free_stmt($stmt);
        SQLSRV::close($db);

        return isset($results) ? $results : array();
    }

    public function updateEstado($filtros, $usuarioId) {
        $db = SQLSRV::connect();
        $results = array();

        $stmt = sqlsrv_query($db, "EXEC dbo.SetEstado ?, ?, ?, ?, ?, ?", array(
            isset($filtros->estaID) && $filtros->estaID != "" ? $filtros->estaID : null,
            isset($filtros->estaDescripcion) && $filtros->estaDescripcion != "" ? $filtros->estaDescripcion : null,
            isset($filtros->estaColor) && $filtros->estaColor != "" ? $filtros->estaColor : null,
            isset($filtros->estadosPosibles) && $filtros->estadosPosibles != "" ? $filtros->estadosPosibles : null,
            isset($filtros->permiteEditar) && $filtros->permiteEditar != "" ? $filtros->permiteEditar : 0,  
            isset($filtros->estaBorrado) && $filtros->estaBorrado != "" ? $filtros->estaBorrado : 0,  
        ));

        if ($stmt === false) {
            SQLSRV::error(500, 'Error interno del servidor al obtener la persona', $db);
        }

        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        }

        sqlsrv_free_stmt($stmt);
        SQLSRV::close($db);

        return isset($results) ? $results : array();
    }

    public function saveEstado($filtros, $usuarioId) {
        $db = SQLSRV::connect();
        $results = array();

        $stmt = sqlsrv_query($db, "EXEC dbo.SetEstado ?, ?, ?, ?, ?, ?", array(
            isset($filtros->estaID) && $filtros->estaID != "" ? $filtros->estaID : null,
            isset($filtros->estaDescripcion) && $filtros->estaDescripcion != "" ? $filtros->estaDescripcion : null,
            isset($filtros->estaColor) && $filtros->estaColor != "" ? $filtros->estaColor : null,
            isset($filtros->estadosPosibles) && $filtros->estadosPosibles != "" ? $filtros->estadosPosibles : null,
            isset($filtros->permiteEditar) && $filtros->permiteEditar != "" ? $filtros->permiteEditar : 0,  
            isset($filtros->estaBorrado) && $filtros->estaBorrado != "" ? $filtros->estaBorrado : 0,  
        ));
        
        if ($stmt === false) {
            SQLSRV::error(500, 'Error interno del servidor al obtener la persona', $db);
        }

        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        }

        sqlsrv_free_stmt($stmt);
        SQLSRV::close($db);

        return isset($results) ? $results : array();
    }

    public function deleteEstado($filtros, $usuarioId) {
        $db = SQLSRV::connect();
        $results = array();

        $stmt = sqlsrv_query($db, "EXEC dbo.SetEstado ?, ?, ?, ?, ?, ?", array(
            isset($filtros->estaID) && $filtros->estaID != "" ? $filtros->estaID : null,
            isset($filtros->estaDescripcion) && $filtros->estaDescripcion != "" ? $filtros->estaDescripcion : null,
            isset($filtros->estaColor) && $filtros->estaColor != "" ? $filtros->estaColor : null,
            isset($filtros->estadosPosibles) && $filtros->estadosPosibles != "" ? $filtros->estadosPosibles : null,
            isset($filtros->permiteEditar) && $filtros->permiteEditar != "" ? $filtros->permiteEditar : 0,  
            isset($filtros->estaBorrado) && $filtros->estaBorrado != "" ? $filtros->estaBorrado : 0,  
        ));

        if ($stmt === false) {
            SQLSRV::error(500, 'Error interno del servidor al obtener la persona', $db);
        }

        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $results[] = $row;
        }

        sqlsrv_free_stmt($stmt);
        SQLSRV::close($db);

        return isset($results) ? $results : array();
    }
}