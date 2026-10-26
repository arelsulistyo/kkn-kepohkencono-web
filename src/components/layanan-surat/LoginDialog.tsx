"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import ModalShell from "./ModalShell";

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
      } else if (result.error) {
        const errorMessage =
          result.error instanceof Error ? result.error.message : String(result.error);
        if (errorMessage.includes("email")) {
          setEmailError(errorMessage);
        } else if (errorMessage.includes("password")) {
          setPasswordError(errorMessage);
        } else {
          toast({
            variant: "destructive",
            title: "Login gagal",
            description: errorMessage || "Terjadi kesalahan. Silakan coba lagi.",
          });
        }
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terjadi kesalahan saat login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={handleOpenChange}
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
