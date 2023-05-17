import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PreloadService, Theming, DialogService, LoaderService, MapaService, MaterialTableColumn } from '@soflex/sisep-base';
import { ConfigService } from '../../services/config.service';
import { MenuContextualComponent } from '@soflex/sisep-base';
import { MatTableDataSource } from '@angular/material/table';
import { ThemeService } from '@soflex/sisep-base';
import { isDebuggerStatement } from 'typescript';
import { SesionService } from '@soflex/sisep-base';
import { Formatear } from '../../shared/formatear';

import { PanelAuxilio } from '../../domain/panel-auxilio';
import { PanelAuxilioService } from '../../services/panel-auxilio.service';

@Component({
  selector: 'app-panel-auxilio',
  templateUrl: './panel-auxilio.component.html',
  styleUrls: ['./panel-auxilio.component.scss']
})
export class PanelAuxilioComponent extends Theming implements OnInit {
  @ViewChild('estadoTemplate') estadoTemplate: TemplateRef<any>;

  menu: any[];
  fecha: string;
  hora: string;

  base: string;
  listaEventos: PanelAuxilio[] = [];
  puedeVerNoticias: boolean;

  dataSource: MatTableDataSource<PanelAuxilio> = new MatTableDataSource();
  cols: MaterialTableColumn[] = [];

  timeLap: number;

  constructor(private loader: LoaderService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sesionService: SesionService,
    protected themeService: ThemeService,
    private configService: ConfigService,
    private formBuilder: FormBuilder,
    private _panelAuxilioService: PanelAuxilioService,
    private dialogService: DialogService) {
    super(themeService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    
    this.puedeVerNoticias = this.sesionService.tienePermiso('AUXILIO_NOTICIAS');
    this.timeLap = this.configService.get("TIME_LAP")

    this.obtenerFechaYhora();
    const setIntervalConst: ReturnType<typeof setInterval> = setInterval(() => {
      this.detectChanges();
      this.obtenerFechaYhora()
    }, 1000)
    this.setCols();
    this.obtenerDatosEventos();
    const setIntervalListaConst: ReturnType<typeof setInterval> = setInterval(() => {
      this.detectChanges();
      this.obtenerDatosEventos()
    }, this.timeLap)
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

  obtenerDatosEventos() {
    this._panelAuxilioService.postAny(null, 'lista-panel-auxilio').subscribe((response: PanelAuxilio[]) => {
      this.listaEventos = response || [];     
      this.base = response[0].encabezado;
      this.actualizarDatosEventos();
    });
  }

  actualizarDatosEventos() {
    this.dataSource.data = this.listaEventos || [];
  }

}
