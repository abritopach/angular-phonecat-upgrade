class PhoneListController {
    constructor(Phone) {
        this.phones = Phone.query();
        this.orderProp = 'age';
    }
}
// The dependency injection annotations are attached to the class using a static property $inject. 
// At runtime this becomes the PhoneListController.$inject property.
PhoneListController.$inject = ['Phone'];
// Register `phoneList` component, along with its associated controller and template
angular.
    module('phoneList').
    component('phoneList', {
    templateUrl: 'phone-list/phone-list.template.html',
    controller: PhoneListController
});
//# sourceMappingURL=phone-list.component.js.map