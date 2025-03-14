import Link from "next/link";
import { Twitter, Linkedin, Github, Cpu } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-cyan-900/30 text-gray-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Product Column */}
          <div>
            <h3 className="font-mono text-cyan-400 mb-4 text-sm uppercase tracking-wider">
              System
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Credits
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Sports Column */}
          <div>
            <h3 className="font-mono text-purple-400 mb-4 text-sm uppercase tracking-wider">
              Sports
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  NBA
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Soccer
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  NFL
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  MLB
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-mono text-blue-400 mb-4 text-sm uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-mono text-red-400 mb-4 text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          <div className="text-gray-500 mb-4 md:mb-0 font-mono text-sm">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-500" />
              <span>L.U.C.I. SYSTEM v2.4.7</span>
            </div>
            <div className="mt-1">
              © {currentYear} L.U.C.I. AI SPORTS PREDICTION. ALL RIGHTS
              RESERVED.
            </div>
          </div>

          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-500 hover:text-cyan-400 transition-colors"
            >
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-purple-400 transition-colors"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-400 transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
