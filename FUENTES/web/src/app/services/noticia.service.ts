import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { ApiService, ApiConfigService } from '@soflex/sisep-base';
import { Noticia } from '../domain/noticia';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoticiaService extends ApiService<Noticia> {

  selected: BehaviorSubject<Noticia> = new BehaviorSubject<Noticia>(null);
  collection: BehaviorSubject<Noticia[]> = new BehaviorSubject<Noticia[]>(null);

  constructor(
      protected http: HttpClient,
      protected configService: ConfigService,
      private apiConfigService: ApiConfigService
  ) {
      super(http, apiConfigService.create(Noticia, 'noticia', 'default', true, true));
  }

  getValue() {
      return this.selected.getValue();
  }

  setValue(x: Noticia) {
      this.selected.next(x);
  }

  getCollection() {
      return this.collection.getValue();
  }

  setCollection(x: Noticia[]) {
      this.collection.next(x);
  }
}


