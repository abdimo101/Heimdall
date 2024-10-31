import {inject, Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserDetails} from "../interfaces/UserDetails";
import {User} from "../interfaces/User.interface";

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {

  private apiURL = "http://localhost:8082/api/users";
  private header = this.createHeader();
  http = inject(HttpClient)

  constructor() {
    super()
  }
  checkAndCreateUser()
  {
    return this.http.get(this.apiURL + "/verify", { headers: this.header })
  }

  checkUserExists(body: String)
  {
    const plainText = new HttpHeaders({
      'Content-Type': 'text/plain',
      'Authorization': `Bearer ` + this.token
    });
    return this.http.post(this.apiURL + "/exists", body, { headers: plainText })
  }

  getSingleUserDetails(id: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(this.apiURL + '/details/' + id, { headers: this.header });
}
  searchUsers(query: string): Observable<[User]> {
    return this.http.post<[User]>(this.apiURL + "/search", JSON.stringify({query: query}), {headers: this.header})
  }
  getUserByID(id: String): Observable<User> {
    return this.http.get<User>(this.apiURL + "/id/" + id, { headers: this.header })
  }
  getUserByEmail(email: String): Observable<User> {
    return this.http.get<User>(this.apiURL + "/" + email, { headers: this.header })
  }
  getOwnUser(): Observable<User> {
    return this.http.get<User>(this.apiURL + "/my", { headers: this.header })
  }
}
