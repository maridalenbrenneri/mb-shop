import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User, RegisterUserModel } from '../models/user.model';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

const token_cookie = "mb/token";
const email_cookie = "mb/email";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string = null;
  private userId: number;
  private email: string;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  registerUser(user: RegisterUserModel) {
    return this.http.post<any>(environment.mbApiBaseUrl + 'users', user);
  }

  signIn(email: string, password: string): Observable<any> {

    return this.http.post<any>(environment.mbApiBaseUrl + 'authenticate', {
      email: email,
      password: password
    });
  }

  trySignInFromStoredCredentials() {
    let token = this.cookieService.get(token_cookie);
    let email = this.cookieService.get(email_cookie);

    if(!token || !email) {
      return;  
    } 

    this.setSignedIn({token: token, email: email}, false);

  }

  setSignedIn(authResponse, setCookie: boolean = true) {

    this.token = authResponse.token;
    this.email = authResponse.email;

    if(setCookie) {
      this.cookieService.set(token_cookie, this.token);
      this.cookieService.set(email_cookie, this.email);
    }
  }

  signOut() {

    this.token = null;
    this.email = null;

    this.cookieService.delete(token_cookie);
    this.cookieService.delete(email_cookie);
  }

  get isSignedIn(): boolean {
    return this.token != null;
  }

  getUser(): Observable<User> {
    // todo: "cache" user. how to "intercept" rxjs properly?

    return this.http.get<any>(environment.mbApiBaseUrl + 'users/me');
  }

  getUsers(): Observable<User[]> {
    return this.http.get<any[]>(environment.mbApiBaseUrl + 'users');
  }

  createUser(user: User): Observable<User> {
    return this.http.post<any>(environment.mbApiBaseUrl + 'users', user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<any>(`${environment.mbApiBaseUrl}users/${user.id}`, user);
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  get userEmail() {
    return this.email;
  }

  signIn_Wordpress(username: string, password: string) {
    const tokenEndpoint = 'jwt-auth/v1/token';
    const meEndpoint = 'wp/v2/users/me';

    this.http.post<WordpressSignInResponse>(environment.wpBaseUrl + tokenEndpoint, {
      username: username,
      password: password

    }).subscribe(response => {
      console.log('[DEBUG] User was successfully logged in (' + response.user_display_name + ')');
      this.token = response.token;

    }, err => {
      if (err.status === 403) {
        console.log('[DEBUG] Not authorized');

      } else {
        console.log('[DEBUG] Error when signing in: ' + err.message);
      }
    });
  }
}

export class WordpressSignInResponse {
  token: string;
  user_display_name: string;
  user_email: string;
}
