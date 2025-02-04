import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add the id field
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
