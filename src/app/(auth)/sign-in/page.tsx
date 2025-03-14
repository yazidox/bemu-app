import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cpu, Lock, Mail } from "lucide-react";
import Link from "next/link";

interface LoginProps {
  searchParams: Promise<Message>;
}

export default async function SignInPage({ searchParams }: LoginProps) {
  const message = await searchParams;

  if ("message" in message) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-8 relative">
        {/* Cyberpunk grid background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80')] bg-cover opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black"></div>

        {/* Animated scan line effect */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent bg-[length:100%_4px] bg-repeat-y animate-scan pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(0,255,255,0.1) 50%, transparent 50%)",
          }}
        ></div>

        <div className="w-full max-w-md rounded-lg border border-cyan-900/50 bg-gray-900/80 p-6 shadow-lg backdrop-blur-sm relative z-10">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-cyan-900/80 px-4 py-1 rounded-md border border-cyan-500">
            <div className="flex items-center gap-2 text-cyan-300 font-mono text-sm">
              <Cpu size={14} className="animate-pulse" />
              <span>SYSTEM LOGIN</span>
            </div>
          </div>

          <form className="flex flex-col space-y-6">
            <div className="space-y-2 text-center mt-4">
              <h1 className="text-3xl font-semibold tracking-tight text-white font-mono">
                ACCESS L.U.C.I.
              </h1>
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  className="text-cyan-400 font-medium hover:underline transition-all"
                  href="/sign-up"
                >
                  Register
                </Link>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-300 font-mono flex items-center gap-2"
                >
                  <Mail size={14} className="text-cyan-500" />
                  EMAIL
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full bg-gray-800/80 border-gray-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-300 font-mono flex items-center gap-2"
                  >
                    <Lock size={14} className="text-cyan-500" />
                    PASSWORD
                  </Label>
                  <Link
                    className="text-xs text-gray-500 hover:text-cyan-400 hover:underline transition-all"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Your password"
                  required
                  className="w-full bg-gray-800/80 border-gray-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            <SubmitButton
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-mono border border-cyan-500"
              pendingText="AUTHENTICATING..."
              formAction={signInAction}
            >
              LOGIN
            </SubmitButton>

            <FormMessage message={message} />
          </form>
        </div>
      </div>
    </>
  );
}
