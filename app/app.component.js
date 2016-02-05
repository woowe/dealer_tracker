System.register(['angular2/core', "ng2-material/all"], function(exports_1) {
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
    var core_1, all_1;
    var jsforce, fs, AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (all_1_1) {
                all_1 = all_1_1;
            }],
        execute: function() {
            jsforce = require('jsforce');
            fs = require('fs');
            AppComponent = (function () {
                function AppComponent(_ngZone) {
                    this._ngZone = _ngZone;
                    this.attempted_logins = 0;
                    this.loggingIn = false;
                    this.remembered = false;
                    this.conn = new jsforce.Connection({
                        loginUrl: "https://dealersocket.my.salesforce.com"
                    });
                    if (fs.existsSync("login_credentials.txt")) {
                        this.remembered = true;
                        var fileContents = fs.readFileSync("login_credentials.txt", "utf-8");
                        console.log(fileContents);
                        var lines = fileContents.split('\n');
                        console.log(lines);
                        this.login(lines[0], lines[1], lines[2], false);
                    }
                }
                AppComponent.prototype.login = function (username, password, security_key, remember) {
                    console.log(username, password, security_key);
                    this.loggingIn = true;
                    var self = this;
                    return this.conn.login(username, password + security_key, function (err, ret) {
                        self._ngZone.runOutsideAngular(function () {
                            self.loggingIn = false;
                            if (err) {
                                self.remembered = false;
                                self.attempted_logins += 1;
                            }
                            else {
                                console.log("Logged in ", self);
                                self.builder_id = ret.id;
                                if (remember) {
                                    self.writeLoginCredentials(username, password, security_key);
                                }
                            }
                            self._ngZone.run(function () { });
                        });
                        //return ret;
                    });
                };
                AppComponent.prototype.writeLoginCredentials = function (username, password, security_key) {
                    fs.writeFile('login_credentials.txt', username + "\n" + password + "\n" + security_key, "utf-8", function (err) {
                        if (err)
                            throw err;
                        return;
                    });
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        templateUrl: 'app/app_view.html',
                        styleUrls: ['app/app_style.css'],
                        directives: [all_1.MATERIAL_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [core_1.NgZone])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map