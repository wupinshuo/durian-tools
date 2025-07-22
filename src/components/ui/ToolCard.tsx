"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ToolCardProps {
  title: string;
  description: string;
  icon: IconDefinition;
  href: string;
  disabled?: boolean;
}

export default function ToolCard({
  title,
  description,
  icon,
  href,
  disabled = false,
}: ToolCardProps) {
  if (disabled) {
    return (
      <div className="tool-card" style={{ opacity: 0.5 }}>
        <div className="tool-icon">
          <FontAwesomeIcon icon={icon} />
        </div>
        <h3 className="tool-title">{title}</h3>
        <p className="tool-description">{description}</p>
      </div>
    );
  }

  return (
    <Link href={href} className="tool-card">
      <div className="tool-icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <h3 className="tool-title">{title}</h3>
      <p className="tool-description">{description}</p>
    </Link>
  );
}
