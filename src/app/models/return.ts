import {Order} from "./order";
import {Client} from "./client";
import {ReturnDetail} from "./returnDetail";
import {Payment} from "./payment";
import {Sending} from "./sending";

export class Return {
  id: number;
  num: string;
  info: string;
  deilver_date: string;
  status: string;
  total: string;
  order: Order;
  client: Client;
  details: ReturnDetail[];
  payment:Payment;
  sending:Sending;
}
