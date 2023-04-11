export class Payment {
  id: number;
  stripe_payment_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  token: any;
}
