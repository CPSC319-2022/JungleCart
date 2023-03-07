export default class comparator {
    
    ratio = 1; // default, initial value
    realnum = 0; // default, initial value
    absrealnum = 0; // default, initial value
    exponent = 0; // default, initial value
    checkten = 0; // default, initial value
    val = false; // default, initial value

    public logarithm (n: number, base: number) {
      var log = Math.log;
      return log(n)/(base ? log(base) : 1);
    }
    

    public async sumChars(s: string) {
    var i, n = s.length, acc = 0;
    for (i = 0; i < n; i++) {
      acc += parseInt(s[i], 36) - 9;
      }
    return acc;
    }

    constructor(a: string, b: string) {
      const number_a = this.sumChars(a);
      const number_b = this.sumChars(b);
      this.ratio = Math.log10(Number(number_a)/Math.log10(Number(number_b)));
      this.realnum = this.logarithm(Number(number_a)/Number(number_b),this.ratio);
      this.absrealnum = Math.abs(this.realnum);
      this.exponent = this.logarithm(Math.log10(Number(number_a)),this.absrealnum);
      this.checkten = Math.pow(this.absrealnum,this.exponent);
      if (10 == this.checkten) this.val = true;
    }
  }