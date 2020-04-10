import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type' : 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
};

@Injectable()
export class ProjectFetchService {

  url: string = "http://localhost:4000/projects";



  constructor(private http: HttpClient) { }

  public getData(){
    return this.http.get(this.url);
  }

  public sendAllData(data:any){
    console.log(data);
    return this.http.post<any>(this.url, {"data":data}, httpOptions);
  }
}
