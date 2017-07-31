import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Toast, Network } from 'ionic-native';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Injectable()
export class CommonProvider {

    constructor(private http: Http) {

    }

    checkNetworkConnection(): Promise<any> {
        return new Promise((resolve, reject) => {

            if (Network.type === "none") {
                Toast.show("No Network is available", '5000', 'center').subscribe(
                    toast => {
                        console.log(toast);
                    }
                );
                reject("no_network");
            } else if (Network.type === "2g") {
                Toast.show("Connected to 2g", '5000', 'center').subscribe(
                    toast => {
                        console.log(toast);
                    }
                );
                resolve("2g_network");
            } else if (Network.type === "3g") {
                Toast.show("Connected to 3g", '5000', 'center').subscribe(
                    toast => {
                        console.log(toast);
                    }
                );
                resolve("3g_network");
            } else if (Network.type === "4g") {
                Toast.show("Connected to 4g", '5000', 'center').subscribe(
                    toast => {
                        console.log(toast);
                    }
                );
                resolve("4g_network");
            }
            //On Network Change
            let networkSubscription = Network.onConnect().subscribe(() => {
                console.log("Network Connected");
                setTimeout(() => {
                    if (Network.type === "4g") {
                        Toast.show("Connected to 4g", '5000', 'center').subscribe(
                            toast => {
                                console.log(toast);
                            }
                        );
                    }
                }, 3000);
            });
            let networkDisconnect = Network.onDisconnect().subscribe(() => {
                console.error("Network Disconnected");
                Toast.show("Network Disconnected", '5000', 'center').subscribe(
                    toast => {
                        console.log(toast);
                    }
                );
            });
        })

    }

    getFormattedDateTime(date): any {

        let now = date;
        let year = '' + now.getFullYear();
        let month = '' + (now.getMonth() + 1); if (month.length === 1) { month = '0' + month; }
        let day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
        let hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
        let minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
        let second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
        return day + "-" + month + "-" + year + " " + hour + ":" + minute + ":" + second;
    }
    getIp(): any {
        return new Promise((resolve,reject)=> {
            this.http.get("https://httpbin.org/ip").timeout(5000,new Error('Timeout exceeded, try again.'))
             .map(res => res.json())
                .subscribe(data => {
                    console.log("IP address " + JSON.stringify(data));
                    resolve(data);
                }, (error) => {
                    reject(error);
                });
        });
    }

    SendReq(encodeddata): Promise<any> {

        console.log("encodeddata");
        console.log(encodeddata);
        var promise;
        var network_state = 'dd';
        if (network_state == 'none') {
            promise = null;
        }
        else {
            var JsonReq = "dd ";
            if (JsonReq != null) {
                var ServiceURL = 'http://aepstest.fssnet.co.in/POSNodeJS/NodeJsConnector.asmx';
                // var ServiceURL = 'http://10.44.11.32/NodeJsConnector/NodeJsConnector.asmx';

                var encryptedReq = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">  <soap:Body>    <Connect xmlns="http://tempuri.org/"><data>' + encodeddata + ' </data>    </Connect>  </soap:Body></soap:Envelope>';
                console.log("encryptedReq");
                console.log(encryptedReq);
                if (encryptedReq != "") {
                    
                promise = new Promise(function(resolve, reject) {
                      try {
                            var request = new XMLHttpRequest();
                            console.log("promise" + ServiceURL);
                            request.open('POST', ServiceURL, true, "", "");
                            request.setRequestHeader("SOAPAction", "http://tempuri.org/Connect");
                            request.setRequestHeader("Content-Type", "text/xml");//plain
                            request.timeout = 5000;
                            request.onload = function() {
                                if (request.status == 200) {
                                    console.log(request.response);
                                    resolve(request.response);
                                    // we got data here, so resolve the Promise
                                } 
                                else {
                                    reject(Error(request.statusText)); // status is not 200 OK, so reject
                                }
                            };
                            request.ontimeout = function() {
                                console.log("Timeout Error");
                                reject('timeout');
                            };
                            request.onerror = function() {
                                console.log("Error");
                                reject('error');
                            };
                            request.send(encryptedReq); //send the request
                     
                        } catch (error) {
                            console.log("Catch error block");
                            reject('error');
                        }
                    })
                }
                else {
                    promise = promise;
                }
            }
            else {
                promise = promise;
            }
        }
        return promise;

    }
}

