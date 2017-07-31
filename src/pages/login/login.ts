import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, LoadingController, ToastController, Platform, AlertController  } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Toast, Dialogs, Keyboard} from 'ionic-native';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { LoginProvider } from '../../providers/login-provider/login-provider';
import { StorageService } from '../../services/storage';
import { TranslateService } from 'ng2-translate';


var tempThis;

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    @ViewChild(Content) content: Content;
    public notification: any;
    public loginForm: FormGroup;
    modalUsername;
    modalPassword;
    registerPage = RegisterPage;
    y;
    h;
    offsetY;

    constructor(public navCtrl: NavController, public platform: Platform, private formBuilder: FormBuilder,
        private loadingCtrl: LoadingController, private toastCtrl: ToastController, public translate: TranslateService,
        public loginProvider: LoginProvider, public alertCtrl: AlertController, public storage: StorageService, public navParams: NavParams) {
        this.loginForm = this.formBuilder.group({ username: ['', Validators.required], password: ['', Validators.required] });
        tempThis = this;
        this.notification = this.navParams.get("notificationDetails");
    }

    submitLogin(username, password) {
        let loading = this.loadingCtrl.create({
            content: this.translate.instant('WAIT')
        });
        if (this.validate(username, password)) {
            Keyboard.close();
            loading.present().then(() => {
                this.loginProvider.submitCredentials(this.modalUsername, this.modalPassword).then((resp) => {
                    console.error("login response here");
                    console.log(resp);
                    if (resp == "00") {
                       this.storage.get("userInfo").then((res) => {
                             if (res !== '' && typeof res !== typeof undefined && res !== null) {
                                    let data = {
                                        userID: JSON.parse(res).userID,
                                        lastAccessDate: JSON.parse(res).lastAccessDate,
                                        fName: JSON.parse(res).fName,
                                        lName: JSON.parse(res).lname
                                    };
//                                    let userID=JSON.parse(res).userID;
//                                      this.loginProvider.updateLastUpdate(userID).then((res) =>{
                                           if (resp == "00") {
                                               console.log("Response for last access date update"+res)
                                               loading.dismiss();
                                               this.navCtrl.setRoot(HomePage, {"notificationDetails":this.notification, lastAccessDate: data.lastAccessDate});
                                            }else {
                                                loading.dismiss();
                                                Toast.show(this.translate.instant('LOGIN FAILED'), '4000', 'center').subscribe(
                                                    toast => {
                                                    }
                                                );
                    
                                            }
//                                      },(error) =>{
//                                          if(error=="timeout"){
//                                                loading.dismiss();
//                                                Toast.show(this.translate.instant('REQ_TIMEOUT'), '4000', 'center').subscribe(
//                                                    toast => {
//                                                    }
//                                                );
//                                            }else{
//                                                loading.dismiss();
//                                                Toast.show(this.translate.instant('LOGIN FAILED'), '4000', 'center').subscribe(
//                                                    toast => {
//                                                    }
//                                                );
//                                            }
//                                      });
                                }
                        });
                    }else if (resp == "14") {
                        loading.dismiss();
                        Toast.show(this.translate.instant('LOGIN FAILED'), '4000', 'center').subscribe(
                            toast => {
                            }
                        );
                    } else {
                        loading.dismiss();
                        Toast.show(this.translate.instant('LOGIN FAILED'), '4000', 'center').subscribe(
                            toast => {
                            }
                        );

                    }
                       
                }, (error) => {
                    if(error=="timeout"){
                        loading.dismiss();
                        Toast.show(this.translate.instant('REQ_TIMEOUT'), '4000', 'center').subscribe(
                            toast => {
                            }
                        );
                    }else{
                        loading.dismiss();
                        Toast.show(this.translate.instant('LOGIN FAILED'), '4000', 'center').subscribe(
                            toast => {
                            }
                        );
                    }
                });
            });
        }
    }


    validate(username, password): boolean {
        let errorMsg = '';
        let control = this.loginForm.controls['username'];

        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = this.translate.instant('UNAME REQ');
            }
            username.setFocus();
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {
                }
            );

            return false;
        }

        control = this.loginForm.controls['password'];
        if (!control.valid || control.value === '') {
            if (control.errors['required']) {
                errorMsg = this.translate.instant('PSWD REQ');
            }
            password.setFocus();
            Toast.show(errorMsg, '2000', 'center').subscribe(
                toast => {
                }
            );
            return false;
        }

        if (this.loginForm.valid) {
            return true;
        }
    }

    scrollContentTop() {
        setTimeout(() => {
            this.content.scrollTo(0, 100, 200);
        }, 0);
    }

    openRegister() {
        this.navCtrl.push(RegisterPage);
    }

    forgotPassword() {
        let prompt = this.alertCtrl.create({
            title: 'Forgot Password',
            message: "Enter the email Id, Password will send to ur mail id.",
            inputs: [
                {
                    name: 'title',
                    placeholder: 'Email Id'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Submit',
                    handler: data => {
                        console.log('Submit clicked');
                    }
                }
            ]
        });
        prompt.present();
    }

    tapCoordinatesLogin(e) {
        tempThis.y = e.touches[0].clientY;
        tempThis.h = window.innerHeight;
        tempThis.offsetY = (tempThis.h - tempThis.y);
    }

    keyboardShowHandlerLogin(e) {
        let kH = e.keyboardHeight;

        console.log("ya lofgin");
        if (tempThis.offsetY < kH + 40) {
            tempThis.scrollContentTop();
        }
    }
}
