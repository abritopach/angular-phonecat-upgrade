(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PhoneDetailController {
        constructor($routeParams, /*Phone: any*/ phone) {
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
        setImage(imageUrl) {
            this.mainImageUrl = imageUrl;
        }
    }
    PhoneDetailController.$inject = ['$routeParams', /*'Phone'*/ phone];
    // Register `phoneDetail` component, along with its associated controller and template
    angular.
        module('phoneDetail').
        component('phoneDetail', {
        templateUrl: 'phone-detail/phone-detail.template.html',
        controller: PhoneDetailController
    });
});
//# sourceMappingURL=phone-detail.component.js.map