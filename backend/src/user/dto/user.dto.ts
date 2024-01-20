
export class UserAccountDto {
  id: number;
  publicKey: string;
}

// Exclude password field
export class UserDto {
  id: number;
  username: string;
  // Array of account objects with id and publicKey
  accounts: UserAccountDto[]; 
}