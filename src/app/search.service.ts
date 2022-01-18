import { Injectable,EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private dataObs$ = new Subject();

  getData() {
      return this.dataObs$;
  }

  updateData(data: string) {
      this.dataObs$.next(data);
  }

  constructor() { }
}
