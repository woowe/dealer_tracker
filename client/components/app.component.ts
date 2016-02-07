import {Component, Inject, Output, EventEmitter} from 'angular2/core';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from "ng2-material/all";
import {SalesForceService} from "../services/salesforce";

let jsforce = require('jsforce');
let fs = require('fs');


interface LoginCredentials {
  username: string,
  password: string,

}

@Component({
  selector: 'app',
  templateUrl: 'client/views/app.html',
  styleUrls: ['client/styles/app.css'],
  directives: [MATERIAL_DIRECTIVES]
})

export class AppComponent {
  attempted_logins: number;
  login_credentials: any;

  @Output() scroll_page: EventEmitter<boolean> = new EventEmitter();

  constructor(@Inject(SalesForceService) public salesforce) {
    this.attempted_logins = 0;

    // if(fs.existsSync("login_credentials.txt")) {
    //   var fileContents: any = fs.readFileSync("login_credentials.txt", "utf-8");
    //   console.log(fileContents);
    //   var lines = fileContents.split('\n');
    //   console.log(lines);
    //   this.login(lines[0], lines[1], lines[2], false);
    // }
  }

  login(username: string, password: string, security_key: string, remember: boolean) {
    console.log(username, password, security_key);
    var self = this;
    return this.salesforce.login(username, password + security_key, function(err, ret) {
        if( err ) {
          self.attempted_logins += 1;
          console.error(err);
        }else {
          console.log("Logged in ", self);
          // if(remember) {
          //   self.writeLoginCredentials(username, password, security_key);
          // }
          setTimeout(() => { self.scroll_page.emit(true); }, 500);
        }
    });
  }

  writeLoginCredentials(username: string, password: string, security_key: string) {
    fs.writeFile('login_credentials.txt', username +"\n"+ password +"\n"+ security_key, "utf-8", function(err) {
      if(err) throw err;
      return;
    });
  }
}
