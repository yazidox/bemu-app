import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { Cpu, UserCircle } from "lucide-react";
import UserProfile from "./user-profile";
import Image from "next/image";
export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full  py-2 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-md border-2 border-gray-400 shadow-inner">
            <Image src="/logo.png" alt="L.U.C.I. AI Logo" width={180} height={180} className="drop-shadow-sm" />
          </div>
        </Link>
        <div className="flex gap-3 items-center">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="bg-gradient-to-b from-blue-100 to-blue-300 text-blue-900 font-bold border-2 border-gray-400 rounded-md px-4 py-1 shadow-sm hover:from-blue-200 hover:to-blue-400 active:shadow-inner"
                >
                  <Cpu className="w-4 h-4 mr-2" />
                  DASHBOARD
                </Button>
              </Link>
              <div className="border-2 border-gray-400 rounded-md bg-gradient-to-b from-gray-100 to-gray-300 shadow-sm">
                <UserProfile />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="bg-gradient-to-b from-blue-100 to-blue-300 text-blue-900 font-bold border-2 border-gray-400 rounded-md px-4 py-1 shadow-sm hover:from-blue-200 hover:to-blue-400 active:shadow-inner"
              >
                LOGIN
              </Link>
              <Link
                href="/sign-up"
                className="bg-gradient-to-b from-green-100 to-green-300 text-green-900 font-bold border-2 border-gray-400 rounded-md px-4 py-1 shadow-sm hover:from-green-200 hover:to-green-400 active:shadow-inner"
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
