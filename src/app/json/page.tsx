"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCodeCompare,
  faEraser,
  faCopy,
  faLightbulb,
  faCode,
} from "@fortawesome/free-solid-svg-icons";

interface JsonDiff {
  [path: string]: {
    type: "added" | "removed" | "modified";
    value?: any;
    oldValue?: any;
    newValue?: any;
  };
}

export default function JsonPage() {
  const [leftJson, setLeftJson] = useState("");
  const [rightJson, setRightJson] = useState("");
  const [diffResult, setDiffResult] = useState<JSX.Element | null>(null);

  // 初始化
  useEffect(() => {
    const savedLeft = localStorage.getItem("jsonLeft");
    const savedRight = localStorage.getItem("jsonRight");

    if (savedLeft) setLeftJson(savedLeft);
    if (savedRight) setRightJson(savedRight);
  }, []);

  // 对比JSON
  const compareJson = () => {
    try {
      if (!leftJson.trim() || !rightJson.trim()) {
        if (window.showAlert) {
          window.showAlert("请在两侧都输入JSON数据", "error");
        }
        return;
      }

      const leftObj = JSON.parse(leftJson);
      const rightObj = JSON.parse(rightJson);

      // 保存到本地存储
      localStorage.setItem("jsonLeft", leftJson);
      localStorage.setItem("jsonRight", rightJson);

      // 执行对比
      const diff = compareObjects(leftObj, rightObj);

      // 显示结果
      if (Object.keys(diff).length === 0) {
        setDiffResult(
          <div className="text-center text-secondary">
            <FontAwesomeIcon icon={faCode} className="text-4xl mb-4" />
            <p>两个JSON数据完全相同</p>
          </div>
        );
      } else {
        setDiffResult(formatDiff(diff));
      }
    } catch (error) {
      if (window.showAlert) {
        window.showAlert(`JSON解析错误: ${(error as Error).message}`, "error");
      }
    }
  };

  // 清空输入
  const clearInputs = () => {
    setLeftJson("");
    setRightJson("");
    setDiffResult(
      <div className="text-center text-text-light">
        <FontAwesomeIcon icon={faCode} className="text-4xl mb-4 opacity-50" />
        <p>请输入JSON数据并点击对比按钮</p>
      </div>
    );
    localStorage.removeItem("jsonLeft");
    localStorage.removeItem("jsonRight");

    if (window.showAlert) {
      window.showAlert("已清空所有输入", "info");
    }
  };

  // 复制结果
  const copyResult = () => {
    if (!diffResult) {
      if (window.showAlert) {
        window.showAlert("没有可复制的结果", "info");
      }
      return;
    }

    const resultText = document.getElementById("json-result")?.textContent;
    if (resultText && !resultText.includes("请输入JSON数据")) {
      navigator.clipboard
        .writeText(resultText)
        .then(() => {
          if (window.showAlert) {
            window.showAlert("已复制到剪贴板", "success");
          }
        })
        .catch((err) => {
          if (window.showAlert) {
            window.showAlert(`复制失败: ${err}`, "error");
          }
        });
    } else {
      if (window.showAlert) {
        window.showAlert("没有可复制的结果", "info");
      }
    }
  };

  // 加载示例
  const loadExample = () => {
    const exampleLeft = {
      name: "工具聚合网站",
      version: "1.0",
      tools: ["todo", "json"],
      author: "开发者",
      settings: {
        theme: "light",
        language: "zh-CN",
      },
    };

    const exampleRight = {
      name: "工具聚合网站",
      version: "1.1",
      tools: ["todo", "json", "jwt"],
      author: "开发团队",
      settings: {
        theme: "dark",
        language: "zh-CN",
        notifications: true,
      },
    };

    setLeftJson(JSON.stringify(exampleLeft, null, 2));
    setRightJson(JSON.stringify(exampleRight, null, 2));

    // 触发对比
    setTimeout(() => {
      compareJson();
    }, 100);
  };

  // 初始化空状态
  useEffect(() => {
    setDiffResult(
      <div className="text-center text-text-light">
        <FontAwesomeIcon icon={faCode} className="text-4xl mb-4 opacity-50" />
        <p>请输入JSON数据并点击对比按钮</p>
      </div>
    );
  }, []);

  return (
    <div className="container py-4">
      <div className="mx-auto" style={{ maxWidth: "56rem" }}>
        <h1 className="text-2xl font-bold mb-4">JSON对比工具</h1>

        {/* JSON编辑器 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">左侧JSON</h3>
            <textarea
              className="w-full h-[300px] font-mono p-3 border border-border rounded-md resize-y"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--text)",
              }}
              placeholder="在此输入JSON数据..."
              value={leftJson}
              onChange={(e) => setLeftJson(e.target.value)}
            />
          </div>
          <div>
            <h3 className="font-semibold mb-2">右侧JSON</h3>
            <textarea
              className="w-full h-[300px] font-mono p-3 border border-border rounded-md resize-y"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--text)",
              }}
              placeholder="在此输入JSON数据..."
              value={rightJson}
              onChange={(e) => setRightJson(e.target.value)}
            />
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button onClick={compareJson} className="btn btn-primary">
            <FontAwesomeIcon icon={faCodeCompare} className="mr-2" />
            对比
          </button>
          <button onClick={clearInputs} className="btn btn-outline">
            <FontAwesomeIcon icon={faEraser} className="mr-2" />
            清空
          </button>
          <button onClick={copyResult} className="btn btn-secondary">
            <FontAwesomeIcon icon={faCopy} className="mr-2" />
            复制结果
          </button>
          <button onClick={loadExample} className="btn btn-outline">
            <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
            加载示例
          </button>
        </div>

        {/* 结果显示 */}
        <div>
          <h3 className="font-semibold my-2 mt-4">对比结果</h3>
          <div
            id="json-result"
            className="p-4 border border-border rounded-md font-mono whitespace-pre-wrap overflow-x-auto min-h-[100px] max-h-[400px] overflow-y-auto"
            style={{ backgroundColor: "var(--background-alt)" }}
          >
            {diffResult}
          </div>
        </div>
      </div>
    </div>
  );
}

// JSON对比函数
function compareObjects(left: any, right: any, path = ""): JsonDiff {
  const diff: JsonDiff = {};

  // 检查左侧对象中的所有键
  for (const key in left) {
    const currentPath = path ? `${path}.${key}` : key;

    // 如果右侧没有这个键
    if (!(key in right)) {
      diff[currentPath] = {
        type: "removed",
        value: left[key],
      };
      continue;
    }

    // 如果两边的值类型不同
    if (typeof left[key] !== typeof right[key]) {
      diff[currentPath] = {
        type: "modified",
        oldValue: left[key],
        newValue: right[key],
      };
      continue;
    }

    // 如果是对象，递归比较
    if (
      typeof left[key] === "object" &&
      left[key] !== null &&
      right[key] !== null
    ) {
      // 数组特殊处理
      if (Array.isArray(left[key]) && Array.isArray(right[key])) {
        // 比较数组长度
        const maxLength = Math.max(left[key].length, right[key].length);
        for (let i = 0; i < maxLength; i++) {
          const arrayPath = `${currentPath}[${i}]`;

          // 如果左侧数组没有这个索引
          if (i >= left[key].length) {
            diff[arrayPath] = {
              type: "added",
              value: right[key][i],
            };
            continue;
          }

          // 如果右侧数组没有这个索引
          if (i >= right[key].length) {
            diff[arrayPath] = {
              type: "removed",
              value: left[key][i],
            };
            continue;
          }

          // 如果两边的值类型不同
          if (typeof left[key][i] !== typeof right[key][i]) {
            diff[arrayPath] = {
              type: "modified",
              oldValue: left[key][i],
              newValue: right[key][i],
            };
            continue;
          }

          // 如果是对象，递归比较
          if (
            typeof left[key][i] === "object" &&
            left[key][i] !== null &&
            right[key][i] !== null
          ) {
            const nestedDiff = compareObjects(
              left[key][i],
              right[key][i],
              arrayPath
            );
            Object.assign(diff, nestedDiff);
          }
          // 如果是基本类型且不同
          else if (left[key][i] !== right[key][i]) {
            diff[arrayPath] = {
              type: "modified",
              oldValue: left[key][i],
              newValue: right[key][i],
            };
          }
        }
      } else {
        // 对象递归比较
        const nestedDiff = compareObjects(left[key], right[key], currentPath);
        Object.assign(diff, nestedDiff);
      }
    }
    // 如果是基本类型且不同
    else if (left[key] !== right[key]) {
      diff[currentPath] = {
        type: "modified",
        oldValue: left[key],
        newValue: right[key],
      };
    }
  }

  // 检查右侧对象中的新增键
  for (const key in right) {
    const currentPath = path ? `${path}.${key}` : key;

    // 如果左侧没有这个键
    if (!(key in left)) {
      diff[currentPath] = {
        type: "added",
        value: right[key],
      };
    }
  }

  return diff;
}

// 格式化差异结果
function formatDiff(diff: JsonDiff): JSX.Element {
  const items = Object.entries(diff).map(([path, item]) => {
    switch (item.type) {
      case "added":
        return (
          <div
            key={path}
            className="text-secondary p-1"
            style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
          >
            + {path}: {formatValue(item.value)}
          </div>
        );
      case "removed":
        return (
          <div
            key={path}
            className="text-danger p-1"
            style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
          >
            - {path}: {formatValue(item.value)}
          </div>
        );
      case "modified":
        return (
          <div
            key={path}
            className="text-primary p-1"
            style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
          >
            ~ {path}: {formatValue(item.oldValue)} →{" "}
            {formatValue(item.newValue)}
          </div>
        );
      default:
        return null;
    }
  });

  return (
    <div>
      {items.length > 0 ? (
        items
      ) : (
        <div className="text-center">没有发现差异</div>
      )}
    </div>
  );
}

// 格式化值
function formatValue(value: any): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "object") return JSON.stringify(value);
  if (typeof value === "string") return `"${value}"`;
  return String(value);
}
