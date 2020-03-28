import { Component } from "@angular/core";
import { AuthService } from "./shop/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "Maridalen Brenneri";

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.trySignInFromStoredCredentials();

    if (!this.isSignedIn) {
      this.router.navigate(["/my-account"]);
    }
  }

  get isSignedIn() {
    return this.authService.isSignedIn;
  }
}
