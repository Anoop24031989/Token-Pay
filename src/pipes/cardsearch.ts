import { Injectable, Pipe ,PipeTransform} from '@angular/core';

interface CardInfo {
    CardNumber: string;
    
} 
@Pipe({
  name: 'cardsearch'
})
@Injectable()
export class CardSearch implements PipeTransform {
  /*
    Takes a value and makes it lowercase.
   */
  transform(cards: Array<any>, searchTxt: any) {
       if(cards == null){
          return null;
      }
      console.log(cards);
      try {
             let query = String(searchTxt).toLowerCase();
             console.log(query);
             if(query == ""){
               return cards;
             }else{
                 console.log("Search");
                return cards.filter((card) =>{
                    return (card.toString()).toLowerCase().indexOf(query) > -1;
                }); 
             }
        } catch (e) {
            return cards;
        }
  }
}
         

