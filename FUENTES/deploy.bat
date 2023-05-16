@echo off

set /p nombre=Ingresa tu nombre: 
echo Hola %nombre%!

set api=  S
set web=  S
set desarrollo=  S
set testing=  S
set salida= vacio

If %nombre%==walde (
    set salida=C:\Deploy\Panel_Auxilio
)

If %nombre%==gaston (
    set salida=C:\Deploy\Panel_Auxilio
)

If %nombre%==david (
    set salida=C:\Deploy\Panel_Auxilio
)

@REM If %salida%==vacio (
@REM   echo no se reconoce el usuario  %nombre%
@REM   exit
@REM )





set /p api=  Quieres deployar la API? [S]/N :  
set /p web=  Quieres deployar la Web? [S]/N :  
set /p desarrollo=  Quieres copiar al servidor desarrollo (gchu)? S/N :  
rem set /p testing=  Quieres copiar al servidor testing (25)? S/N : 





If %web%==S (
    echo Construyendo Cliente...
    cd "web/"

    call ng build --prod --aot=true --buildOptimizer=true  --output-path "%salida%\dist" --delete-output-path --output-hashing bundles
    cd ".."
)
If %api%==S (
   rem API sin build ...
)
echo Construido  OK


rem copiado de archivos


If %web%==S (
    rem la web esta copiada a la carpeta destino
) else (
    rem si no se deploya la web se borra la carpeta para no subirla
    rd "%salida%\dist\" /S/Q 
)
If %api%==S (
    echo Borrando Api "%salida%\api\" 
    rd "%salida%\api\" /S/Q 

    echo copiando Api "%salida%\api\" 
    xcopy "api" "%salida%\api\"  /s/c/y >> "id.txt"
    del id.txt
)
echo Borrado  OK


rem borrado de archivos de configuracion

If %web%==S (
    echo borrando config web..
	del "%salida%\dist\assets\config.json"
)
If %api%==S (
    echo borrando config api..
    del "%salida%\api\public\config.php"
    del "%salida%\api\composer.json" 
    del "%salida%\api\composer.lock"
    del "%salida%\api\php_errors.log"
    rd "%salida%\api\vendor" /Q /S
    rd "%salida%\api\logs" /Q /S
    rd "%salida%\api\public\uploads" /Q /S
    rd "%salida%\api\public\generador-pdf\files" /Q /S
)
echo Borrado  OK

rem Subida de los archivos al servidor


If %desarrollo%==S (
    echo Conectando al Server Desarrollo...
    net use "\\192.168.1.17\c$\Soflex\SISEP\apps\panel_auxilio" 
    echo Copiando al Server Desarrollo...
    xcopy "%salida%" "\\192.168.1.17\c$\Soflex\SISEP\apps\panel_auxilio" /s/c/y 
    echo Copiado en desarrollo 
)



If %testing%==S (
    rem echo Conectando al Server Desarrollo...
    rem net use ""\\172.24.134.25\c$\Soflex\SISEP\WEB\v1.2\apps\sisep-denuncias\new" 
    rem echo Borrando los archivos viejos al Server Desarrollo...
    rem del "\\172.24.134.25\c$\Soflex\SISEP\WEB\v1.2\apps\sisep-denuncias\new" /Q
    rem echo Copiando al Server Desarrollo...
    rem xcopy "%salida%" "\\172.24.134.25\c$\Soflex\SISEP\WEB\v1.2\apps\sisep-denuncias\new" /s/c/y 
    rem echo Copiado en desarrollo 
)

pause
exit