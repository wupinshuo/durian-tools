"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faEraser,
  faCopy,
  faLightbulb,
  faFileCode,
  faDatabase,
  faSignature,
  faExclamationCircle,
  faCheckCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

interface DecodedJwt {
  header: Record<string, unknown>;
  payload: {
    iat: number;
    nbf?: number;
    exp?: number;
  };
  signature: string;
  isExpired?: boolean;
}

export default function JwtPage() {
  const [jwtToken, setJwtToken] = useState("");
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [showResult, setShowResult] = useState(false);

  // 初始化
  useEffect(() => {
    const savedToken = localStorage.getItem("jwtToken");
    if (savedToken) {
      setJwtToken(savedToken);
      decodeJwt(savedToken);
    }
  }, []);

  // 解析JWT
  const decodeJwt = (token: string) => {
    try {
      const trimmedToken = token.trim();
      if (!trimmedToken) {
        if (window.showAlert) {
          window.showAlert("请输入JWT令牌", "error");
        }
        return;
      }

      // 分割令牌
      const parts = trimmedToken.split(".");
      if (parts.length !== 3) {
        throw new Error("JWT令牌格式无效");
      }

      // 解码头部
      const header = JSON.parse(base64UrlDecode(parts[0]));

      // 解码载荷
      const payload = JSON.parse(base64UrlDecode(parts[1]));

      // 检查是否过期
      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp && payload.exp < now;

      // 保存解析结果
      setDecoded({
        header,
        payload,
        signature: parts[2],
        isExpired,
      });

      // 显示结果
      setShowResult(true);

      // 保存到本地存储
      localStorage.setItem("jwtToken", trimmedToken);

      if (window.showAlert) {
        window.showAlert("JWT令牌解析成功", "success");
      }
    } catch (error) {
      if (window.showAlert) {
        window.showAlert(`JWT解析错误: ${(error as Error).message}`, "error");
      }
    }
  };

  // 清空输入
  const clearInput = () => {
    setJwtToken("");
    setShowResult(false);
    localStorage.removeItem("jwtToken");

    if (window.showAlert) {
      window.showAlert("已清空输入", "info");
    }
  };

  // 复制头部
  const copyHeader = () => {
    if (!decoded) {
      if (window.showAlert) {
        window.showAlert("没有可复制的头部", "info");
      }
      return;
    }

    const headerText = JSON.stringify(decoded.header, null, 2);
    navigator.clipboard
      .writeText(headerText)
      .then(() => {
        if (window.showAlert) {
          window.showAlert("已复制头部到剪贴板", "success");
        }
      })
      .catch((err) => {
        if (window.showAlert) {
          window.showAlert(`复制失败: ${err}`, "error");
        }
      });
  };

  // 复制载荷
  const copyPayload = () => {
    if (!decoded) {
      if (window.showAlert) {
        window.showAlert("没有可复制的载荷", "info");
      }
      return;
    }

    const payloadText = JSON.stringify(decoded.payload, null, 2);
    navigator.clipboard
      .writeText(payloadText)
      .then(() => {
        if (window.showAlert) {
          window.showAlert("已复制载荷到剪贴板", "success");
        }
      })
      .catch((err) => {
        if (window.showAlert) {
          window.showAlert(`复制失败: ${err}`, "error");
        }
      });
  };

  // 加载示例
  const loadExample = () => {
    // 创建一个示例JWT令牌
    const exampleToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IuW3peWFt-e9keermeiusOaIt-W4iCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNjE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    setJwtToken(exampleToken);
    decodeJwt(exampleToken);
  };

  // 格式化时间信息
  const formatTimeInfo = () => {
    if (!decoded || !decoded.payload) return null;

    const { payload } = decoded;
    const timeInfoItems = [];

    if (payload.iat) {
      const iatDate = new Date(payload.iat * 1000);
      timeInfoItems.push(
        <div key="iat">发行时间: {iatDate.toLocaleString()}</div>
      );
    }

    if (payload.nbf) {
      const nbfDate = new Date(payload.nbf * 1000);
      timeInfoItems.push(
        <div key="nbf">生效时间: {nbfDate.toLocaleString()}</div>
      );
    }

    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      timeInfoItems.push(
        <div key="exp">过期时间: {expDate.toLocaleString()}</div>
      );
    }

    return timeInfoItems.length > 0 ? (
      <div className="mt-2 text-sm" style={{ color: "var(--text-light)" }}>
        {timeInfoItems}
      </div>
    ) : null;
  };

  // 显示过期状态
  const renderExpiryStatus = () => {
    if (!decoded) return null;

    if (decoded.isExpired) {
      return (
        <div className="mt-2 text-danger font-semibold flex items-center">
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
          令牌已过期
        </div>
      );
    } else if (decoded.payload.exp) {
      return (
        <div className="mt-2 text-secondary font-semibold flex items-center">
          <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
          令牌有效
        </div>
      );
    } else {
      return (
        <div className="mt-2 text-primary font-semibold flex items-center">
          <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
          令牌没有过期时间
        </div>
      );
    }
  };

  return (
    <div className="container py-4">
      <div className="mx-auto" style={{ maxWidth: "48rem" }}>
        <h1 className="text-2xl font-bold mb-4">JWT解析工具</h1>

        {/* JWT输入 */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">JWT令牌</h3>
          <textarea
            className="w-full font-mono p-3 border border-border rounded-md resize-y min-h-[100px]"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--text)",
            }}
            placeholder="在此输入JWT令牌..."
            value={jwtToken}
            onChange={(e) => setJwtToken(e.target.value)}
          />
        </div>

        {/* 控制按钮 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => decodeJwt(jwtToken)}
            className="btn btn-primary"
          >
            <FontAwesomeIcon icon={faKey} className="mr-2" />
            解析
          </button>
          <button onClick={clearInput} className="btn btn-outline">
            <FontAwesomeIcon icon={faEraser} className="mr-2" />
            清空
          </button>
          <button onClick={copyHeader} className="btn btn-secondary">
            <FontAwesomeIcon icon={faCopy} className="mr-2" />
            复制头部
          </button>
          <button onClick={copyPayload} className="btn btn-secondary">
            <FontAwesomeIcon icon={faCopy} className="mr-2" />
            复制载荷
          </button>
          <button onClick={loadExample} className="btn btn-outline">
            <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
            加载示例
          </button>
        </div>

        {/* 解析结果 */}
        {showResult && decoded ? (
          <div>
            <h3 className="font-semibold my-2">解析结果</h3>

            {/* 头部 */}
            <div className="mb-4">
              <div className="border border-border rounded-lg overflow-hidden">
                <div
                  className="p-3 border-b border-border font-semibold"
                  style={{ backgroundColor: "var(--background-alt)" }}
                >
                  <FontAwesomeIcon icon={faFileCode} className="mr-2" />
                  头部 (Header)
                </div>
                <div className="p-4">
                  <pre className="font-mono whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(decoded.header, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* 载荷 */}
            <div className="mb-4">
              <div className="border border-border rounded-lg overflow-hidden">
                <div
                  className="p-3 border-b border-border font-semibold"
                  style={{ backgroundColor: "var(--background-alt)" }}
                >
                  <FontAwesomeIcon icon={faDatabase} className="mr-2" />
                  载荷 (Payload)
                </div>
                <div className="p-4">
                  <pre className="font-mono whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(decoded.payload, null, 2)}
                  </pre>
                  {renderExpiryStatus()}
                  {formatTimeInfo()}
                </div>
              </div>
            </div>

            {/* 签名 */}
            <div className="mb-4">
              <div className="border border-border rounded-lg overflow-hidden">
                <div
                  className="p-3 border-b border-border font-semibold"
                  style={{ backgroundColor: "var(--background-alt)" }}
                >
                  <FontAwesomeIcon icon={faSignature} className="mr-2" />
                  签名 (Signature)
                </div>
                <div className="p-4">
                  <div className="font-mono break-all">{decoded.signature}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="text-center p-8"
            style={{ color: "var(--text-light)" }}
          >
            <FontAwesomeIcon
              icon={faKey}
              className="text-4xl mb-4"
              style={{ opacity: 0.5 }}
            />
            <p>请输入JWT令牌并点击解析按钮</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Base64 URL解码函数
function base64UrlDecode(str: string): string {
  // 替换URL安全字符
  let output = str.replace(/-/g, "+").replace(/_/g, "/");

  // 添加填充
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new Error("非法base64url字符串");
  }

  try {
    return atob(output);
  } catch (err) {
    throw new Error("解码失败");
  }
}
