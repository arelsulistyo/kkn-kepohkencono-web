"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import ModalShell from "./ModalShell";

type LoginProblem = { field?: "email" | "password"; message: string };

function describeLoginError(error: unknown): LoginProblem {
  const code = (error as { code?: string } | null)?.code ?? "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return { field: "password", message: "Email atau kata sandi salah. Silakan periksa kembali." };
    case "auth/invalid-email":
      return { field: "email", message: "Format email tidak valid." };
    case "auth/missing-password":
      return { field: "password", message: "Kata sandi wajib diisi." };
    case "auth/user-disabled":
      return { message: "Akun ini dinonaktifkan. Hubungi admin desa." };
    case "auth/too-many-requests":
      return { message: "Terlalu banyak percobaan login. Tunggu beberapa menit, lalu coba lagi." };
    case "auth/network-request-failed":
      return { message: "Tidak dapat terhubung. Periksa koneksi internet Anda." };
    default:
      return { message: "Login gagal. Silakan coba lagi." };
  }
}

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoggedIn: () => void;
}

export default function LoginDialog({ open, onOpenChange, onLoggedIn }: LoginDialogProps) {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setPassword("");
      setEmailError("");
      setPasswordError("");
    }
    onOpenChange(next);
  };

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
        setPassword("");
        onLoggedIn();
      } else {
        console.error("Login gagal:", result.error);
        const problem = describeLoginError(result.error);
        if (problem.field === "email") setEmailError(problem.message);
        else if (problem.field === "password") setPasswordError(problem.message);
        toast({ variant: "destructive", title: "Login gagal", description: problem.message });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Login gagal",
        description: "Terjadi kesalahan saat login. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={handleOpenChange}
      kicker="akses petugas"
      title="Login perangkat desa"
      description="Masuk dengan akun petugas untuk membuat dan mengunduh surat."
    >
      <form className="ls-login-form" onSubmit={handleLogin} noValidate>
        <div className={`form-field ${emailError ? "has-error" : ""}`}>
          <label htmlFor="ls-login-email">Email</label>
          <input
            id="ls-login-email"
            type="email"
            autoComplete="username"
            placeholder="nama@kepohkencono.desa.id"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? "ls-login-email-error" : undefined}
            required
          />
          {emailError && <em id="ls-login-email-error">{emailError}</em>}
        </div>
        <div className={`form-field ${passwordError ? "has-error" : ""}`}>
          <label htmlFor="ls-login-password">Password</label>
          <input
            id="ls-login-password"
            type="password"
            autoComplete="current-password"
            placeholder="Masukkan kata sandi"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordError ? "ls-login-password-error" : undefined}
            required
          />
          {passwordError && <em id="ls-login-password-error">{passwordError}</em>}
        </div>
        <button
          type="submit"
          className="primary-button ls-block-button"
          disabled={isLoading || !email || !password}
          aria-busy={isLoading}
        >
          {isLoading ? "Memproses…" : "Login"}
        </button>
      </form>
    </ModalShell>
  );
}
