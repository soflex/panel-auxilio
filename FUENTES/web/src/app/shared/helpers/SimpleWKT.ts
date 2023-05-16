import * as L from 'leaflet';
;

interface ILayer {
    new(nombre: string): L.Layer;
}

export class SimpleWKT {

    public static isMarker(geo: L.Layer): geo is L.Marker { return !!(geo && (<L.Marker>geo).getLatLng); }
    public static isInternalPolyline(geo: L.Layer): geo is L.Polyline { return !!(geo && (<L.Polyline>geo).getLatLngs); }
    public static isPolygon(geo: L.Layer): geo is L.Polygon { if (!(<L.Polygon>geo).getLatLngs) return false; let a = (<L.Polygon>geo).getLatLngs(); return a[0] == a.slice(-1)[0]; }
    public static isCircleMarker(geo: L.Layer): geo is L.CircleMarker { return !!(geo && (<L.CircleMarker>geo).getRadius); }
    public static isPath(geo: L.Layer): geo is L.Path { return !!(geo && (<L.Path>geo).setStyle); }

    public static layerToWkt(geo: L.Layer): string {
        if (!geo) { return null; }
        let res = '';

        if (this.isInternalPolyline(geo)) {
            let ptos: any = geo.getLatLngs();

            //Es RECTANGULO
            if (ptos[0] instanceof Array) {
                ptos = ptos[0];
                ptos.push(ptos[0]);
            }

            ptos = ptos.reverse();
            res = ptos.map((x) => x.lng + ' ' + x.lat).join(',');
            res = this.isPolygon(geo) ? `POLYGON ((${res}))` : `LINESTRING (${res})`;
        }
        else {
            if (this.isCircleMarker(geo) || this.isMarker(geo)) {

                res = `POINT (${(<any>geo).getLatLng().lng} ${(<any>geo).getLatLng().lat})`;
            }
        }
        return res;
    }

   
    public static wktToLayer(wkt: string, radio?: number, customIcon?: L.Icon): L.Layer {
        if (!wkt) { return null; }
        radio = Math.round(radio);
        let inicio = wkt.lastIndexOf('(') + 1;
        let fin = wkt.indexOf(')');
        let prefix = wkt.substr(0, wkt.indexOf('(')).trim();

        // ['-40.446 36.566', '67.566 44.692']
        let puntosStr = wkt.substr(inicio, fin - inicio).split(',');

        let puntosLatLng = [];

        for (let x of puntosStr) {
            let ptoStr = x.trim().split(' ');
            if (isNaN(+ptoStr[1]) || isNaN(+ptoStr[0])) {
                return null;
            }
            puntosLatLng.push(L.latLng(+ptoStr[1], +ptoStr[0]));
        }

        if (puntosLatLng.length == 5) {
            let cuadrado =
                puntosLatLng[0].lng == puntosLatLng[1].lng && puntosLatLng[2].lng == puntosLatLng[3].lng &&
                puntosLatLng[1].lat == puntosLatLng[2].lat && puntosLatLng[0].lat == puntosLatLng[3].lat;
            if (cuadrado) { prefix = 'RECTANGULO'; }
        }

        // Creo el layer pertinente.
        let layer: L.Layer;
        switch (prefix) {
            case 'POINT':
                layer = radio ?
                    L.circle(puntosLatLng[0], radio) :
                    L.marker(puntosLatLng[0], customIcon ?
                        { icon: customIcon } :
                        null);
                break;
            case 'POLYGON': layer = L.polygon(puntosLatLng); break;
            case 'RECTANGULO': layer = L.rectangle(puntosLatLng); break;
            case 'LINESTRING': layer = L.polyline(puntosLatLng); break;
            default:
        }

        return layer;
        /*
        //let puntosStr = wkt.replace('POLYGON ((', ' ').replace('))', '').split(',');


        puntos = puntosStr.map((p: string): L.LatLng => {
            let lonLat = p.trim().split(' ');
            return L.latLng(parseFloat(lonLat[1]), parseFloat(lonLat[0]));
        });
        return puntos;
        */

    }

    public static circleToPoints(latitud: number, longitud: number , radio: number): any[] {

        const puntos: number[][] = [];
    
        const d2r = Math.PI / 180;   // degrees to radians
        const r2d = 180 / Math.PI;   // radians to degrees
        const earthsradius = 6371009; // radio promedio de la tierra en metros
    
        const points = 64;
    
        // find the raidus in lat/lon
        const rlat = (radio / earthsradius) * r2d;
        const rlng = rlat / Math.cos(latitud * d2r);
    
        const extp = new Array();
        for (let i = 0; i < points + 1; i++) {
          const theta = Math.PI * (i / (points / 2));
          const ex = longitud + (rlng * Math.cos(theta)); // center a + radius x * cos(theta)
          const ey = latitud + (rlat * Math.sin(theta)); // center b + radius y * sin(theta)
    
            puntos.push([ey, ex ]);
        }
    
        puntos.push(puntos[0]); // repito al final el primer punto para que cierre el poligono
    
        return puntos;
    }
    /**
     * A partir de puntos pertenecientes a un Poligono devuelve un String en formato WKT.
     * 
     * @public static
     * @param {Latlng[]} puntos
     * @returns {string}
     * 
     * @memberOf SimpleWKT
     */
    public static polygonToWkt(puntos: L.LatLng[]): string {

        let puntosTransformados: string[] = puntos.map(function (p) {
            return p.lng.toString() + ' ' + p.lat.toString();
        });

        // repito al final el primer punto para que cierre el poligono
        puntosTransformados.push(puntosTransformados[0]);

        return 'POLYGON ((' + puntosTransformados.join(',') + ' ))';
    }

    /**
     * Devuelve el Poligono que representa al circulo enf ormato WKT
     * 
     * @public static
     * @param {Latlng} punto
     * @param {number} radio
     * @returns {string}
     * 
     * @memberOf SimpleWKT
     */
    public static circleToWkt(latitud: number, longitud: number , radio: number): string {

        const puntos = this.circleToPoints(latitud, longitud, radio);

        const puntosStr = puntos.map((punto) => {
            return punto[1].toString() + ' ' + punto[0].toString();
        });

        return 'POLYGON ((' + puntosStr.join(',') + ' ))';
    }

    public static wktToPoints(wkt: string): L.LatLng[] {

        let puntosStr = wkt.replace('POLYGON ((', ' ').replace('))', '').split(',');

        let puntos: L.LatLng[] = [];

        puntos = puntosStr.map((p: string): L.LatLng => {
            let lonLat = p.trim().split(' ');
            return L.latLng(parseFloat(lonLat[1]), parseFloat(lonLat[0]));
        });

        return puntos;

    }

    public static wktToPointsElastic(wkt: string): L.LatLng[] {

        let puntosStr = wkt.replace('POLYGON ((', ' ').replace('))', '').split(',');

        let puntos: L.LatLng[] = [];

        puntos = puntosStr.map((p: string): L.LatLng => {
            let lonLat = p.trim().split(' ');
            return { lat: parseFloat(lonLat[1]), lon: parseFloat(lonLat[0]) };
        });

        return puntos;

    }

    public static obtenerCentroide(geometria: L.Layer): L.LatLng {
        if (!geometria) { return null; }
        let res: L.LatLng;
        if (this.isMarker(geometria)) {
            res = geometria.getLatLng();
        } else {
            if (this.isInternalPolyline(geometria)) {
                res = (<any>geometria).getCenter();
            }
        }
        return res;
    }

}
