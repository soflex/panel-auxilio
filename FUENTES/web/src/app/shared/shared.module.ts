import { MaterialModule, SisepBaseModule } from '@soflex/sisep-base';
import { SisepBaseConfigFactory } from '../config/sisep-base-config-factory';
import { ConfigService } from '../services/config.service';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MovableModule } from '@soflex/ventana-flotante';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MaterialTableComponent } from './material-table/material-table.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

import { MenuComponent } from './menu/menu.component';

// ======================== OTROS ========================================================================
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';
// ======================== GENERAL =============================================================
import { PanelAuxilioComponent } from '../components/panel-auxilio/panel-auxilio.component';
import { TranslateService } from '../services/translate-service.service';


registerLocaleData(localeEsAr, 'es-Ar');

@NgModule({
    declarations: [
        MaterialTableComponent,
        MenuComponent,
        PanelAuxilioComponent,
        DateTimePickerComponent,
    ],
    imports: [
        CommonModule,
        SisepBaseModule.forRoot({
            useFactory: SisepBaseConfigFactory,
            deps: [ConfigService]
        }),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        NgxMatFileInputModule,
        MatTabsModule,
        MatStepperModule,
        MatAutocompleteModule,
        MaterialModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatRadioModule
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        MaterialTableComponent,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatRadioModule,
        MatTabsModule,
        NgSelectModule
    ],
    providers: [
        ConfigService,
        TranslateService
    ],
    entryComponents: [
        PanelAuxilioComponent
    ]
})
export class SharedModule { }
