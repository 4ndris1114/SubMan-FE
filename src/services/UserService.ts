import type { IUser } from '@/types/interfaces/IUser';
import instance from './httpClient'
import { mapToIUser } from '@/utils/mappers';

export class UserService {
    async login(email: String, password: String) {
        try {
            const response = await instance.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    async register(username: String, email: String, password: String) {
        try {
            const response = await instance.post('/auth/register', { username, email, password });
            return response.data;
        } catch (error) {
            console.error('Error during register:', error);
            throw error;
        }
    }

    async logout() {
        //endpoint for logout or just clear token + loggedInUser info ?
    }

    async getUserById(userId: string) {
      try {
        const response = await instance.get(`/user/${userId}`);
        return mapToIUser(response.data);
      } catch (error) {
        console.error('Error fetching user by id:', error);
        throw error;
      }
    }

    mapToIUser(user: any): IUser {
      return {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      } as IUser;
    }
}
