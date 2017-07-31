import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavParams } from 'ionic-angular';
//import { OneSignal } from '@ionic-native/onesignal';
import { StatusBar, Splashscreen, Toast, Dialogs, Keyboard, SpeechRecognition } from 'ionic-native';
import { TranslateService } from 'ng2-translate';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import {LoginPage} from'../pages/login/login';
import {HomePage} from'../pages/home/home';
import { ConfigProvider } from '../providers/config-provider/config-provider';
import { StorageService } from '../services';
import { SpeechRecognisation } from '../providers/speech-recognisation/speech-recognisation';
declare var window :any;
var _thisobj;
interface MenuObj {
    title: string;
    component: any;
    icon: string;
    index?: number;
    color: string;
}
@Component({
    templateUrl: 'app.html',
    selector: 'app',
    providers: [ConfigProvider]

})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    sideMenus: MenuObj[];
    userImage: any;
    rootPage: any = LoginPage;
    DisplayFirstName: any;
    DisplayLastName: any;
    activeSideMenu: any;
    pages: Array<{ title: string, component: any, icon: string, color: string }>;
    // pages: Array<{}>;

    constructor(public platform: Platform, private config: ConfigProvider, public translate: TranslateService, public storage: StorageService) {
         _thisobj = this;
        this.initializeApp();
        // this.SpeechRecognise();
        this.DisplayFirstName = this.DisplayFirstName;
        this.DisplayLastName = this.DisplayLastName;
        this.sideMenus = config.getSideMenus();
        this.userImage = 'assets/img/user_avatar.png';
        this.storage.get("userInfo").then((res) => {
            let data = {
                userID: JSON.parse(res).userID,
                lastAccessDate: JSON.parse(res).lastAccessDate,
                fName: JSON.parse(res).fName,
                lName: JSON.parse(res).lName
            };
            this.DisplayFirstName = data.fName;
            this.DisplayLastName = data.lName;

        }, (error) => {

        });
        this.storage.get('language').then((res) => {
            console.log('language :' + res);
            if (res !== '' && typeof res !== typeof undefined && res !== null) {
                this.translate.setDefaultLang(res.toString());
            } else {
                this.translate.setDefaultLang('en');
            }
        }, (error) => {
            this.storage.set('language','en').then(() =>{
                 this.translate.setDefaultLang('en');
           });
           
        });
        
    }
    ionViewDidEnter() {
        console.error("Its often executing..............");
        this.initializeApp();
    }
    
    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();
            var notificationOpenedCallback = function(jsonData) {
                console.log(jsonData);
                   _thisobj.storage.get("IsLoggedIn").then((res) =>{
                       if(res=="true"){
                           _thisobj.nav.setRoot(HomePage,{"notificationDetails":jsonData});
                       }
                       else{
                            _thisobj.nav.setRoot(LoginPage,{"notificationDetails":jsonData});
                       }
                   }, (error) => {
                            _thisobj.nav.setRoot(LoginPage,{"notificationDetails":jsonData});
                   });
                console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
            };
     
                
                 window['plugins'].OneSignal.registerForPushNotifications({
                    modalPrompt: true
                  });
                 window['plugins'].OneSignal.startInit('834e6a56-5ccf-491c-9cf2-84b26bfa3bcb','650595037339');
                 window['plugins'].OneSignal.handleNotificationOpened(notificationOpenedCallback);
                 window['plugins'].OneSignal.inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification);
                 window['plugins'].OneSignal.endInit();
                console.log('OneSignal Tags');
                  window['plugins'].OneSignal.getTags(function(tags) {
                    console.log('Tags Received: ' + JSON.stringify(tags));
                 });
                 console.log('OneSignal ids');
                  window['plugins'].OneSignal.getIds(function(ids) {
                  console.log('getIds: ' + JSON.stringify(ids));
                });
                console.log('tsp_a10000');
                window['plugins'].TSP.tsp_a10000('Hi',function(data){
                     console.log('tsp_a10000 sucess: ' + JSON.stringify(data));
                },function(error){
                    console.log('tsp_a10000 error: ' + JSON.stringify(error));
                });
        });
    }

    openPage(menu: MenuObj) {
            this.activeSideMenu=menu.index;
            this.nav.setRoot(menu.component,{"index":menu.index});
        
    }
    logout(menu: MenuObj) {
        Dialogs.confirm(this.translate.instant('EXIT_CONFIRMATION'), this.translate.instant('TOKENPAY'), [this.translate.instant('OK'), this.translate.instant('CANCEL')]).then((buttonIndex) => {
            if (buttonIndex === 1) {
                this.nav.setRoot(LoginPage);
                return;
            }

        });

    }
    SpeechRecognise() {
        let navigate;
        console.log("Speech recognise clicked");
        let matches: Array<string>;
        let options = {
            language: "en-IN",
            showPopup: false
        };
        SpeechRecognition.startListening(options)
            .subscribe(
            (matchesk) => {
                console.log(matchesk);
                console.log("Check this" + matchesk);

                if (matchesk.indexOf("card management") >= 0) {
                    console.log("listerning always here");
                    //    this.navCtrl.push(CardRegistrationPage);
                }
                else if (matchesk.indexOf("profile") >= 0) {
                    console.log("listerning always here222222222222");

                    //    this.navCtrl.push(ProfilePage);
                }
                else {
                    Toast.show("Tap mic to speak again", '2000', 'center').subscribe(
                        toast => {
                        }
                    );

                }
            }
            ,
            (onerror) => console.log('error:', onerror));
        // console.log("How much value in this"+matches.length);matches= matchesk; console.log(matches);console.log(matchesk); console.log("m"+ matchesk)

    }
}
