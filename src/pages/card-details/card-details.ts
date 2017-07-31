import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { CardDisplayProvider } from '../../providers/carddisplay-provider/carddisplay-provider';
import { StorageService } from '../../services/storage';
/*
  Generated class for the CardDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var _thisobj;
@Component({
  selector: 'page-card-details',
  templateUrl: 'card-details.html'
})
export class CardDetailsPage {
  cardLastForDigit: string = '';
  tokenlastFourDigit: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public cardDisplayProvider: CardDisplayProvider, public storage: StorageService,  public viewCtrl: ViewController, public platform: Platform) {
       _thisobj = this;
      this.cardLastForDigit=this.navParams.get('card');
      this.platform.ready().then(() => {
            this.platform.registerBackButtonAction(function(event) {
               _thisobj.viewCtrl.dismiss()
            }, 101);
        });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardDetailsPage');
  }
 ionViewDidEnter() {
      console.log('ionViewDidEnter CardDetailsPage');
     this.storage.get("userInfo").then((res) => {
               
                        let data = {
                            userID: JSON.parse(res).userID,
                            cardLast4Digit: this.cardLastForDigit
                        }
                this.cardDisplayProvider.getTokenByCardLast4DigitAndUserId(data).then((res)=>{
                     var jsonData = JSON.parse(res);
                     console.log("additional_data");
                    console.log(jsonData.additional_data);
                    if (jsonData.response_code == "00") {
                        var tokens=jsonData.additional_data[0].tokens
                        this.tokenlastFourDigit=tokens.substr(tokens.length-4);
                    }
                });
      });
 }
     dismiss() {
        this.viewCtrl.dismiss(); 
    }
}
