import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Content, Platform } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Toast, Keyboard, CardIO, Dialogs } from 'ionic-native';
import { CardManageProvider } from '../../providers/cardmanage-provider/cardmanage-provider';
import { CommonProvider } from '../../providers/common-provider/common-provider';
import { CardDisplayProvider } from '../../providers/carddisplay-provider/carddisplay-provider';
import { PaymentProvider } from '../../providers/payment-provider/payment-provider';
import { StorageService } from '../../services/storage';
import { ShoppingItemsPage } from'../shopping-items/shopping-items';
/*
  Generated class for the NfcPay page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var nfc: any;
declare var ndef: any;
declare var window: any;
var _thisobj;
@Component({
  selector: 'page-nfc-pay',
  templateUrl: 'nfc-pay.html'
})
export class NfcPayPage {
 @ViewChild(Content) content: Content;
  public title:string;
  public queryText: string = '';
//  public disablePayment: boolean;
  public billDetails: Array<any> = [];
  public cartItems: Array<any>=[];
  public items: Array<any> = [];
  public totalAmt: number;
  public showPayment: boolean = true;
  public paymentResult: boolean = false; 
  public cardSelected: string;
  public cardSelection: string="selectCard";
  public cardRegisterForm: FormGroup;
  public registeredCardForm: FormGroup;  
  public cardDetails: {debitCardNumber?:number,creditCardNumber?:number,debitExMonth?:string,debitExYear?:string,creditExMonth?:string,creditExYear?:string}={};
  constructor(public navCtrl: NavController, public navParams: NavParams,  private formBuilder: FormBuilder, public platform: Platform, public storage:StorageService,
               private loadingCtrl: LoadingController,public cardmanageProvider:CardManageProvider,public common:CommonProvider, public cardDisplayProvider: CardDisplayProvider,
               public payment: PaymentProvider) {
        this.title="NFC Payment";
         _thisobj = this;
        this.cardRegisterForm = this.formBuilder.group({ creditCardNumber: ['', Validators.required]  
                        , creditExMonth: ['', Validators.required], creditExYear: ['', Validators.required] 
                         });
        this.registeredCardForm =this.formBuilder.group({
            queryText: [''],
            cardSelected: ['']
        });
       //this.disablePayment = true;
       this.billDetails=this.navParams.get('billDetails');
       this.cartItems=this.billDetails[0].cartItems;
       this.platform.ready().then(() => {
                this.platform.registerBackButtonAction(function(event) {
                    if (navCtrl.canGoBack()) {
                        return;
                    }
                }, 101);
            });
  }
    ionViewDidEnter(){
         this.calculateTotalAmt().then((res)=>{
              this.totalAmt=res;
               this.storage.get("userInfo").then((res) => {
                    let data = {
                        userID: JSON.parse(res).userID
                    }
                    this.cardDisplayProvider.cardDetails(data).then(res => {
                        var jsonData = JSON.parse(res);
                        console.log(jsonData);
                        console.log(jsonData.response_code);
                        if (jsonData.response_code == "00") {
                            for (let ele of jsonData.additional_data) {
                                console.log(JSON.stringify(ele.cardLast4Digit));
                                this.items.push(ele.cardLast4Digit);
                            }
                        }
                    });
                });
         });
     }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NfcPayPage');
    nfc.enabled(
            function() {

            },
            function(msg) {
                if(msg == 'NFC_DISABLED') {
                     //this.disablePayment = true;
                    Toast.show('NFC is disabled please check settings, ' + msg , '5000', 'bottom').subscribe(
                        toast => {
                        }
                    );
                } else {
                     //this.disablePayment = true;
                     Toast.show('NFC is not available, '+ msg, '5000', 'bottom').subscribe(
                        toast => {
                        }
                    );
                }
            }
        );
  }
  ionViewWillLeave() {
        nfc.removeNdefListener(
            //this.nfcHandler, // this must be the same as the function above
            function () {
                console.log("Success, the listener has been removed.");
            },
            function (error) {
                console.log("Removing the listener failed");
            }
        );
  }
  public calculateTotalAmt(): Promise<any>{
     return new Promise((resolve,reject) => {
    
         let amt: number=0;
         for(const ele of this.cartItems){
             console.log(ele.Price);
             amt= amt +ele.Price;
         }
         resolve(amt);
     });
 }
  refresh() {
        nfc.enabled(
            function() {
            },
            function(msg) {
                 if(msg == 'NFC_DISABLED') {
                    //this.disablePayment = true;
                    Toast.show('NFC is disabled please check settings, ' + msg , '5000', 'bottom').subscribe(
                        toast => {
                        }
                    );
                } else {
                     // this.disablePayment = true;
                     Toast.show('NFC is not available, '+ msg, '5000', 'bottom').subscribe(
                        toast => {
                        }
                    );
                }
            }
        );
    }
    submitCreditCardRegistration() {
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        
        if (this.validateCreditCard()) 
        {
            loading.present().then(() => 
            {
                Keyboard.close();
                this.storage.get("userInfo").then((res) =>{
                console.log(JSON.parse(res).userID);
                let data:any={
                    userID:JSON.parse(res).userID,
                    cardNo:this.cardDetails.creditCardNumber,
                    // creditExMonth:this.cardDetails.creditExMonth,
                    // creditExYear:this.cardDetails.creditExYear,
                    // creditExMonth:(this.cardDetails.creditExMonth+this.cardDetails.creditExYear)
                       expiryDate:1712
                    // cvv:this.cardDetails.cvv
                };
                 console.error((this.cardDetails.debitExMonth+this.cardDetails.debitExYear));
                 console.error("Casdfasf"+data);

                this.cardmanageProvider.submitCreditCredentials(data).then(res => 
                {
                    console.log("Register Response");     
                        let result=JSON.parse(res);
                         console.log(("res recived result response_code"+  result+"heh>>>"+JSON.stringify(res.response_code)+"dsd>>>"+res.response_code +"sadf"+result.response_code));
                        if(result.response_code=="00"){
                                loading.dismiss();
                                Toast.show('Registration saved successfully', '3000', 'center').subscribe(
                                toast => {
                                
                                }
                            );
                            
                            this.navCtrl.pop();
                        } else if(result.response_code=="04"){
                            loading.dismiss();
                            Toast.show('Email already exsits', '3000', 'center').subscribe(
                                toast => {
                                
                                }
                            );
                        
                        }else if(result.response_code=="05"){
                            loading.dismiss();
                            Toast.show('Username  already exsits', '3000', 'center').subscribe(
                                toast => {
                                
                                }
                            );
                        
                        }else if(result.response_code=="09"){
                            loading.dismiss();
                            Toast.show('Token Failed', '3000', 'center').subscribe(
                                toast => {
                                
                                }
                            );
                        
                        }  
                        else{
                            loading.dismiss();
                            Toast.show('Registration Failed', '3000', 'center').subscribe(
                                toast => {
                                
                                }
                            );
                        }
                }, (err) => {
                    console.log("Register Response");
                    console.log(JSON.stringify(err));
                    loading.dismiss();
                     Toast.show('Registration Failed', '3000', 'center').subscribe(
                    toast => {
                       
                    }
                );
                });
               });
            });
        }
    }
      validateCreditCard(): boolean  {
        let errorMsg = '';
        let control =  this.cardRegisterForm.controls['creditCardNumber'];

        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = 'Credit Card number is required';
            } else if (control.errors['minlength']) {
                errorMsg = 'Credit Card number is not valid';
            }            
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {

                }
            );
            return false;
        }
        
        control =  this.cardRegisterForm.controls['creditExMonth'];
        
        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = 'Credit Card Expiry month is required';
            } else if (control.errors['minlength']) {
                errorMsg = 'Credit Card Expiry month is not valid.';
            }            
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {
                        
                }
            );
            return false;
        }
         control =  this.cardRegisterForm.controls['creditExYear'];
        
        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = 'Credit Card Expiry year is required';
            } else if (control.errors['minlength']) {
                errorMsg = 'Credit Card Expiry year is not valid.';
            }            
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {
                        
                }
            );
            return false;
        }
                
        // control =  this.creditRegisterForm.controls['cvv'];
        
        // if (!control.valid || control.value === '') {
        //     if (control.errors['required']) {
        //         errorMsg = 'CVV is required';
        //     } else if (control.errors['minlength']) {
        //         errorMsg = 'CVV is not valid.';
        //     }            
        //     Toast.show(errorMsg, '2000', 'center').subscribe(
        //         toast => {
                        
        //         }
        //     );
        //     return false;
        // }
        
        if (this.cardRegisterForm.valid) {
            return true;
        }
   }
    confirmNFCPay= function() {
        let loading = _thisobj.loadingCtrl.create({
            content: 'Please wait...'
        });
        console.log(this.cardSelected);
        console.log(this.cardSelected=="");
        if(this.cardSelected==undefined){
            Toast.show("Please select a card", '3000', 'bottom').subscribe(
                        toast => {
                           console.log(toast);
                        }
                     );
            return false;
        }
        loading.present().then(() => {
            _thisobj.storage.get("userInfo").then((res) => {
               
                        let data = {
                            userID: JSON.parse(res).userID,
                            cardLast4Digit: this.cardSelected
                        }
                _thisobj.cardDisplayProvider.getTokenByCardLast4DigitAndUserId(data).then((res)=>{
                    var jsonData = JSON.parse(res);
                     console.log("additional_data");
                    console.log(jsonData.additional_data);
                    if (jsonData.response_code == "00") {
                        
                        let billDetailsStr = JSON.stringify(this.billDetails);
                        let cardDetailsStr = JSON.stringify(jsonData.additional_data);
                        let dataStr = billDetailsStr.slice(0, -2)+',"cardDetails":'+cardDetailsStr+'}]';
                        let data: any ={
                            provisionID:jsonData.additional_data[0].provisionID,
                            tokens:jsonData.additional_data[0].tokens,
                            tranAmt:_thisobj.totalAmt
                        }
                        console.log("Detokenization request data");
                         console.log(data);
                        _thisobj.payment.submitForDetokenization(data).then((resp)=>{
                            console.log("Detokenization additional_data");
                            console.log(resp);
                            let jsonRes = JSON.parse(resp);
                             console.log(jsonRes.additional_data);
                             if (jsonRes.response_code == "00") {
                                 loading.dismiss();
                                 Dialogs.confirm('Card No: '+jsonRes.additional_data[0].pan+'\n Token: '+jsonRes.additional_data[0].tokens, 'Detoken Details', ['OK']).then((buttonIndex) => {
                                    if (buttonIndex === 1) {
                                      let loading = _thisobj.loadingCtrl.create({
                                        content: 'Please wait...'
                                      });
                                     loading.present().then(() => {
                                            setTimeout( () => {
                                                console.log("Bill Details String");
                                               console.log(dataStr);
                                                console.log("Bill Details JSON");
                                                console.log(JSON.parse(dataStr));
                                                var records = [
                                                    ndef.textRecord(dataStr),
                                                ];
                                        
                                                nfc.share(
                                                    records,
                                                    function () {
                                                        console.log("share success");
                                                        setTimeout( () => {
                                                            nfc.unshare(function(){
                                                                 loading.dismiss();
                                                                _thisobj.paymentResult=true;
                                                                _thisobj.showPayment=false;
                                                                console.log("unshare success");
                                                                Toast.show("Payment done successfully", '5000', 'bottom').subscribe(
                                                                        toast => {
                                                                           console.log(toast);
                                                                        }
                                                               );
                                                            }, function(){
                                                                _thisobj.paymentResult=true;
                                                                _thisobj.showPayment=false;
                                                            });
                                                        },1000);     
                                                    },
                                                    function () {
                                                        loading.dismiss();
                                                        _thisobj.paymentResult=false;
                                                        _thisobj.showPayment=false;
                                                        console.log("share error");
                                                        Toast.show("Payment failed", '5000', 'bottom').subscribe(
                                                            toast => {
                                                               console.log(toast);
                                                            }
                                                         );
                                                        
                                                    }
                                                );
                                         },2000);
                                        },(error)=>{
                                               loading.dismiss();
                                               Toast.show("Detokenization request failed", '5000', 'bottom').subscribe(
                                                                toast => {
                                                                   console.log(toast);
                                                                }
                                                             );
                                        });
                                    }
                                   });
                             
                            }else{
                                  loading.dismiss();
                                 Toast.show("Detokenization request failed", '5000', 'center').subscribe(
                                        toast => {
                                        }
                                    );
                             } 
                        },(error) =>{
                             loading.dismiss();
                            console.log(error.toString());
                             console.log(error.toString()=='timeout');
                            if(error.toString()=='timeout'){
                                Toast.show("Request Timed out", '5000', 'center').subscribe(
                                        toast => {
                                        }
                                    );
                            }else{
                                 Toast.show("Detokenization request failed", '5000', 'center').subscribe(
                                        toast => {
                                        }
                                    );
                            }
                        });
                     } 
                   },(error) =>{
                       loading.dismiss();
                       Toast.show("Payment failed", '5000', 'bottom').subscribe(
                            toast => {
                               console.log(toast);
                            }
                      );
                   })
                  
               },(error)=>{
                   loading.dismiss();
                   Toast.show("Payment failed", '5000', 'bottom').subscribe(
                                    toast => {
                                       console.log(toast);
                                    }
                                 );
               });
           });
    }
    backtoShop(){
        this.navCtrl.setRoot(ShoppingItemsPage);
    }
     scanCard(){
      
              let options = {
                        "requireExpiry": false,
                        "scanExpiry": true,
                        "requirePostalCode": false,
                        "restrictPostalCodeToNumericOnly": true,
                        "hideCardIOLogo": true,
                        "suppressScan": false,
                        "keepApplicationTheme": true
                }
            
          
          CardIO.canScan().then((ress: boolean) => {
            if(ress){
                console.log(ress);
                    CardIO.scan(options).then((response) =>{
                        var cardIOResponseFields = [
                            "cardType",
                            "redactedCardNumber",
                            "cardNumber",
                            "expiryMonth",
                            "expiryYear",
                            "cvv",
                            "postalCode",
                            "cardholderName"
                        ];
    
                        var len = cardIOResponseFields.length;
                        for (var i = 0; i < len; i++) {
                            var field = cardIOResponseFields[i];
                             Toast.show(field+":"+response[field], '1000', 'center').subscribe(
                                toast => {});
                            // alert(field + ": " + response[field]);
                        } 
                    }, (error)=>{
                         Toast.show("Card Scan Cancelled", '3000', 'center').subscribe(
                                toast => {});
                        alert("card.io scan cancelled");
                    });
            }
          
        });     
           
      }
    keyboardShowHandler(e) {
        _thisobj.isKeyboardOpen = true;
        let kH = e.keyboardHeight;
        _thisobj.kH = kH; 
        
        if (_thisobj.offsetY < kH + 40) {
            _thisobj.scrollContentTop();
        }
    }
    
    keyboardHideHandler(){
        _thisobj.isKeyboardOpen = false;
    }

    scrollContentTop() {
        setTimeout(() => {
            this.content.scrollTo(0, 100, 200);
        }, 0);
    }
}
