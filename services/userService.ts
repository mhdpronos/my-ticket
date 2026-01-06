import { mockUserAccess } from '@/data/user';
import { UserAccess } from '@/types';

export const getUserAccess = async (): Promise<UserAccess> => Promise.resolve(mockUserAccess);
