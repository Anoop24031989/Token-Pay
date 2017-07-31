import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { CartPage } from '../cart/cart';
import { StorageService } from '../../services/storage';
/*
  Generated class for the ShoppingItems page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-shopping-items',
  templateUrl: 'shopping-items.html'
})
export class ShoppingItemsPage {
  public items: Array<any>;
  public cartItems: Array<any> = [];
  public totalCartItem: number;
   public title:string;
  public i: number =0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public storage: StorageService) {
     this.title="Shopping";
     
     this.items=[{id:1001,name: "PNY Pendrive 16GB",Price:400,image:"assets/img/shopping_items/pendrive.jpg"},
            {id:1002,name:"BOSE Headphone",Price:3500,image:"assets/img/shopping_items/headphone.jpg"},
            {id:1003,name:"Lenova Laptop",Price:27000,image:"assets/img/shopping_items/laptop.png"},
            {id:1004,name:"Pen",Price:450,image:"assets/img/shopping_items/pen.jpg"},
            {id:1005,name:"Fastrack Sunglass",Price:4500,image:"assets/img/shopping_items/sunglass.jpeg"},
            {id:1006,name:"Tablet",Price:4500,image:"assets/img/shopping_items/tablet.jpg"}] 
      this.platform.ready().then(() => {
            this.platform.registerBackButtonAction(function(event) {
                if (navCtrl.canGoBack()) {
                    navCtrl.pop();
                    return;
                }
            }, 101);
      });
  }
 ionViewDidEnter(){
     this.storage.get("cartItems").then((res) =>{
         console.log(JSON.parse(res).length);
         this.totalCartItem=JSON.parse(res).length;
     });
 }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ShoppingItemsPage');
  }
   
 public addToCart(item: any){
     console.log(item);
     this.cartItems.push(item);
     this.i++;
     this.totalCartItem=this.cartItems.length;
 }
 public openCart(): any{
     this.navCtrl.push(CartPage,{"cartItems":this.cartItems});
 }
}
