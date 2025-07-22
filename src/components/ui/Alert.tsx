"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

type AlertType = "success" | "error" | "info";

interface AlertProps {
  message: string;
  type?: AlertType;
  duration?: number;
  onClose?: () => void;
}

export default function Alert({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const icons = {
    success: faCheckCircle,
    error: faExclamationCircle,
    info: faInfoCircle,
  };

  return (
    <div className={`alert alert-${type} flex items-center`}>
      <FontAwesomeIcon icon={icons[type]} className="mr-2" />
      <span>{message}</span>
    </div>
  );
}
