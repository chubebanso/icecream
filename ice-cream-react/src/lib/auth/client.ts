'use client';

import type { User } from '@/types/user';

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  // Method for signing up (dummy implementation)
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    const token = generateToken(); // This can remain if you want to simulate the process
    localStorage.setItem('custom-auth-token', token);
    return {};
  }

  // OAuth login placeholder
  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  // Updated method for sign in with password, fetching token from the API
  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      // Check if the response is valid and contains the access token
      if (!response.ok || !data.data?.accessToken) {
        return { error: data.message || 'Invalid credentials' };
      }

      // Save the retrieved token in localStorage
      localStorage.setItem('custom-auth-token', data.data.accessToken);

      return {};
    } catch (error) {
      console.error("Login error:", error);
      return { error: 'An error occurred during login.' };
    }
  }

  // Password reset placeholder
  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  // Password update placeholder
  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  // Method to get user data based on the token in localStorage
  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('custom-auth-token');

    // If there is no token, user is not authenticated
    if (!token) {
      return { data: null };
    }

    // If a real user endpoint is available, it can be added here to verify the token
    return { data: user }; // Simulated user data; replace with API call if needed
  }

  // Method to sign out the user
  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    return {};
  }
}

// Generate a token as fallback or placeholder (only used in signUp)
function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

// Export an instance of AuthClient
export const authClient = new AuthClient();
