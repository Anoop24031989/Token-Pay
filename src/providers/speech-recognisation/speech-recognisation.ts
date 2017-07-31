import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Toast, Dialogs, Keyboard,TextToSpeech, SpeechRecognition} from 'ionic-native';

/*
  Generated class for the SpeechRecognisation provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SpeechRecognisation {

  constructor(public http: Http) {
    console.log('Hello SpeechRecognisation Provider');
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
            //    this.navCtrl.push(CardRegistrationPage);
           }
           else if(matchesk.indexOf("profile") >=0)
           {
                              console.log("listerning always here222222222222");

            //    this.navCtrl.push(ProfilePage);
           }
           else
           {
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
