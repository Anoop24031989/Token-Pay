import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ConfigProvider } from '../../providers/config-provider/config-provider';
import { CommonProvider } from '../../providers/common-provider/common-provider';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { StorageService } from '../../services/storage';

declare var require: any;
var base64 = require('base-64');
const XmlReader = require('xml-reader');
const xmlQuery = require('xml-query');
const reader = XmlReader.create({stream: true});
// const xml =
//     `<?xml version="1.0" encoding="UTF-8"?>
//     <message>
//         <to>Alice</to>
//         <from>Bob</from>
//         <heading color="blue">Hello</heading>
//         <body color="red">This is a demo!</body>
//     </message>`;
@Injectable()
export class LoginProvider {
    
  providers: [ConfigProvider];
  data: any;
  serverUrl: string;
  loginPath: string;
  
  constructor(private http: Http, public config: ConfigProvider,public common:CommonProvider, public storage: StorageService) {
    this.data = null;
    this.serverUrl = config.getServerURL();
    this.loginPath = config.getLoginPath();
    
  }
  submitCredentials(userName, password): Promise<any>{
//          return new Promise((resolve,reject) => {
//          let JsonData= '{"response_code":"00","desc":"success","additional_data":[{"userID":1042,"userName":"Anoop","rollID":7,"emailid":"anoopvarghese@gmail.com","fName":"Anoop","lName":"Varghese","mobileNo":9087394200,"secQuestId":2,"secAns":"Skoda","lockFlg":"N","pwdExpDate":"2017-04-16T14:38:34.000Z","lastAccessDate":"2017-03-17T14:38:34.000Z","gender":"female","deviceModel":"Moto G (4) (7.0)","ipAddress":"2405 205:8000:57f4:2f48:9459:2402:85f9","platform":"Android","country":"ind","appVersion":"1","playerID":"26ac0781-d431-441a-b27e-ad348ea40e70","accessMobNo":9876546154}]}'
//                
//                  var JSONStr =JSON.parse(JsonData);
//                  console.error(JSONStr);
//                  console.error("Additional Data");
//                  console.error(JSONStr.additional_data);
//                   console.error("Additional Data [0]");
//                  console.error(JSONStr.additional_data[0]);
//                 if(JSONStr.response_code=="00"){
//                      this.storage.set("userInfo",JSON.stringify(JSONStr.additional_data[0]));
//                     this.storage.set("IsLoggedIn","true");
//                  }else{
//                      this.storage.set("userInfo","");
//                      this.storage.set("IsLoggedIn","false");
//                  }
//              resolve(JSONStr.response_code);
//      });
    let body = JSON.stringify({  userName: userName,
                                 Password: password 
                                  });
                                  // lastlogin: this.config.getCurrentDateTime()
                                 //{"userName":"Victor","Password":"12345"}
      body = '<req><data1>'+body+'</data1><serverurl> http://10.44.11.33:8080/userInfo/getUserByUnameAndPswd </serverurl></req>'
      return new Promise((resolve,reject) => {
            var encodedData = base64.encode(body);
          this.common.SendReq(encodedData)
          .then((data)=>{
                    console.log(data);
                   if(data=='timeout'){
                       reject('timeout');
                   } else if(data=='error'){
                       reject('error');
                   }else{
                     console.log("getting data : "+data);
                     let JsonData= data.substring(data.indexOf("ConnectResult")+15,(data.lastIndexOf("/ConnectResult")-2 ));  
                     console.log("getting data"+JsonData);
                     console.log("getting data length : "+JsonData.length);         
                     if(JsonData.length>14){
                          var JSONStr =JSON.parse(JsonData);
                          console.error(JSONStr);
                          if(JSONStr.response_code=="00"){
                               this.storage.set("userInfo",JSON.stringify(JSONStr.additional_data[0]));
                               this.storage.set("IsLoggedIn","true");
                              
                          }else{
                              this.storage.set("userInfo","");
                              this.storage.set("IsLoggedIn","false");
                          }
                         resolve(JSONStr.response_code);
                 }else{
                     reject('failed');
                 }
            }
          },(err)=>{
              reject(err);
          })
         });
        
         
  }
  updateLastUpdate(userID): Promise<any>{
      let body=JSON.stringify({userID});
      body = '<req><data1>'+body+'</data1><serverurl> http://10.44.11.33:8080/userInfo/updateLastAccessDate </serverurl></req>'
       return new Promise((resolve, reject) => {
            var encodedData = base64.encode(body);
            console.log("Encoded data in last access date");
            console.log(encodedData);
            this.common.SendReq(encodedData).then((data)=>{
                console.log("getting data in last access date"+data);
              let JsonData= data.substring(data.indexOf("ConnectResult")+15,(data.lastIndexOf("/ConnectResult")-2 ));   
                        console.log("getting data in last access date2"+JsonData);
                 if(JsonData.length>14){
                     var JSONStr =JSON.parse(JsonData);
                          console.error(JSONStr);
                     resolve(JSONStr.response_code);
                 } else{
                     reject('failed');
                 }         
                
            },(error)=>{
                reject(console.error(error));
            });
        });
  }
}

