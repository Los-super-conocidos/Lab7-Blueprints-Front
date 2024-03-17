  import { HttpClient } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
import { blueprintJson } from '../blueprintJson';

  @Injectable({
    providedIn: 'root'
  })
  export class BlueprintsService {

    private roomApiUrl = "http://localhost:8080/blueprints";

    constructor(private http:HttpClient) { }

    getBlueprintsByAuthor(author:string): Observable<blueprintJson[]>{
      return this.http.get<blueprintJson[]>(this.roomApiUrl+"/"+author);
    }

    getBlueprintsByNameAndAuthor (author:string,name:string): Observable<blueprintJson>{
      return this.http.get<blueprintJson>(this.roomApiUrl+"/"+author+ "/" + name);
    }

    saveOrUpdateBlueprint(blueprint: blueprintJson): Observable<blueprintJson> {
      const requestBody = { points: blueprint.points };
      return this.http.put<blueprintJson>(this.roomApiUrl+"/"+blueprint.author+ "/" + blueprint.name, requestBody);
    }
    
    addNewBlueprint(blueprint: blueprintJson): Observable<blueprintJson> {
      return this.http.post<blueprintJson>(this.roomApiUrl, blueprint);
    }

    deleteBlueprint(blueprint: blueprintJson): Observable<blueprintJson> {
      return this.http.delete<blueprintJson>(this.roomApiUrl+"/"+blueprint.author+ "/" + blueprint.name);
    }
  }
