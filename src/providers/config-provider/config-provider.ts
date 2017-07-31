import { Injectable } from '@angular/core';
import { Page1 } from '../../pages/page1/page1';
import { Page2 } from '../../pages/page2/page2';
import {LoginPage} from'../../pages/login/login';
import {ProfilePage} from'../../pages/profile/profile';
import {HomePage} from'../../pages/home/home';
import { TranslateService } from 'ng2-translate';
import { ShoppingItemsPage } from '../../pages/shopping-items/shopping-items';


interface MenuObj {
    title: string;
    component: any;
    icon: string;
    index?: number;
    color: string;
}
@Injectable()
export class ConfigProvider {

    serverURL: string;
    loginPath: string;
    registerPath: string;
    sideMenus: MenuObj[];

    constructor( public translate: TranslateService) {
        this.sideMenus = [{ title: 'Home', component: HomePage, index: 0, icon: 'home', color: '#D81B60' },
            { title: 'Card Management', component: Page1, index: 1, icon: 'card', color: 'indigo' },
             { title: 'Profile', component: ProfilePage, index: 2, icon: 'people', color: '#1B5E20' },
             {title: 'Shop', component: ShoppingItemsPage, index: 3, icon: 'cart', color: '#B9770E' },
        ];
        this.serverURL = 'http://10.44.11.33:8081';
        this.loginPath = 'getUserByUnameAndPswd';
        this.registerPath = 'addUser';
    }
    getSideMenus(): any {
        return this.sideMenus;
    }
    getServerURL(): string {
        return this.serverURL;
    }

    getLoginPath(): string {
        return this.loginPath;
    }
    getRegisterPath(): string {
        return this.registerPath;
    }

    getCurrentDateTime(): any {
        var date = new Date();
        var options = {
            weekday: 'long', year: 'numeric', month: 'short',
            day: 'numeric', hour: '2-digit', minute: '2-digit'
        };

        return date.toLocaleTimeString('en-us', options);
    }
}