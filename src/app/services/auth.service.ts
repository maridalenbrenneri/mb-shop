import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticateEndpoint = 'authenticate';
  private token: string = null;

  userId: number;
  username: string;
  user: any;

  constructor(private http: HttpClient) { }

  isSignedIn(): boolean {
    return this.token != null;
  }

  getUser() {
    return this.user;
  }

  signIn(email: string, password: string) {
    this.http.post<SignInResponse>(environment.mbApiBaseUrl + this.authenticateEndpoint, {
      email: email,
      password: password

    }).subscribe(response => {
      // todo: save token in cookie

      this.token = response.token;
      this.username = email;
      this.user = new User();
      this.user.email = response.user.email;
      this.user.givenName = response.user.givenName;
      this.user.familyName = response.user.familyName;
      this.user.role = response.user.role;

    }, err => {
      if (err.status === 401) {
        console.log('[DEBUG] Not authorized');

      } else {
        console.log('[DEBUG] Error when signing in: ' + err.message);
      }
    });
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
    this.username = null;
    this.user = null;
  }

  getToken() {
    return this.token;
  }
}

export class SignInResponse {
  token: string;
  user: any;
}

export class WordpressSignInResponse {
  token: string;
  user_display_name: string;
  user_email: string;
}
