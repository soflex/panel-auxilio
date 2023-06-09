<?php

class SQLSRV
{
    public static function connect($instancia = "Denuncias")
    {            
        switch($instancia)
        {
            case "Denuncias":            
                $db_conn = sqlsrv_connect(DB_HOST, array("Database"=>DB_DATABASE, "UID"=>DB_USERNAME, "PWD"=>DB_PASSWORD, "CharacterSet" => "UTF-8"));
            break;

        }
        if (!$db_conn) {
            // die( print_r( sqlsrv_errors(), true));
            SQLSRV::error(500, 'Error de conexion a la base '.$instancia . '<br>' . json_encode(sqlsrv_errors()[0]));
        }
        return $db_conn;
    }

    public static function error($codigo, $mensaje, $db = null){
        http_response_code($codigo);
        echo json_encode(array("result"=>"ERROR",
            "error"=>$mensaje,
            "sqlError"=> sqlsrv_errors()));
        if($db){
            sqlsrv_close($db);
        }
        die;
    }

    public static function close($db){
        sqlsrv_close($db);
    }
    
}


?>