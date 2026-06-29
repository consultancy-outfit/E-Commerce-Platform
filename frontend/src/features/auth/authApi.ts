import { baseApi } from "@/src/lib/api/baseApi";
import type { AuthResponse, User } from "@/src/lib/types";

interface SignupBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
interface LoginBody {
  email: string;
  password: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signup: build.mutation<AuthResponse, SignupBody>({
      query: (body) => ({ url: "/auth/signup", method: "POST", body }),
    }),
    login: build.mutation<AuthResponse, LoginBody>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    me: build.query<User, void>({
      query: () => "/auth/me",
    }),
  }),
});

export const { useSignupMutation, useLoginMutation, useMeQuery } = authApi;
