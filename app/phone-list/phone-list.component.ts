class PhoneListController {
  phones: any[];
  orderProp: string;
  query: string;

  // The dependency injection annotations are attached to the class using a static property $inject. 
  // At runtime this becomes the PhoneListController.$inject property.
  static $inject = ['Phone'];
  constructor(Phone: any) {
    this.phones = Phone.query();
    this.orderProp = 'age';
  }

}


// Register `phoneList` component, along with its associated controller and template
angular.
  module('phoneList').
  component('phoneList', {
    templateUrl: 'phone-list/phone-list.template.html',
    controller: PhoneListController
  });
