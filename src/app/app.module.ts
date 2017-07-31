import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate/ng2-translate';
import { Http } from '@angular/http';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import {LoginPage} from'../pages/login/login';
import {HomePage} from'../pages/home/home';
import {RegisterPage} from'../pages/register/register';
import {ProfilePage} from'../pages/profile/profile';
import {CardRegistrationPage} from'../pages/card-registration/card-registration';
import {RegisteredCardsPage} from'../pages/registered-cards/registered-cards';
import {CardDetailsPage} from'../pages/card-details/card-details';
import { ConfigProvider } from '../providers/config-provider/config-provider';
import { CommonProvider } from '../providers/common-provider/common-provider';
import { LoginProvider } from '../providers/login-provider/login-provider';
import { RegistrationProvider } from '../providers/registration-provider/registration-provider';
import { CardManageProvider} from '../providers/cardmanage-provider/cardmanage-provider';
import { CardDisplayProvider} from '../providers/carddisplay-provider/carddisplay-provider';
import { PasswordProvider} from '../providers/password-provider/password-provider';
import { NotificationProvider } from '../providers/notification-provider/notification-provider';
import { PaymentProvider } from '../providers/payment-provider/payment-provider';
import { SpeechRecognisation} from '../providers/speech-recognisation/speech-recognisation';
import { CardSearch} from '../pipes/cardsearch';
import { StorageService } from '../services/storage';
import { NfcPayPage } from'../pages/nfc-pay/nfc-pay';
import { CartPage } from'../pages/cart/cart';
import { ShoppingItemsPage } from'../pages/shopping-items/shopping-items';


export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}
@NgModule({
    declarations: [
        MyApp,
        Page1,
        Page2,
        LoginPage,
        HomePage,
        RegisterPage,
        CardRegistrationPage,
        RegisteredCardsPage,
        CardDetailsPage,
        ProfilePage,
        CardSearch,
        ShoppingItemsPage,
        CartPage,
        NfcPayPage

    ],
    imports: [
        IonicModule.forRoot(MyApp),
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        }),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        Page1,
        Page2,
        LoginPage,
        HomePage,
        RegisterPage,
        CardRegistrationPage,
        RegisteredCardsPage,
        CardDetailsPage,
        ProfilePage,
        ShoppingItemsPage,
        CartPage,
        NfcPayPage

    ],
    providers: [SpeechRecognisation, CommonProvider, LoginProvider, ConfigProvider, RegistrationProvider, StorageService, CardManageProvider, CardDisplayProvider, PasswordProvider, NotificationProvider, PaymentProvider ]

    //    [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule { }
