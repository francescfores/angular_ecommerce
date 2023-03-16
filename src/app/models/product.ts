
export class Product {
  id: number;
  name: string;
  desc: string;
  price :any;
  stock :any;
  img: string;
  category: any;
  subcategory: any;
  supercategory: any;
  colors: any[];
  inventory: any;
  sizes: any[];
  variations: Variation[];
  type: any;
}

export class Variation {
  id: any;
  price :any;
  stock :any;
  img: any;
  attributes: Attribute[];
  product:Product=undefined;
  total:number;
  new:boolean;
}

export class Attribute {
  id: any;
  name:any;
  value:any;
  desc:any;
}



