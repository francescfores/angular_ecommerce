import {Client} from "./client";

export class Address {
  id: number;
  name: number;
  surnames: string;
  dni: string;
  phone: string;
  address: string;
  address_detail: string;
  notes: string;
  country: string;
  zip: string;
  city: string;
  province: string;
  location: string;
  lat: string;
  lng: string;
  client: Client;
}
