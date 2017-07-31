import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, Content, Platform } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AndroidFingerprintAuth, TouchID, Toast, Keyboard } from 'ionic-native';
import { TranslateService } from 'ng2-translate';
import { StorageService } from '../../services/storage';
import {LoginPage} from '../login/login';
import { CommonProvider } from '../../providers/common-provider/common-provider';
import { PasswordProvider } from '../../providers/password-provider/password-provider';


var tempThis;
declare var window: any;
declare var FingerprintAuth:any;

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
 @ViewChild(Content) content: Content;
   public title: string;
   public cardSelection:string="updateProfile";
   public updateProfileForm: FormGroup;
   public changePwdForm: FormGroup;
   public settingsForm : FormGroup;
   public languageRegisterForm : FormGroup;
   public english: boolean;
   public spanish: boolean;
   public malay: boolean;
   public speech:boolean;
   public userDetails: {firstName?:string,lastName?:string,userName?:string,password?:string,confirmPassword?:string
                        ,mobileNumber?:number,gender?:string,country?:string,secQuestion?:string
                        ,secAnswer?:string,emailId?:string}={};
                        
   public changePwdDetails :{oldPassword?:string,newPassword?:string,changeConfirmPassword?:string}={};
  
  constructor(public navCtrl: NavController,  private formBuilder: FormBuilder 
               ,private loadingCtrl: LoadingController, public storage: StorageService
               ,public passwordProvider:PasswordProvider, public translate: TranslateService, public platform: Platform ) {
        this.updateProfileForm = this.formBuilder.group({
                        firstName: ['', Validators.required],lastName: ['', Validators.required]
                        ,mobileNumber: ['', Validators.required], gender:['',Validators.required]
                        ,country:['',Validators.required]
                        , secQuestion: ['',Validators.required],secAnswer: ['', Validators.required]
                    });
                    
        this.changePwdForm = this.formBuilder.group({
                       oldPassword:['',Validators.required]
                       ,newPassword:['',Validators.required]
                       ,changeConfirmPassword:['',Validators.required]
                    });
         this.settingsForm=this.formBuilder.group({});
         this.languageRegisterForm=this.formBuilder.group({});
         this.storage.get('language').then((res) =>{
              console.log(res);
              if (res == 'en') {
                  this.english = true;
                  this.spanish = false;
                  this.malay = false;
              } else if (res == 'es') {
                  this.english = false;
                  this.spanish = true;
                  this.malay = false;
              }else if(res=='ms'){
                  this.english = false;
                  this.spanish = false;
                  this.malay = true;
              }else{
                  this.english = true;
                  this.spanish = false;
                  this.malay = false;
              }
          })
      this.title = this.translate.instant('MNGE PROFLE');              
       tempThis = this;
       this.platform.ready().then(() => {
            this.platform.registerBackButtonAction(function(event) {
                if (navCtrl.canGoBack()) {
                    navCtrl.pop();
                    return;
                }
            }, 101);
      });
       
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
  //Finger Print changes saving starts///
  openFingerPrint()
  {
     this.storage.set("FingerPrintState","TRUE");
  }
  //Finger Print changes ends////////
  
//Update Profile Starts///////

    submitUpdateProfile() {
        let loading = this.loadingCtrl.create({
            content: this.translate.instant('WAIT')
        });
        
        if (this.validate()) {
            Keyboard.close();
            loading.present();
            setTimeout(()=>{
                Toast.show(this.translate.instant('CARD REG SUCCESS'), '3000', 'center').subscribe(
                  toast => {
                      
                    }
                );  
                loading.dismiss();  
                this.navCtrl.pop();
            },1000);
        }
    }
  
  validate(): boolean {
        let errorMsg = '';
                let control: any =  this.updateProfileForm.controls['firstName'];

        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = this.translate.instant('FIRST NAME REQ');
            } else if (control.errors['minlength']) {
                errorMsg = this.translate.instant('FIRST NAME NOT VALID');
            }
            
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {

                }
            );
           control.setFocus();
            return false;
        }
        control =  this.updateProfileForm.controls['lastName'];

        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = this.translate.instant('LAST NAME REQ');
            } else if (control.errors['minlength']) {
                errorMsg = this.translate.instant('LAST NAME NOT VALID');
            }
            
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {

                }
            );
           control.setFocus();
            return false;
        }
         control =  this.updateProfileForm.controls['mobileNumber'];
        
        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = this.translate.instant('MOB REQ');
            } else if (control.errors['minlength']) {
                errorMsg = this.translate.instant('MOB NUMBER NOT VALID');
            }
            
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {
                        
                }
            );
            control.setFocus();
            return false;
        }
               
       control = this.updateProfileForm.controls['gender']; 
       if (!control.valid || control.value === '') {
           if (control.errors['required']) {
               errorMsg = this.translate.instant('GENDER REQ');
           }
           Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {
                      console.log(errorMsg);
                }
           );
           control.setFocus();
           return false;
       }
       control = this.updateProfileForm.controls['country']; 
       if (!control.valid || control.value === '') {
           if (control.errors['required']) {
               errorMsg = this.translate.instant('COUNTRY REQ');
           }
           Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {
                      console.log(errorMsg);
                }
           );
           control.setFocus();
           return false;
       }
        control = this.updateProfileForm.controls['secQuestion']; 
       if (!control.valid || control.value === '') {
           if (control.errors['required']) {
               errorMsg = this.translate.instant('SEC QUES REQ');
           }
           Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {
                      console.log(errorMsg);
                }
           );
           control.setFocus();
           return false;
       }
        control =  this.updateProfileForm.controls['secAnswer'];

        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = this.translate.instant('SEC ANS REQ');
            } else if (control.errors['minlength']) {
                errorMsg = this.translate.instant('SEC ANS NOT VALID');
            }
            
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {

                }
            );
           control.setFocus();
            return false;
        }     
        if (this.updateProfileForm.valid) {
            return true;
        }
   }
//Update Profile Ends///////

//Change Password Starts////
     ChangePassword()
     {
          let loading = this.loadingCtrl.create({
            content: this.translate.instant('WAIT')
        });
        
        if (this.changePasswordValidate()) 
        {
             loading.present().then(() => 
			{
                Keyboard.close();
                this.storage.get("userInfo").then((res) =>
                 {
                        let data={
                                    userID:JSON.parse(res).userID,
                                    Password:this.changePwdDetails.newPassword,
                                    forceChangePwd:1
                                };
                         this.passwordProvider.submitChangePassword(data).then(res => 
                          {
                                console.log("Change Password Response::");     
                                    let result=JSON.parse(res);
                                    console.log(("res recived result response_code"+  result+"heh>>>"+JSON.stringify(res.response_code)+"dsd>>>"+res.response_code +"sadf"+result.response_code));
                                    if(result.response_code=="00"){
                                            loading.dismiss();
                                            Toast.show(this.translate.instant('PSWD CHNG SUCCESS'), '3000', 'center').subscribe(
                                            toast => {
                                            
                                            }
                                        );
                                        
                                        this.navCtrl.pop();
                                    } 
                                    else{
                                        loading.dismiss();
                                        Toast.show(this.translate.instant('PSWD CHNG FAIL'), '3000', 'center').subscribe(
                                            toast => {
                                            
                                            }
                                        );
                                    }
                         }, (err) => 
                            {
                                console.log("Password Error Response");
                                console.log(JSON.stringify(err));
                                loading.dismiss();
                                Toast.show(this.translate.instant('PSWD CHNG FAIL'), '3000', 'center').subscribe(
                                toast => {
                                
                                }
                            );
                            });
                   });
            });
        }
     }
     changePasswordValidate():boolean
     {
            let control =  this.changePwdForm.controls['oldPassword'];
            let errorMsg = '';

            if (!control.valid || control.value === '') {
                if (control.errors['required']) {
                    errorMsg = this.translate.instant('OLD PSWD REQ');
                } else if (control.errors['minlength']) {
                    errorMsg = this.translate.instant('OLD PSWD NOT VALID');
                }
                
                Toast.show(errorMsg, '2000', 'center').subscribe(
                    toast => {

                    }
                );
                return false;
            }     
            control =  this.changePwdForm.controls['newPassword'];

            if (!control.valid || control.value === '') {
                if (control.errors['required']) {
                    errorMsg = this.translate.instant('NEW PSWD REQ');
                } else if (control.errors['minlength']) {
                    errorMsg = this.translate.instant('NEW PSWD NOT VALID');
                }
                
                Toast.show(errorMsg, '2000', 'center').subscribe(
                    toast => {

                    }
                );
                return false;
            }     
            control =  this.changePwdForm.controls['changeConfirmPassword'];

            if (!control.valid || control.value === '') {
                if (control.errors['required']) {
                    errorMsg = this.translate.instant('CNFRM PSWD REQ');
                } else if (control.errors['minlength']) {
                    errorMsg = this.translate.instant('CNFRM PSWD NOT VALID');
                }
                
                Toast.show(errorMsg, '2000', 'center').subscribe(
                    toast => {

                    }
                );
                return false;
            }
            if(!(this.changePwdDetails.oldPassword==this.changePwdDetails.newPassword))
            {
                errorMsg = this.translate.instant('NEW OLD PSWD SHLD NOT MATCH');
                Toast.show(errorMsg, '2000', 'center').subscribe(
                    toast => {
                            
                    });
            }     
            if(!(this.changePwdDetails.newPassword==this.changePwdDetails.changeConfirmPassword))
            {
                errorMsg = this.translate.instant('PSWD MUST MATCH');
                Toast.show(errorMsg, '2000', 'center').subscribe(
                    toast => {
                            
                    });
            } 
            if (this.changePwdForm.valid) {
                return true;
            }
     }
    
    public translateToEnglish(): void {
           this.storage.set('language','en').then(() =>{
               this.translate.use('en');
                this.title = this.translate.instant('MNGE PROFLE');
           });
      }
     public translateToSpanish(): void {
          this.storage.set('language','es').then(() =>{
                this.translate.use('es');
                 this.title = this.translate.instant('MNGE PROFLE');
           });
     } 
    public translateToMalay(): void {
           this.storage.set('language','ms').then(() =>{
               this.translate.use('ms');
                this.title = this.translate.instant('MNGE PROFLE');
           });
    }
       //Change Password Ends////
// speechRecognisation()
// {   
//    this.speech=true;
//     if(this.speech==true)
//     {
//         this.storage.set("SpeechRecognisation","TRUE");
//         console.error("TOGGLE IS IN ON STATE");
//         this.speech=false;
//     }
//     else
//     {
//          console.error("TOGGLE IS IN OFF STATE");
//         this.storage.set("SpeechRecognisation","FALSE");
//     }
    
// }
 /* openFingerPrint() {
      console.log("Its Entering in to fingerprint");
       let loading = tempThis.loadingCtrl.create({
                    content: 'please wait...'
        });
        FingerprintAuth.isAvailable((result) => 
   {
       if (result.isAvailable) {
               var encryptConfig = {
                    clientId: "tokenPay",
                    username: "Test",
                    password: "test",
                    disableBackup: true
               };
        
        loading.present().then(() => {
            FingerprintAuth.encrypt(encryptConfig, (result) => {
                if (result.withFingerprint) {
                    console.log("Successfully encrypted credentials.");
                    setTimeout( () => {
                        tempThis.storage.set('Username','test' +' ' + 'Test').then(() => {
                            tempThis.nav.setRoot(LoginPage);
                                loading.dismiss();
                         });
                   });
                }else {
                       console.log('Didn\'t authenticate!');
                       setTimeout( function() {
                            loading.dismiss();
                        }, 200);
                }
            },(error) => {
                loading.dismiss();
                if (error === "Cancelled") {
                    Toast.show('Authentication Cancelled', '2000', 'center').subscribe(
                        toast => {
                                
                        }
                    );
                    console.log("FingerprintAuth Dialog Cancelled!");
                } else {
                    console.log("FingerprintAuth Error: " + error);
                }
            }); 
          });   
       }else {
           Toast.show('Authentication Not Available', '2000', 'center').subscribe(
                toast => {
                        
                }
        );
       }
   },function(err){
        Toast.show('Authentication Not Available', '2000', 'center').subscribe(
                toast => {
                        
                }
        );
   });
  }*/
}
