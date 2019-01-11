import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ConversionProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ConversionProvider {

  constructor(public http: Http) {
    console.log('Hello ConversionProvider Provider');
  }
	arabicNumber(value) {		
        if (!value) {		
            return;		
        }		
        var arabicNumbers = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "٠"],		
            persianNumbers = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰"];		
		
        for (var i = 0, numbersLen = arabicNumbers.length; i < numbersLen; i++) {		
            value = value.replace(new RegExp(arabicNumbers[i], "g"), persianNumbers[i]);		
        }		
        return value;		
    }

    englishNumber(value) {	
		value = this.arabicNumber(value);
        if (!value) {		
            return;		
        }		
        var englishNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],		
            persianNumbers = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰"];		
		
        for (var i = 0, numbersLen = englishNumbers.length; i < numbersLen; i++) {		
            value = value.replace(new RegExp(persianNumbers[i], "g"), englishNumbers[i]);		
        }		
         return value;
    }
}
