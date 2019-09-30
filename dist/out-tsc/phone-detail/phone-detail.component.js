var PhoneDetailController = /** @class */ (function () {
    function PhoneDetailController($routeParams, Phone) {
        var _this = this;
        var phoneId = $routeParams['phoneId'];
        this.phone = Phone.get({ phoneId: phoneId }, function (phone) {
            _this.setImage(phone.images[0]);
        });
    }
    PhoneDetailController.prototype.setImage = function (imageUrl) {
        this.mainImageUrl = imageUrl;
    };
    PhoneDetailController.$inject = ['$routeParams', 'Phone'];
    return PhoneDetailController;
}());
// Register `phoneDetail` component, along with its associated controller and template
angular.
    module('phoneDetail').
    component('phoneDetail', {
    templateUrl: 'phone-detail/phone-detail.template.html',
    controller: PhoneDetailController
});
//# sourceMappingURL=phone-detail.component.js.map