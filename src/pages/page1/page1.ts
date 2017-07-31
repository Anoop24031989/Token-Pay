import { Component } from '@angular/core';
import { Toast, Dialogs, Keyboard} from 'ionic-native';
import { NavController, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import {CardRegistrationPage} from'../card-registration/card-registration';
import {RegisteredCardsPage} from'../registered-cards/registered-cards';


@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
    CardRegistrationPage=CardRegistrationPage;
    RegisteredCardsPage=RegisteredCardsPage;

  constructor(public navCtrl: NavController, public platform: Platform) {
    this.platform.ready().then(() => {
            this.platform.registerBackButtonAction(function(event) {
                if (navCtrl.canGoBack()) {
                    navCtrl.pop();
                    return;
                }
            }, 101);
      });
  }
      logout() {
        Dialogs.confirm('Are you want to exit ?', 'Token Wallet', ['OK', 'Cancel']).then((buttonIndex) => {
            if (buttonIndex === 1) {
                this.navCtrl.setRoot(LoginPage);
                return;
            }
        });
    }


}
