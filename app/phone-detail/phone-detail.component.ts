declare var angular: angular.IAngularStatic;
import { Phone, PhoneData } from '../core/phone/phone.service';

class PhoneDetailController {
  // Phone that the user is looking.
  // phone: any;
  phone: PhoneData;
  // URL of the currently displayed image.
  mainImageUrl: string;

  static $inject = ['$routeParams', /*'Phone'*/ phone];
  constructor($routeParams: angular.route.IRouteParamsService, /*Phone: any*/phone: Phone) {
    let phoneId = $routeParams['phoneId'];
    /*
    this.phone = Phone.get({phoneId}, (phone: any) => {
      this.setImage(phone.images[0]);
    });
    */
    phone.get(phoneId).subscribe(data => {
      this.phone = data;
      this.setImage(data.images[0]);
    });
  }

  setImage(imageUrl: string) {
    this.mainImageUrl = imageUrl;
  }
}

// Register `phoneDetail` component, along with its associated controller and template
angular.
  module('phoneDetail').
  component('phoneDetail', {
    templateUrl: 'phone-detail/phone-detail.template.html',
    controller: PhoneDetailController
  });
