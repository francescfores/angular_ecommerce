import {Product, Variation} from "./product";
import {Payment} from "./payment";

export class Cart {
  id: number;
  name: string;
  info: string;
  num: string;
  date: any;
  status: any;
  total: any;
  products: Variation[]=[];
  payment:Payment;
  shipping:any;
  sub_total:any;
}

