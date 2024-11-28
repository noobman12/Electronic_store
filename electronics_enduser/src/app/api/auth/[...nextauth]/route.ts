import { SETTINGS } from "@/constants/setting";
import type { Session } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt"; 

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password are required");
        }

        const res = await fetch(`${SETTINGS.URL_API}/v1/customers/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });


        const resJson = await res.json();

        if (res.ok && resJson) {
          const resUser = await fetch(`${SETTINGS.URL_API}/v1/customers/profile`,{
            method: "GET",
            headers: {
              Authorization: `Bearer ${resJson.data.access_token}`,
            },
          })

          const dataUser = await resUser.json();
          const user = {...dataUser.data, access_token: resJson.data.access_token}
          
          return user; // Trả về dữ liệu user (được lưu trong session)
        }

        //throw new Error(user.message || "Invalid credentials");
      },
    }),
          
  ],
  pages: {
    signIn: "/login", // Trang login tùy chỉnh
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: { id: string; email: string; first_name: string;  access_token: string } }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.first_name = user.first_name;
        token.accessToken = user.access_token; // Lưu access_token từ API
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        first_name: token.first_name as string,
        access_token: token.accessToken as string,
      };
      return session;
    },
  },
  secret: "74de109f75a2c6046a526621ac8e0c0886c8491098436564045deb18092d321d",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
