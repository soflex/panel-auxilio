import { TemplateRef } from '@angular/core';

export class MaterialTableColumn {

    prop: string;
    name: string;
    width?: string;
    headerTemplate?: TemplateRef<any>;
    headerClass?: string;
    cellTemplate?: TemplateRef<any>;
    cellTransform?: any; // se pasa una funcion con parametros (celda, row)
    cellOrder?: any; // se pasa una funcion para determinar el orden. con parametros (celda, row)
    hidden ? = false; // determina si esa columna se oculta
    hasClick?: boolean; // define si la celda tiene definido un evento click
}
