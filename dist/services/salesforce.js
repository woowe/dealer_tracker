System.register(['angular2/core'], function(exports_1) {
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
    var core_1;
    var jsforce, Transform, inherits, SalesForceService;
    function QueryStream() {
        Transform.call(this);
        this.count = 0;
    }
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            jsforce = require('jsforce');
            Transform = require('stream').Transform;
            inherits = require('util').inherits;
            inherits(QueryStream, Transform);
            QueryStream.prototype._transform = function (chunck, enc, done) {
                this.count++;
            };
            SalesForceService = (function () {
                function SalesForceService() {
                    this.loggingIn = new core_1.EventEmitter();
                    this.loggedIn = new core_1.EventEmitter();
                    this.conn = new jsforce.Connection({
                        loginUrl: 'https://dealersocket.my.salesforce.com'
                    });
                }
                SalesForceService.prototype.login = function (username, password, security_key) {
                    this.loggingIn.next(true);
                    var self = this;
                    this.conn.login(username, password + security_key, function (err, userInfo) {
                        self.loggingIn.next(false);
                        if (err) {
                            self.loggedIn.next(false);
                        }
                        self.loggedIn.next(true);
                        self.userInfo = userInfo;
                    });
                };
                SalesForceService.prototype.query = function (query) {
                    return this.conn.query(query);
                };
                SalesForceService.prototype.getLoggingIn = function () {
                    return this.loggingIn;
                };
                SalesForceService.prototype.getLoggedIn = function () {
                    return this.loggedIn;
                };
                SalesForceService.prototype.logout = function () {
                    this.conn.logout(function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], SalesForceService.prototype, "loggingIn", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], SalesForceService.prototype, "loggedIn", void 0);
                SalesForceService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], SalesForceService);
                return SalesForceService;
            }());
            exports_1("SalesForceService", SalesForceService);
        }
    }
});
//# sourceMappingURL=salesforce.js.map