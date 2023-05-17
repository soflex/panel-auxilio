import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { ApiService, ApiConfigService } from '@soflex/sisep-base';
import { PanelAuxilio } from '../domain/panel-auxilio';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelAuxilioService extends ApiService<PanelAuxilio> {

  selected: BehaviorSubject<PanelAuxilio> = new BehaviorSubject<PanelAuxilio>(null);
  collection: BehaviorSubject<PanelAuxilio[]> = new BehaviorSubject<PanelAuxilio[]>(null);

  constructor(
      protected http: HttpClient,
      protected configService: ConfigService,
      private apiConfigService: ApiConfigService
  ) {
      super(http, apiConfigService.create(PanelAuxilio, 'panel-auxilio', 'default', true, true));
  }

  getValue() {
      return this.selected.getValue();
  }

  setValue(x: PanelAuxilio) {
      this.selected.next(x);
  }

  getCollection() {
      return this.collection.getValue();
  }

  setCollection(x: PanelAuxilio[]) {
      this.collection.next(x);
  }
}


