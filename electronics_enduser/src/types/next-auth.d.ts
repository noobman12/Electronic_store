// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      first_name: string;
      access_token: string;
    };
  }

  interface User {
    id: string;
    email: string;
    first_name: string;
    access_token: string;
  }

  interface JWT {
    id: string;
    email: string;
    first_name: string;
    accessToken: string;
  }
}
