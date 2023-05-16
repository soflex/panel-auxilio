import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { Theming } from '@soflex/sisep-base';
import { SesionService } from '@soflex/sisep-base';
import { ThemeService } from '@soflex/sisep-base';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends Theming implements OnInit {

  puedeVerAdmin: boolean;
  puedeVerDerivaciones: boolean;
  puedeVerTraslaos: boolean;
  puedeVerPlNegativas: boolean;
  puedeVerPtlGuardia: boolean;

  constructor(
    protected themeService: ThemeService, 
    private sesionService: SesionService,
    private router: Router,
    private cd: ChangeDetectorRef,) { 
    super(themeService);
  }

  ngOnInit(): void {
    super.ngOnInit(); 
    this.detectChanges();

    this.puedeVerAdmin = this.sesionService.tienePermiso('TRASLADO_MENU_ADMIN');
    this.puedeVerDerivaciones = this.sesionService.tienePermiso('TRASLADO_MENU_DERIVACION');
    this.puedeVerTraslaos = this.sesionService.tienePermiso('TRASLADO_MENU_TRASLADO');
    this.puedeVerPlNegativas = this.sesionService.tienePermiso('TRASLADO_MENU_PLANILLA');
    this.puedeVerPtlGuardia = this.sesionService.tienePermiso('TRASLADO_MENU_PLANTEL');
  }

  verAdmin(){
    this.detectChanges();
    const url = '/abm';
    this.router.navigateByUrl(url);
  }

  verDerivaciones(){
    this.detectChanges();
    const url = '/lista-derivacion';
    this.router.navigateByUrl(url);
  }

  verTraslados(){
    this.detectChanges();
    const url = '/lista-traslado';
    this.router.navigateByUrl(url);
  }

  verPntNegativas(){
    this.detectChanges();
    const url = '/lista-planilla-negativa';
    this.router.navigateByUrl(url);
  }

  verPnlGuardia() {
    this.detectChanges();
    const url = '/lista-plantel-guardia';
    this.router.navigateByUrl(url);
  }



  detectChanges() {
    if (this.cd && this.cd.detectChanges && !this.cd['destroyed']) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }    
  }

}
