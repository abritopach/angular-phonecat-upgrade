# Angular-Phonecat-Upgrade

## Overview

Sample project where you migrate from AngularJS Phone Catalog to Angular (Angular 8, current version) Phone Catalog.

Angular is the name for the Angular of today and tomorrow.
AngularJS is the name for all 1.x versions of Angular.

The full migration guide can be found at https://angular.io/guide/upgrade#upgrading-from-angularjs-to-angular.

## PhoneCat Upgrade Tutorial

When performing the migration process, although the [tutorial](https://angular.io/guide/upgrade#phonecat-upgrade-tutorial) is quite detailed, code is missing in some sections of the tutorial.

So that you don't have the problems I had I leave the code in each step.

### Steps

#### Step 1: Switching to TypeScript

Install TypeScript to the project.

```bash
  npm i typescript --save-dev
```

Install type definitions for the existing libraries that you're using but that don't come with prepackaged types: AngularJS and the Jasmine unit test framework.

```bash
  npm install @types/jasmine @types/angular @types/angular-animate @types/angular-cookies @types/angular-mocks @types/angular-resource @types/angular-route @types/angular-sanitize --save-dev
```

Add a tsconfig.json in the project directory.

```bash
  {
    "compileOnSave": false,
    "compilerOptions": {
      "sourceMap": true,
      "declaration": false,
      "module": "umd",
      "moduleResolution": "node",
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "importHelpers": true,
      "target": "es2015",
      "typeRoots": [
        "node_modules/@types"
      ],
      "lib": [
        "es2018",
        "dom"
      ]
    },
    "angularCompilerOptions": {
      "fullTemplateTypeCheck": true,
      "strictInjectionParameters": true
    }
  }
```

Add some npm scripts in package.json to compile the TypeScript files to JavaScript (based on the tsconfig.json configuration file).

```bash
  "scripts": {
  "tsc": "tsc",
  "tsc:w": "tsc -w",
  ...

```

Launch the TypeScript compiler from the command line in watch mode

```bash
  npm run tsc:w
```

Next, convert your current JavaScript files into TypeScript. Show tutorial.

#### Step 2: Installing Angular

Add Angular and the other new dependencies to package.json

```bash
  ...
  "dependencies": {
    "@angular/common": "^8.2.8",
    "@angular/compiler": "^8.2.8",
    "@angular/core": "^8.2.8",
    "@angular/forms": "^8.2.8",
    "@angular/http": "~7.2.15",
    "@angular/platform-browser": "^8.2.8",
    "@angular/platform-browser-dynamic": "^8.2.8",
    "@angular/router": "^8.2.8",
    "angular-in-memory-web-api": "~0.3.0",
    "core-js": "^2.4.1",
    "rxjs": "^6.5.3",
    "systemjs": "0.19.40",
    "zone.js": "^0.10.2"
  },
  ...
```

Add systemjs.config.js to the project root directory

```bash
  /**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    // #docregion paths
    System.config({
      paths: {
        // paths serve as alias
        'npm:': '/node_modules/'
      },
      map: {
        'ng-loader': '/systemjs-angular-loader.js',
        app: '/app',
        // #enddocregion paths
        // angular bundles
        '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
        '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
        '@angular/common/http': 'npm:@angular/common/bundles/common-http.umd.js',
        '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
        '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
        '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
        '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
        '@angular/router/upgrade': 'npm:@angular/router/bundles/router-upgrade.umd.js',
        '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
        // #docregion paths
        '@angular/upgrade/static': 'npm:@angular/upgrade/bundles/upgrade-static.umd.js',
        // #enddocregion paths
  
        // other libraries
        'rxjs': 'npm:rxjs',
        'angular-in-memory-web-api': 'npm:angular-in-memory-web-api',
        'tslib': 'npm:tslib/tslib.js',
        // #docregion paths
      },
      // #enddocregion paths
  
      // packages tells the System loader how to load when no filename and/or no extension
      packages: {
        'app': {
          defaultExtension: 'js',
          meta: {
            './*.js': {
              loader: 'ng-loader'
            }
          }
        },
        'angular-in-memory-web-api': {
          main: './index.js',
          defaultExtension: 'js'
        },
        'rxjs/ajax': {main: 'index.js', defaultExtension: 'js' },
        'rxjs/operators': {main: 'index.js', defaultExtension: 'js' },
        'rxjs/testing': {main: 'index.js', defaultExtension: 'js' },
        'rxjs/websocket': {main: 'index.js', defaultExtension: 'js' },
        'rxjs': { main: 'index.js', defaultExtension: 'js' },
      }
    });
  })(this);
  
```

Add systemjs-angular-loader.js to the project root directory

```bash
  var templateUrlRegex = /templateUrl\s*:(\s*['"`](.*?)['"`]\s*)/gm;
  var stylesRegex = /styleUrls *:(\s*\[[^\]]*?\])/g;
  var stringRegex = /(['`"])((?:[^\\]\\\1|.)*?)\1/g;

module.exports.translate = function(load){
  if (load.source.indexOf('moduleId') != -1) return load;

  var url = document.createElement('a');
  url.href = load.address;

  var basePathParts = url.pathname.split('/');

  basePathParts.pop();
  var basePath = basePathParts.join('/');

  var baseHref = document.createElement('a');
  baseHref.href = this.baseURL;
  baseHref = baseHref.pathname;

  if (!baseHref.startsWith('/base/')) { // it is not karma
    basePath = basePath.replace(baseHref, '');
  }

  load.source = load.source
    .replace(templateUrlRegex, function(match, quote, url){
      var resolvedUrl = url;

      if (url.startsWith('.')) {
        resolvedUrl = basePath + url.substr(1);
      }

      return 'templateUrl: "' + resolvedUrl + '"';
    })
    .replace(stylesRegex, function(match, relativeUrls) {
      var urls = [];

      while ((match = stringRegex.exec(relativeUrls)) !== null) {
        if (match[2].startsWith('.')) {
          urls.push('"' + basePath + match[2].substr(1) + '"');
        } else {
          urls.push('"' + match[2] + '"');
        }
      }

      return "styleUrls: [" + urls.join(', ') + "]";
    });

  return load;
};

```

Once these are done, run:

```bash
  npm install
```

Move the app/index.html file to the project root directory. Then change the development server root path in package.json to also point to the project root instead of app.

```bash
  "start": "http-server ./ -a localhost -p 8000 -c-1",
```

Now you're able to serve everything from the project root to the web browser. But you do not want to have to change all the image and data paths used in the application code to match the development setup. For that reason, you'll add a <base> tag to index.html, which will cause relative URLs to be resolved back to the /app directory:

```bash
  <base href="/app/">
```

Now you can load Angular via SystemJS. You'll add the Angular polyfills and the SystemJS config to the end of the <head> section, and then you'll use System.import to load the actual application:

```bash
  <script src="/node_modules/core-js/client/shim.min.js"></script>
  <script src="/node_modules/zone.js/dist/zone.js"></script>
  <script src="/node_modules/systemjs/dist/system.src.js"></script>
  <script src="/systemjs.config.js"></script>
  <script>
    System.import('/app');
  </script>
```

Install the upgrade package via npm install @angular/upgrade --save and add a mapping for the @angular/upgrade/static package.

If you get the following error when access to http://localhost:8000 

```bash
zone.js:699 Unhandled Promise rejection: (SystemJS) Unexpected token '<'
	SyntaxError: Unexpected token '<'
	    at eval (<anonymous>)
	Evaluating http://localhost:8000/app
	Error loading http://localhost:8000/app ; Zone: <root> ; Task: Promise.then ; Value: (SystemJS) Unexpected token '<'
	SyntaxError: Unexpected token '<'
	    at eval (<anonymous>)
	Evaluating http://localhost:8000/app
	Error loading http://localhost:8000/app (SystemJS) Unexpected token '<'
	SyntaxError: Unexpected token '<'
	    at eval (<anonymous>)
	Evaluating http://localhost:8000/app
	Error loading http://localhost:8000/app
```

is due to this line of code

```bash
<script>
    System.import('/app');
  </script>
```
is solved in step 4 or comment the line for the moment // System.import('/app');

Update href in Phone List Template.

```bash
  ...
  <ul class="phones">
    <li ng-repeat="phone in $ctrl.phones | filter:$ctrl.query | orderBy:$ctrl.orderProp"
        class="thumbnail phone-list-item">
      <a href="/#!/phones/{{phone.id}}" class="thumb">
        <img ng-src="{{phone.imageUrl}}" alt="{{phone.name}}" />
      </a>
      <a href="/#!/phones/{{phone.id}}">{{phone.name}}</a>
      <p>{{phone.snippet}}</p>
    </li>
  </ul>
  ...
```

#### Step 3: Creating the AppModule

Rename app.module.ts it to app.module.ajs.ts and update the corresponding script name in the index.html.

Now create a new app.module.ts with the minimum NgModule class

```bash
  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';

  @NgModule({
    imports: [
      BrowserModule,
    ],
  })
  export class AppModule {
  }
```

#### Step 4: Bootstrapping a hybrid PhoneCat

First, remove the ng-app attribute from index.html. Then import UpgradeModule in the AppModule, and override its ngDoBootstrap method.

```bash
  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { UpgradeModule } from '@angular/upgrade/static';

  @NgModule({
    imports: [
      BrowserModule,
      UpgradeModule,
    ],
  })
  export class AppModule {
    constructor(private upgrade: UpgradeModule) { }
    ngDoBootstrap() {
      this.upgrade.bootstrap(document.documentElement, ['phonecatApp']);
    }
  }
```

Finally, bootstrap the AppModule in app/main.ts. This file has been configured as the application entrypoint in systemjs.config.js, so it is already being loaded by the browser.

```bash
  import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
  import { AppModule } from './app.module';

  platformBrowserDynamic().bootstrapModule(AppModule);
```

Modify systemjs.config.js

```bash
  ...
   // packages tells the System loader how to load when no filename and/or no extension
      packages: {
        'app': {
          main: './main.js',
          defaultExtension: 'js',
          meta: {
            './*.js': {
              loader: 'ng-loader'
            }
          }
        },
  ...
```

#### Step 5: Upgrading the Phone service

Import and add HttpClientModule to the imports array of the AppModule.

```bash
  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { UpgradeModule } from '@angular/upgrade/static';
  import { HttpClientModule } from '@angular/common/http';

  @NgModule({
    imports: [
      BrowserModule,
      UpgradeModule,
      HttpClientModule
    ],
  })
  export class AppModule {
    constructor(private upgrade: UpgradeModule) { }
    ngDoBootstrap() {
      this.upgrade.bootstrap(document.documentElement, ['phonecatApp']);
    }
  }
```

Upgrade the Phone service itself.

```bash
  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';

  declare var angular: angular.IAngularStatic;
  import { downgradeInjectable } from '@angular/upgrade/static';

  export interface PhoneData {
    name: string;
    snippet: string;
    images: string[];
  }

  @Injectable()
  export class Phone {
    constructor(private http: HttpClient) { }
    query(): Observable<PhoneData[]> {
      return this.http.get<PhoneData[]>(`phones/phones.json`);
    }
    get(id: string): Observable<PhoneData> {
      return this.http.get<PhoneData>(`phones/${id}.json`);
    }
  }

  angular.module('core.phone')
    .factory('phone', downgradeInjectable(Phone));
```

The new Phone service has the same features as the original, ngResource-based service. Because it's an Angular service, you register it with the NgModule providers.

```bash
  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { UpgradeModule } from '@angular/upgrade/static';
  import { HttpClientModule } from '@angular/common/http';
  import { Phone } from './core/phone/phone.service';

  @NgModule({
    imports: [
      BrowserModule,
      UpgradeModule,
      HttpClientModule
    ],
    providers: [
      Phone
    ]
  })
  export class AppModule {
    constructor(private upgrade: UpgradeModule) { }
    ngDoBootstrap() {
      this.upgrade.bootstrap(document.documentElement, ['phonecatApp']);
    }
  }
```

Remove the <script> tag for the phone service from index.html

At this point, you can switch the two components to use the new service instead of the old one. While you $inject it as the downgraded phone factory, it's really an instance of the Phone class and you annotate its type accordingly.

app/phone-list/phone-list.component.ts

```bash
  declare var angular: angular.IAngularStatic;
  import { Phone, PhoneData } from '../core/phone/phone.service';

  class PhoneListController {
    phones: PhoneData[];
    orderProp: string;

    static $inject = ['phone'];
    constructor(phone: Phone) {
      phone.query().subscribe(phones => {
        this.phones = phones;
      });
      this.orderProp = 'age';
    }

  }

  angular.
    module('phoneList').
    component('phoneList', {
      templateUrl: 'app/phone-list/phone-list.template.html',
      controller: PhoneListController
    });
```

app/phone-detail/phone-detail.component.ts

```bash
  declare var angular: angular.IAngularStatic;
  import { Phone, PhoneData } from '../core/phone/phone.service';

  class PhoneDetailController {
    phone: PhoneData;
    mainImageUrl: string;

    static $inject = ['$routeParams', 'phone'];
    constructor($routeParams: angular.route.IRouteParamsService, phone: Phone) {
      let phoneId = $routeParams['phoneId'];
      phone.get(phoneId).subscribe(data => {
        this.phone = data;
        this.setImage(data.images[0]);
      });
    }

    setImage(imageUrl: string) {
      this.mainImageUrl = imageUrl;
    }
  }

  angular.
    module('phoneDetail').
    component('phoneDetail', {
      templateUrl: 'phone-detail/phone-detail.template.html',
      controller: PhoneDetailController
    });
```

#### Step 6: Upgrading Components

app/phone-list/phone-list.component.ts

```bash

  declare var angular: angular.IAngularStatic;
  import { downgradeComponent } from '@angular/upgrade/static';

  import { Component } from '@angular/core';
  import { Phone, PhoneData } from '../core/phone/phone.service';

  @Component({
    selector: 'phone-list',
    templateUrl: './phone-list.template.html'
  })
  export class PhoneListComponent {
    phones: PhoneData[];
    query: string;
    orderProp: string;

    constructor(phone: Phone) {
      phone.query().subscribe(phones => {
        this.phones = phones;
      });
      this.orderProp = 'age';
    }
  
    getPhones(): PhoneData[] {
      return this.sortPhones(this.filterPhones(this.phones));
    }

    private filterPhones(phones: PhoneData[]) {
      if (phones && this.query) {
        return phones.filter(phone => {
          let name = phone.name.toLowerCase();
          let snippet = phone.snippet.toLowerCase();
          return name.indexOf(this.query) >= 0 || snippet.indexOf(this.query) >= 0;
        });
      }
      return phones;
    }

    private sortPhones(phones: PhoneData[]) {
      if (phones && this.orderProp) {
        return phones
          .slice(0) // Make a copy
          .sort((a, b) => {
            if (a[this.orderProp] < b[this.orderProp]) {
              return -1;
            } else if ([b[this.orderProp] < a[this.orderProp]]) {
              return 1;
            } else {
              return 0;
            }
          });
      }
      return phones;
    }
  }

  angular.module('phoneList')
  .directive(
    'phoneList',
    downgradeComponent({component: PhoneListComponent}) as angular.IDirectiveFactory
  );
```

app/phone-list/phone-list.template.html (search controls)

```bash
  <p>
    Search:
    <input [(ngModel)]="query" />
  </p>

  <p>
    Sort by:
    <select [(ngModel)]="orderProp">
      <option value="name">Alphabetical</option>
      <option value="age">Newest</option>
    </select>
  </p>
```

app/phone-list/phone-list.template.html (phones)

```bash
  <ul class="phones">
    <li *ngFor="let phone of getPhones()"
        class="thumbnail phone-list-item">
      <a href="/#!/phones/{{phone.id}}" class="thumb">
        <img [src]="phone.imageUrl" [alt]="phone.name" />
      </a>
      <a href="/#!/phones/{{phone.id}}" class="name">{{phone.name}}</a>
      <p>{{phone.snippet}}</p>
    </li>
  </ul>
```

app.module.ts

```bash
  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { UpgradeModule } from '@angular/upgrade/static';
  import { Phone } from './core/phone/phone.service';
  import { HttpClientModule } from '@angular/common/http';

  import { FormsModule } from '@angular/forms';
  import { PhoneListComponent } from './phone-list/phone-list.component';

  @NgModule({
  imports: [
      BrowserModule,
      UpgradeModule,
      HttpClientModule,
      FormsModule,
  ],
  providers: [
      Phone
  ],
  declarations: [
      PhoneListComponent,
    ],
    entryComponents: [
      PhoneListComponent
    ]
  })
  export class AppModule {
  constructor(private upgrade: UpgradeModule) { }
  ngDoBootstrap() {
      this.upgrade.bootstrap(document.documentElement, ['phonecatApp']);
  }
}
```

Remove the <script> tag for the phone list component from index.html.

app/phone-detail/phone-detail.component.ts

```bash
  declare var angular: angular.IAngularStatic;
  import { downgradeComponent } from '@angular/upgrade/static';

  import { Component } from '@angular/core';

  import { Phone, PhoneData } from '../core/phone/phone.service';
  import { RouteParams } from '../ajs-upgraded-providers';

  @Component({
    selector: 'phone-detail',
    templateUrl: './phone-detail.template.html',
  })
  export class PhoneDetailComponent {
    phone: PhoneData;
    mainImageUrl: string;

    constructor(routeParams: RouteParams, phone: Phone) {
      phone.get(routeParams['phoneId']).subscribe(phone => {
        this.phone = phone;
        this.setImage(phone.images[0]);
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
```

Create ajs-upgraded-providers.ts and import it in app.module.ts

app/ajs-upgraded-providers.ts

```bash
  export abstract class RouteParams {
  [key: string]: string;
  }

  export function routeParamsFactory(i: any) {
    return i.get('$routeParams');
  }

  export const routeParamsProvider = {
    provide: RouteParams,
    useFactory: routeParamsFactory,
    deps: ['$injector']
  };
```

app/app.module.ts ($routeParams)

```bash
  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { UpgradeModule } from '@angular/upgrade/static';
  import { Phone } from './core/phone/phone.service';
  import { HttpClientModule } from '@angular/common/http';

  import { FormsModule } from '@angular/forms';
  import { PhoneListComponent } from './phone-list/phone-list.component';

  import { routeParamsProvider } from './ajs-upgraded-provider';

  @NgModule({
  imports: [
      BrowserModule,
      UpgradeModule,
      HttpClientModule,
      FormsModule,
  ],
  providers: [
      Phone,
      routeParamsProvider
  ],
  declarations: [
      PhoneListComponent,
    ],
    entryComponents: [
      PhoneListComponent
    ]
  })
  export class AppModule {
  constructor(private upgrade: UpgradeModule) { }
  ngDoBootstrap() {
      this.upgrade.bootstrap(document.documentElement, ['phonecatApp']);
  }
}
```

app/phone-detail/phone-detail.template.html

```bash
  <div *ngIf="phone">
  <div class="phone-images">
    <img [src]="img" class="phone"
        [ngClass]="{'selected': img === mainImageUrl}"
        *ngFor="let img of phone.images" />
  </div>

  <h1>{{phone.name}}</h1>

  <p>{{phone.description}}</p>

  <ul class="phone-thumbs">
    <li *ngFor="let img of phone.images">
      <img [src]="img" (click)="setImage(img)" />
    </li>
  </ul>

  <ul class="specs">
    <li>
      <span>Availability and Networks</span>
      <dl>
        <dt>Availability</dt>
        <dd *ngFor="let availability of phone.availability">{{availability}}</dd>
      </dl>
    </li>
    <li>
      <span>Battery</span>
      <dl>
        <dt>Type</dt>
        <dd>{{phone.battery?.type}}</dd>
        <dt>Talk Time</dt>
        <dd>{{phone.battery?.talkTime}}</dd>
        <dt>Standby time (max)</dt>
        <dd>{{phone.battery?.standbyTime}}</dd>
      </dl>
    </li>
    <li>
      <span>Storage and Memory</span>
      <dl>
        <dt>RAM</dt>
        <dd>{{phone.storage?.ram}}</dd>
        <dt>Internal Storage</dt>
        <dd>{{phone.storage?.flash}}</dd>
      </dl>
    </li>
    <li>
      <span>Connectivity</span>
      <dl>
        <dt>Network Support</dt>
        <dd>{{phone.connectivity?.cell}}</dd>
        <dt>WiFi</dt>
        <dd>{{phone.connectivity?.wifi}}</dd>
        <dt>Bluetooth</dt>
        <dd>{{phone.connectivity?.bluetooth}}</dd>
        <dt>Infrared</dt>
        <dd>{{phone.connectivity?.infrared | checkmark}}</dd>
        <dt>GPS</dt>
        <dd>{{phone.connectivity?.gps | checkmark}}</dd>
      </dl>
    </li>
    <li>
      <span>Android</span>
      <dl>
        <dt>OS Version</dt>
        <dd>{{phone.android?.os}}</dd>
        <dt>UI</dt>
        <dd>{{phone.android?.ui}}</dd>
      </dl>
    </li>
    <li>
      <span>Size and Weight</span>
      <dl>
        <dt>Dimensions</dt>
        <dd *ngFor="let dim of phone.sizeAndWeight?.dimensions">{{dim}}</dd>
        <dt>Weight</dt>
        <dd>{{phone.sizeAndWeight?.weight}}</dd>
      </dl>
    </li>
    <li>
      <span>Display</span>
      <dl>
        <dt>Screen size</dt>
        <dd>{{phone.display?.screenSize}}</dd>
        <dt>Screen resolution</dt>
        <dd>{{phone.display?.screenResolution}}</dd>
        <dt>Touch screen</dt>
        <dd>{{phone.display?.touchScreen | checkmark}}</dd>
      </dl>
    </li>
    <li>
      <span>Hardware</span>
      <dl>
        <dt>CPU</dt>
        <dd>{{phone.hardware?.cpu}}</dd>
        <dt>USB</dt>
        <dd>{{phone.hardware?.usb}}</dd>
        <dt>Audio / headphone jack</dt>
        <dd>{{phone.hardware?.audioJack}}</dd>
        <dt>FM Radio</dt>
        <dd>{{phone.hardware?.fmRadio | checkmark}}</dd>
        <dt>Accelerometer</dt>
        <dd>{{phone.hardware?.accelerometer | checkmark}}</dd>
      </dl>
    </li>
    <li>
      <span>Camera</span>
      <dl>
        <dt>Primary</dt>
        <dd>{{phone.camera?.primary}}</dd>
        <dt>Features</dt>
        <dd>{{phone.camera?.features?.join(', ')}}</dd>
      </dl>
    </li>
    <li>
      <span>Additional Features</span>
      <dd>{{phone.additionalFeatures}}</dd>
    </li>
  </ul>
</div>
```

Add PhoneDetailComponent component to the NgModule declarations and entryComponents

```bash
  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { UpgradeModule } from '@angular/upgrade/static';
  import { Phone } from './core/phone/phone.service';
  import { HttpClientModule } from '@angular/common/http';

  import { FormsModule } from '@angular/forms';
  import { PhoneListComponent } from './phone-list/phone-list.component';

  import { routeParamsProvider } from './ajs-upgraded-provider';
  import { PhoneDetailComponent } from './phone-detail/phone-detail.component';

  @NgModule({
  imports: [
      BrowserModule,
      UpgradeModule,
      HttpClientModule,
      FormsModule,
  ],
  providers: [
      Phone,
      routeParamsProvider
  ],
  declarations: [
      PhoneListComponent,
      PhoneDetailComponent
    ],
    entryComponents: [
      PhoneListComponent,
      PhoneDetailComponent
    ]
  })
  export class AppModule {
  constructor(private upgrade: UpgradeModule) { }
  ngDoBootstrap() {
      this.upgrade.bootstrap(document.documentElement, ['phonecatApp']);
  }
}
```

The AngularJS directive had a checkmark filter. Turn that into an Angular pipe.

There is no upgrade method to convert filters into pipes. You won't miss it. It's easy to turn the filter function into an equivalent Pipe class. The implementation is the same as before, repackaged in the transform method. Rename the file to checkmark.pipe.ts to conform with Angular conventions

app/core/checkmark/checkmark.pipe.ts

```bash
  import { Pipe, PipeTransform } from '@angular/core';

  @Pipe({name: 'checkmark'})
  export class CheckmarkPipe implements PipeTransform {
    transform(input: boolean) {
      return input ? '\u2713' : '\u2718';
    }
  }
```

app/app.module.ts (checkmarkpipe)

```bash
  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { UpgradeModule } from '@angular/upgrade/static';
  import { Phone } from './core/phone/phone.service';
  import { HttpClientModule } from '@angular/common/http';

  import { FormsModule } from '@angular/forms';
  import { PhoneListComponent } from './phone-list/phone-list.component';

  import { routeParamsProvider } from './ajs-upgraded-provider';
  import { PhoneDetailComponent } from './phone-detail/phone-detail.component';

  import { CheckmarkPipe } from './core/checkmark/checkmark.pipe';

  @NgModule({
  imports: [
      BrowserModule,
      UpgradeModule,
      HttpClientModule,
      FormsModule,
  ],
  providers: [
      Phone,
      routeParamsProvider
  ],
  declarations: [
      PhoneListComponent,
      PhoneDetailComponent,
      CheckmarkPipe
    ],
    entryComponents: [
      PhoneListComponent,
      PhoneDetailComponent
    ]
  })
  export class AppModule {
  constructor(private upgrade: UpgradeModule) { }
  ngDoBootstrap() {
      this.upgrade.bootstrap(document.documentElement, ['phonecatApp']);
  }
}
```

Remove the filter <script> tag from index.html

#### Step 7: Adding The Angular Router And Bootstrap

Create a new app.component.ts file with the following AppComponent class

```bash
  import { Component } from '@angular/core';

  @Component({
    selector: 'phonecat-app',
    template: '<router-outlet></router-outlet>'
  })
  export class AppComponent { }
```

It has a simple template that only includes the <router-outlet>. This component just renders the contents of the active route and nothing else.

The selector tells Angular to plug this root component into the <phonecat-app> element on the host web page when the application launches.

Add this <phonecat-app> element to the index.html. It replaces the old AngularJS ng-view directive

index.html (body)

```bash
  <body>
    <phonecat-app></phonecat-app>
  </body>
```

app/app-routing.module.ts

```bash
  import { NgModule } from '@angular/core';
  import { Routes, RouterModule } from '@angular/router';
  import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy } from '@angular/common';

  import { PhoneDetailComponent } from './phone-detail/phone-detail.component';
  import { PhoneListComponent }   from './phone-list/phone-list.component';

  const routes: Routes = [
    { path: '', redirectTo: 'phones', pathMatch: 'full' },
    { path: 'phones',          component: PhoneListComponent },
    { path: 'phones/:phoneId', component: PhoneDetailComponent }
  ];

  @NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
    providers: [
      { provide: APP_BASE_HREF, useValue: '!' },
      { provide: LocationStrategy, useClass: HashLocationStrategy },
    ]
  })
  export class AppRoutingModule { }
```

app/app.module.ts

```bash
  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { FormsModule } from '@angular/forms';
  import { HttpClientModule } from '@angular/common/http';

  import { AppRoutingModule } from './app-routing.module';
  import { AppComponent }     from './app.component';
  import { CheckmarkPipe }    from './core/checkmark/checkmark.pipe';
  import { Phone }            from './core/phone/phone.service';
  import { PhoneDetailComponent } from './phone-detail/phone-detail.component';
  import { PhoneListComponent }   from './phone-list/phone-list.component';

  @NgModule({
    imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
      AppRoutingModule
    ],
    declarations: [
      AppComponent,
      PhoneListComponent,
      CheckmarkPipe,
      PhoneDetailComponent
    ],
    providers: [
      Phone
    ],
    bootstrap: [ AppComponent ]
  })
  export class AppModule {}
```

app/phone-list/phone-list.template.html (list with links)

```bash
  <ul class="phones">
  <li *ngFor="let phone of getPhones()"
      class="thumbnail phone-list-item">
    <a [routerLink]="['/phones', phone.id]" class="thumb">
      <img [src]="phone.imageUrl" [alt]="phone.name" />
    </a>
    <a [routerLink]="['/phones', phone.id]" class="name">{{phone.name}}</a>
    <p>{{phone.snippet}}</p>
  </li>
  </ul>
```

app/phone-detail/phone-detail.component.ts

```bash
  import { Component }      from '@angular/core';
  import { ActivatedRoute } from '@angular/router';

  import { Phone, PhoneData } from '../core/phone/phone.service';

  @Component({
    selector: 'phone-detail',
    templateUrl: './phone-detail.template.html'
  })
  export class PhoneDetailComponent {
    phone: PhoneData;
    mainImageUrl: string;

    constructor(activatedRoute: ActivatedRoute, phone: Phone) {
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
```

#### Step 8: Say Goodbye to AngularJS

main.ts

```bash
  import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

  import { AppModule } from './app.module';

  platformBrowserDynamic().bootstrapModule(AppModule);
```

Also remove any downgradeInjectable() or downgradeComponent() you find, together with the associated AngularJS factory or directive declarations.

app.module.ts

```bash
  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { FormsModule } from '@angular/forms';
  import { HttpClientModule } from '@angular/common/http';

  import { AppRoutingModule } from './app-routing.module';
  import { AppComponent }     from './app.component';
  import { CheckmarkPipe }    from './core/checkmark/checkmark.pipe';
  import { Phone }            from './core/phone/phone.service';
  import { PhoneDetailComponent } from './phone-detail/phone-detail.component';
  import { PhoneListComponent }   from './phone-list/phone-list.component';

  @NgModule({
    imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule,
      AppRoutingModule
    ],
    declarations: [
      AppComponent,
      PhoneListComponent,
      CheckmarkPipe,
      PhoneDetailComponent
    ],
    providers: [
      Phone
    ],
    bootstrap: [ AppComponent ]
  })
  export class AppModule {}
```

You may also completely remove the following files. They are AngularJS module configuration files and not needed in Angular:

app/app.module.ajs.ts
app/app.config.ts
app/core/core.module.ts
app/core/phone/phone.module.ts
app/phone-detail/phone-detail.module.ts
app/phone-list/phone-list.module.ts

The external typings for AngularJS may be uninstalled as well. The only ones you still need are for Jasmine and Angular polyfills. The @angular/upgrade package and its mapping in systemjs.config.js can also go.

```bash
  npm uninstall @angular/upgrade --save
  npm uninstall @types/angular @types/angular-animate @types/angular-cookies @types/angular-mocks @types/angular-resource @types/angular-route @types/angular-sanitize --save-dev
```

Finally, from index.html, remove all references to AngularJS scripts and jQuery. When you're done, this is what it should look like

```bash
```


## Application Directory Layout After Upgrade

```bash
aot/                     --> 
app/                     --> all the source code of the app (along with unit tests)
  lib/...                --> 3rd party bootstrap CSS library
  core/                  --> all the source code of the core module (stuff used throughout the app)
    checkmark/...        --> files for the `checkmark` filter, including TS source code, specs
    phone/...            --> files for the phone service, including TS source code, specs
  img/...                --> image files
  phone-detail/...       --> files for the `phoneDetail` component, including TS source code, HTML templates, specs
  phone-list/...         --> files for the `phoneList` component, including TS source code, HTML templates, specs
  phones/...             --> static JSON files with phone data (used to fake a backend API)
  app.css                --> default stylesheet
  app.component.ts       --> the main app component
  app.module.ts          --> the main app module

e2e-tests/               --> config and source files for e2e tests
  protractor.conf.js     --> config file for running e2e tests with Protractor
  scenarios.ts          --> e2e specs

node_modules/...         --> 3rd party libraries and development tools (fetched using `npm`)

karma.conf.js            --> config file for running unit tests with Karma
package.json             --> Node.js specific metadata, including development tools dependencies
package-lock.json        --> Npm specific metadata, including versions of installed development tools dependencies
index.html               --> app layout file (the main HTML template file of the app)
main.ts
main-aot.ts
systemjs.config.js
systemjs-angular-loader.js
tsconfig.json
```

## Original AngularJS Phone Catalog Tutorial Application


## Overview

This application takes the developer through the process of building a web-application using
AngularJS. The application is loosely based on the **Google Phone Gallery**, which no longer exists.
Here is a historical reference: [Google Phone Gallery on WayBack][google-phone-gallery]

Each tagged commit is a separate lesson teaching a single aspect of the framework.

The full tutorial can be found at https://docs.angularjs.org/tutorial.


## Prerequisites

### Git

- A good place to learn about setting up git is [here][git-setup].
- You can find documentation and download git [here][git-home].

### Node.js and Tools

- Get [Node.js][node].
- Install the tool dependencies: `npm install`


## Workings of the Application

- The application filesystem layout structure is based on the [angular-seed][angular-seed] project.
- There is no dynamic backend (no application server) for this application. Instead we fake the
  application server by fetching static JSON files.
- Read the _Development_ section at the end to familiarize yourself with running and developing
  an AngularJS application.


## Commits / Tutorial Outline

You can check out any point of the tutorial using:

```
git checkout step-?
```

To see the changes made between any two lessons use the `git diff` command:

```
git diff step-?..step-?
```

### step-0 _Bootstrapping_

- Add the 'angular.js' script.
- Add the `ngApp` directive to bootstrap the application.
- Add a simple template with an expression.

### step-1 _Static Template_

- Add a stylesheet file ('app/app.css').
- Add a static list with two phones.

### step-2 _AngularJS Templates_

- Convert the static phone list to dynamic by:
  - Creating a `PhoneListController` controller.
  - Extracting the data from HTML into the controller as an in-memory dataset.
  - Converting the static document into a template with the use of the `ngRepeat` directive.
- Add a simple unit test for the `PhoneListController` controller to show how to write tests and
  run them using Karma.

### step-3 _Components_

- Introduce components.
- Combine the controller and the template into a reusable, isolated `phoneList` component.
- Refactor the application and tests to use the `phoneList` component.

### step-4 _Directory and File Organization_

- Refactor the layout of files and directories, applying best practices and techniques that will
  make the application easier to maintain and expand in the future:
  - Put each entity in its own file.
  - Organize code by feature area (instead of by function).
  - Split code into modules that other modules can depend on.
  - Use external templates in `.html` files (instead of inline HTML strings).

### step-5 _Filtering Repeaters_

- Add a search box to demonstrate:
  - How the data-binding works on input fields.
  - How to use the `filter` filter.
  - How `ngRepeat` automatically shrinks and grows the number of phones in the view.
- Add an end-to-end test to:
  - Show how end-to-end tests are written and used.
  - Prove that the search box and the repeater are correctly wired together.

### step-6 _Two-way Data Binding_

- Add an `age` property to the phone model.
- Add a drop-down menu to control the phone list order.
- Override the default order value in controller.
- Add unit and end-to-end tests for this feature.

### step-7 _XHR & Dependency Injection_

- Replace the in-memory dataset with data loaded from the server (in the form of a static
  'phone.json' file to keep the tutorial backend agnostic):
  - The JSON data is loaded using the `$http` service.
- Demonstrate the use of `services` and `dependency injection` (DI):
  - `$http` is injected into the controller through DI.
  - Introduce DI annotation methods: `.$inject` and inline array

### step-8 _Templating Links & Images_

- Add a phone image and links to phone pages.
- Add an end-to-end test that verifies the phone links.
- Tweak the CSS to style the page just a notch.

### step-9 _Routing & Multiple Views_

- Introduce the `$route` service, which allows binding URLs to views for routing and deep-linking:
  - Add the `ngRoute` module as a dependency.
  - Configure routes for the application.
  - Use the `ngView` directive in 'index.html'.
- Create a phone list route (`/phones`):
  - Map `/phones` to the existing `phoneList` component.
- Create a phone detail route (`/phones/:phoneId`):
  - Map `/phones/:phoneId` to a new `phoneDetail` component.
  - Create a dummy `phoneDetail` component, which displays the selected phone ID.
  - Pass the `phoneId` parameter to the component's controller via `$routeParams`.

### step-10 _More Templating_

- Implement fetching data for the selected phone and rendering to the view:
  - Use `$http` in `PhoneDetailController` to fetch the phone details from a JSON file.
  - Create the template for the detail view.
- Add CSS styles to make the phone detail page look "pretty-ish".

### step-11 _Custom Filters_

- Implement a custom `checkmark` filter.
- Update the `phoneDetail` template to use the `checkmark` filter.
- Add a unit test for the `checkmark` filter.

### step-12 _Event Handlers_

- Make the thumbnail images in the phone detail view clickable:
  - Introduce a `mainImageUrl` property on `PhoneDetailController`.
  - Implement the `setImage()` method for changing the main image.
  - Use `ngClick` on the thumbnails to register a handler that changes the main image.
  - Add an end-to-end test for this feature.

### step-13 _REST and Custom Services_

- Replace `$http` with `$resource`.
- Create a custom `Phone` service that represents the RESTful client.
- Use a custom Jasmine equality tester in unit tests to ignore irrelevant properties.

### step-14 _Animations_

- Add animations to the application:
  - Animate changes to the phone list, adding, removing and reordering phones with `ngRepeat`.
  - Animate view transitions with `ngView`.
  - Animate changes to the main phone image in the phone detail view.
- Showcase three different kinds of animations:
  - CSS transition animations.
  - CSS keyframe animations.
  - JavaScript-based animations.


## Development with `angular-phonecat`

The following docs describe how you can test and develop this application further.

### Installing Dependencies

The application relies upon various JS libraries, such as AngularJS and jQuery, and Node.js tools,
such as [Karma][karma] and [Protractor][protractor]. You can install these by running:

```
npm install
```

This will also download the AngularJS files needed for the current step of the tutorial and copy
them to `app/lib`.

Most of the scripts described below will run this automatically but it doesn't do any harm to run
it whenever you like.

*Note copying the AngularJS files from `node_modules` to `app/lib` makes it easier to serve the
files by a web server.*

### Running the Application during Development

- Run `npm start`.
- Navigate your browser to [http://localhost:8000/](http://localhost:8000/) to see the application
  running.

### Unit Testing

We recommend using [Jasmine][jasmine] and [Karma][karma] for your unit tests/specs, but you are free
to use whatever works for you.

- Start Karma with `npm test`.
- A browser will start and connect to the Karma server. Chrome and Firefox are the default browsers,
  others can be captured by loading the same URL or by changing the `karma.conf.js` file.
- Karma will sit and watch your application and test JavaScript files. To run or re-run tests just
  change any of your these files.

### End-to-End Testing

We recommend using [Protractor][protractor] for end-to-end (e2e) testing.

It requires a webserver that serves the application. See the
_Running the Application during Development_ section, above.

- Serve the application with: `npm start`
- In a separate terminal/command line window run the e2e tests: `npm run protractor`.
- Protractor will execute the e2e test scripts against the web application itself. The project is
  set up to run the tests on Chrome directly. If you want to run against other browsers, you must
  modify the configuration at `e2e-tests/protractor-conf.js`.

**Note:**
Under the hood, Protractor uses the [Selenium Standalone Server][selenium], which in turn requires
the [Java Development Kit (JDK)][jdk] to be installed on your local machine. Check this by running
`java -version` from the command line.

If JDK is not already installed, you can download it [here][jdk-download].


## Application Directory Layout

```
app/                     --> all the source code of the app (along with unit tests)
  lib/...                --> 3rd party JS/CSS libraries, including AngularJS and jQuery (copied over from `node_modules/`)
  core/                  --> all the source code of the core module (stuff used throughout the app)
    checkmark/...        --> files for the `checkmark` filter, including JS source code, specs
    phone/...            --> files for the `core.phone` submodule, including JS source code, specs
    core.module.js       --> the core module
  img/...                --> image files
  phone-detail/...       --> files for the `phoneDetail` module, including JS source code, HTML templates, specs
  phone-list/...         --> files for the `phoneList` module, including JS source code, HTML templates, specs
  phones/...             --> static JSON files with phone data (used to fake a backend API)
  app.animations.css     --> hooks for running CSS animations with `ngAnimate`
  app.animations.js      --> hooks for running JS animations with `ngAnimate`
  app.config.js          --> app-wide configuration of AngularJS services
  app.css                --> default stylesheet
  app.module.js          --> the main app module
  index.html             --> app layout file (the main HTML template file of the app)

e2e-tests/               --> config and source files for e2e tests
  protractor.conf.js     --> config file for running e2e tests with Protractor
  scenarios.js           --> e2e specs

node_modules/...         --> 3rd party libraries and development tools (fetched using `npm`)

scripts/                 --> handy scripts
  private/...            --> private scripts used by the AngularJS Team to maintain this repo
  update-repo.sh         --> script for pulling down the latest version of this repo (!!! DELETES ALL CHANGES YOU HAVE MADE !!!)

karma.conf.js            --> config file for running unit tests with Karma
package.json             --> Node.js specific metadata, including development tools dependencies
package-lock.json        --> Npm specific metadata, including versions of installed development tools dependencies
```

## Tools to help with AngularJS to Angular Migrations

### ngMigration Assistant

[ngMigration Assistant](https://github.com/ellamaolson/ngMigration-Assistant) is a command-line tool that analyzes an AngularJS application and recommends a migration path. It provides statistics on the complexity, size, and patterns of an app. It outlines the necessary preparation work for migrating to Angular.

### ngMigration Forum

The new [ngMigration Forum](https://github.com/angular/ngMigration-Forum/wiki) is a community hub that provides a starting place to find information about migration paths, tools, and to consolidate some of the best information and experts from the web.

## Others AngularJS to Angular migration repositories

* https://github.com/angular/angular/tree/master/aio/content/examples/upgrade-phonecat-2-hybrid
* https://github.com/timofeysie/angular-phonecat-upgrade
* https://github.com/melxx001/angular2-phonecat-migration

## Contact

For more information on AngularJS, please check out https://angularjs.org/.


[angular-seed]: https://github.com/angular/angular-seed
[git-home]: https://git-scm.com/
[git-setup]: https://help.github.com/articles/set-up-git
[google-phone-gallery]: http://web.archive.org/web/20131215082038/http://www.android.com/devices
[jasmine]: https://jasmine.github.io/
[jdk]: https://wikipedia.org/wiki/Java_Development_Kit
[jdk-download]: http://www.oracle.com/technetwork/java/javase/downloads
[karma]: https://karma-runner.github.io/
[node]: https://nodejs.org/
[protractor]: http://www.protractortest.org/
[selenium]: http://docs.seleniumhq.org/
