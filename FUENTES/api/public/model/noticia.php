<?php

class Noticia 
{
    public function getNoticias($filtros, $usuarioId) {
        
        $db = SQLSRV::connect();
        $results = array();

        $stmt = sqlsrv_query($db, "EXEC dbo.sp_Panel_Auxilios 1, 'noticia'", array());

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