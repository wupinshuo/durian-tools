"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 在组件挂载后才渲染主题切换按钮，避免水合不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="durian-navbar">
      <div className="container flex justify-between items-center">
        <Link href="/" className="durian-brand">
          <div className="durian-logo">
            <Image
              src="/durian_logo.svg"
              alt="榴莲工具"
              width={28}
              height={28}
              className="durian-icon"
            />
          </div>
          <div className="durian-brand-text">
            <span className="durian-title">榴莲工具</span>
            <span className="durian-subtitle">实用工具聚合平台</span>
          </div>
        </Link>
        <div className="navbar-nav">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
          >
            {mounted && (
              <FontAwesomeIcon
                icon={theme === "dark" ? faSun : faMoon}
                className="theme-icon"
              />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
