// modify the response of your account creation function so that it only 
// returns the id, publicKey, and user.id

export class AccountResponseDto {
  id: number;
  publicKey: string;
  user: { id: number };
}