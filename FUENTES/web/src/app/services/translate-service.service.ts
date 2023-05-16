import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Injectable()
export class TranslateService {


    constructor() {

    }

    translatePaginator(paginator: MatPaginator): MatPaginator {
        paginator._intl.itemsPerPageLabel = 'Filas Por Página';
        paginator._intl.firstPageLabel = 'Primer Página';
        paginator._intl.lastPageLabel = 'Última Página';
        paginator._intl.nextPageLabel = 'Página Siguiente';
        paginator._intl.previousPageLabel = 'Página Anterior';
        paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
            if (length === 0 || pageSize === 0) {
                return `0 de ${length}`;
            }
            length = Math.max(length, 0);
            const startIndex = page * pageSize;
            const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
            return `${startIndex + 1} - ${endIndex} de ${length}`;
        };
        return paginator;
    }
}
