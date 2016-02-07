System.register(['angular2/core', "ng2-material/all", "../services/salesforce.js"], function(exports_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, all_1, salesforce_1;
    var jsforce, fs, AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (all_1_1) {
                all_1 = all_1_1;
            },
            function (salesforce_1_1) {
                salesforce_1 = salesforce_1_1;
            }],
        execute: function() {
            jsforce = require('jsforce');
            fs = require('fs');
            AppComponent = (function () {
                function AppComponent(salesforce) {
                    this.salesforce = salesforce;
                    this.scroll_page = new core_1.EventEmitter();
                    this.attempted_logins = 0;
                }
                AppComponent.prototype.login = function (username, password, security_key, remember) {
                    console.log(username, password, security_key);
                    var self = this;
                    return this.salesforce.login(username, password + security_key, function (err, ret) {
                        if (err) {
                            self.attempted_logins += 1;
                            console.error(err);
                        }
                        else {
                            console.log("Logged in ", self);
                            setTimeout(function () { self.scroll_page.emit(true); }, 500);
                        }
                    });
                };
                AppComponent.prototype.writeLoginCredentials = function (username, password, security_key) {
                    fs.writeFile('login_credentials.txt', username + "\n" + password + "\n" + security_key, "utf-8", function (err) {
                        if (err)
                            throw err;
                        return;
                    });
                };
                __decorate([
                    core_1.Output(),
                    __metadata('design:type', core_1.EventEmitter)
                ], AppComponent.prototype, "scroll_page", void 0);
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'app',
                        templateUrl: 'client/views/app.html',
                        styleUrls: ['client/styles/app.css'],
                        directives: [all_1.MATERIAL_DIRECTIVES]
                    }),
                    __param(0, core_1.Inject(salesforce_1.SalesForceService)),
                    __metadata('design:paramtypes', [Object])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map
