import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions  } from '@angular/http';
import { ConfigProvider } from '../../providers/config-provider/config-provider';
import { CommonProvider } from '../../providers/common-provider/common-provider';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';


declare var require: any;
var base64 = require('base-64');

@Injectable()
export class PasswordProvider {
 providers: [ConfigProvider];
    data: any;
    serverUrl: string;
    registerPath: string;

    constructor(private http: Http,public common:CommonProvider) {
        this.data = null;
    }
    submitChangePassword(data): Promise<any> {

        let body = JSON.stringify(data);
        console.log(JSON.stringify(data));
        body = '<req><data1>'+body+'</data1><serverurl>http://10.44.11.33:8080/userInfo/updatePswd</serverurl></req>';
        console.log("body data");
        console.log(body);
        // lastlogin: this.config.getCurrentDateTime()
        return new Promise((resolve, reject) => {
            var encodedData = base64.encode(body);
            console.log("Encoded data");
            console.log(encodedData);
            this.common.SendReq(encodedData).then((data)=>{
              let JsonData= data.substring(data.indexOf("ConnectResult")+15,(data.lastIndexOf("/ConnectResult")-2 ));   
                        console.log("getting data"+JsonData);         
                resolve(JsonData);
                
            },(error)=>{
                reject(console.error(error));
            });
        });
    }
}
