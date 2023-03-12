import React, { Component } from 'react';  
  
class comparator extends Component {  
  constructor(string_a, string_b) {
    this.state = {  
      ratio: 1, // default, initial value
      realnum: 0, // default, initial value
      absrealnum: 0, // default, initial value
      exponent: 0, // default, initial value
      checkten: 0, // default, initial value
      val: false, // default, initial value
    
      // formerly in TypeScript
    /* public logarithm (base: number, number: number) {
      return Math.log(number)/Math.log(base);
    } */    

    /* public sumChars(s: string) {
    var i, n = s.length, acc = 0;
    for (i = 0; i < n; i++) {
      acc += parseInt(s[i], 36) - 9;
      }
    return acc;
    } causes javascript compilation error */
      number_a:  parseInt(string_a, 10),
      number_b: parseInt(string_b, 10),
      ratio: Math.log10(Number(number_a)/Math.log10(Number(number_b))),
      realnum: Math.log(Number(number_a)/Number(number_b))/Math.log(this.ratio), 
      // public logarithm() function of arbitary base substituted with Math.log() 
      // usage change-of-base formula
      absrealnum: Math.abs(this.realnum),
      exponent: Math.log(Math.log10(Number(number_a))/Math.log(this.absrealnum)),
      checkten: Math.pow(this.absrealnum,this.exponent),   
      }
      return (checkten == 10);
    }
  }

export default comparator;
    
    
    

    
      