import {EventEmitter} from 'angular2/core';

export interface ILogin {

  loggingIn: EventEmitter<boolean>
  loggedIn: EventEmitter<boolean>

  login(username: string, password: string, security_key?: string)
  logout()

  getLoggingIn()
  getLoggedIn()
}
