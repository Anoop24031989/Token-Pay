'use strict';
import { Injectable } from '@angular/core';
import { Storage }    from '@ionic/storage';

@Injectable()
export class StorageService {

  private storage: Storage;

  constructor() {
    this.storage = StorageService.initStorage();
  }

  public static initStorage(): Storage {
    return new Storage();
  }

  public get(key: string): Promise<any> {
      return new Promise((resolve, reject) =>{
          console.log('get');
         this.storage.get(key).then((data) => {
             if (typeof data !== typeof undefined && data!==null) {
                 resolve(data);
             }else {
              reject('error');
            }
         })
      });
  }

  public set(key: string, value: string): Promise<{}> {
    return this.storage.set(key, value);
  }

  public remove(key: string): Promise<{}> {
    return this.storage.remove(key);
  }
}
