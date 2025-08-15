"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faEye,
  faEyeSlash,
  faCheckCircle,
  faCode,
  faKey,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const pathname = usePathname();

  // 在组件挂载后才渲染主题切换按钮，避免水合不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLogo = () => {
    setShowLogo(!showLogo);
  };

  return (
    <nav className="durian-navbar">
      <div className="container flex items-center justify-between">
        <div className="navbar-left flex items-center gap-8">
          {showLogo && (
            <Link href="/" className="durian-brand">
              <Image
                src="/durian_logo.svg"
                alt="榴莲工具"
                width={48}
                height={48}
                className="durian-icon"
              />
              <div className="durian-brand-text">
                <span className="durian-title">榴莲工具</span>
                <span className="durian-subtitle">实用工具聚合平台</span>
              </div>
            </Link>
          )}

          <div className="navbar-tools">
            <Link
              href="/todo"
              className={`tool-nav-link ${
                pathname === "/todo" ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="tool-nav-icon" />
              <span>待办事项</span>
            </Link>
            <Link
              href="/json"
              className={`tool-nav-link ${
                pathname === "/json" ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faCode} className="tool-nav-icon" />
              <span>JSON对比</span>
            </Link>
            <Link
              href="/jwt"
              className={`tool-nav-link ${pathname === "/jwt" ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={faKey} className="tool-nav-icon" />
              <span>JWT解析</span>
            </Link>
            <Link
              href="/csv"
              className={`tool-nav-link ${pathname === "/csv" ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={faTable} className="tool-nav-icon" />
              <span>CSV查询</span>
            </Link>
          </div>
        </div>

        <div className="navbar-nav">
          {/* <button
            type="button"
            className="logo-toggle-btn"
            onClick={toggleLogo}
            aria-label={showLogo ? "隐藏Logo" : "显示Logo"}
          >
            {mounted && (
              <FontAwesomeIcon
                icon={showLogo ? faEyeSlash : faEye}
                className="toggle-icon"
              />
            )}
          </button> */}

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

          <a
            href="https://github.com/wupinshuo/durian-tools"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            aria-label="访问GitHub仓库"
          >
            <FontAwesomeIcon icon={faGithub} className="github-icon" />
          </a>
        </div>
      </div>
    </nav>
  );
}
