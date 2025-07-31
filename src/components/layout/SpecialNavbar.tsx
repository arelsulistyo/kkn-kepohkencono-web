"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface SpecialNavbarProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  showAuth?: boolean;
  responsive?: boolean;
}

export interface SpecialNavbarRef {
  openLoginDialog: () => void;
}

const SpecialNavbar = forwardRef<SpecialNavbarRef, SpecialNavbarProps>((
  {
    title,
    description,
    icon,
    gradientFrom,
    gradientTo,
    showAuth = false,
    responsive = false,
  },
  ref
) => {
  const { user, login, logout, loading } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    openLoginDialog: () => {
      if (!user && showAuth) {
        setIsDialogOpen(true);
      }
    },
  }));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setEmailError("");
      setPasswordError("");

      const result = await login(email, password);
      if (result.success) {
        toast({
          title: "Login berhasil",
          description: "Selamat datang di dashboard admin",
        });
        setIsDialogOpen(false);
      } else {
        if (result.error) {
          const errorMessage =
            typeof result.error === "string"
              ? result.error
              : (result.error as any)?.message || "Unknown error";
          if (errorMessage.includes("email")) {
            setEmailError(errorMessage);
          } else if (errorMessage.includes("password")) {
            setPasswordError(errorMessage);
          } else {
            toast({
              variant: "destructive",
              title: "Login gagal",
              description:
                errorMessage || "Terjadi kesalahan. Silakan coba lagi.",
            });
          }
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terjadi kesalahan saat login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await logout();
    if (result.success) {
      toast({
        title: "Logout berhasil",
        description: "Sampai jumpa kembali!",
      });
    }
  };

  if (responsive) {
    return (
      <nav className="bg-white/90 backdrop-blur-[2px] fixed w-full z-50 shadow-xl top-0 left-0">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:grid sm:grid-cols-3 items-center gap-3 sm:gap-0">
            <div className="flex justify-start w-full sm:w-auto">
              <Link
                href="/"
                className="flex items-center space-x-2 text-green-800 hover:text-green-900"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold text-sm sm:text-base">
                  Kembali ke Beranda
                </span>
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center col-span-1">
              <div className="flex items-center">
                <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} p-1.5 sm:p-2 rounded-md mr-2`}>
                  {icon}
                </div>
                <h1 className={`text-lg sm:text-2xl font-bold bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent font-poppins`}>
                  {title}
                </h1>
              </div>
              <p className="text-md sm:text-md text-gray-600 mt-1 max-w-md text-center px-2">
                {description}
              </p>
            </div>
            <div className="hidden sm:flex justify-end">
              {/* Empty space for responsive layout */}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white/90 backdrop-blur-[2px] fixed w-full z-50 shadow-xl top-0 left-0">
      <div className="container mx-auto px-6 py-4">
        <div className="grid grid-cols-5 items-center">
          <div className="flex justify-start col-span-1">
            <Link
              href="/"
              className="flex items-center space-x-2 text-green-800 hover:text-green-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Kembali ke Beranda</span>
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center col-span-3">
            <div className="flex items-center">
              <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} p-2 rounded-md mr-2`}>
                {icon}
              </div>
              <h1 className={`text-2xl font-bold bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent font-poppins`}>
                {title}
              </h1>
            </div>
            <p className="text-md text-gray-600 mt-1 text-center whitespace-nowrap">
              {description}
            </p>
          </div>
          <div className="flex justify-end col-span-1">
            {showAuth && (
              <>
                {loading ? (
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                    disabled
                  >
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </Button>
                ) : user ? (
                  <div className="flex justify-end">
                    <div className="flex items-center gap-3">
                      <div className="relative group">
                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-4 py-2 hover:border-green-300 hover:shadow-md transition-all duration-300 cursor-pointer">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {user.email
                                ? user.email.substring(0, 2).toUpperCase()
                                : "AD"}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {user.email}
                            </span>
                            <span className="text-xs text-gray-500">
                              Administrator
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 text-gray-500 hover:text-red-600 hover:bg-red-50 p-1 h-auto"
                            onClick={handleLogout}
                          >
                            Logout
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <LogIn className="h-4 w-4" />
                        Login
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader className="pb-0">
                        <DialogTitle>Login Admin</DialogTitle>
                        <DialogDescription>
                          Masuk sebagai admin untuk mengelola layanan surat.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setEmailError("");
                            }}
                            className={`bg-gray-100 placeholder:text-gray-800 ${
                              emailError ? "border-red-500" : "border-gray-400"
                            }`}
                            required
                          />
                          {emailError && (
                            <p className="text-sm text-red-500 mt-1">
                              {emailError}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Masukkan kata sandi"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setPasswordError("");
                            }}
                            className={`bg-gray-100 placeholder:text-gray-600 ${
                              passwordError ? "border-red-500" : "border-gray-400"
                            }`}
                            required
                          />
                          {passwordError && (
                            <p className="text-sm text-red-500 mt-1">
                              {passwordError}
                            </p>
                          )}
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-green-800 hover:bg-green-900 text-white"
                          disabled={isLoading}
                        >
                          {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {isLoading ? "Loading..." : "Login"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});

SpecialNavbar.displayName = "SpecialNavbar";

export default SpecialNavbar;