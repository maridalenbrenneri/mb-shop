import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User, RegisterUserModel } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string = null;

  userId: number;
  username: string;
  email: string;

  constructor(private http: HttpClient) { }

  registerUser(user: RegisterUserModel) {
    return this.http.post<any>(environment.mbApiBaseUrl + 'users', user);
  }

  signIn(email: string, password: string): Observable<any> {

    // this.signIn_Wordpress(email, password);
    // return null;
    return this.http.post<any>(environment.mbApiBaseUrl + 'authenticate', {
      email: email,
      password: password
    });
  }

  signOut() {
    // todo: remove token from cookie

    this.token = null;
    this.email = null;
    this.username = null;
  }

  isSignedIn(): boolean {
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

  setSignedIn(authResponse) {
    // todo: save token in cookie

    this.token = authResponse.token;
    this.email = authResponse.email;
    this.username = authResponse.givenName;
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
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
      this.username = response.user_display_name;

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
