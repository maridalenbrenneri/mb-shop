import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string = null;

  userId: number;
  username: string;
  email: string;

  constructor(private http: HttpClient) { }

  isSignedIn(): boolean {
    return this.token != null;
  }

  getUser(): Observable<User> {
    const obs = this.http.get<any>(environment.mbApiBaseUrl + 'users/me');

    obs.subscribe(user => {}, err => {
      console.error(err);
    });

    return obs;
  }

  signIn(email: string, password: string): Observable<any> {
    const obs = this.http.post<any>(environment.mbApiBaseUrl + 'authenticate', {
      email: email,
      password: password
    });

    obs.subscribe(response => {
      // todo: save token in cookie

      this.token = response.token;
      this.email = response.email;
      this.username = response.givenName;

    }, err => {
      if (err.status === 401) {
        console.log('[DEBUG] Not authorized');

      } else {
        console.log('[DEBUG] Error when signing in: ' + err.message);
      }
    });

    return obs;
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

  signOut() {
    // todo: remove token from cookie

    this.token = null;
    this.email = null;
    this.username = null;
  }

  getToken() {
    return this.token;
  }
}

export class WordpressSignInResponse {
  token: string;
  user_display_name: string;
  user_email: string;
}
