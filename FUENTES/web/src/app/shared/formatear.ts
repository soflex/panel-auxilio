import { DatePipe } from '@angular/common';
import * as moment from 'moment';

export class Formatear {

    constructor(public datepipe: DatePipe) { }

    public static boolean(cell: any): string {
        if (cell) {
            return 'SI';
        }
        return '.';
    }

    public static ceros(cell: any): string {        
        if (cell === "") {
            return '0'
        } else {
            return cell;
        }
    }

    public static booleanBorrado(cell: any): string {
        if (cell) {
            return 'borrado';
        }
        return '.';
    }

    public static booleanSiNo(cell: any): string {
        
        if (cell) {
            return 'Si';
        }
        return 'No';
    }

    public static booleanSiNoReverse(cell: any): string {
        
        if (!cell) {
            return 'Si';
        }
        return 'No';
    }

    public static fecha(cell: any): string {
        if (cell){
            return cell.date.substr(0,16).toString();
        } else {
            return ' ';
        }
    }

    public static valorCero(cell: any): string {
        if (cell === ""){
            return '0';
        } else {
            return ' ';
        }
    }
}
