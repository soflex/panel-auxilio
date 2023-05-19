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

  constructor(private loader: LoaderService,
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
    this.detectChanges();
    this.cols = [
      { prop: 'nroAuxilio', name: 'N° Auxilio', width: '10%' },
      { prop: 'signos', name: 'Signos', width: '40%' },
      { prop: 'ubicacion', name: 'Ubicación', width: '40%' },
      { prop: 'demora', name: 'Demora', width: '10%' },
    ];
  }

  obtenerNoticias() {
    this._noticiasService.postAny(null, 'lista-noticia').subscribe((response: Noticia[]) => {
      this.listaNoticias = response || [];      
      this.noticiaActual = this.listaNoticias[this.count].noticia;
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
      this.base = response[0].encabezado;
      // this.listaEventos.forEach((item) => {
      //   item.cssClass = 'colorFila'
      // })
      this.actualizarDatosEventos();
    });
  }

  actualizarDatosEventos() {
    this.dataSource.data = this.listaEventos || [];
  }

}
