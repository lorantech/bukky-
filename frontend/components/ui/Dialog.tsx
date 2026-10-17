"use client";

import React, { type ReactNode } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
}

export function Dialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
}: DialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      className="max-w-sm"
    >
      <div className="p-6 flex flex-col gap-3">
        <Button
          variant={variant === "danger" ? "burgundy" : "primary"}
          className="w-full"
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
        <Button variant="ghost" className="w-full" onClick={onClose}>
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  );
}