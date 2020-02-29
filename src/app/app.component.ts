/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  email = 'testadmin@gmail.com';
  password = '12345678';
  constructor(
    private analytics: AnalyticsService,
    private seoService: SeoService,
    private service: AuthService,
    ) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
    this.login();
  }

  login() {
    const param = {
      email: this.email,
      password: this.password
    };
    this.service.authenticate(param).subscribe(
      (res) => {
        if (res['token'] != null) {
          // retreive the access token from the server
          // store the token in the localStorage
          localStorage.setItem('token', res['token']);
          this.getDataList();

        } else {
          console.log('check your credentials !!');
        }
      }
    );
  }

  getDataList() {
    this.service.getDataList().subscribe(res => {
      console.log(res);
    });
  }
}
