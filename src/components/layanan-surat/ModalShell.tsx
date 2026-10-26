"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { LS_ROOT_CLASS } from "@/app/layanan-surat/fonts";

interface ModalShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  size?: "narrow" | "wide";
  children: React.ReactNode;
}

/** Centered card dialog in the Layanan Surat style (focus trap, Escape, scroll lock via Radix). */
export default function ModalShell({
  open,
  onOpenChange,
  title,
  description,
  size = "narrow",
  children,
}: ModalShellProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={`${LS_ROOT_CLASS} ls-backdrop`} />
        <DialogPrimitive.Content
          className={`${LS_ROOT_CLASS} ls-modal ls-modal-${size}`}
          {...(description ? {} : { "aria-describedby": undefined })}
        >
          <div className="ls-modal-header">
            <div>
              <DialogPrimitive.Title className="ls-modal-title">{title}</DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="ls-modal-description">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close className="text-action muted-action">
              Tutup <span aria-hidden="true">×</span>
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
