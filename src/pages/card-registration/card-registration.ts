import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, Content } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Toast, Keyboard, CardIO } from 'ionic-native';
import { CardManageProvider } from '../../providers/cardmanage-provider/cardmanage-provider';
import { CommonProvider } from '../../providers/common-provider/common-provider';
import { StorageService } from '../../services/storage';
import { TranslateService } from 'ng2-translate';

var tempThis;

@Component({
  selector: 'page-card-registration',
  templateUrl: 'card-registration.html'
})
export class CardRegistrationPage {
       @ViewChild(Content) content: Content;
       cardSelection:string="creditCard";
   public creditRegisterForm: FormGroup;
   public debitRegisterForm: FormGroup;
   public cardDetails: {debitCardNumber?:number,creditCardNumber?:number,debitExMonth?:string,debitExYear?:string,creditExMonth?:string,creditExYear?:string}={};

  constructor(public navCtrl: NavController,  private formBuilder: FormBuilder , public storage:StorageService, public translate: TranslateService,
               private loadingCtrl: LoadingController,public cardmanageProvider:CardManageProvider,public common:CommonProvider ) {
        this.creditRegisterForm = this.formBuilder.group({ creditCardNumber: ['', Validators.required]  
                        , creditExMonth: ['', Validators.required], creditExYear: ['', Validators.required] 
                         });
       this.debitRegisterForm = this.formBuilder.group({ debitCardNumber: ['', Validators.required]  
                        , debitExMonth: ['', Validators.required], debitExYear: ['', Validators.required] 
                         });
                        
                        
       tempThis = this; 
       
  }

    tapCoordinates(e) {
        tempThis.y = e.touches[0].clientY;
        tempThis.h = window.innerHeight;
        tempThis.offsetY = (tempThis.h - tempThis.y);
    }

    keyboardShowHandler(e) {
        tempThis.isKeyboardOpen = true;
        let kH = e.keyboardHeight;
        tempThis.kH = kH; 
        
        if (tempThis.offsetY < kH + 40) {
            tempThis.scrollContentTop();
        }
    }
    
    keyboardHideHandler(){
        tempThis.isKeyboardOpen = false;
    }

    scrollContentTop() {
        setTimeout(() => {
            this.content.scrollTo(0, 100, 200);
        }, 0);
    }
  
    submitCreditCardRegistration() {
        let loading = this.loadingCtrl.create({
            content: this.translate.instant('WAIT')
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
                    creditExMonth:this.cardDetails.creditExMonth,
                    // creditExMonth:this.cardDetails.creditExMonth,
                    // creditExYear:this.cardDetails.creditExYear,
                    // creditExMonth:(this.cardDetails.creditExMonth+this.cardDetails.creditExYear)
                       expiryDate:1712
                    // cvv:this.cardDetails.cvv
                };
                 console.error("Casdfasf"+JSON.stringify(data));
                 console.error((this.cardDetails.debitExMonth+this.cardDetails.debitExYear));
                 console.error("Check for this"+this.cardDetails.debitExYear)

                this.cardmanageProvider.submitCreditCredentials(data).then(res => 
                {
                    console.log("Register Response");     
                        let result=JSON.parse(res);
                         console.log(("res recived result response_code"+  result+"heh>>>"+JSON.stringify(res.response_code)+"dsd>>>"+res.response_code +"sadf"+result.response_code));
                        if(result.response_code=="00"){
                                loading.dismiss();
                                Toast.show(this.translate.instant('CARD REG SUCCESS'), '3000', 'center').subscribe(
                                toast => {
                                
                                }
                            );
                            
                            this.navCtrl.pop();
                        } else if(result.response_code=="04"){
                            loading.dismiss();
                            Toast.show(this.translate.instant('EMAIL EXISTS'), '3000', 'center').subscribe(
                                toast => {
                                
                                }
                            );
                        
                        }else if(result.response_code=="05"){
                            loading.dismiss();
                            Toast.show(this.translate.instant('USERNAME EXISTS'), '3000', 'center').subscribe(
                                toast => {
                                
                                }
                            );
                        
                        }
                        else{
                            loading.dismiss();
                            Toast.show(this.translate.instant('REGISTRATION FAILED'), '3000', 'center').subscribe(
                                toast => {
                                
                                }
                            );
                        }
                }, (err) => {
                    console.log("Register Response");
                    console.log(JSON.stringify(err));
                    loading.dismiss();
                     Toast.show(this.translate.instant('REGISTRATION FAILED'), '3000', 'center').subscribe(
                    toast => {
                       
                    }
                );
                });
               });
            });
        }
    }
    submitDebitCardRegistration() {
       let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        
        if (this.validateCreditCard()) 
        {
            loading.present().then(() => 
			{
                Keyboard.close();
                
                let data:any={
                    userID:1018,
                    cardNo:this.cardDetails.debitCardNumber,
                      expiryDate:1712
                    // debitExMonth:(this.cardDetails.debitExMonth+this.cardDetails.debitExYear)
                    // debitExYear:,
                    // atmPin:this.cardDetails.atmPin
                };
                 console.error((this.cardDetails.debitExMonth+this.cardDetails.debitExYear));
                 console.error(data);
                this.cardmanageProvider.submitDebitCredentials(data).then(res => 
                {
                    console.log("Register Response");     
                        let result=JSON.parse(res);
                         console.log(("res recived result response_code"+  result+"heh>>>"+JSON.stringify(res.response_code)+"dsd>>>"+res.response_code +"sadf"+result.response_code));
                        if(result.response_code=="00"){
                                loading.dismiss();
                                Toast.show(this.translate.instant('CARD REG SUCCESS'), '3000', 'center').subscribe(
                                toast => {
                                
                                }
                            );
                            
                            this.navCtrl.pop();
                        } else if(result.response_code=="04"){
                            loading.dismiss();
                            Toast.show(this.translate.instant('EMAIL EXISTS'), '3000', 'center').subscribe(
                                toast => {
                                
                                }
                            );
                        
                        }else if(result.response_code=="05"){
                            loading.dismiss();
                            Toast.show(this.translate.instant('USERNAME EXISTS'), '3000', 'center').subscribe(
                                toast => {
                                
                                }
                            );
                        
                        } else{
                            loading.dismiss();
                            Toast.show(this.translate.instant('REGISTRATION FAILED'), '3000', 'center').subscribe(
                                toast => {
                                
                                }
                            );
                        }
                }, (err) => {
                    console.log("Register Response");
                    console.log(JSON.stringify(err));
                    loading.dismiss();
                            Toast.show(this.translate.instant('REGISTRATION FAILED'), '3000', 'center').subscribe(
                    toast => {
                       
                    }
                );
                });
            });
        }
    }
  
  validateCreditCard(): boolean 
  {
        let errorMsg = '';
        let control =  this.creditRegisterForm.controls['creditCardNumber'];

        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = this.translate.instant('CREDIT_CARD_NUMBER_REQ');
            } else if (control.errors['minlength']) {
                errorMsg = this.translate.instant('CREDIT_CARD_NUMBER_NOT_VALID');
            }            
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {

                }
            );
            return false;
        }
        
        control =  this.creditRegisterForm.controls['creditExMonth'];
        
        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = this.translate.instant('CREDIT_CARD_EXPIRY_MONTH_REQ');
            }          
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {
                        
                }
            );
            return false;
        }
         control =  this.creditRegisterForm.controls['creditExYear'];
        
        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = this.translate.instant('CREDIT_CARD_EXPIRY_YEAR_REQ');
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
        
        if (this.creditRegisterForm.valid) {
            return true;
        }
   }
   validateDebitCard(): boolean 
  {
        let errorMsg = '';
        let control =  this.debitRegisterForm.controls['debitCardNumber'];

        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = this.translate.instant('DEBIT_CARD_NUMBER_REQ');
            } else if (control.errors['minlength']) {
                errorMsg = this.translate.instant('DEBIT_CARD_NUMBER_NOT_VALID');
            }            
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {

                }
            );
            return false;
        }
        
        control =  this.debitRegisterForm.controls['debitExMonth'];
        
        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = this.translate.instant('DEBIT_CARD_EXPIRY_MONTH_REQ');
            }          
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {
                        
                }
            );
            return false;
        }
         control =  this.debitRegisterForm.controls['debitExYear'];
        
        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = this.translate.instant('DEBIT_CARD_EXPIRY_YEAR_REQ');
            }           
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {
                        
                }
            );
            return false;
        }
                
        //  control =  this.debitRegisterForm.controls['atmPin'];
        
        // if (!control.valid || control.value === '') {
        //     if (control.errors['required']) {
        //         errorMsg = 'ATM Pin is required';
        //     } else if (control.errors['minlength']) {
        //         errorMsg = 'ATM Pin is not valid.';
        //     }            
        //     Toast.show(errorMsg, '2000', 'center').subscribe(
        //         toast => {
                        
        //         }
        //     );
        //     return false;
        // }
        
        if (this.debitRegisterForm.valid) {
            return true;
        }
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
                         Toast.show(this.translate.instant(field+":"+response[field]), '1000', 'center').subscribe(
                                toast => {});
                        // alert(field + ": " + response[field]);
                    } 
                }, (error)=>{
                    Toast.show(this.translate.instant('SCAN_CANCELLED'), '3000', 'center').subscribe(
                                toast => {});
                });
        }
      
    });     
       
  }
}
