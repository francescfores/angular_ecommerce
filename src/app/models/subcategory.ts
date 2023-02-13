import {SuperCategory} from "./supercategory";

export class SubCategory {
  id: number;
  num: number;
  name: string;
  desc: string;
  img: string;
  price: any;
  supercategories: SuperCategory[];
}
