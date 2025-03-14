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
      <div className="flex min-h-screen flex-col items-center justify-center bg-[url('/bg.png')] px-4 py-8 relative">
        {/* Windows 98 style background pattern */}
        <div className="absolute inset-0 bg-[url('/bg.png')] bg-repeat opacity-10"></div>

        <div className="w-full max-w-md rounded-none border-2 border-gray-500 bg-[#ece9d8] p-6 shadow-md relative z-10">
          {/* Windows title bar */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-[#000080] to-[#1084d0] flex items-center px-2 -mt-8 border-2 border-gray-500 border-b-0">
            <div className="flex items-center gap-2 text-white font-bold">
              <Cpu size={16} />
              <span>L.U.C.I. System Login</span>
            </div>
            <div className="ml-auto flex">
              <button className="w-6 h-5 bg-[#c0c0c0] border border-gray-500 flex items-center justify-center text-xs mr-1">
                _
              </button>
              <button className="w-6 h-5 bg-[#c0c0c0] border border-gray-500 flex items-center justify-center text-xs mr-1">
                □
              </button>
              <button className="w-6 h-5 bg-[#c0c0c0] border border-gray-500 flex items-center justify-center text-xs">
                ×
              </button>
            </div>
          </div>

          <form className="flex flex-col space-y-6 mt-2">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-[#000080]">
                ACCESS L.U.C.I.
              </h1>
              <p className="text-sm text-gray-700">
                Don't have an account?{" "}
                <Link
                  className="text-blue-700 font-medium hover:underline transition-all"
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
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Mail size={14} className="text-[#000080]" />
                  EMAIL
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full bg-white border-2 border-gray-400 text-black focus:border-[#000080] shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Lock size={14} className="text-[#000080]" />
                    PASSWORD
                  </Label>
                  <Link
                    className="text-xs text-blue-700 hover:underline transition-all"
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
                  className="w-full bg-white border-2 border-gray-400 text-black focus:border-[#000080] shadow-inner"
                />
              </div>
            </div>

            <SubmitButton
              className="w-full bg-[#c0c0c0] hover:bg-[#d0d0d0] text-black font-bold border-2 border-gray-400 shadow-[inset_-1px_-1px_#707070,inset_1px_1px_#fff] active:shadow-[inset_1px_1px_#707070,inset_-1px_-1px_#fff]"
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
