/*
declare var angular: angular.IAngularStatic;
import { Phone, PhoneData } from '../core/phone/phone.service';

class PhoneListController {
  // phones: any[];
  phones: PhoneData[];
  orderProp: string;
  // query: string;

  // The dependency injection annotations are attached to the class using a static property $inject.
  // At runtime this becomes the PhoneListController.$inject property.
  // static $inject = ['Phone'];
  static $inject = ['phone'];
  // constructor(Phone: any) {
  constructor(phone: Phone) {
    // this.phones = Phone.query();
    phone.query().subscribe(phones => {
      this.phones = phones;
    });
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
*/
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "@angular/core", "../core/phone/phone.service", "@angular/upgrade/static"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const phone_service_1 = require("../core/phone/phone.service");
    const static_1 = require("@angular/upgrade/static");
    let PhoneListComponent = class PhoneListComponent {
        constructor(phone) {
            phone.query().subscribe(phones => {
                this.phones = phones;
            });
            this.orderProp = 'age';
        }
        getPhones() {
            return this.sortPhones(this.filterPhones(this.phones));
        }
        filterPhones(phones) {
            if (phones && this.query) {
                return phones.filter(phone => {
                    let name = phone.name.toLowerCase();
                    let snippet = phone.snippet.toLowerCase();
                    return name.indexOf(this.query) >= 0 || snippet.indexOf(this.query) >= 0;
                });
            }
            return phones;
        }
        sortPhones(phones) {
            if (phones && this.orderProp) {
                return phones
                    .slice(0) // Make a copy
                    .sort((a, b) => {
                    if (a[this.orderProp] < b[this.orderProp]) {
                        return -1;
                    }
                    else if ([b[this.orderProp] < a[this.orderProp]]) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
            }
            return phones;
        }
    };
    PhoneListComponent = tslib_1.__decorate([
        core_1.Component({
            selector: 'phone-list',
            templateUrl: './phone-list.template.html'
        }),
        tslib_1.__metadata("design:paramtypes", [phone_service_1.Phone])
    ], PhoneListComponent);
    exports.PhoneListComponent = PhoneListComponent;
    angular.module('phoneList')
        .directive('phoneList', static_1.downgradeComponent({ component: PhoneListComponent }));
});
//# sourceMappingURL=phone-list.component.js.map