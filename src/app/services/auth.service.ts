import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokenEndpoint = 'jwt-auth/v1/token';
  meEndpoint = 'wp/v2/users/me';

  private token: string = null;
  userId: number;
  username: string;

  constructor(private http: HttpClient) { }

  isSignedIn() : boolean {
    return this.token != null;
  }

  signIn(username: string, password: string) {
    this.http.post<SignInResponse>(environment.wpBaseUrl + this.tokenEndpoint, {
      username: username,
      password: password

    }).subscribe(response => {
      console.log("[DEBUG] User was successfully logged in (" + response.user_display_name + ")");
      this.token = response.token,
      this.username = response.user_display_name
    
    }, err => {
      if(err.status == 403) {
        console.log("[DEBUG] Not authorized");
      
      } else {
        console.log("[DEBUG] Error when signing in: " + err.message);
      }
    });
  }

  signOut() {
    // todo: do something real...

    this.token = null;
  }
}

export class SignInResponse {
  token: string;
  user_display_name: string;
  user_email: string;
}