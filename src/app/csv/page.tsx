"use client";

import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import html2canvas from "html2canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileUpload,
  faEraser,
  faSort,
  faSortUp,
  faSortDown,
  faEye,
  faEyeSlash,
  faLightbulb,
  faCog,
  faCheckSquare,
  faSquare,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faDownload,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface CsvData {
  headers: string[];
  rows: string[][];
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc' | null;
}

export default function CsvPage() {
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null });
  const [displayData, setDisplayData] = useState<string[][]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [visibleColumns, setVisibleColumns] = useState<boolean[]>([]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [jumpPage, setJumpPage] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // 文件上传处理
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      if (window.showAlert) {
        window.showAlert("请选择CSV格式的文件", "error");
      }
      return;
    }

    Papa.parse(file, {
      complete: (results) => {
        if (results.errors.length > 0) {
          if (window.showAlert) {
            window.showAlert(`CSV解析错误: ${results.errors[0].message}`, "error");
          }
          return;
        }

        const data = results.data as string[][];
        if (data.length === 0) {
          if (window.showAlert) {
            window.showAlert("CSV文件为空", "error");
          }
          return;
        }

        const headers = data[0];
        const rows = data.slice(1).filter(row => row.some(cell => cell.trim() !== ''));

        setCsvData({ headers, rows });
        setDisplayData(rows);
        setSortConfig({ key: '', direction: null });
        setCurrentPage(1);
        setVisibleColumns(new Array(headers.length).fill(true));

        if (window.showAlert) {
          window.showAlert(`成功加载 ${rows.length} 行数据`, "success");
        }
      },
      header: false,
      skipEmptyLines: true,
      encoding: "UTF-8"
    });
  };

  // 排序处理
  const handleSort = (columnIndex: number) => {
    if (!csvData) return;

    const columnKey = columnIndex.toString();
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...csvData.rows].sort((a, b) => {
      const aValue = a[columnIndex] || '';
      const bValue = b[columnIndex] || '';

      // 尝试数字比较
      const aNum = parseFloat(aValue);
      const bNum = parseFloat(bValue);

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // 字符串比较
      return direction === 'asc'
        ? aValue.localeCompare(bValue, 'zh-CN', { numeric: true })
        : bValue.localeCompare(aValue, 'zh-CN', { numeric: true });
    });

    setDisplayData(sortedData);
    setSortConfig({ key: columnKey, direction });
    setCurrentPage(1);
  };

  // 清空数据
  const clearData = () => {
    setCsvData(null);
    setDisplayData([]);
    setSortConfig({ key: '', direction: null });
    setCurrentPage(1);
    setVisibleColumns([]);
    setShowColumnSelector(false);
    setJumpPage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (window.showAlert) {
      window.showAlert("已清空所有数据", "info");
    }
  };

  // 加载示例数据
  const loadExample = () => {
    const exampleData = [
      ['姓名', '年龄', '城市', '薪资', '部门'],
      ['张三', '28', '北京', '15000', '技术部'],
      ['李四', '32', '上海', '18000', '销售部'],
      ['王五', '25', '广州', '12000', '市场部'],
      ['赵六', '35', '深圳', '22000', '技术部'],
      ['钱七', '29', '杭州', '16000', '产品部'],
      ['孙八', '31', '成都', '14000', '销售部'],
      ['周九', '27', '西安', '13000', '市场部'],
      ['吴十', '33', '武汉', '19000', '技术部']
    ];

    const headers = exampleData[0];
    const rows = exampleData.slice(1);

    setCsvData({ headers, rows });
    setDisplayData(rows);
    setSortConfig({ key: '', direction: null });
    setCurrentPage(1);
    setVisibleColumns(new Array(headers.length).fill(true));

    if (window.showAlert) {
      window.showAlert("已加载示例数据", "success");
    }
  };

  // 分页数据
  const paginatedData = displayData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(displayData.length / pageSize);

  // 获取排序图标
  const getSortIcon = (columnIndex: number) => {
    const columnKey = columnIndex.toString();
    if (sortConfig.key !== columnKey) {
      return faSort;
    }
    return sortConfig.direction === 'asc' ? faSortUp : faSortDown;
  };

  // 切换列可见性
  const toggleColumnVisibility = (index: number) => {
    const newVisibleColumns = [...visibleColumns];
    newVisibleColumns[index] = !newVisibleColumns[index];
    setVisibleColumns(newVisibleColumns);
  };

  // 全选/取消全选
  const toggleAllColumns = () => {
    const allVisible = visibleColumns.every(visible => visible);
    setVisibleColumns(new Array(visibleColumns.length).fill(!allVisible));
  };

  // 获取可见列的索引
  const getVisibleColumnIndices = () => {
    return visibleColumns.map((visible, index) => visible ? index : -1).filter(index => index !== -1);
  };

  // 获取可见列数量
  const visibleColumnCount = visibleColumns.filter(visible => visible).length;

  // 处理页码跳转
  const handleJumpToPage = () => {
    const pageNum = parseInt(jumpPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setJumpPage('');
    } else {
      if (window.showAlert) {
        window.showAlert(`请输入 1 到 ${totalPages} 之间的页码`, "error");
      }
    }
  };

  // 处理页码输入框回车
  const handleJumpInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJumpToPage();
    }
  };

  // 导出表格为图片
  const exportToImage = async () => {
    if (!tableRef.current || !csvData) return;

    setIsExporting(true);
    
    try {
      const element = tableRef.current;
      // 临时隐藏滚动条和阴影效果，确保导出图片干净
      const originalStyle = element.style.cssText;
      element.style.overflow = 'visible';
      element.style.boxShadow = 'none';
      element.style.border = '1px solid #e5e7eb';

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      // 恢复原始样式
      element.style.cssText = originalStyle;

      // 创建下载链接
      const link = document.createElement('a');
      link.download = `csv-export-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (window.showAlert) {
        window.showAlert('表格已导出为图片', 'success');
      }
    } catch (error) {
      console.error('导出图片失败:', error);
      if (window.showAlert) {
        window.showAlert('导出图片失败，请重试', 'error');
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-4 flex-1">
        <div className="mx-auto" style={{ maxWidth: "80rem" }}>
          {/* 页面头部 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">CSV查询工具</h1>
          </div>

          {/* 文件上传区域 */}
          <div className="mb-6">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center"
                 style={{ backgroundColor: "var(--background-alt)" }}>
              <FontAwesomeIcon icon={faFileUpload} className="text-4xl text-primary mb-4" />
              <p className="text-lg mb-4">选择CSV文件或拖拽到此处</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="btn btn-primary cursor-pointer"
              >
                <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
                选择文件
              </label>
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={clearData} className="btn btn-outline">
              <FontAwesomeIcon icon={faEraser} className="mr-2" />
              清空数据
            </button>
            <button onClick={loadExample} className="btn btn-secondary">
              <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
              加载示例
            </button>
            {csvData && (
              <>
                <button 
                  onClick={() => setShowColumnSelector(!showColumnSelector)} 
                  className="btn btn-outline"
                >
                  <FontAwesomeIcon icon={faCog} className="mr-2" />
                  字段设置
                </button>
                <button 
                  onClick={exportToImage}
                  disabled={isExporting || visibleColumnCount === 0}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon icon={isExporting ? faImage : faDownload} className="mr-2" />
                  {isExporting ? '导出中...' : '导出图片'}
                </button>
              </>
            )}
          </div>

          {/* 数据显示 */}
          {csvData && (
            <>
              {/* 字段选择器 */}
              {showColumnSelector && (
                <div className="mb-4 p-4 border border-border rounded-md"
                     style={{ backgroundColor: "var(--background-alt)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">字段显示设置</h3>
                    <button 
                      onClick={toggleAllColumns}
                      className="btn btn-outline px-3 py-1 text-sm"
                    >
                      <FontAwesomeIcon 
                        icon={visibleColumns.every(v => v) ? faCheckSquare : faSquare} 
                        className="mr-2" 
                      />
                      {visibleColumns.every(v => v) ? '全不选' : '全选'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {csvData.headers.map((header, index) => (
                      <label 
                        key={index}
                        className="flex items-center p-2 rounded cursor-pointer hover:bg-opacity-50 transition-colors"
                        style={{ 
                          backgroundColor: visibleColumns[index] ? "rgba(59, 130, 246, 0.1)" : "transparent"
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns[index]}
                          onChange={() => toggleColumnVisibility(index)}
                          className="hidden"
                        />
                        <FontAwesomeIcon 
                          icon={visibleColumns[index] ? faCheckSquare : faSquare}
                          className="mr-2 text-primary"
                        />
                        <span className="text-sm truncate">{header}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3 text-sm" style={{ color: "var(--text-light)" }}>
                    已选择 {visibleColumnCount} / {csvData.headers.length} 个字段
                  </div>
                </div>
              )}

              {/* 统计信息 */}
              <div className="mb-4 p-3 border border-border rounded-md"
                   style={{ backgroundColor: "var(--background-alt)" }}>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span>总行数: <strong>{displayData.length}</strong></span>
                  <span>显示列数: <strong>{visibleColumnCount}/{csvData.headers.length}</strong></span>
                  <span>当前页: <strong>{currentPage}/{totalPages}</strong></span>
                </div>
              </div>

              {/* 分页大小选择 */}
              <div className="mb-4">
                <label className="text-sm mr-2">每页显示:</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-border rounded text-sm"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--text)"
                  }}
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>

              {/* 数据表格 */}
              {visibleColumnCount > 0 ? (
                <div 
                  ref={tableRef}
                  className="overflow-x-auto border border-border rounded-md"
                >
                  <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: "var(--background-alt)" }}>
                      {csvData.headers.map((header, index) => 
                        visibleColumns[index] ? (
                          <th
                            key={index}
                            className="px-3 py-2 text-left border-b border-border cursor-pointer hover:bg-opacity-80 transition-colors"
                            onClick={() => handleSort(index)}
                            style={{ color: "var(--text)" }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{header}</span>
                              <FontAwesomeIcon 
                                icon={getSortIcon(index)} 
                                className="ml-2 text-xs opacity-60"
                              />
                            </div>
                          </th>
                        ) : null
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="hover:bg-opacity-50 transition-colors"
                        style={{ 
                          backgroundColor: rowIndex % 2 === 0 ? "var(--background)" : "var(--background-alt)"
                        }}
                      >
                        {row.map((cell, cellIndex) => 
                          visibleColumns[cellIndex] ? (
                            <td
                              key={cellIndex}
                              className="px-3 py-2 border-b border-border"
                              style={{ color: "var(--text)" }}
                            >
                              {cell}
                            </td>
                          ) : null
                        )}
                      </tr>
                    ))}
                  </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border border-border rounded-md"
                     style={{ backgroundColor: "var(--background-alt)" }}>
                  <FontAwesomeIcon icon={faEyeSlash} className="text-4xl mb-4 opacity-50" style={{ color: "var(--text-light)" }} />
                  <p style={{ color: "var(--text-light)" }}>请至少选择一个字段进行显示</p>
                  <button 
                    onClick={() => setShowColumnSelector(true)}
                    className="btn btn-primary mt-4"
                  >
                    <FontAwesomeIcon icon={faCog} className="mr-2" />
                    字段设置
                  </button>
                </div>
              )}

              {/* 分页控件 */}
              {totalPages > 1 && visibleColumnCount > 0 && (
                <div className="mt-4 space-y-4">
                  {/* 记录统计信息 */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm" style={{ color: "var(--text-light)" }}>
                      显示 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, displayData.length)} 条，
                      共 {displayData.length} 条记录
                    </div>
                    <div className="text-sm" style={{ color: "var(--text-light)" }}>
                      第 <strong>{currentPage}</strong> 页，共 <strong>{totalPages}</strong> 页
                    </div>
                  </div>

                  {/* 分页控制器 */}
                  <div className="flex items-center justify-end gap-2 flex-wrap">
                    {/* 首页 */}
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="btn btn-outline px-2 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      title="首页"
                    >
                      <FontAwesomeIcon icon={faAngleDoubleLeft} />
                    </button>

                    {/* 上一页 */}
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="btn btn-outline px-2 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      title="上一页"
                    >
                      <FontAwesomeIcon icon={faAngleLeft} />
                    </button>

                    {/* 页码显示 - 简化逻辑 */}
                    {totalPages <= 7 ? (
                      // 页数少时显示所有页码
                      Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`btn px-3 py-1 text-sm ${
                            currentPage === pageNum ? 'btn-primary' : 'btn-outline'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))
                    ) : (
                      // 页数多时显示省略号
                      <>
                        {/* 第一页 */}
                        <button
                          onClick={() => setCurrentPage(1)}
                          className={`btn px-3 py-1 text-sm ${
                            currentPage === 1 ? 'btn-primary' : 'btn-outline'
                          }`}
                        >
                          1
                        </button>

                        {/* 左侧省略号 */}
                        {currentPage > 4 && (
                          <span className="px-2 text-sm" style={{ color: "var(--text-light)" }}>
                            ...
                          </span>
                        )}

                        {/* 当前页周围的页码 */}
                        {Array.from({ length: 3 }, (_, i) => {
                          const pageNum = currentPage - 1 + i;
                          if (pageNum > 1 && pageNum < totalPages) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`btn px-3 py-1 text-sm ${
                                  currentPage === pageNum ? 'btn-primary' : 'btn-outline'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                          return null;
                        })}

                        {/* 右侧省略号 */}
                        {currentPage < totalPages - 3 && (
                          <span className="px-2 text-sm" style={{ color: "var(--text-light)" }}>
                            ...
                          </span>
                        )}

                        {/* 最后一页 */}
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className={`btn px-3 py-1 text-sm ${
                            currentPage === totalPages ? 'btn-primary' : 'btn-outline'
                          }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    {/* 下一页 */}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="btn btn-outline px-2 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      title="下一页"
                    >
                      <FontAwesomeIcon icon={faAngleRight} />
                    </button>

                    {/* 末页 */}
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="btn btn-outline px-2 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      title="末页"
                    >
                      <FontAwesomeIcon icon={faAngleDoubleRight} />
                    </button>

                    {/* 分隔线 */}
                    <div className="w-px h-6 mx-2" style={{ backgroundColor: "var(--border)" }}></div>

                    {/* 页码跳转 */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: "var(--text)" }}>跳转到</span>
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={jumpPage}
                        onChange={(e) => setJumpPage(e.target.value)}
                        onKeyPress={handleJumpInputKeyPress}
                        placeholder={currentPage.toString()}
                        className="w-16 px-2 py-1 text-sm border border-border rounded text-center"
                        style={{
                          backgroundColor: "var(--background)",
                          color: "var(--text)"
                        }}
                      />
                      <span className="text-sm" style={{ color: "var(--text)" }}>页</span>
                      <button
                        onClick={handleJumpToPage}
                        disabled={!jumpPage || parseInt(jumpPage) < 1 || parseInt(jumpPage) > totalPages}
                        className="btn btn-outline px-2 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        跳转
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* 空状态 */}
          {!csvData && (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faEye} className="text-4xl mb-4 opacity-50" style={{ color: "var(--text-light)" }} />
              <p style={{ color: "var(--text-light)" }}>请上传CSV文件开始查询</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}