"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { UserCircle, Home, Cpu } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <nav className="w-full border-b border-cyan-900/30 bg-black/80 backdrop-blur-sm py-3 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" prefetch className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="L.U.C.I. AI Logo"
              width={180}
              height={180}
              className="drop-shadow-sm"
            />
          </Link>
          <Link
            href="/"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
            >
              <Home className="h-4 w-4 mr-2" />
              HOME
            </Button>
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
              >
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gray-900 border border-cyan-900 text-gray-300"
            >
              <DropdownMenuItem
                className="hover:bg-gray-800 hover:text-red-400 cursor-pointer font-mono text-sm"
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.refresh();
                }}
              >
                LOGOUT
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
