import {SubCategory} from "./subcategory";

export class Category {
  id: number;
  num: number;
  name: string;
  desc: string;
  img: string;
  price: any;
  subcategories: SubCategory[];
}
