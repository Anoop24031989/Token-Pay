import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Toast, Dialogs, Keyboard,TextToSpeech, SpeechRecognition} from 'ionic-native';
import { Http, Headers } from '@angular/http';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';
import { StorageService } from '../../services/storage';
import { TranslateService } from 'ng2-translate';
import { CardRegistrationPage } from '../card-registration/card-registration';
declare var window :any;
declare var device: any;
declare var networkinterface: any;
var _thisobj;
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    public notification: any;
    public DisplayFirstName: any;
    public DisplayLastName: any;
    lastAccessDate : any;
    lastAccessDatePrint: any;
    userImage: any;
    profile="profile";
    constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public translate: TranslateService,public storage: StorageService, public http: Http) {
        // this.SpeechRecognise();
         _thisobj = this;
        this.notification = this.navParams.get("notificationDetails");
         this.storage.get("userInfo").then((res) => {
            let data = JSON.parse(res)
            this.DisplayFirstName = data.fName;
            this.DisplayLastName = data.lName;
            this.lastAccessDatePrint =data.lastAccessDate;
            this.userImage = 'assets/img/user_avatar.png';
            this.platform.ready().then(() => {
                this.platform.registerBackButtonAction(function(event) {
                    if (navCtrl.canGoBack()) {
                        navCtrl.pop();
                        return;
                    }
                    if(_thisobj.navParams.get("index")>0){
                        navCtrl.pop();
                        return;
                    }
                    
                    Dialogs.confirm(_thisobj.translate.instant('EXIT_CONFIRMATION'), _thisobj.translate.instant('TOKENPAY'), [_thisobj.translate.instant('OK'), _thisobj.translate.instant('CANCEL1')]).then((buttonIndex) => {
                        if (buttonIndex === 1) {
                            platform.exitApp();
                            return;
                        }
                    });
                }, 101);
            });
       }, (error) => {

        });
    }
    ionViewDidEnter() {
        console.error("Its often executing..............");
        this.SpeechRecognise();
        window['plugins'].TSP.tsp_a10000('Hi',function(data){
                     console.log('tsp_a10000 sucess: ' + JSON.stringify(data));
                },function(error){
                    console.log('tsp_a10000 error: ' + JSON.stringify(error));
         });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TtspeachPage');
        SpeechRecognition.isRecognitionAvailable()
            .then((available: boolean) => console.log("Speech Recognition Availability" + available));
        SpeechRecognition.hasPermission().then(
            (info) => console.log('Has permission: ', info));
        SpeechRecognition.requestPermission().then(
            () => {  
                console.log('Permission granted');},

            () => console.log('Permission denied'));
    }    
    changePassword() {
        this.navCtrl.push(ProfilePage);

    }
    settings() {
        this.navCtrl.push(ProfilePage);
    }
    SpeechRecognise()
    {
        let navigate;
        console.log("Speech recognise clicked");
         let matches: Array<string>;
        let options = {
            language : "en-IN",
            showPopup: false
        };
        SpeechRecognition.startListening(options)
            .subscribe(
            (matchesk) =>{ 
      console.log(matchesk);
            console.log("Check this"+matchesk);
          
           if( matchesk.indexOf("card management") >=0)
           {
               console.log("listerning always here");
               this.navCtrl.push(CardRegistrationPage);
           }
           else if(matchesk.indexOf("profile") >=0)
           {
                              console.log("listening always here222222222222");

               this.navCtrl.push(ProfilePage);
           }
           else
           {
                          Toast.show("Tap mic to speak again", '2000', 'center').subscribe(
                toast => {
                }
            );

           }    
    } ,
            (onerror) => console.log('error:', onerror));
            // console.log("How much value in this"+matches.length);matches= matchesk; console.log(matches);console.log(matchesk); console.log("m"+ matchesk)
           
     }
    logout() {
                Dialogs.confirm(this.translate.instant('EXIT_CONFIRMATION'), this.translate.instant('TOKENPAY'), [this.translate.instant('OK'), this.translate.instant('CANCEL')]).then((buttonIndex) => {
            if (buttonIndex === 1) {
                this.navCtrl.setRoot(LoginPage);
                return;
            }
        });
    }


}
