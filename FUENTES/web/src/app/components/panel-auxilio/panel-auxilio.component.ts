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

  listaEventos: any[] = [];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  cols: MaterialTableColumn[] = [];

  constructor(private preloadService: PreloadService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sesionService: SesionService,
    protected themeService: ThemeService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService) {
    super(themeService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.obtenerFechaYhora();
    const setIntervalConst: ReturnType<typeof setInterval> = setInterval(() => {
      this.detectChanges();
      this.obtenerFechaYhora()
    }, 1000)
    this.setCols();
    this.obtenerDatosEventos();
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
    this.hora = date.toLocaleTimeString('en-US');
  }

  setCols() {
    this.detectChanges();
    this.cols = [
      { prop: 'trasFechaCreacion', name: 'Dato 1', width: '20%', cellTransform: Formatear.fecha },
      { prop: 'trasRealizadoGFH', name: 'Dato 2', width: '20%', cellTransform: Formatear.fecha },
      { prop: 'estaDescripcion', name: 'Dato 3', width: '20%', cellTemplate: this.estadoTemplate },
      { prop: 'trasPacienteNombre', name: 'Dato 4', width: '20%' },
      { prop: 'trasPacienteApellido', name: 'Dato 5', width: '20%' },

    ];
  }

  obtenerDatosEventos() {
    
    this.actualizarDatosEventos();

  }

  actualizarDatosEventos() {
    this.dataSource.data = this.listaEventos || [];
  }

}
