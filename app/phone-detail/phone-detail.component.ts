declare var angular: angular.IAngularStatic;
import { downgradeComponent } from '@angular/upgrade/static';

import { Component } from '@angular/core';

import { Phone, PhoneData } from '../core/phone/phone.service';
import { RouteParams } from '../ajs-upgraded-providers';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'phone-detail',
  templateUrl: './phone-detail.template.html',
})
export class PhoneDetailComponent {
  phone: PhoneData;
  mainImageUrl: string;

  constructor(/*routeParams: RouteParams*/, phone: Phone, activatedRoute: ActivatedRoute) {
    /*
    phone.get(routeParams['phoneId']).subscribe(phone => {
      this.phone = phone;
      this.setImage(phone.images[0]);
    });
    */
   phone.get(activatedRoute.snapshot.paramMap.get('phoneId'))
      .subscribe((p: PhoneData) => {
        this.phone = p;
        this.setImage(p.images[0]);
      });
  }

  setImage(imageUrl: string) {
    this.mainImageUrl = imageUrl;
  }
}

angular.module('phoneDetail')
  .directive(
    'phoneDetail',
    downgradeComponent({component: PhoneDetailComponent}) as angular.IDirectiveFactory
  );