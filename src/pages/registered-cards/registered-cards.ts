import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { CardDisplayProvider } from '../../providers/carddisplay-provider/carddisplay-provider';
import { StorageService } from '../../services/storage';
import { CommonProvider } from '../../providers/common-provider/common-provider';
import { CardSearch } from '../../pipes/cardsearch';
import 'rxjs/add/operator/debounceTime';
import {CardRegistrationPage} from '../card-registration/card-registration';
import {CardDetailsPage} from '../card-details/card-details';
import { Toast, Dialogs, Keyboard} from 'ionic-native';


@Component({
    selector: 'page-registered-cards',
    templateUrl: 'registered-cards.html',
})
export class RegisteredCardsPage {
    items = [];
    queryText: string = '';
    constructor(public navCtrl: NavController, public navParams: NavParams, public common: CommonProvider,
        public cardDisplayProvider: CardDisplayProvider, public storage: StorageService, public modalCtrl: ModalController) {
        this.initializeItemsAtFirst();
    }
    initializeItemsAtFirst() {
        this.storage.get("userInfo").then((res) => {
            let data = {
                userID: JSON.parse(res).userID
            }
            console.log(data);
            this.cardDisplayProvider.cardDetails(data).then(res => {
                var jsonData = JSON.parse(res);
                console.log(jsonData);
                console.log(jsonData.response_code);

                if (jsonData.response_code == "00") {
                    for (let ele of jsonData.additional_data) {
                        console.log(JSON.stringify(ele.cardLast4Digit));
                        this.items.push(ele.cardLast4Digit);
                        // this.initializeItems(ele);

                    }
                }
            });
        });
    }
    // initializeItems(ele) {
    //     this.items.push(ele.cardLast4Digit);
    // }

    getItems(ev: any) {
        // Reset items back to all of the items
        let ex:any;
        this.initializeItemsAtFirst();
        // set val to the value of the searchbar
        let val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.items = this.items.filter((item) => {
                return (item.toString().toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad RegisteredCardsPage');
    }
    AddCard(){
        this.navCtrl.push(CardRegistrationPage);
    }
    DeActivate(){
        Dialogs.confirm('Do you want to DeActivate Card ?', 'DeActivation', ['OK', 'Cancel']).then((buttonIndex) => {
            if (buttonIndex === 1) {
                this.navCtrl.push(RegisteredCardsPage);
                return;
            }
        });
    }
    ViewCard(card: any){
         let newItemPage = this.modalCtrl.create(CardDetailsPage, {"card": card});
         newItemPage.present();
    }
}
