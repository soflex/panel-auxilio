import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { SesionService } from '@soflex/sisep-base';
import { PanelAuxilioComponent } from './components/panel-auxilio/panel-auxilio.component';

const routes: Routes = [
  { path: '',  redirectTo: 'panel-auxilio', pathMatch: 'full' /* , canActivate: [AppGuard]  */ },
  
  { path: 'panel-auxilio', component: PanelAuxilioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

