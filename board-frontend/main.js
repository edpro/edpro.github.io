(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/api.service.ts":
/*!********************************!*\
  !*** ./src/app/api.service.ts ***!
  \********************************/
/*! exports provided: ApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiService", function() { return ApiService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _msg_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./msg.service */ "./src/app/msg.service.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ApiService = /** @class */ (function () {
    // private url = "http://127.0.0.1:8001";
    function ApiService(http, msg) {
        this.http = http;
        this.msg = msg;
        this.url = "http://8.12.16.153:8000";
    }
    ApiService.prototype.getInstances = function () {
        return this.http.get(this.url + "/api/instances");
    };
    ApiService.prototype.getStat = function (id) {
        return this.http.get(this.url + "/api/stat/" + id);
    };
    ApiService.prototype.log = function (message) {
        this.msg.add('[InstService] ' + message);
    };
    ApiService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({ providedIn: 'root' }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"],
            _msg_service__WEBPACK_IMPORTED_MODULE_1__["MsgService"]])
    ], ApiService);
    return ApiService;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _root_root_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./root/root.component */ "./src/app/root/root.component.ts");
/* harmony import */ var _inst_inst_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./inst/inst.component */ "./src/app/inst/inst.component.ts");
/* harmony import */ var _formatting__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./formatting */ "./src/app/formatting.ts");
/* harmony import */ var _stat_stat_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./stat/stat.component */ "./src/app/stat/stat.component.ts");
/* harmony import */ var _msg_msg_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./msg/msg.component */ "./src/app/msg/msg.component.ts");
/* harmony import */ var _routing_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./routing.module */ "./src/app/routing.module.ts");
/* harmony import */ var _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./dashboard/dashboard.component */ "./src/app/dashboard/dashboard.component.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};











var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _root_root_component__WEBPACK_IMPORTED_MODULE_3__["RootComponent"],
                _inst_inst_component__WEBPACK_IMPORTED_MODULE_4__["InstComponent"],
                _formatting__WEBPACK_IMPORTED_MODULE_5__["DateFormatPipe"],
                _formatting__WEBPACK_IMPORTED_MODULE_5__["DateTimeFormatPipe"],
                _stat_stat_component__WEBPACK_IMPORTED_MODULE_6__["StatComponent"],
                _msg_msg_component__WEBPACK_IMPORTED_MODULE_7__["MsgComponent"],
                _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_9__["DashboardComponent"],
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormsModule"],
                _routing_module__WEBPACK_IMPORTED_MODULE_8__["RoutingModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_10__["HttpClientModule"],
            ],
            providers: [],
            bootstrap: [_root_root_component__WEBPACK_IMPORTED_MODULE_3__["RootComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/dashboard/dashboard.component.css":
/*!***************************************************!*\
  !*** ./src/app/dashboard/dashboard.component.css ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/dashboard/dashboard.component.html":
/*!****************************************************!*\
  !*** ./src/app/dashboard/dashboard.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2>Dashboard:</h2>\n<div>\n</div>\n"

/***/ }),

/***/ "./src/app/dashboard/dashboard.component.ts":
/*!**************************************************!*\
  !*** ./src/app/dashboard/dashboard.component.ts ***!
  \**************************************************/
/*! exports provided: DashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardComponent", function() { return DashboardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DashboardComponent = /** @class */ (function () {
    function DashboardComponent() {
    }
    DashboardComponent.prototype.ngOnInit = function () {
    };
    DashboardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-dashboard',
            template: __webpack_require__(/*! ./dashboard.component.html */ "./src/app/dashboard/dashboard.component.html"),
            styles: [__webpack_require__(/*! ./dashboard.component.css */ "./src/app/dashboard/dashboard.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], DashboardComponent);
    return DashboardComponent;
}());



/***/ }),

/***/ "./src/app/formatting.ts":
/*!*******************************!*\
  !*** ./src/app/formatting.ts ***!
  \*******************************/
/*! exports provided: DateFormatPipe, DateTimeFormatPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DateFormatPipe", function() { return DateFormatPipe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DateTimeFormatPipe", function() { return DateTimeFormatPipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var D_FMT = 'dd-MMM-yyyy';
var DT_FMT = D_FMT + " hh:mm";
var DateFormatPipe = /** @class */ (function (_super) {
    __extends(DateFormatPipe, _super);
    function DateFormatPipe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateFormatPipe.prototype.transform = function (value, args) {
        return _super.prototype.transform.call(this, value, D_FMT);
    };
    DateFormatPipe = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Pipe"])({ name: 'dd' })
    ], DateFormatPipe);
    return DateFormatPipe;
}(_angular_common__WEBPACK_IMPORTED_MODULE_1__["DatePipe"]));

var DateTimeFormatPipe = /** @class */ (function (_super) {
    __extends(DateTimeFormatPipe, _super);
    function DateTimeFormatPipe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateTimeFormatPipe.prototype.transform = function (value, args) {
        return _super.prototype.transform.call(this, value, DT_FMT);
    };
    DateTimeFormatPipe = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Pipe"])({ name: 'dt' })
    ], DateTimeFormatPipe);
    return DateTimeFormatPipe;
}(_angular_common__WEBPACK_IMPORTED_MODULE_1__["DatePipe"]));



/***/ }),

/***/ "./src/app/inst/inst.component.css":
/*!*****************************************!*\
  !*** ./src/app/inst/inst.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/* instComponent's private CSS styles */\r\n.inst {\r\n\tmargin: 0 0 2em 0;\r\n\tlist-style-type: none;\r\n\tpadding: 0;\r\n}\r\n.inst li {\r\n\tposition: relative;\r\n\tcursor: pointer;\r\n\tbackground-color: #EEE;\r\n\tmargin: .5em;\r\n\tpadding: .3em 0;\r\n\theight: 1.6em;\r\n\tborder-radius: 4px;\r\n}\r\n.inst li:hover {\r\n\tcolor: #607D8B;\r\n\tbackground-color: #DDD;\r\n}\r\n.inst .text {\r\n\tposition: relative;\r\n\ttop: -3px;\r\n}\r\n.inst a {\r\n\tcolor: #888;\r\n\ttext-decoration: none;\r\n\tposition: relative;\r\n\tdisplay: block;\r\n}\r\n.inst a:hover {\r\n\tcolor:#607D8B;\r\n}\r\n.inst .badge {\r\n\tdisplay: inline-block;\r\n\tfont-size: small;\r\n\tcolor: white;\r\n\tpadding: 0.8em 0.7em 0 0.7em;\r\n\tbackground-color: #607D8B;\r\n\tline-height: 1em;\r\n\tposition: relative;\r\n\tleft: -1px;\r\n\ttop: -4px;\r\n\theight: 1.8em;\r\n\tmin-width: 16px;\r\n\ttext-align: right;\r\n\tmargin-right: .8em;\r\n\tborder-radius: 4px 0 0 4px;\r\n}\r\n"

/***/ }),

/***/ "./src/app/inst/inst.component.html":
/*!******************************************!*\
  !*** ./src/app/inst/inst.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2>Instances:</h2>\n\n<ul class=\"inst\">\n\t<li *ngFor=\"let inst of instances\">\n\t\t<a routerLink=\"/stat/{{inst.cli_id}}\">\n\t\t\t<span class=\"badge\">{{inst.cli_id | slice:0:8}}</span>\n\t\t\t<span class=\"text\">{{inst.cli_name}} | {{inst.cli_version}} | {{inst.created_at | dd}} |\t{{inst.updated_at | dt}}</span>\n\t\t</a>\n\t</li>\n</ul>\n\n"

/***/ }),

/***/ "./src/app/inst/inst.component.ts":
/*!****************************************!*\
  !*** ./src/app/inst/inst.component.ts ***!
  \****************************************/
/*! exports provided: InstComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InstComponent", function() { return InstComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var InstComponent = /** @class */ (function () {
    function InstComponent(instService) {
        this.instService = instService;
    }
    InstComponent.prototype.ngOnInit = function () {
        this.getInstances();
    };
    InstComponent.prototype.getInstances = function () {
        var _this = this;
        this.instService
            .getInstances()
            .subscribe(function (it) { return _this.instances = it; });
    };
    InstComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-inst',
            template: __webpack_require__(/*! ./inst.component.html */ "./src/app/inst/inst.component.html"),
            styles: [__webpack_require__(/*! ./inst.component.css */ "./src/app/inst/inst.component.css")]
        }),
        __metadata("design:paramtypes", [_api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"]])
    ], InstComponent);
    return InstComponent;
}());



/***/ }),

/***/ "./src/app/msg.service.ts":
/*!********************************!*\
  !*** ./src/app/msg.service.ts ***!
  \********************************/
/*! exports provided: MsgService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MsgService", function() { return MsgService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var MsgService = /** @class */ (function () {
    function MsgService() {
        this.messages = [];
    }
    MsgService.prototype.add = function (message) {
        this.messages.push(message);
    };
    MsgService.prototype.clear = function () {
        this.messages = [];
    };
    MsgService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({ providedIn: 'root' })
    ], MsgService);
    return MsgService;
}());



/***/ }),

/***/ "./src/app/msg/msg.component.css":
/*!***************************************!*\
  !*** ./src/app/msg/msg.component.css ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/* MessagesComponent's private CSS styles */\r\nh2 {\r\n\tcolor: red;\r\n\tfont-family: Arial, Helvetica, sans-serif;\r\n\tfont-weight: lighter;\r\n}\r\nbody {\r\n\tmargin: 2em;\r\n}\r\nbody, input[text], button {\r\n\tcolor: crimson;\r\n\tfont-family: Cambria, Georgia, serif;\r\n}\r\nbutton.clear {\r\n\tfont-family: Arial, serif;\r\n\tbackground-color: #eee;\r\n\tborder: none;\r\n\tpadding: 5px 10px;\r\n\tborder-radius: 4px;\r\n\tcursor: pointer;\r\n}\r\nbutton:hover {\r\n\tbackground-color: #cfd8dc;\r\n}\r\nbutton:disabled {\r\n\tbackground-color: #eee;\r\n\tcolor: #aaa;\r\n\tcursor: auto;\r\n}\r\nbutton.clear {\r\n\tcolor: #888;\r\n\tmargin-bottom: 12px;\r\n}\r\n"

/***/ }),

/***/ "./src/app/msg/msg.component.html":
/*!****************************************!*\
  !*** ./src/app/msg/msg.component.html ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"msgService.messages.length\">\n\t<button class=\"clear\"\n\t\t\t(click)=\"msgService.clear()\">clear\n\t</button>\n\t<div *ngFor='let message of msgService.messages'> {{message}}</div>\n</div>\n"

/***/ }),

/***/ "./src/app/msg/msg.component.ts":
/*!**************************************!*\
  !*** ./src/app/msg/msg.component.ts ***!
  \**************************************/
/*! exports provided: MsgComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MsgComponent", function() { return MsgComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _msg_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../msg.service */ "./src/app/msg.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MsgComponent = /** @class */ (function () {
    function MsgComponent(msgService) {
        this.msgService = msgService;
    }
    MsgComponent.prototype.ngOnInit = function () {
    };
    MsgComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-msg',
            template: __webpack_require__(/*! ./msg.component.html */ "./src/app/msg/msg.component.html"),
            styles: [__webpack_require__(/*! ./msg.component.css */ "./src/app/msg/msg.component.css")]
        }),
        __metadata("design:paramtypes", [_msg_service__WEBPACK_IMPORTED_MODULE_1__["MsgService"]])
    ], MsgComponent);
    return MsgComponent;
}());



/***/ }),

/***/ "./src/app/root/root.component.css":
/*!*****************************************!*\
  !*** ./src/app/root/root.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/* AppComponent's private CSS styles */\r\nh1 {\r\n\tfont-size: 1.2em;\r\n\tcolor: #999;\r\n\tmargin-bottom: 0;\r\n}\r\nh2 {\r\n\tfont-size: 2em;\r\n\tmargin-top: 0;\r\n\tpadding-top: 0;\r\n}\r\nnav a {\r\n\tmargin-right: 4px;\r\n\tpadding: 5px 10px;\r\n\ttext-decoration: none;\r\n\tmargin-top: 10px;\r\n\tdisplay: inline-block;\r\n\tbackground-color: #eee;\r\n\tborder-radius: 4px;\r\n}\r\nnav a:visited, a:link {\r\n\tcolor: #607D8B;\r\n}\r\nnav a:hover {\r\n\tcolor: #039be5;\r\n\tbackground-color: #CFD8DC;\r\n}\r\nnav a.active {\r\n\tcolor: #039be5;\r\n}\r\n"

/***/ }),

/***/ "./src/app/root/root.component.html":
/*!******************************************!*\
  !*** ./src/app/root/root.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1>{{title}}</h1>\n\n<nav>\n\t<a routerLink=\"/dashboard\">Dashboard</a>\n\t<a routerLink=\"/instances\">Instances</a>\n</nav>\n\n<router-outlet></router-outlet>\n\n<app-msg></app-msg>\n"

/***/ }),

/***/ "./src/app/root/root.component.ts":
/*!****************************************!*\
  !*** ./src/app/root/root.component.ts ***!
  \****************************************/
/*! exports provided: RootComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RootComponent", function() { return RootComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var RootComponent = /** @class */ (function () {
    function RootComponent() {
        this.title = "Edpro Board";
    }
    RootComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./root.component.html */ "./src/app/root/root.component.html"),
            styles: [__webpack_require__(/*! ./root.component.css */ "./src/app/root/root.component.css")]
        })
    ], RootComponent);
    return RootComponent;
}());



/***/ }),

/***/ "./src/app/routing.module.ts":
/*!***********************************!*\
  !*** ./src/app/routing.module.ts ***!
  \***********************************/
/*! exports provided: RoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RoutingModule", function() { return RoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _inst_inst_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./inst/inst.component */ "./src/app/inst/inst.component.ts");
/* harmony import */ var _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dashboard/dashboard.component */ "./src/app/dashboard/dashboard.component.ts");
/* harmony import */ var _stat_stat_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./stat/stat.component */ "./src/app/stat/stat.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_3__["DashboardComponent"] },
    { path: 'instances', component: _inst_inst_component__WEBPACK_IMPORTED_MODULE_2__["InstComponent"] },
    { path: 'stat/:id', component: _stat_stat_component__WEBPACK_IMPORTED_MODULE_4__["StatComponent"] },
];
var RoutingModule = /** @class */ (function () {
    function RoutingModule() {
    }
    RoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
        })
    ], RoutingModule);
    return RoutingModule;
}());



/***/ }),

/***/ "./src/app/stat/stat.component.css":
/*!*****************************************!*\
  !*** ./src/app/stat/stat.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".stat {\r\n\tdisplay: flex;\r\n\tflex-direction: row;\r\n\tbackground-color: #EEE;\r\n\tborder-radius: 4px;\r\n\tpadding: 0.3em;\r\n}\r\n\r\n.item {\r\n\tmargin: 0.5em 0.3em 0.5em 1em;\r\n\tdisplay: flex;\r\n\tflex-direction: row;\r\n\tborder-bottom-color: #cccccc;\r\n\tborder-bottom-width: 1px;\r\n\tborder-bottom-style: dotted;\r\n}\r\n\r\n.name {\r\n\twidth: 100%;\r\n}\r\n\r\n.value {\r\n}\r\n\r\nlabel {\r\n\tdisplay: inline-block;\r\n\twidth: 3em;\r\n\tmargin: .5em 0;\r\n\tcolor: #607D8B;\r\n\tfont-weight: bold;\r\n}\r\n\r\nbutton {\r\n\tmargin-top: 20px;\r\n\tfont-family: Arial, serif;\r\n\tbackground-color: #eee;\r\n\tborder: none;\r\n\tpadding: 5px 10px;\r\n\tborder-radius: 4px;\r\n\tcursor: pointer;\r\n}\r\n\r\nbutton:hover {\r\n\tbackground-color: #cfd8dc;\r\n}\r\n\r\nbutton:disabled {\r\n\tbackground-color: #eee;\r\n\tcolor: #ccc;\r\n\tcursor: auto;\r\n}\r\n"

/***/ }),

/***/ "./src/app/stat/stat.component.html":
/*!******************************************!*\
  !*** ./src/app/stat/stat.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2>Stat:</h2>\n\n<div *ngFor=\"let stat of stats\">\n\t<div class=\"stat\">\n\t\t<span class=\"name\">{{ stat.begin | dt }} | {{ stat.end | dt }}</span>\n\t\t<b><span class=\"value\">{{ stat.duration | number:'0.0-0' }}</span></b>\n\t</div>\n\t<div class=\"item\" *ngFor=\"let item of stat.items\">\n\t\t<span class=\"name\">{{item.name}}</span>\n\t\t<span class=\"value\">{{item.duration | number:'0.0-0'}}</span>\n\t</div>\n</div>\n\n<button (click)=\"goBack()\">go back</button>\n\n\n"

/***/ }),

/***/ "./src/app/stat/stat.component.ts":
/*!****************************************!*\
  !*** ./src/app/stat/stat.component.ts ***!
  \****************************************/
/*! exports provided: StatComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StatComponent", function() { return StatComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var StatComponent = /** @class */ (function () {
    function StatComponent(route, api, loc) {
        this.route = route;
        this.api = api;
        this.loc = loc;
        this.stats = [];
    }
    StatComponent.prototype.ngOnInit = function () {
        this.getInstance();
    };
    StatComponent.prototype.getInstance = function () {
        var _this = this;
        var id = this.route.snapshot.paramMap.get('id');
        this.api
            .getStat(id)
            .subscribe(function (it) {
            for (var _i = 0, it_1 = it; _i < it_1.length; _i++) {
                var s = it_1[_i];
                s.items.sort(function (a, b) { return b.duration - a.duration; });
            }
            _this.stats = it;
        });
    };
    StatComponent.prototype.goBack = function () {
        this.loc.back();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], StatComponent.prototype, "stats", void 0);
    StatComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-stat',
            template: __webpack_require__(/*! ./stat.component.html */ "./src/app/stat/stat.component.html"),
            styles: [__webpack_require__(/*! ./stat.component.css */ "./src/app/stat/stat.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _api_service__WEBPACK_IMPORTED_MODULE_2__["ApiService"],
            _angular_common__WEBPACK_IMPORTED_MODULE_3__["Location"]])
    ], StatComponent);
    return StatComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\canab\.projects\board-frontend\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map