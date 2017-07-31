import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions  } from '@angular/http';
import { ConfigProvider } from '../../providers/config-provider/config-provider';
import { CommonProvider } from '../../providers/common-provider/common-provider';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

declare var require: any;
var base64 = require('base-64');

@Injectable()
export class RegistrationProvider {
    providers: [ConfigProvider];
    data: any;
    serverUrl: string;
    registerPath: string;

    constructor(private http: Http, public config: ConfigProvider,public common:CommonProvider) {
        this.data = null;
        this.serverUrl = config.getServerURL();
        this.registerPath = config.getRegisterPath();
    }
    getSequrityQuestion(): any {
        console.log("Trying to get securtiy questions");
        let body = JSON.stringify({ "modeType": "Security" });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return new Promise(resolve => {
            let securityUrl='http://10.44.11.33:8080/master/addMaster';
            this.http.post(securityUrl, body, options)
                .timeout(5000, new Error('Timeout exceeded, try again.'))
                .map(res => res.json())
                .subscribe(
                (data) => resolve(data),
                (err) => resolve(err)
                );
        });
    }
    submitCredentials(data): Promise<any> {

        let body = JSON.stringify(data);
        console.log(JSON.stringify(data));
        body = '<req><data1>'+body+'</data1><serverurl>http://10.44.11.33:8080/userInfo/addUser </serverurl></req>';
        // lastlogin: this.config.getCurrentDateTime()
        return new Promise((resolve, reject) => {
            var encodedData = base64.encode(body);
            console.log("Encoded data");
            console.log(encodedData);
              console.log("body data");
            console.log(body);
            this.common.SendReq(encodedData).then((data)=>{
                console.log("getting data"+data);
              let JsonData= data.substring(data.indexOf("ConnectResult")+15,(data.lastIndexOf("/ConnectResult")-2 ));   
                        console.log("getting data"+JsonData);         
                resolve(JsonData);
                
            },(error)=>{
                reject(console.error(error));
            });
        });
    }
}

