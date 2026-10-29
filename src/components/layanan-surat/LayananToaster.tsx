"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { LS_ROOT_CLASS } from "@/app/layanan-surat/fonts";
import { CheckGlyph } from "./glyphs";

export default function LayananToaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props} className="ls-toast">
          <span className="ls-toast-badge" aria-hidden="true">
            {props.variant === "destructive" ? "!" : <CheckGlyph />}
          </span>
          <div className="ls-toast-copy">
            {title && <ToastTitle className="ls-toast-title">{title}</ToastTitle>}
            {description && (
              <ToastDescription className="ls-toast-description">{description}</ToastDescription>
            )}
          </div>
          {action}
          <ToastClose className="ls-toast-close" aria-label="Tutup notifikasi" />
        </Toast>
      ))}
      <ToastViewport className={`${LS_ROOT_CLASS} ls-toast-viewport`} />
    </ToastProvider>
  );
}
