export class PanelAuxilio {

    nroAuxilio: string;

    signos: string;

    prioridad: string;

    ubicacion: string;

    estado: string;

    fechaInicio: string;
    
    fechaDerivacion: string;

    demora: string;

    hospitalBase: string;

    encabezado: string;

    colorFondo: string;

    colorLetra: string;

    cssClass: string;

    colorFila: string;

    onDeserialize(e: PanelAuxilio, json: any) {
		if (e.colorFondo) {
			e.cssClass = e.colorFondo;
		}
	}

}