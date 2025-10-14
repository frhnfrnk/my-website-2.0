"use client";

import { useState, useEffect } from "react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastCounter = 0;
const listeners = new Set<(toasts: Toast[]) => void>();
let toasts: Toast[] = [];

function notify() {
  listeners.forEach((listener) => listener(toasts));
}

export function toast(message: string, type: ToastType = "success") {
  const id = `toast-${++toastCounter}`;
  const newToast: Toast = { id, message, type };

  toasts = [...toasts, newToast];
  notify();

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, 3000);
}

export function useToasts() {
  const [state, setState] = useState<Toast[]>(toasts);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  return state;
}
