import {
  Component, OnInit, Input, OnDestroy,
  ViewChild, Output, EventEmitter, ChangeDetectorRef, TemplateRef, AfterViewInit, OnChanges, SimpleChanges, SimpleChange, HostListener, ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialTableColumn } from '../../domain/material-table-column';
import * as moment from 'moment';
import { _isNumberValue } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '../../services/translate-service.service';
import { ThemeService, Theming } from '@soflex/sisep-base';


@Component({
  selector: 'material-table',
  templateUrl: './material-table.component.html',
  styleUrls: ['./material-table.component.scss'],
})

export class MaterialTableComponent extends Theming implements OnInit, OnDestroy, AfterViewInit {


  displayedColumns: string[];
  @Input() rows: any[] | MatTableDataSource<any>;

  @Input() disabled: boolean;
  @Input() filter = false;
  @Input() pagination = true;
  @Input() selected: any;
  @Input() selectedColumn: any;
  @Input() selectionMode = 1; // 0:none , 1: row , 2:cell
  @Input() rowHeight: number = 30;
  @Input() set selectedMultiple(value: any[]) {
    value.forEach((v) => {
      this.selectionToggle(v, false);
    });
  }

  // al modificarse el campo columns se llama a la funcion onRecalculate()
  @Input('columns')
  get columnas(): MaterialTableColumn[] {
    return this.columns;
  }
  set columnas(v: MaterialTableColumn[]) {
    this.columns = v;
    this.onRecalculate();
  }

  columns: MaterialTableColumn[];

  @Input()
  selection = new SelectionModel<Element>(true, []);
  row: any;
  recalculate_: EventEmitter<any>;
  recalculateSub: Subscription;
  @Input() set recalculate(value) {

    if (value) {
      this.recalculate_ = value;
      if (this.recalculateSub) { this.recalculateSub.unsubscribe(); }
      this.recalculateSub = this.recalculate_.subscribe(x => {
        this.onRecalculate();
      });
    }
  }

  @Input() sortCol: string;
  @Input() pageSize: number;
  @Input() buttons: any[];
  @Input() showPageOptions = true;
  @Input() autoPage: boolean;

  @Output() select = new EventEmitter();
  @Output() selectCell = new EventEmitter();
  @Output() dblClick = new EventEmitter();
  // @ViewChild('table') table: MatTable;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('divParent') divParent: ElementRef;


  sub: Subscription;
  sinResultados = true;
  pageSizeOptions: number[];
  sortDirecction = 'asc';
  gridWidth = 0;
  show: boolean = true;

  constructor(
    private cd: ChangeDetectorRef,
    private translateService: TranslateService,
    private sanitizer: DomSanitizer, protected themeService: ThemeService) {
    super(themeService);

  }
  ngOnInit() {
    super.ngOnInit();
    if (this.sortCol) {
      if (this.sortCol.includes('|')) {
        [this.sortCol, this.sortDirecction] = this.sortCol.split('|');
      } else {
        this.sortDirecction = 'asc';
      }
    }
    this.sortCol = (this.sortCol) ? this.sortCol : (this.columns.length) ? this.columns[0].prop : null;

    this.setPageSize();
  }

  ngAfterViewInit() {
    if (this.rows instanceof MatTableDataSource) {
      this.rows.sortingDataAccessor = (item, property) => {
        return this.getCellValueSorting(item, property);
      };
      this.sort.sortChange.subscribe((x) => {
        if (this.recalculate_) { this.recalculate_.emit(); }
      });
      if (this.pagination) {
        this.paginator.page.subscribe((x) => {
          if (this.recalculate_) { this.recalculate_.emit(); }
        });
      }

      this.rows.sort = this.sort;
      this.rows.paginator = this.paginator;
      this.rows.filterPredicate = this.filtrarGrilla();
    }
    this.paginator = this.translateService.translatePaginator(this.paginator);
    this.onRecalculate();
  }

  // actualiza las filas y el paginador, cuando ordena o pagina
  // ya que la libreria por si sola no lo hace
  updateRowsAndPaginator(index, length) {
    const self = this;
    if (this.rows instanceof MatTableDataSource) {
      if (this.paginator['_changeDetectorRef']) {
        this.paginator['_changeDetectorRef'].detectChanges();
      }
      setTimeout(function () {
        if (self.paginator.length === length) {
          self.paginator.pageIndex = index;
        } else {
          self.paginator.pageIndex = 1;
          self.paginator.firstPage();
        }
      }, 10);
    }
  }

  setPageSize() {

    if (this.pagination) {
      if (this.autoPage) {
        const parent = this.divParent.nativeElement;
        if (parent && parent.offsetHeight > 0 && this.paginator) {
          let height = parent.offsetHeight;
          if (this.filter) {
            height -= 64;
          }
          this.pageSize = parseInt((height / this.rowHeight).toFixed(0), 10) - 2;

          // si se pasa del alto le quito una fila
          if ((this.pageSize + 2) * this.rowHeight > height) {
            this.pageSize--;
          }

          this.pageSizeOptions = (this.pageSize) ?
            [(this.pageSize * 1), (this.pageSize * 2), (this.pageSize * 3), (this.pageSize * 4)] : [5, 10, 25, 100];
          this.updatePaginator();
          this.paginator._changePageSize(this.pageSize);
        } else {
          setTimeout(() => {
            this.detectChanges();
            this.setPageSize();
          }, 500);
        }
      } else {
        this.pageSize = (this.pageSize) ? this.pageSize : 25;
        this.pageSizeOptions = (this.pageSize) ?
          [(this.pageSize * 1), (this.pageSize * 2), (this.pageSize * 3), (this.pageSize * 4)] : [5, 10, 25, 100];
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(e?) {
    this.setPageSize();
  }

  /**
   * modifica la funcion de filtrado original para contemplar las columnas multinivel
   */
  private filtrarGrilla(): (data: any[], filter: string) => boolean {
    return (row: any[], filter: string) => {
      const stringColumn: string[] = [];
      for (const col of this.columns) {
        stringColumn.push(this.getCellValue(col, row));
      }
      const stringCol = stringColumn.join(' ').toLowerCase();
      return stringCol.includes(filter);
    };
  }

  ngOnDestroy() {
    this.cd.detach();
    if (this.recalculateSub) { this.recalculateSub.unsubscribe(); }
    if (this.sub) { this.sub.unsubscribe(); }
  }

  /**
   * Obtiene el valor mostrado de una celda
   * @param col
   * @param row
   */
  getCellValue(col: MaterialTableColumn, row: any) {
    let value: any = '';

    if (this.getVal(row, col.prop)) {
      value = this.getVal(row, col.prop);
    }
    if (col.cellTransform) {
      value = col.cellTransform(value, row);
    }
    return value;
  }

  /**
 * Obtiene el valor de la celda utilizado para ordenar
 * @param col
 * @param row
 */
  private getCellOrderValue(col: MaterialTableColumn, row: any) {
    let value: any = '';

    if (this.getVal(row, col.prop)) {
      value = this.getVal(row, col.prop);
    }
    if (col.cellOrder) {
      value = col.cellOrder(value, row);
    } else if (col.cellTransform) {
      value = col.cellTransform(value, row);
    }


    if (this.isValidDate(value)) {
      return this.getMomentDate(value).unix();
    } else if (!isNaN(parseInt(value.toString().replace('#', ''), 10))) {
      return parseInt(value.toString().replace('#', ''), 10);
    } else if (typeof value === 'boolean') {
      return value;
    } else {
      return value.toLowerCase();
    }

  }


  isValidDate(value) {

    const d = this.getMomentDate(value);
    if (d == null || !d.isValid()) { return false; }
    return !Number.isInteger(value) && (value.indexOf(d.format('D/M/YYYY')) >= 0
      || value.indexOf(d.format('DD/MM/YYYY')) >= 0
      || value.indexOf(d.format('D/M/YY')) >= 0
      || value.indexOf(d.format('DD/MM/YY')) >= 0
      || value.indexOf(d.format('YY-MM-DD')) >= 0
      || value.indexOf(d.format('Y-MM-DD')) >= 0
      || value.indexOf(d.format('DD-MM-YYYY')) >= 0);
  }

  /**
   * 
   */

  getMomentDate(value) {
    let d = moment(value, 'DD/MM/YYYY hh:mm:ss');
    if (d == null || !d.isValid()) {
      d = moment(value, 'Y-MM-DD hh:mm:ss');
    }
    return d;
  }




  private getCellValueSorting(row: any, path: string) {

    const col = this.columns.find(c => c.prop === path);
    if (col) {
      return this.getCellOrderValue(col, row);
    } else { return null; }


  }
  private getVal(val: any, path: string) {
    if (path.indexOf('.') > 0) {
      const partes = path.split('.');
      const key = partes.shift();
      const newPath = partes.join('.');
      if (val[key]) {
        return this.getVal(val[key], newPath);
      } else { return undefined; }
    } else {
      if (val[path]) {
        return val[path];
      } else { return undefined; }
    }
  }

  public onRecalculate() {

    this.displayedColumns = this.columns.filter(x => (!x.hidden)).map(y => y.prop);
    if (this.selectionMode === 3) { this.displayedColumns.unshift('selectionColumn'); }
    this.setGridWidth();
    this.showSinResultados();
    this.detectChanges();
    if (this.pagination) {
      this.updatePaginator();
    }
  }

  updatePaginator() {
    if (this.paginator) {
      const index = this.paginator.pageIndex;
      const length = this.paginator.length;
      this.updateRowsAndPaginator(index, length);
    }
  }

  public showSinResultados() {
    if (this.rows instanceof MatTableDataSource) {
      this.sinResultados = (this.rows.data.length === 0);
    } else if (this.rows && this.rows.length) {
      this.sinResultados = (this.rows.length === 0);
    } else {
      this.sinResultados = true;
    }
    return this.sinResultados;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.rows.filter = filterValue;
  }

  onClick(row) {
    if (this.selectionMode !== 3) {
      this.selected = row;
      this.select.emit(row);
    } else {
      this.selectionToggle(row, true);
      this.selected = this.selection.selected;
      this.select.emit(this.selected);
    }
  }

  onClickCell(col, row) {
    this.selectedColumn = col;
    this.selectCell.emit({ row: row, col: col });
    if (!col.hasClick) {
      this.onClick(row);
    }
  }



  onDblClick(row) {
    this.selected = row;
    this.dblClick.emit(row);
  }
  detectChanges() {
    if (this.cd && this.cd.detectChanges && !this.cd['destroyed']) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }

  myTrackById(a, b) {

  }

  private setGridWidth() {
    this.gridWidth = 0;
    this.columns.filter(x => (!x.hidden)).forEach(col => {
      this.gridWidth += parseInt((col.width) ? col.width.replace('px', '') : '130', 10);
    });
  }

  // #region SELECCION MULTIPLE

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {

    const numSelected = this.selection.selected.filter((r) => { return !!r; }).length;

    const numRows = this.getRowsLength();
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {

    if (this.rows instanceof MatTableDataSource && this.rows.data) {
      this.isAllSelected() ?
        this.selection.clear() :
        this.rows.data.forEach(row => this.selection.select(row));
    }
    setTimeout(() => {
      this.toogleClickSelected();
    }, 200);

  }




  getRowsLength() {
    if (this.rows instanceof MatTableDataSource && this.rows.data) {
      return this.rows.data.length;
    } else if (!(this.rows instanceof MatTableDataSource) && this.rows && this.rows.length) {
      return this.rows.length;
    }
  }

  selectionToggle(row, emitClick: boolean) {
    this.selection.toggle(row);
    if (emitClick) {
      this.toogleClickSelected();
    }
  }

  toogleClickSelected() {
    this.select.emit(this.selection.selected.filter((r) => { return !!r; }));
  }


  // #endregion


  getRowClass(row, index) {
    let seleccionado = false;
    if (this.selected === row && this.selectionMode === 1) { seleccionado = true; }
    if (this.selection.isSelected(row) && this.selectionMode === 3) { seleccionado = true; }

    return {
      'row-seleccionado': seleccionado,
      'row-par': !seleccionado && index % 2 === 0,
      'row-impar': !seleccionado && index % 2 !== 0
    };
  }

  santitizerStyle(url) {
    return this.sanitizer.bypassSecurityTrustStyle(url);
  }



}
