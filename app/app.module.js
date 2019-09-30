(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "@angular/core", "@angular/platform-browser", "@angular/upgrade/static", "@angular/common/http", "./core/phone/phone.service", "@angular/forms", "./phone-list/phone-list.component"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@angular/core");
    const platform_browser_1 = require("@angular/platform-browser");
    const static_1 = require("@angular/upgrade/static");
    const http_1 = require("@angular/common/http");
    const phone_service_1 = require("./core/phone/phone.service");
    const forms_1 = require("@angular/forms");
    const phone_list_component_1 = require("./phone-list/phone-list.component");
    let AppModule = class AppModule {
        constructor(upgrade) {
            this.upgrade = upgrade;
        }
        ngDoBootstrap() {
            this.upgrade.bootstrap(document.documentElement, ['phonecatApp'], { strictDi: true });
        }
    };
    AppModule = tslib_1.__decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                static_1.UpgradeModule,
                http_1.HttpClientModule,
                forms_1.FormsModule
            ],
            providers: [
                phone_service_1.Phone,
            ],
            declarations: [
                phone_list_component_1.PhoneListComponent,
            ],
            entryComponents: [
                phone_list_component_1.PhoneListComponent,
            ]
        }),
        tslib_1.__metadata("design:paramtypes", [static_1.UpgradeModule])
    ], AppModule);
    exports.AppModule = AppModule;
});
//# sourceMappingURL=app.module.js.map