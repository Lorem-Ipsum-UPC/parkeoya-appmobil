import { User } from './data';

// Almacenamiento simple en memoria (para desarrollo)
let currentUser: User | null = null;

export const StorageService = {
  // Usuario actual
  async setCurrentUser(user: User): Promise<void> {
    currentUser = user;
    return Promise.resolve();
  },

  async getCurrentUser(): Promise<User | null> {
    return Promise.resolve(currentUser);
  },

  async removeCurrentUser(): Promise<void> {
    currentUser = null;
    return Promise.resolve();
  },

  async clearAll(): Promise<void> {
    currentUser = null;
    return Promise.resolve();
  },
};
