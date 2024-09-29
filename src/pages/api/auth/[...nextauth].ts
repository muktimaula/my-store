//2.membuat fungtion login dengan librya next auth versi 4.24.8
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn } from "@/lib/firebase/servise";
import { compare } from "bcrypt";
import GoogleProvaider from "next-auth/providers/google";
import Email from "next-auth/providers/email";
import { loginWithGoogle } from "@/lib/firebase/servise";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, //tambahkan ini di env local
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const user: any = await signIn(email);
        if (user) {
          //untuk mengecek apakah email sudah terdaftar menggunakana bycrypt
          const passwoardConfirm = await compare(password, user.password);
          if (passwoardConfirm) {
            return user;
          }
          return null;
        } else {
          return null;
        }
      },
    }),
    // 3. credentials google
    GoogleProvaider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
    }),
  ], //setelah credentials ditambahkan lanjut membuat authorize

  callbacks: {
    async jwt({ token, account, profile, user }: any) {
      if (account?.provider === "credentials") {
        token.email = user.email;
        token.fullname = user.fullname;
        token.phone = user.phone;
        token.role = user.role;
      }
      // 3.CEK GOOGLE
      if (account?.provider === "google") {
        const data = {
          fullname: user.name,
          email: user.email,
          type: "google",
        }; //lanjut fungsi with google di firebase/servise.ts
        // 3. mambuat login
        await loginWithGoogle(data, (data: any) => {
          token.email = data.email;
          token.fullname = data.fullname;
          token.role = data.role;
        }); //lanjut buat button di view/auth/login/index.tsx
      }

      return token;
    },

    async session({ session, token }: any) {
      if ("email" in token) {
        session.user.email = token.email;
      }
      if ("fullname" in token) {
        session.user.email = token.fullname;
      }
      if ("phone" in token) {
        session.user.email = token.phone;
      }
      if ("role" in token) {
        session.user.email = token.role;
      }
      return session;
    },
  },
  pages: {
    //custom login diserver
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);

//lanjut ke auth/_app.tsx untuk membuat session provider
