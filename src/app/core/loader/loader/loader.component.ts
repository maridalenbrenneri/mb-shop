import { Component, OnInit } from '@angular/core';
import { LoaderService, LoaderState } from '../loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  show = false;

  private subscription: Subscription;
  
  constructor(private loaderService: LoaderService) { }
  
  ngOnInit() { 
    this.subscription = this.loaderService.loaderState
        .subscribe((state: LoaderState) => {
            this.show = state.show;
        });
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
