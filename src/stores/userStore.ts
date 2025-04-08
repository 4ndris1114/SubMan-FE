import type { IUser } from '@/types/interfaces/IUser';
import { UserService } from '@/services/UserService';

import router from '@/router'  // Import router to perform navigation
import { defineStore } from 'pinia';
import {jwtDecode} from 'jwt-decode';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    loggedInUser: null as IUser | null,
    token: sessionStorage.getItem('jwtToken') || null as string | null,
    isAuthenticated: false, 

    userService: new UserService() as UserService,
  }),

  actions: {
    async initAuth() {
      if (this.token) {
        try {
          const decoded = jwtDecode<{ userId: string, exp: number }>(this.token);
          if (decoded.exp * 1000 < Date.now()) {
            console.warn('Token has expired, clearing session');
            this.clearAuthData();
            return;
          }
          this.loggedInUser = await this.getUserById(decoded.userId);
          this.isAuthenticated = true;
        } catch (error) {
          console.error("Failed to restore session:", error);
          this.clearAuthData();
        }
      }
    },
    
    async login(email: string, password: string) {
      try {
        const token = await this.userService.login(email, password);
        this.assignToken(token);

        router.push('/');
      } catch (e: any) {
          throw e;
      }
    },

    async register(username: string, email: string, password: string) {
      try {
        await this.userService.register(username, email, password);
      } catch (e) {
        throw e;
      }
    },

    async logout() {
    },

    async getUserById(userId: string) {
      try {
        const user = await this.userService.getUserById(userId);
        return user;
      } catch (e: any) {
        console.error(e);
        throw e;
      }
    },

    async assignToken(token: string) {
      this.persistTokenInSessionStorage(token);
      this.token = token;
      this.isAuthenticated = true;
      try {
        const decoded = jwtDecode<{ userId: string }>(token);
        this.loggedInUser = await this.getUserById(decoded.userId); // Fetch full user details
      } catch (error) {
        console.error("Error decoding token:", error);
        this.clearAuthData();
      }
    },

    persistTokenInSessionStorage(token: string) {
      sessionStorage.setItem('jwtToken', token);
    },

    clearAuthData() {
      sessionStorage.removeItem('jwtToken');
      this.token = null;
      this.isAuthenticated = false;
      this.loggedInUser = null;
    }
  },
});
