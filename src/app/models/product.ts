
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
}

export class Variation {
  id: any;
  price :any;
  stock :any;
  img: File;
  attributes: any[];
}



