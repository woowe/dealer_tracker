import {Component, NgZone} from 'angular2/core';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from "ng2-material/all";

let jsforce = require('jsforce');
let fs = require('fs');

@Component({
    selector: 'my-app',
    templateUrl: 'app/app_view.html',
    styleUrls: ['app/app_style.css'],
    directives: [MATERIAL_DIRECTIVES]
})

export class AppComponent {
  conn: any;
  builder_id: string;
  loggingIn: boolean;
  attempted_logins: number;
  login_credentials: any;
  remembered: boolean;

  constructor(private _ngZone: NgZone) {
    this.attempted_logins = 0;
    this.loggingIn = false;
    this.remembered = false;
    this.conn = new jsforce.Connection({
      loginUrl: "https://dealersocket.my.salesforce.com"
    });

    if(fs.existsSync("login_credentials.txt")) {
      this.remembered = true;
      var fileContents: any = fs.readFileSync("login_credentials.txt", "utf-8");
      console.log(fileContents);
      var lines = fileContents.split('\n');
      console.log(lines);
      this.login(lines[0], lines[1], lines[2], false);
    }
  }

  login(username: string, password: string, security_key: string, remember: boolean) {
    console.log(username, password, security_key);
    this.loggingIn = true;
    var self = this;
    return this.conn.login(username, password + security_key, function(err, ret) {
      self._ngZone.runOutsideAngular(() => {
        self.loggingIn = false;
        if( err ) {
          self.remembered = false;
          self.attempted_logins += 1;
          console.error(err);
        }else {
          console.log("Logged in ", self);
          self.builder_id = ret.id;
          if(remember) {
            self.writeLoginCredentials(username, password, security_key);
          }
        }
        self._ngZone.run(() => {});
      });
      //return ret;
    });
  }

  writeLoginCredentials(username: string, password: string, security_key: string) {
    fs.writeFile('login_credentials.txt', username +"\n"+ password +"\n"+ security_key, "utf-8", function(err) {
      if(err) throw err;
      return;
    });
  }


}
