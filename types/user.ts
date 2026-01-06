export type UserAccess = 'FREE' | 'PREMIUM';

export interface UserProfile {
  id: string;
  name: string;
  access: UserAccess;
}
