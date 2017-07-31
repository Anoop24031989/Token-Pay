import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
/*
  Generated class for the Notification provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
declare var require: any
@Injectable()
export class NotificationProvider {
    url = 'https://onesignal.com/api/v1/players?';
  constructor(public http: Http) {
    console.log('Hello Notification Provider');
  }
    public notificationToUser(userMessage: string, userList: Array<any>): Promise<any> {
        return new Promise((resolve, reject) => {
              var sendNotification = function(data) {
              var headers = {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": "Basic NGEwMGZmMjItY2NkNy0xMWUzLTk5ZDUtMDAwYzI5NDBlNjJj"
              };
              
              var options = {
                host: "onesignal.com",
                port: 443,
                path: "/api/v1/notifications",
                method: "POST",
                headers: headers
              };
              
              var https = require('https');
              var req = https.request(options, function(res) {  
                res.on('data', function(data) {
                  console.log("Response:");
                  console.log(JSON.parse(data));
                  resolve('success');
                });
              });
              
              req.on('error', function(e) {
                console.log("ERROR:");
                console.log(e);
                reject('error');
              });
              
              req.write(JSON.stringify(data));
              req.end();
            };
            
            var message = { 
              app_id: "90a7fd9a-eb55-4a71-a84a-d3645175b621",
              contents: {"en": userMessage},
              include_player_ids: userList
            };
            sendNotification(message);
        });
    }
    public appUsers(): Promise<any> {
        let path = 'app_id=90a7fd9a-eb55-4a71-a84a-d3645175b621&limit=300&offset=0';
        let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Basic MjQxMTU4OGMtM2E5OC00NWI1LTliODUtYmZjZmRjZTI4OGQ0');
        return new Promise((resolve, reject) => {
            this.http.get(this.url + path,{headers})
                .map(res => res.json())
                .subscribe((data) => {
                        console.log('appUsers');
                        console.log(data);
                        resolve(data.players);
                    },(err) => {
                        reject("Error");
                    }
                );
        });
    }
}
