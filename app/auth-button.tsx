"use client";
import {
  createClientComponentClient,
  Session,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { cookies } from "next/headers";

export default function AuthButton({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient({
    supabaseKey: process.env.NEXT_PUBLIC_ANON_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  });

  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return session ? (
    <button className="text-xs text-gray-400" onClick={handleSignOut}>
      Logout
    </button>
  ) : (
    <button className="text-xs text-gray-400" onClick={handleSignIn}>
      Login
    </button>
  );
}
