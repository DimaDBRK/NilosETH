export class PaymentDto {
  id: number;
  from: {
    id: number;
    publicKey: string;
  };
  to: {
    id: number;
    publicKey: string;
  };
  amount: number;
}