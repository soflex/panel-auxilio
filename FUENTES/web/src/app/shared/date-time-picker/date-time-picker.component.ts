import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { DialogService } from '@soflex/sisep-base';
import { format, compareAsc, parseISO, differenceInDays } from 'date-fns';
import * as moment from 'moment'


@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss']
})
export class DateTimePickerComponent implements OnInit, AfterViewInit {

  public CACHE_OUTPUT: string | null;
  readonly DEFAULT_FECHA_MIN = this.formatoDate('1950-01-01T00:00:00'); // 1950/01/01 00:00:00
  readonly DEFAULT_FECHA_MAX = this.formatoDate((new Date().getFullYear()) + 100 + '-12-31T23:59:59'); // Año actual + 100
  readonly DISTANCIA_MINIMA = 1; // Distancia mínima permitida en DÍAS entre fechaMin y fechaMax

  titulo = 'Fecha';
  @Input('title')
  get title(): string { return this.titulo; }
  set title(v: string) { this.titulo = v; }

  @Input() hoy: boolean;
  @Input() required: boolean;

  // fechaMinima debe venir como 'YYYYMMDD HH:MM'
  fechaMin: string;
  @Input('fechaMinima')
  get fechaMinima(): string { return this.fechaMin; }
  set fechaMinima(v: string) { this.fechaMin = v; }

  // fechaMaxima debe venir como 'YYYYMMDD HH:MM'
  fechaMax: string;
  @Input('fechaMaxima')
  get fechaMaxima(): string { return this.fechaMax; }
  set fechaMaxima(v: string) { this.fechaMax = v; }

  _model: string;
  @Input()
  set model(val: string) {
    this.modelChange.emit(val);
    this._model = val;
    if (val) {
      this.setFecha(val);
    } else if (val == '') {
      this.limpiar();
      this.changed = true;
    }
  }
  get model() {
    return this._model;
  }

  _disabled: string;
  @Input()
  set disabled(val: string) {
    this._disabled = val;
    this.setDisable();
  }
  get disabled() {
    return this._disabled;
  }

  @Output()
  modelChange: EventEmitter<string> = new EventEmitter<string>();

  _onlyDate: string;
  @Input()
  set onlyDate(val: string) {
    this._onlyDate = val;
    this.formatoFecha = !val ? 'yyyyMMdd HH:mm:ss' : 'yyyyMMdd';
  }
  get onlyDate() {
    return this._onlyDate;
  }

  

  @ViewChild('dateDia') dateDiaElement: ElementRef;
  @ViewChild('dateMes') dateMesElement: ElementRef;
  @ViewChild('dateAnio') dateAnioElement: ElementRef;
  @ViewChild('timeHoras') timeHorasElement: ElementRef;
  @ViewChild('timeMinutos') timeMinutosElement: ElementRef;
  @ViewChild('picker') picker: MatDatepicker<any>;
  @ViewChild('divTime') divTime: any;
  @ViewChild('divHoras') divHoras: any;
  @ViewChild('divMinutos') divMinutos: any;


  dDia: string;
  dMes: string;
  dAnio: string;
  tHoras: string;
  tMinutos: string;
  horas: string[] = [];
  minutos: string[] = [];
  fechaPicker: moment.Moment;
  changed: boolean;
  formatoFecha: string = 'yyyyMMdd HH:mm:ss';


  form = new FormGroup({
    fDia: new FormControl(),
    fMes: new FormControl(),
    fAnio: new FormControl(),
    fHoras: new FormControl(),
    fMinutos: new FormControl(),
    blimpiar: new FormControl()
  });

  promptAbierto = false;

  constructor(
    private dialogService: DialogService
  ) {
    this.setPlaceholder();
  }

  ngOnInit() {
    this.setDisable();
    if (this.onlyDate) {
      this.tMinutos = '00';
      this.tHoras = '00';
    }
    if (this.isValidDate(this.fechaMin) === false) { this.fechaMin = this.formatoUniversal(this.DEFAULT_FECHA_MIN); }
    if (this.isValidDate(this.fechaMax) === false) { this.fechaMax = this.formatoUniversal(this.DEFAULT_FECHA_MAX); }
    for (let i = 0; i < 24; i++) {
      this.horas.push(this.formatNumber(i));
    }
    for (let i = 0; i < 60; i++) {
      this.minutos.push(this.formatNumber(i));
    }
  }

  setDisable() {
    this.disabled ? this.form.disable() : this.form.enable();
  }

  ngAfterViewInit(): void {
    if (this.distanciaEntreFechaMinMax() < this.DISTANCIA_MINIMA) {
      this.dialogService.error('La diferencia entre la fecha mínima y máxima no puede ser inferior a ' +
        this.DISTANCIA_MINIMA + ' días.', () => {
          this.emitirSegunCacheado(null);
        });
    } else {
      if (this.model) {
        this.setFecha(this.model);
      } else if (this.hoy) {
        this.setFecha();
      }
      this.emitir();
    }
  }

  distanciaEntreFechaMinMax() {
    const min = this.formatoDate(this.fechaMin);
    const max = this.formatoDate(this.fechaMax);
    const dist = differenceInDays(max, min);
    return dist;
  }

  emitirSegunCacheado(valor) {
    if (this.CACHE_OUTPUT !== valor) {
      this.model = valor;
      this.CACHE_OUTPUT = valor;
      return true;
    }
    return false;
  }

  
  openPicker() {
    if (!this.disabled) {
      this.picker.open();
      const picker = (<any>this.picker);
      if (picker && picker._popupComponentRef && picker._popupComponentRef._component
        && picker._popupComponentRef._component._elementRef.nativeElement && !this.onlyDate) {
        const content = picker._popupComponentRef._component._elementRef.nativeElement;
        content.appendChild(this.divTime.nativeElement);
        if (parseInt(this.dDia, 10) > 0 && parseInt(this.dMes, 10) > 0 && parseInt(this.dAnio, 10) > 0) {
          const fecha = moment(this.dAnio + this.dMes + this.dDia, 'YYYYMMDD');
          this.picker.select(fecha);
        }
        setTimeout(() => {
          this.centerHora();
          this.centerMinutos();
        }, 500);
      }
    }
  }

  centerHora() {
    if (parseInt(this.tHoras, 10)) {
      const selected = this.divHoras.nativeElement.getElementsByClassName('selected-time');
      this.divHoras.nativeElement.scrollTo(0, selected[0].offsetTop - 10);
    }
  }

  centerMinutos() {
    if (parseInt(this.tMinutos, 10)) {
      const selected = this.divMinutos.nativeElement.getElementsByClassName('selected-time');
      this.divMinutos.nativeElement.scrollTo(0, selected[0].offsetTop - 10);
    }
  }

  clickHora(hora) {
    this.tHoras = hora;
    this.modelChanged(hora, 2, 'minutos');
    setTimeout(() => {
      this.centerHora();
    }, 500);
  }

  clickMinutos(minuto) {
    this.tMinutos = minuto;
    this.modelChanged(minuto, 2);
    setTimeout(() => {
      this.centerMinutos();
    }, 500);
  }

  changeFechaPicker() {
    if (this.fechaPicker) {
      const dia = this.formatNumber(this.fechaPicker.date());
      const mes = this.formatNumber(this.fechaPicker.month() + 1);
      const anio = this.formatNumber(this.fechaPicker.year());
      if (dia != this.dDia || mes != this.dMes || this.dAnio != anio) {
        this.dDia = dia;
        this.dMes = mes;
        this.dAnio = anio;
        setTimeout(() => {
          if (!(parseInt(this.tMinutos, 10) > 0 && parseInt(this.tHoras, 10)) && !this.onlyDate) {
            this.openPicker();
          } 
        }, 50);
      }
    }
  }

  emitir() {
    this.validarTodoSeparado();
    this.validarFechaMinMax();
    try {
      if (this.isSomeNull()) { throw new Error('FECHA INVALIDA'); }
      const formateada = this.formatoUniversal(this.buildFecha());
      this.emitirSegunCacheado(formateada);
    } catch (error) {
      this.emitirSegunCacheado(null);
    }
  }

  buildFecha(): Date {
    // Se construye la fecha en base a un string en formato ISO8601 → "YYYY-MM-DDTHH:MM:SS"
    const stringISO = this.formatNumber(Number(this.dAnio)) + '-' +
      this.formatNumber(Number(this.dMes)) + '-' +
      this.formatNumber(Number(this.dDia)) + 'T' +
      ((this.onlyDate) ? '00' : this.formatNumber(this.tHoras)) + ':' +
      // this.formatNumber(Number(this.tHoras)) + ':' +
      ((this.onlyDate) ? '00' : this.formatNumber(this.tMinutos));
      // this.formatNumber(Number(this.tMinutos));
    const fecha = this.formatoDate(stringISO);
    return fecha;
  }

  isValidDate(fecha: Date | string): boolean {
    if (typeof fecha === 'string') { fecha = this.formatoDate(fecha); }
    return (fecha instanceof Date) && !isNaN(Number(fecha));
  }

  formatoUniversal(fecha: Date): string {
    return format(fecha, this.formatoFecha);
  }
  formatoDate(fecha: string): Date {
    return parseISO(fecha);
  }

  setPlaceholder() {
    this.dDia = 'dd';
    this.dMes = 'mm';
    this.dAnio = 'aaaa';
    this.tHoras = 'hh';
    this.tMinutos = 'mm';
  }

  setFecha(f?: string) {
    if (f) {
      this.changed = true;
    }
    const fecha = f ? moment(f, 'YYYYMMDD HH:mm') : moment();
    this.dDia = this.formatNumber(fecha.date());
    this.dMes = this.formatNumber(fecha.month() + 1);
    this.dAnio = this.formatNumber(fecha.year(), 4);
    this.tHoras = (this.onlyDate) ? '00' : this.formatNumber(fecha.hours());
    this.tMinutos = (this.onlyDate) ? '00' : this.formatNumber(fecha.minutes());
  }

  formatNumber(num: (number | string), len = 2): string {
    return (num !== null) ? num.toString().padStart(len, '0') : null;
  }

  modelChanged(value, max, siguiente = null) {
    if (value?.length >= max) { this.focusNext(siguiente); }
  }

  tabular(e, siguiente = null) {
    if (e?.key !== 'Enter') { return; }
    this.focusNext(siguiente);
  }

  focusNext(siguiente) {
    const elem = siguiente === 'dia' ? this.dateDiaElement :
      siguiente === 'mes' ? this.dateMesElement :
        siguiente === 'anio' ? this.dateAnioElement :
          siguiente === 'horas' ? this.timeHorasElement :
            siguiente === 'minutos' ? this.timeMinutosElement : null;
    if (typeof elem !== 'undefined') {
      elem?.nativeElement?.focus();
      this.emitir();
    }
  }

  pararPropagacion(e) {
    e.stopPropagation();
  }

  validarTodoSeparado() {
    let ddia = this.dDia === 'dd' ? null : isNaN(Number(this.dDia)) ? 1 : Number(this.dDia);
    let dmes = this.dMes === 'mm' ? null : isNaN(Number(this.dMes)) ? 1 : Number(this.dMes);
    let danio = this.dAnio === 'aaaa' ? null : isNaN(Number(this.dAnio)) ? 0 : Number(this.dAnio);
    const anioMIN = this.formatoDate(this.fechaMin).getFullYear();
    const anioMAX = this.formatoDate(this.fechaMax).getFullYear();
    let thor = this.tHoras === 'hh' ? null : isNaN(Number(this.tHoras)) ? 0 : Number(this.tHoras);
    let tmin = this.tMinutos === 'mm' ? null : isNaN(Number(this.tMinutos)) ? 0 : Number(this.tMinutos);

    if (ddia !== null) { ddia = (ddia < 1) ? 1 : (ddia > 31) ? 31 : ddia; }
    if (dmes !== null) { dmes = (dmes < 1) ? 1 : (dmes > 12) ? 12 : dmes; }
    if (danio !== null) {
      danio = (danio < anioMIN) ? anioMIN :
        (danio > anioMAX) ? anioMAX : danio;
    } // Corrige automaticamente el anio
    if (thor !== null) { thor = (thor > 24) ? 0 : thor; }
    if (tmin !== null) { tmin = (tmin > 59) ? (tmin - 60) : tmin; }

    if (ddia !== null) { this.dDia = this.formatNumber(ddia); }
    if (dmes !== null) { this.dMes = this.formatNumber(dmes); }
    if (danio !== null) { this.dAnio = this.formatNumber(danio, 4); }
    if (thor !== null) { this.tHoras = this.formatNumber(thor); }
    if (tmin !== null) { this.tMinutos = this.formatNumber(tmin); }
  }


  validarFechaMinMax() {
    const fecha = this.buildFecha();
    const res1 = compareAsc(fecha, this.formatoDate(this.fechaMin));
    const res2 = compareAsc(this.formatoDate(this.fechaMax), fecha);
    if (res1 === -1 && !this.promptAbierto) {
      this.picker.close();
      this.dialogService.error('La fecha elegida no puede ser anterior a:\n' + this.formatoDate(this.fechaMin).toLocaleString(),
        () => {
          this.limpiar();
          this.dateDiaElement?.nativeElement?.focus();
          this.promptAbierto = false;
        });
      this.promptAbierto = true;
    }
    if (res2 === -1 && !this.promptAbierto) {
      this.picker.close();
      this.dialogService.error('La fecha elegida no puede ser posterior a:\n' + this.formatoDate(this.fechaMax).toLocaleString(),
        () => {
          this.limpiar();
          this.dateDiaElement?.nativeElement?.focus();
          this.promptAbierto = false;
        });
      this.promptAbierto = true;
    }
  }

  resaltar(e) {
    e?.target?.select();
  }

  limpiar(event?) {
    if (event) {
      event.stopPropagation();
    }
    this.setPlaceholder();
    this.emitirSegunCacheado(null);
    this.fechaPicker = null;
    if (!event) {
      setTimeout(() => {
        this.openPicker();
      }, 50);
    }
  }

  isAllNull(): boolean {
    return (this.dDia === null || this.dDia === 'dd') &&
      (this.dMes === null || this.dMes === 'mm') &&
      (this.dAnio === null || this.dAnio === 'aaaa') &&
      (this.tHoras === null || this.tHoras === 'hh') &&
      (this.tMinutos === null || this.tMinutos === 'mm');
  }

  isSomeNull(): boolean {
    return (this.dDia === null || this.dDia === 'dd') ||
      (this.dMes === null || this.dMes === 'mm') ||
      (this.dAnio === null || this.dAnio === 'aaaa') ||
      (!this.onlyDate && (this.tHoras === null || this.tHoras === 'hh')) ||
      (!this.onlyDate && (this.tMinutos === null || this.tMinutos === 'mm'));
  }
}
