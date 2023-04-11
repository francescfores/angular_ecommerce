import {Order} from "./order";
import {Client} from "./client";
import {Return} from "./return";
import {Variation} from "./product";

export class ReturnDetail {
  id: number;
  num: string;
  info: string;
  quantity: string;
  price: string;
  status: string;
  return: Return;
  variation : Variation;
}
