"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faExchangeAlt,
  faClock,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TimestampPage() {
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);
  const [isCurrentSeconds, setIsCurrentSeconds] = useState<boolean>(true);
  
  const [timestampInput, setTimestampInput] = useState<string>("");
  const [isTimestampSeconds, setIsTimestampSeconds] = useState<boolean>(true);
  const [timestampResult, setTimestampResult] = useState<string>("");
  const [timezone, setTimezone] = useState<string>("Asia/Shanghai");
  
  const [dateInput, setDateInput] = useState<string>("");
  const [timeInput, setTimeInput] = useState<string>("");
  const [isDateSeconds, setIsDateSeconds] = useState<boolean>(true);
  const [dateResult, setDateResult] = useState<string>("");

  useEffect(() => {
    const updateCurrentTimestamp = () => {
      const now = Date.now();
      setCurrentTimestamp(isCurrentSeconds ? Math.floor(now / 1000) : now);
    };

    updateCurrentTimestamp();
    const interval = setInterval(updateCurrentTimestamp, 1000);
    return () => clearInterval(interval);
  }, [isCurrentSeconds]);

  useEffect(() => {
    const now = new Date();
    setDateInput(now.toISOString().split('T')[0]);
    setTimeInput(now.toTimeString().slice(0, 8));
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const convertTimestampToDate = () => {
    try {
      if (!timestampInput.trim()) return;
      
      const timestamp = parseInt(timestampInput);
      const date = new Date(isTimestampSeconds ? timestamp * 1000 : timestamp);
      
      if (isNaN(date.getTime())) {
        setTimestampResult("无效的时间戳");
        return;
      }

      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };

      const formatter = new Intl.DateTimeFormat('zh-CN', options);
      setTimestampResult(formatter.format(date));
    } catch (error) {
      setTimestampResult("转换失败");
    }
  };

  const convertDateToTimestamp = () => {
    try {
      if (!dateInput || !timeInput) return;
      
      const dateTimeString = `${dateInput}T${timeInput}`;
      const date = new Date(dateTimeString);
      
      if (isNaN(date.getTime())) {
        setDateResult("无效的日期时间");
        return;
      }

      const timestamp = date.getTime();
      setDateResult(isDateSeconds ? Math.floor(timestamp / 1000).toString() : timestamp.toString());
    } catch (error) {
      setDateResult("转换失败");
    }
  };

  useEffect(() => {
    if (timestampInput) {
      convertTimestampToDate();
    }
  }, [timestampInput, isTimestampSeconds, timezone]);

  useEffect(() => {
    if (dateInput && timeInput) {
      convertDateToTimestamp();
    }
  }, [dateInput, timeInput, isDateSeconds]);

  const timezones = [
    { value: "Asia/Shanghai", label: "Asia/Shanghai" },
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "America/New_York" },
    { value: "Europe/London", label: "Europe/London" },
    { value: "Asia/Tokyo", label: "Asia/Tokyo" },
  ];

  return (
    <>
      <Navbar />
      <main className="container py-8 flex-1">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">时间戳转换</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            时间戳与日期时间的相互转换工具
          </p>
        </div>

      <div className="space-y-8">
        {/* 当前时间戳 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faClock} className="text-blue-500" />
            当前时间戳
          </h2>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-medium">当前时间戳</span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCurrentSeconds(!isCurrentSeconds)}
                  className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faExchangeAlt} />
                  切换单位 ({isCurrentSeconds ? "秒" : "毫秒"})
                </button>
                
                <button
                  type="button"
                  onClick={() => copyToClipboard(currentTimestamp.toString())}
                  className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faCopy} />
                  复制
                </button>
              </div>
            </div>
            
            <div className="text-3xl font-mono font-bold p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              {currentTimestamp} {isCurrentSeconds ? "秒" : "毫秒"}
            </div>
          </div>
        </div>

        <div className="space-y-8 max-w-2xl mx-auto">
          {/* 时间戳转日期时间 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="text-green-500" />
              时间戳转日期时间
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">时间戳</label>
                  <button
                    type="button"
                    onClick={() => setIsTimestampSeconds(!isTimestampSeconds)}
                    className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faExchangeAlt} />
                    切换单位 ({isTimestampSeconds ? '秒' : '毫秒'})
                  </button>
                </div>
                <input
                  type="text"
                  value={timestampInput}
                  onChange={(e) => setTimestampInput(e.target.value)}
                  placeholder={`请输入时间戳 (${isTimestampSeconds ? '秒' : '毫秒'})`}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">时区</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  aria-label="选择时区"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">转换结果</label>
                <div className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono">
                  {timestampResult || "转换结果"}
                </div>
              </div>
            </div>
          </div>

          {/* 日期时间转时间戳 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendar} className="text-purple-500" />
              日期时间转时间戳
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">日期</label>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  aria-label="选择日期"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">时间</label>
                <input
                  type="time"
                  step="1"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  aria-label="选择时间"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">转换结果</label>
                  <button
                    type="button"
                    onClick={() => setIsDateSeconds(!isDateSeconds)}
                    className="px-3 py-1 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faExchangeAlt} />
                    切换单位 ({isDateSeconds ? '秒' : '毫秒'})
                  </button>
                </div>
                <div className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono">
                  {dateResult || "转换结果"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}