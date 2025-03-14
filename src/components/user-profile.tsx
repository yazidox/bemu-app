"use client";
import { Cpu, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const supabase = createClient();
  const router = useRouter();

  return (
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
          className="hover:bg-gray-800 hover:text-cyan-400 cursor-pointer font-mono text-sm"
          onClick={() => router.push("/dashboard")}
        >
          <Cpu className="mr-2 h-4 w-4" />
          DASHBOARD
        </DropdownMenuItem>
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
  );
}
