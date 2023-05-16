import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SesionService } from '@soflex/sisep-base';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { SisepBaseModule } from '@soflex/sisep-base';
import { ConfigService } from './services/config.service';
import { SisepBaseConfigFactory } from './config/sisep-base-config-factory';
import { MatGridListModule } from '@angular/material/grid-list';

SisepBaseModule.forRoot({
  useFactory: SisepBaseConfigFactory,
  deps: [ConfigService]
})

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    HttpClientModule,
    MatStepperModule,
    SisepBaseModule,
    SharedModule,
    MatTableModule,
    MatGridListModule,
  ],
  providers: [
    ConfigService,
    SesionService,
    { provide: APP_INITIALIZER, useFactory: loadConfig, deps: [ConfigService], multi: true },
    { provide: LOCALE_ID, useValue: 'es-Ar' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// tslint:disable-next-line:typedef
export function loadConfig(config: ConfigService) {
  return () => config.load();
}
