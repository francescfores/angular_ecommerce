
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
  imgs: any[];
  type: any;
}

export class Variation {
  id: any;
  price :any;
  stock :any;
  img: any;
  attributes: Attribute[];
  product:Product;
  total:any;
  new:boolean;
  count:any;
  imgs: any[];
}

export class Attribute {
  id: any;
  name:any;
  value:any;
  desc:any;
}



