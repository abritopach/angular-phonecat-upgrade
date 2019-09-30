import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { HttpClientModule } from '@angular/common/http';

import { Phone } from './core/phone/phone.service';

import { FormsModule } from '@angular/forms';
import { PhoneListComponent } from './phone-list/phone-list.component';

@NgModule({
    imports: [ 
        BrowserModule,
        UpgradeModule,
        HttpClientModule,
        FormsModule
    ],
    providers: [
        Phone,
    ],
    declarations: [
        PhoneListComponent,
      ],
      entryComponents: [
        PhoneListComponent,
      ]
})
export class AppModule {
    constructor(private upgrade: UpgradeModule) { }
    ngDoBootstrap() {
        this.upgrade.bootstrap(document.documentElement, ['phonecatApp'], { strictDi: true });
    }
}
