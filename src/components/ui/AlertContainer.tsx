"use client";

import { useState } from "react";
import Alert from "./Alert";

type AlertType = "success" | "error" | "info";

interface AlertItem {
  id: string;
  message: string;
  type: AlertType;
}

export default function AlertContainer() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  // 添加到全局window对象，以便在任何地方调用
  if (typeof window !== "undefined") {
    window.showAlert = (message: string, type: AlertType = "info") => {
      const id = Date.now().toString();
      setAlerts((prev) => [...prev, { id, message, type }]);
      return id;
    };
  }

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          message={alert.message}
          type={alert.type}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );
}
