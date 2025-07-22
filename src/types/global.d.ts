/// <reference types="react" />

type AlertType = "success" | "error" | "info";

declare global {
  interface Window {
    showAlert?: (message: string, type?: AlertType) => string;
  }
}

export {};
