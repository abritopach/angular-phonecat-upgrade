// AngularJS E2E Testing Guide:
// https://docs.angularjs.org/guide/e2e-testing
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "protractor"], factory);
    }
})(function (require, exports) {
    'use strict'; // necessary for es6 output in node
    Object.defineProperty(exports, "__esModule", { value: true });
    const protractor_1 = require("protractor");
    // Angular E2E Testing Guide:
    // https://docs.angularjs.org/guide/e2e-testing
    describe('PhoneCat Application', function () {
        it('should redirect `index.html` to `index.html#!/phones', function () {
            protractor_1.browser.get('index.html');
            protractor_1.browser.sleep(1000); // Not sure why this is needed but it is. The route change works fine.
            expect(protractor_1.browser.getCurrentUrl()).toMatch(/\/phones$/);
        });
        describe('View: Phone list', function () {
            beforeEach(function () {
                protractor_1.browser.get('index.html#!/phones');
            });
            it('should filter the phone list as a user types into the search box', function () {
                let phoneList = protractor_1.element.all(protractor_1.by.css('.phones li'));
                let query = protractor_1.element(protractor_1.by.css('input'));
                expect(phoneList.count()).toBe(20);
                query.sendKeys('nexus');
                expect(phoneList.count()).toBe(1);
                query.clear();
                query.sendKeys('motorola');
                expect(phoneList.count()).toBe(8);
            });
            it('should be possible to control phone order via the drop-down menu', function () {
                let queryField = protractor_1.element(protractor_1.by.css('input'));
                let orderSelect = protractor_1.element(protractor_1.by.css('select'));
                let nameOption = orderSelect.element(protractor_1.by.css('option[value="name"]'));
                let phoneNameColumn = protractor_1.element.all(protractor_1.by.css('.phones .name'));
                function getNames() {
                    return phoneNameColumn.map(function (elem) {
                        return elem.getText();
                    });
                }
                queryField.sendKeys('tablet'); // Let's narrow the dataset to make the assertions shorter
                expect(getNames()).toEqual([
                    'Motorola XOOM\u2122 with Wi-Fi',
                    'MOTOROLA XOOM\u2122'
                ]);
                nameOption.click();
                expect(getNames()).toEqual([
                    'MOTOROLA XOOM\u2122',
                    'Motorola XOOM\u2122 with Wi-Fi'
                ]);
            });
            it('should render phone specific links', function () {
                let query = protractor_1.element(protractor_1.by.css('input'));
                query.sendKeys('nexus');
                protractor_1.element.all(protractor_1.by.css('.phones li a')).first().click();
                protractor_1.browser.sleep(1000); // Not sure why this is needed but it is. The route change works fine.
                expect(protractor_1.browser.getCurrentUrl()).toMatch(/\/phones\/nexus-s$/);
            });
        });
        describe('View: Phone detail', function () {
            beforeEach(function () {
                protractor_1.browser.get('index.html#!/phones/nexus-s');
            });
            it('should display the `nexus-s` page', function () {
                expect(protractor_1.element(protractor_1.by.css('h1')).getText()).toBe('Nexus S');
            });
            it('should display the first phone image as the main phone image', function () {
                let mainImage = protractor_1.element(protractor_1.by.css('img.phone.selected'));
                expect(mainImage.getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
            });
            it('should swap the main image when clicking on a thumbnail image', function () {
                let mainImage = protractor_1.element(protractor_1.by.css('img.phone.selected'));
                let thumbnails = protractor_1.element.all(protractor_1.by.css('.phone-thumbs img'));
                thumbnails.get(2).click();
                expect(mainImage.getAttribute('src')).toMatch(/img\/phones\/nexus-s.2.jpg/);
                thumbnails.get(0).click();
                expect(mainImage.getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
            });
        });
    });
});
//# sourceMappingURL=scenarios.js.map