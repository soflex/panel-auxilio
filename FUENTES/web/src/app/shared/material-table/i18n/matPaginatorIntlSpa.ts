import {MatPaginatorIntl} from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class MatPaginatorIntlSpa extends MatPaginatorIntl {
  itemsPerPageLabel = 'Items por Página';
  nextPageLabel     = 'Sigiente Página';
  previousPageLabel = 'Página Anterior';
}
