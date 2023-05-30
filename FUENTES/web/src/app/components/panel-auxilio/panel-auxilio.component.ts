import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder} from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Theming, DialogService, LoaderService, MaterialTableColumn } from '@soflex/sisep-base';
import { ConfigService } from '../../services/config.service';
import { MatTableDataSource } from '@angular/material/table';
import { ThemeService } from '@soflex/sisep-base';
import { SesionService } from '@soflex/sisep-base';

import { PanelAuxilio } from '../../domain/panel-auxilio';
import { PanelAuxilioService } from '../../services/panel-auxilio.service';
import { Noticia } from '../../domain/noticia';
import { NoticiaService } from '../../services/noticia.service';

export interface columnas{
  prop: string;
  name: string;
  visible: boolean;
  width: string;
}

@Component({
  selector: 'app-panel-auxilio',
  templateUrl: './panel-auxilio.component.html',
  styleUrls: ['./panel-auxilio.component.scss']
})

export class PanelAuxilioComponent extends Theming implements OnInit {
  @ViewChild('estadoTemplate') estadoTemplate: TemplateRef<any>;
  displayedColumns: string[] = ['numauxilio', 'signos', 'ubicacion', 'demora'];

  infoOnOff: boolean;
  newsOnOf: boolean;
  menu: any[];
  fecha: string;
  hora: string;
  
  base: string;
  noticiaActual: string;
  count: number = 0;

  listaEventos: PanelAuxilio[] = [];
  listaNoticias: Noticia[] = [];
  puedeVerNoticias: boolean;

  dataSource: MatTableDataSource<PanelAuxilio> = new MatTableDataSource();
  cols: MaterialTableColumn[] = [];

  timeLap: number;

  columnasPanel: columnas[];

  items: any[] =[
    {
      nroAuxilio : 13649,
      signos: "TRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVE TRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVETRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVETRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVE",
      ubicacion : "ASOCIACION ARGENTINA DE PESCA calle COMBATE DE LOS pozos 552",
      demora: "12:43:22",
      prioridad: "ROJO"
    },
    {
      nroAuxilio : "136499",
      signos: "TRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVE TRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVETRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVETRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVE",
      ubicacion : "ASOCIACION ARGENTINA DE PESCA calle COMBATE DE LOS pozos 552",
      demora: "12:43:22",
      prioridad: "VERDE"
    },
    {
      nroAuxilio : "136499",
      signos: "TRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVE TRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVETRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVETRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVE",
      ubicacion : "ASOCIACION ARGENTINA DE PESCA calle COMBATE DE LOS pozos 552",
      demora: "12:43:22",
      prioridad: "AMARILLO"
    },
    {
      nroAuxilio : "136499",
      signos: "TRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVE TRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVETRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVETRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVE",
      ubicacion : "ASOCIACION ARGENTINA DE PESCA calle COMBATE DE LOS pozos 552",
      demora: "12:43:22",
      prioridad: "COVID"
    },
    {
      nroAuxilio : "136499",
      signos: "TRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVE TRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVETRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVETRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVE",
      ubicacion : "ASOCIACION ARGENTINA DE PESCA calle COMBATE DE LOS pozos 552",
      demora: "12:43:22",
      prioridad: "AMARILLO"

    },
    {
      nroAuxilio : 13649,
      signos: "TRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVE TRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVETRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVETRAUMATISMO GRAVEFOR CAIOA DE ALTURA - TRAUMATISMO GRAVE",
      ubicacion : "ASOCIACION ARGENTINA DE PESCA calle COMBATE DE LOS pozos 552",
      demora: "12:43:22",
      prioridad: "ROJO"
    }
  ]

  constructor(
    private loader: LoaderService,
    private cd: ChangeDetectorRef,
    private sesionService: SesionService,
    protected themeService: ThemeService,
    private configService: ConfigService,
    private _panelAuxilioService: PanelAuxilioService,
    private _noticiasService: NoticiaService,
    ) {
    super(themeService);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.puedeVerNoticias = this.sesionService.tienePermiso('AUXILIO_NOTICIAS');
    this.timeLap = this.configService.get("TIME_LAP")
    this.setCols();

    this.obtenerFechaYhora();
    const setIntervalDateConst: ReturnType<typeof setInterval> = setInterval(() => {
      this.detectChanges();
      this.obtenerFechaYhora()
    }, 1000)
    
    this.obtenerDatosEventos();
    const setIntervalEventoConst: ReturnType<typeof setInterval> = setInterval(() => {
      this.detectChanges();
      this.obtenerDatosEventos()
    }, this.timeLap)

    this.obtenerNoticias();
    const setIntervalNoticiaConst: ReturnType<typeof setInterval> = setInterval(() => {
      this.detectChanges();
      this.obtenerNoticias()
    }, 60000)

    this.detectChanges();
  }

  ngAfterViewInit() {
    this.detectChanges();
  }

  isColumnVisible(column: any): boolean {
    return column.visible;
  }

  getDynamicClasses(column: any, item: any): any {
    const classes = {};
  
    // if (!isColumnVisible(column)) {
    //   classes['hidden'] = true;
    // }
  
    if (item[column.prop]) {
      classes[item[column.prop]] = true;
    }
  
    return classes;
  }

  detectChanges() {
    if (this.cd && this.cd.detectChanges && !this.cd['destroyed']) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }

  obtenerFechaYhora() {
    var date = new Date();
    this.fecha = date.toLocaleDateString('en-US');
    this.hora = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  setCols() {
    this.columnasPanel = this.configService.get("COLUMNAS_PANEL");

    this.detectChanges();
    // this.cols = [
    //   { prop: 'nroAuxilio', name: 'N° Auxilio', width: '10%' },
    //   { prop: 'signos', name: 'Signos', width: '40%' },
    //   { prop: 'ubicacion', name: 'Ubicación', width: '40%' },
    //   { prop: 'demora', name: 'Demora', width: '10%' },
    // ];  
  }

  obtenerNoticias() {
    this._noticiasService.postAny(null, 'lista-noticia').subscribe((response: Noticia[]) => {
      this.listaNoticias = response || [];
      this.noticiaActual = this.listaNoticias[this.count].noticia || "";
      if (this.count === this.listaNoticias.length) {
        this.count = 0;
      } else {
        this.count++;
      }
    })
  }

  obtenerDatosEventos() {
    this._panelAuxilioService.postAny(null, 'lista-panel-auxilio').subscribe((response: PanelAuxilio[]) => {
      this.listaEventos = response || [];
      console.log(this.listaEventos)
      this.base = response[0].encabezado || "";
      this.listaEventos.forEach((item) => {
          if( item.prioridad.toLocaleLowerCase().indexOf("ROJO".toLocaleLowerCase()) > -1){
            item.colorFila = "ROJO"
          }
          else if( item.prioridad.toLocaleLowerCase().indexOf("AMARILLO".toLocaleLowerCase()) > -1){
            item.colorFila = "AMARILLO"
          } else if( item.prioridad.toLocaleLowerCase().indexOf("VERDE".toLocaleLowerCase()) > -1){
            item.colorFila = "VERDE"
          } else {
            item.colorFila= "COVID"
          }

        item.cssClass = 'colorFila'
      })
      this.actualizarDatosEventos();
    });
  }

  actualizarDatosEventos() {
    this.dataSource.data = this.listaEventos || [];
  }

}
