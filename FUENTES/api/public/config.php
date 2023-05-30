<?php

defined ( 'MODULO' ) ? null : define ( 'MODULO', 'PANEL_AUXILIO');

defined ( 'DEBUG' ) ? null : define ( 'DEBUG', true);

$ambiente = "dev";

if($ambiente == "dev"){

    defined ('DB_HOST') ? null : define('DB_HOST','192.168.1.20,1442');
    defined ('DB_DATABASE') ? null : define('DB_DATABASE', "SAE911");
    defined ('DB_USERNAME') ? null : define('DB_USERNAME', "sa");
    defined ('DB_PASSWORD') ? null : define('DB_PASSWORD', "Digital23");
    
    //Conexion a Auditoria 
    defined ('DB_USER') ? null : define('DB_USER', "sa");
    defined ('DB_PASS') ? null : define('DB_PASS', "Digital23");
    defined ('DB_BASE') ? null : define('DB_BASE', "SISEP_Auditoria");

    defined ( 'TOKEN_KEY' ) ? null : define ( 'TOKEN_KEY', '#SoflexasAG#ASX#TS!232323#' );

    defined ( 'REMOTE_STORAGE' ) ? null : define ( 'REMOTE_STORAGE', 'http://192.168.1.17/sisep/apps/administrador_archivos/api/index.php/' );
    
    defined ( 'REMOTE_STORAGE_FILES' ) ? null : define ( 'REMOTE_STORAGE_FILES', 'http://192.168.1.17/sisep/apps/administrador_archivos/archivos/' );

   
 } 
else if ($ambiente == "test")
{
    defined ('DB_HOST') ? null : define('DB_HOST','172.24.134.25');
    defined ('DB_DATABASE') ? null : define('DB_DATABASE', "sae911_VG");
    defined ('DB_USERNAME') ? null : define('DB_USERNAME', "admin");
    defined ('DB_PASSWORD') ? null : define('DB_PASSWORD', "Soflex9112323sql");
    
    //Conexion a Auditoria 
    defined ('DB_USER') ? null : define('DB_USER', "admin");
    defined ('DB_PASS') ? null : define('DB_PASS', "Soflex9112323sql");
    defined ('DB_BASE') ? null : define('DB_BASE', "SISEP_Auditoria");

    defined ( 'TOKEN_KEY' ) ? null : define ( 'TOKEN_KEY', '#SoflexMunicipiosS12563#' );

    defined ( 'REMOTE_STORAGE' ) ? null : define ( 'REMOTE_STORAGE', 'http://192.168.1.17/sisep/apps/administrador_archivos/api/index.php/' );
    
    defined ( 'REMOTE_STORAGE_FILES' ) ? null : define ( 'REMOTE_STORAGE_FILES', 'http://172.24.134.25/sisep/api/archivos/' );

}
else if ($ambiente == "prod")
{
   
    defined ('DB_HOST') ? null : define('DB_HOST','172.24.134.23');
    defined ('DB_DATABASE') ? null : define('DB_DATABASE', "sae911_VG");
    defined ('DB_USERNAME') ? null : define('DB_USERNAME', "admin");
    defined ('DB_PASSWORD') ? null : define('DB_PASSWORD', "Soflex9112323sql");
    
    //Conexion a Auditoria 
    defined ('DB_USER') ? null : define('DB_USER', "admin");
    defined ('DB_PASS') ? null : define('DB_PASS', "Soflex9112323sql");
    defined ('DB_BASE') ? null : define('DB_BASE', "SISEP_Auditoria");

    defined ( 'TOKEN_KEY' ) ? null : define ( 'TOKEN_KEY', '#SoflexasAG#ASX#TS!232323#' );

    defined ( 'REMOTE_STORAGE' ) ? null : define ( 'REMOTE_STORAGE', 'http://172.24.134.23/sisep/apps/administrador_archivos/api/index.php/' );

    defined ( 'REMOTE_STORAGE_FILES' ) ? null : define ( 'REMOTE_STORAGE_FILES', 'http://172.24.134.23/sisep/apps/administrador_archivos/archivos/' );

   
}

?>