import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-google-success',
  standalone: true,
  template: `<p>Redirecting...</p>`
})
export class GoogleSuccess implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {

      this.route.queryParams.subscribe(params => {

        const token = params['token'];

        if (token) {
          localStorage.setItem('token', token);
          this.router.navigateByUrl('/weather');
        } else {
          this.router.navigateByUrl('');
        }

      });

    }
  }
}