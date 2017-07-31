import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, Content,AlertController } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import { Toast, Dialogs, Keyboard} from 'ionic-native';
import { RegistrationProvider } from '../../providers/registration-provider/registration-provider';
import { CommonProvider } from '../../providers/common-provider/common-provider';
import { TranslateService } from 'ng2-translate';
import { StorageService } from '../../services/storage';
declare var window :any;
declare var device: any;
declare var networkinterface: any;
var tempThis;

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
   @ViewChild(Content) content: Content;
   public userDetails: {firstName?:string,lastName?:string,userName?:string,password?:string,confirmPassword?:string,mobileNumber?:number,
                        gender?:string,country?:string,secQuestion?:string,secAnswer?:string,emailId?:string}={};
   public registerForm: FormGroup;
   public securityQuestions: Array<any> = [];
   modalFirstname;
   y;
   h;
   offsetY;
   kH;
   isKeyboardOpen = false;
   
  constructor(public navCtrl: NavController,  private formBuilder: FormBuilder,  public translate: TranslateService, public storage: StorageService,
                private loadingCtrl: LoadingController,public registrationProvider:RegistrationProvider,public alertCtrl: AlertController
                ,public commonProvider: CommonProvider) {
        
        this.registerForm = this.formBuilder.group({ firstName: ['', Validators.required]
                        ,lastName: ['',Validators.required]
                        ,userName: ['', Validators.required]
                        , password: ['',Validators.required]
                        , confirmPassword: ['', Validators.required] 
                        , emailId: ['',Validators.required]
                        , mobileNumber: ['', Validators.required]
                        , gender:['',Validators.required]
                        , country:['',Validators.required]
                        , secQuestion: ['',Validators.required]
                        ,secAnswer: ['', Validators.required]});    
       tempThis = this; 
  }
  public ionViewDidLoad(): void {
       this.securityQuestions=[{masterID: 1 , descr: this.translate.instant('SECURITYQSTN1') },{masterID: 2 , descr: this.translate.instant('SECURITYQSTN2') },{masterID: 3 , descr: this.translate.instant('SECURITYQSTN3') }];
    //    this.registrationProvider.getSequrityQuestion().then(res => {
    //        this.securityQuestions=[{masterID: 1 , descr: "What is your Favourite car" },{masterID: 2 , descr: "What is your pet name?" },{masterID: 3 , descr: "What is your favourite color?" }];
    //        console.log(JSON.stringify(res));
    //    });
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
    
    
  
  submitRegistration() {
         let loading = this.loadingCtrl.create({
            content: this.translate.instant('WAIT')
         });
        
        if (this.validate()) {
            loading.present().then(() =>{
                 Keyboard.close();
                console.log('OneSignal ids');
                 window['plugins'].OneSignal.getIds((ids) =>{
                      console.log(ids.userId);
                      this.commonProvider.getIp().then((res) => {
                         
                        let data: any ={
                            userName:this.userDetails.firstName,
                            emailid:this.userDetails.emailId,
                            fName:this.userDetails.firstName,
                            lName:this.userDetails.lastName,
                            mobileNo: this.userDetails.mobileNumber,
                            Password: this.userDetails.password,
                            gender: this.userDetails.gender,
                            country: this.userDetails.country,
                            secQuestId: 2,
                           // secQuestId: this.userDetails.secQuestion,
                            secAns:this.userDetails.secAnswer,
                            IMEI:"2342342234234",
                            deviceModel: device.model+"("+device.version+")",
                            ipAddress: res.origin,
                            platform: device.platform,
                            accessMobNo:"9876546154",
                            rollID:7,
                            appVersion:1,
                            playerID: ids.userId,
                            uuid: device.uuid
        
                        };
                         console.log(data);  
                        this.registrationProvider.submitCredentials(data).then(res => {
                            console.log("Register Response");     
                                let result=JSON.parse(res);
                                 console.log(("res recived result response_code"+  result+"heh>>>"+JSON.stringify(res.response_code)+"dsd>>>"+res.response_code +"sadf"+result.response_code));
                                if(result.response_code=="00"){
                                        loading.dismiss();
                                        Toast.show(this.translate.instant('USER REG SUCCESS'), '3000', 'center').subscribe(
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
                    }, (error)=>{
                        Toast.show("No Server Found", '5000', 'center').subscribe(
                            toast => {
                                
                            }
                        );
                    });
                });          
            });
        }
  }
  
  validate(): boolean {
        let errorMsg = '';
        let control: any =  this.registerForm.controls['firstName'];

        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = this.translate.instant('FIRST NAME REQ');
            } else if (control.errors['minlength']) {
                errorMsg = this.translate.instant('FIRST NAME NOT VALID');
            }
            else if(control.errors['pattern'])
            {
                 errorMsg =this.translate.instant('FIRST_NAME_PATTERN_WRONG');
            }
            
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {

                }
            );
           control.setFocus();
            return false;
        }
        control =  this.registerForm.controls['lastName'];

        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = this.translate.instant('LAST NAME REQ');
            } else if (control.errors['minlength']) {
                errorMsg = this.translate.instant('LAST NAME NOT VALID');
            } else if(control.errors['pattern'])
            {
                 errorMsg =this.translate.instant('LAST_NAME_PATTERN_WRONG');
            }
            
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {

                }
            );
           control.setFocus();
            return false;
        }
         control =  this.registerForm.controls['userName'];

        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = this.translate.instant('UNAME REQ');
            } else if (control.errors['minlength']) {
                errorMsg = this.translate.instant('UNAME NOT VALID');
            }
             else if(control.errors['pattern'])
            {
                 errorMsg =this.translate.instant('USER_NAME_PATTERN_WRONG');
            }
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {

                }
            );
           control.setFocus();
            return false;
        }
        
        control =  this.registerForm.controls['password'];
        
        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = this.translate.instant('PSWD REQ');
            } else if (control.errors['minlength']) {
                errorMsg = this.translate.instant('PSWD NOT VALID');
            }else if(control.errors['pattern'])
            {
                errorMsg =this.translate.instant('PSWD_PATTERN_WRONG');
            }
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {
                        
                }
            );
            control.setFocus();
            return false;
        }
        
        control =  this.registerForm.controls['confirmPassword'];
        
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
            control.setFocus();
            return false;
        }
        if(!(this.userDetails.password==this.userDetails.confirmPassword))
        {
                control =  this.registerForm.controls['confirmPassword'];
                errorMsg = this.translate.instant('PSWD MUST MATCH');
             Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {
                        
                });
            control.setFocus();
            return false;
        }
        
        
         control =  this.registerForm.controls['emailId'];
        
        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = this.translate.instant('EMAIL REQ');
            } else if (control.errors['minlength']) {
                errorMsg = this.translate.instant('EMAIL  NOT VALID');
            } else if(control.errors['pattern']){
                errorMsg =this.translate.instant('EMAIL_PATTERN_WRONG');
            }
            
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {
                        
                }
            );
            control.setFocus();
            return false;
        }
        control =  this.registerForm.controls['mobileNumber'];
        
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
               
       control = this.registerForm.controls['gender']; 
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
       control = this.registerForm.controls['country']; 
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
        control = this.registerForm.controls['secQuestion']; 
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
        control =  this.registerForm.controls['secAnswer'];

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
        if (this.registerForm.valid) {
            return true;
        }
   }
   checkTermsCondition()
   {
       {
    let confirm = this.alertCtrl.create({
      title:this.translate.instant('TERMSCONDITIONTITLE'),
      message:this.translate.instant('TERMSCONDITIONCONTENT'),
      buttons: [
        {
          text: this.translate.instant('TERMSCONDITIONAGREE'),
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
       }
   }

}
