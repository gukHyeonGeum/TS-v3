import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private events = new Map<string, Subject<any>>();
  constructor() {}
  get(key: string) {
    return this.events.get(key);
  }
  listen(key: string) {
    this.events.set(key, new Subject<any>());
    return this.get(key).asObservable()
  }
}