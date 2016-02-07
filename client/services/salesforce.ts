import {Injectable, Output, EventEmitter} from 'angular2/core';
import {ILogin} from '../interfaces/Login';

let jsforce = require('jsforce');
let Transform = require('stream').Transform;
let inherits = require('util').inherits;

function QueryStream() {
  Transform.call(this);
  this.count = 0;
}
inherits(QueryStream, Transform);

QueryStream.prototype._transform = function(chunck, enc, done) {

  this.count++;
}

@Injectable()
export class SalesForceService implements ILogin {
  @Output() loggingIn: EventEmitter<any> = new EventEmitter();
  @Output() loggedIn: EventEmitter<any> = new EventEmitter();

  conn: any;
  userInfo: any;
  queryStreamWriter: Array<any>;

  constructor() {
    this.conn = new jsforce.Connection({
      loginUrl: 'https://dealersocket.my.salesforce.com'
    });
  }

  login(username: string, password: string, security_key: string) {
    this.loggingIn.next(true);
    var self = this;
    this.conn.login(username, password + security_key, function(err, userInfo) {
      self.loggingIn.next(false);

      if( err) {
        self.loggedIn.next(false);
      }

      self.loggedIn.next(true);

      self.userInfo = userInfo;
    });
  }

  query(query: string) {
    return this.conn.query(query);
  }

  getLoggingIn() {
    return this.loggingIn;
  }

  getLoggedIn() {
    return this.loggedIn;
  }

  logout(){
    this.conn.logout(function(err) {
      if(err) { console.error(err); }
    });
  }
}
