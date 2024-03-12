import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlueprintsService {

  private roomApiUrl = "http://localhost:8080/blueprints";

  constructor(private http:HttpClient) { }

  getBlueprintsByAuthor(author:string): Observable<any>{
    return this.http.get<any>(this.roomApiUrl+"/"+author);
  }

  getBlueprint(author:string,name:string): Observable<any>{
    return this.http.get<any>(this.roomApiUrl+"/"+author+ "/" + name);
  }
}
