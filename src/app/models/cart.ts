import {Product, Variation} from "./product";

export class Cart {
  id: number;
  name: string;
  info: string;
  num: string;
  date: any;
  status: any;
  total: any;
  products: Variation[]=[];
  payment:any;
  shipping:any;
}

