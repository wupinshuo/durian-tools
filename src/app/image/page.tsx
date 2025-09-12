"use client";

import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileUpload,
  faEraser,
  faDownload,
  faImage,
  faLink,
  faCode,
  faEye,
  faEyeSlash,
  faArrowRight,
  faArrowLeft,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type ConversionMode = "toBase64" | "fromBase64";

export default function ImagePage() {
  const [conversionMode, setConversionMode] = useState<ConversionMode>("toBase64");
  const [imageUrl, setImageUrl] = useState("");
  const [base64Input, setBase64Input] = useState("");
  const [base64Output, setBase64Output] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (window.showAlert) {
        window.showAlert("请选择图片文件", "error");
      }
      return;
    }

    setFileName(file.name);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (conversionMode === "toBase64") {
        setBase64Output(result);
        setPreviewSrc(result);
      }
      setLoading(false);
      
      if (window.showAlert) {
        window.showAlert("图片上传成功", "success");
      }
    };

    reader.onerror = () => {
      setLoading(false);
      if (window.showAlert) {
        window.showAlert("文件读取失败", "error");
      }
    };

    reader.readAsDataURL(file);
  };

  // 处理URL链接转换
  const handleUrlToBase64 = async () => {
    if (!imageUrl.trim()) {
      if (window.showAlert) {
        window.showAlert("请输入图片URL", "error");
      }
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('网络请求失败');
      }
      
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) {
        throw new Error('URL不是有效的图片');
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBase64Output(result);
        setPreviewSrc(result);
        setLoading(false);
        
        // 从URL中提取文件名
        const urlParts = imageUrl.split('/');
        const extractedFileName = urlParts[urlParts.length - 1].split('?')[0];
        setFileName(extractedFileName || 'image');
        
        if (window.showAlert) {
          window.showAlert("图片转换成功", "success");
        }
      };
      
      reader.onerror = () => {
        setLoading(false);
        if (window.showAlert) {
          window.showAlert("图片转换失败", "error");
        }
      };
      
      reader.readAsDataURL(blob);
    } catch (error) {
      setLoading(false);
      if (window.showAlert) {
        window.showAlert("获取图片失败，请检查URL是否有效", "error");
      }
    }
  };

  // 处理Base64转换为图片预览
  const handleBase64ToImage = () => {
    if (!base64Input.trim()) {
      if (window.showAlert) {
        window.showAlert("请输入Base64数据", "error");
      }
      return;
    }

    try {
      // 检查是否是有效的base64图片格式
      let base64Data = base64Input.trim();
      if (!base64Data.startsWith('data:image/')) {
        // 如果没有data URI前缀，尝试添加默认的
        if (base64Data.startsWith('/9j/')) {
          base64Data = 'data:image/jpeg;base64,' + base64Data;
        } else if (base64Data.startsWith('iVBORw0KGgo')) {
          base64Data = 'data:image/png;base64,' + base64Data;
        } else {
          // 默认尝试PNG格式
          base64Data = 'data:image/png;base64,' + base64Data;
        }
      }

      setPreviewSrc(base64Data);
      
      // 从base64数据中提取文件类型
      const mimeMatch = base64Data.match(/data:image\/([^;]+)/);
      const fileType = mimeMatch ? mimeMatch[1] : 'png';
      setFileName(`converted-image.${fileType}`);
      
      if (window.showAlert) {
        window.showAlert("Base64解析成功", "success");
      }
    } catch (error) {
      if (window.showAlert) {
        window.showAlert("无效的Base64数据", "error");
      }
    }
  };

  // 下载图片
  const downloadImage = () => {
    if (!previewSrc) {
      if (window.showAlert) {
        window.showAlert("没有可下载的图片", "error");
      }
      return;
    }

    const link = document.createElement('a');
    link.download = fileName || 'image';
    link.href = previewSrc;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (window.showAlert) {
      window.showAlert("图片下载成功", "success");
    }
  };

  // 复制Base64到剪贴板
  const copyBase64 = async () => {
    if (!base64Output) {
      if (window.showAlert) {
        window.showAlert("没有可复制的Base64数据", "error");
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(base64Output);
      if (window.showAlert) {
        window.showAlert("Base64数据已复制到剪贴板", "success");
      }
    } catch (error) {
      if (window.showAlert) {
        window.showAlert("复制失败", "error");
      }
    }
  };

  // 清空所有数据
  const clearAll = () => {
    setImageUrl("");
    setBase64Input("");
    setBase64Output("");
    setPreviewSrc("");
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    if (window.showAlert) {
      window.showAlert("已清空所有数据", "info");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-4 flex-1">
        <div className="mx-auto" style={{ maxWidth: "64rem" }}>
          {/* 页面头部 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">图片转换工具</h1>
          </div>

          {/* 转换模式选择 */}
          <div className="mb-6">
            <div className="flex gap-4 p-1 border border-border rounded-lg w-fit"
                 style={{ backgroundColor: "var(--background-alt)" }}>
              <button
                onClick={() => setConversionMode("toBase64")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  conversionMode === "toBase64" 
                    ? "bg-primary text-white" 
                    : "hover:bg-opacity-50"
                }`}
                style={{
                  backgroundColor: conversionMode === "toBase64" ? "var(--primary)" : "transparent"
                }}
              >
                <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
                转换为Base64
              </button>
              <button
                onClick={() => setConversionMode("fromBase64")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  conversionMode === "fromBase64" 
                    ? "bg-primary text-white" 
                    : "hover:bg-opacity-50"
                }`}
                style={{
                  backgroundColor: conversionMode === "fromBase64" ? "var(--primary)" : "transparent"
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                从Base64转换
              </button>
            </div>
          </div>

          {conversionMode === "toBase64" ? (
            /* 转换为Base64模式 */
            <>
              {/* 文件上传区域 */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">上传图片文件</h2>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center"
                     style={{ backgroundColor: "var(--background-alt)" }}>
                  <FontAwesomeIcon icon={faFileUpload} className="text-4xl text-primary mb-4" />
                  <p className="text-lg mb-4">选择图片文件或拖拽到此处</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="btn btn-primary cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
                    选择图片
                  </label>
                </div>
              </div>

              {/* URL输入区域 */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">或输入图片URL</h2>
                <div className="flex gap-2">
                  <input
                    type="url"
                    className="input flex-1"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <button 
                    onClick={handleUrlToBase64}
                    disabled={loading}
                    className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={loading ? faImage : faLink} className="mr-2" />
                    {loading ? "转换中..." : "转换"}
                  </button>
                </div>
              </div>

              {/* Base64输出区域 */}
              {base64Output && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Base64输出</h2>
                    <button onClick={copyBase64} className="btn btn-outline">
                      <FontAwesomeIcon icon={faCopy} className="mr-2" />
                      复制
                    </button>
                  </div>
                  <textarea
                    className="w-full h-32 p-3 border border-border rounded-md resize-none text-sm font-mono"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--text)"
                    }}
                    value={base64Output}
                    readOnly
                    placeholder="Base64数据将在这里显示..."
                  />
                </div>
              )}
            </>
          ) : (
            /* 从Base64转换模式 */
            <>
              {/* Base64输入区域 */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">输入Base64数据</h2>
                <textarea
                  className="w-full h-32 p-3 border border-border rounded-md resize-none text-sm font-mono mb-3"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--text)"
                  }}
                  value={base64Input}
                  onChange={(e) => setBase64Input(e.target.value)}
                  placeholder="粘贴Base64数据到这里...&#10;支持带前缀 (data:image/png;base64,xxx) 或纯Base64数据"
                />
                <button 
                  onClick={handleBase64ToImage}
                  className="btn btn-primary"
                >
                  <FontAwesomeIcon icon={faImage} className="mr-2" />
                  生成预览
                </button>
              </div>
            </>
          )}

          {/* 控制按钮 */}
          <div className="flex gap-2 mb-6">
            <button onClick={clearAll} className="btn btn-outline">
              <FontAwesomeIcon icon={faEraser} className="mr-2" />
              清空数据
            </button>
            {previewSrc && (
              <>
                <button 
                  onClick={() => setShowPreview(!showPreview)}
                  className="btn btn-outline"
                >
                  <FontAwesomeIcon icon={showPreview ? faEyeSlash : faEye} className="mr-2" />
                  {showPreview ? "隐藏预览" : "显示预览"}
                </button>
                <button onClick={downloadImage} className="btn btn-secondary">
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  下载图片
                </button>
              </>
            )}
          </div>

          {/* 图片预览区域 */}
          {previewSrc && showPreview && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">图片预览</h2>
              <div className="border border-border rounded-lg p-4 text-center"
                   style={{ backgroundColor: "var(--background-alt)" }}>
                <img
                  src={previewSrc}
                  alt="预览图片"
                  className="max-w-full max-h-96 mx-auto rounded-md shadow-sm"
                  style={{ objectFit: "contain" }}
                  onError={() => {
                    if (window.showAlert) {
                      window.showAlert("图片加载失败，请检查数据是否正确", "error");
                    }
                  }}
                />
                {fileName && (
                  <p className="mt-3 text-sm" style={{ color: "var(--text-light)" }}>
                    文件名: {fileName}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 使用说明 */}
          <div className="border border-border rounded-lg p-4"
               style={{ backgroundColor: "var(--background-alt)" }}>
            <h3 className="text-md font-semibold mb-3">使用说明</h3>
            <div className="text-sm space-y-2" style={{ color: "var(--text-light)" }}>
              <p><strong>转换为Base64:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>支持上传本地图片文件 (JPG, PNG, GIF, WebP等格式)</li>
                <li>支持输入图片URL链接进行在线转换</li>
                <li>转换后的Base64数据可直接复制使用</li>
              </ul>
              <p className="mt-3"><strong>从Base64转换:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>支持标准的Base64图片数据 (带data:image前缀)</li>
                <li>也支持纯Base64数据 (会自动尝试识别格式)</li>
                <li>转换后可预览和下载为图片文件</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}