import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NfcPayPage } from'../nfc-pay/nfc-pay';
import { Toast } from 'ionic-native';
import { StorageService } from '../../services/storage';
/*
  Generated class for the Cart page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
 public cartItems: Array<any>=[];
 public title:string;
 public totalAmt: number;
 public disablePayment: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageService) {
      this.title="Cart";
      this.cartItems=this.navParams.get('cartItems');
      console.log(this.cartItems);
      this.storage.set("cartItems",JSON.stringify(this.cartItems));
      this.calculateTotalAmt().then((res)=>{
          this.totalAmt=res;
         if(res>0){
             this.disablePayment = false;
         }else{
             this.disablePayment = true;
         }
     });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }
 public removeItemFromCart(item: any): any{
     let index = this.cartItems.indexOf(item);
     this.cartItems.splice(index, 1);
     this.storage.set("cartItems",JSON.stringify(this.cartItems));
     this.calculateTotalAmt().then((res)=>{
         this.totalAmt=res;
         if(res>0){
             this.disablePayment = false;
         }else{
             this.disablePayment = true;
         }
     });
     
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
 public getBillNo(): Promise<any>{
     return new Promise((resolve)=>{
         let curDate= new Date();
         
         resolve(curDate);
     });  
 }
 public pay(){
     this.getBillNo().then((res)=>{
         console.log("Date:"+res);
        this.storage.get("userInfo").then((data) =>{
             
             let billDetails: Array<any> =[{"billDate":res,
                                            "billNo":res.getHours()+res.getMinutes()+res.getSeconds(),
                                            "payedBy":JSON.parse(data).fName+" "+JSON.parse(data).lName,
                                            "oneSignalId":JSON.parse(data).playerID,
                                            "totalAmt":this.totalAmt,
                                            "cartItems":this.cartItems}]
             this.navCtrl.push(NfcPayPage,{"billDetails":billDetails});
         });
         
     })
     
 }
}
