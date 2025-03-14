import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { Cpu, UserCircle } from "lucide-react";
import UserProfile from "./user-profile";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full border-b border-cyan-900/30 bg-black/80 backdrop-blur-sm py-3 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="flex items-center gap-2">
          <Cpu className="h-6 w-6 text-cyan-500" />
          <span className="text-xl font-mono font-bold text-white">
            L.U.C.I.
          </span>
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Button
                  variant="outline"
                  className="border-cyan-700 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 hover:border-cyan-500"
                >
                  DASHBOARD
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                LOGIN
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-mono text-white bg-gradient-to-r from-cyan-600 to-blue-700 rounded-md hover:from-cyan-500 hover:to-blue-600 transition-all border border-cyan-500"
              >
                REGISTER
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
