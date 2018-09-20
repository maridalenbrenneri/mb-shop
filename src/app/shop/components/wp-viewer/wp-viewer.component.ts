import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';

// import * as FrameHelper from './frame-helper';

@Component({
  selector: 'app-wp-viewer',
  templateUrl: './wp-viewer.component.html',
  styleUrls: ['./wp-viewer.component.scss']
})
export class WpViewerComponent implements OnInit {
  @Input() page: string;
  baseUrl: string = 'https://maridalenbrenneri.no/';
  src: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // component supports both input attribute and query param

    if(!this.page) {
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.setAndSanitizeSrc(params['page']);
      });
    
    } else {
      this.setAndSanitizeSrc(this.page);
    }

    console.log("[DEBUG] This crap doesn't work. :(");
    // FrameHelper.setIframeHeight("wordPressFrame");
  }

  setAndSanitizeSrc(page: string) {
    let urlToSanitize = this.baseUrl + page;
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(urlToSanitize);
  }
}
