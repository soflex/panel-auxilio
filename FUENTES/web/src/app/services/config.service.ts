import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class ConfigService {

    private data = {};

    constructor(private http: HttpClient) { }

    // se llama desde el APP_INITIALIZER en el home module
    // esto hace que los demas modulos esperen a que esta promise devuelva resolve(true)
    public load() {
        return new Promise((resolve, reject) => {
            this.http.get('./assets/config.json')
                .pipe(map((res) => { return res; }))
                .subscribe(data => {
                    this.data = data;
                    resolve(true);
                }, (err) => {
                    reject('No se pudo cargar el archivo de Configuracion.');
                }, () => {
                    console.log('Config Cargado.');
                });
        });
    }
    get(key: string, defecto = null) {

        if (typeof (this.data[key]) === 'undefined' || this.data[key] == null) {
            console.info('No se encontró configuración: ' + key);
        }
        return this.data[key] ? this.data[key] : defecto;
    }

    getAll() {
        return this.data;
    }
}
