import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  stats: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    
    this.http.get<any>(environment.mbApiBaseUrl + 'admin/stats').subscribe(stats => {
      this.stats = stats;
    });
  }
}
