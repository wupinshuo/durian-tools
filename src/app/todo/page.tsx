"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faTrashAlt,
  faEdit,
  faCheck,
  faClipboardList,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodoPage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState("");

  // 初始化
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        // 确保日期正确解析
        const todosWithDates = parsedTodos.map(
          (todo: TodoItem & { createdAt: string }) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
          })
        );
        setTodos(todosWithDates);
      } catch (error) {
        console.error("Failed to parse todos:", error);
        setTodos([]);
      }
    }
  }, []);

  // 保存待办事项到本地存储
  const saveTodos = (newTodos: TodoItem[]) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  // 添加待办事项
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      createdAt: new Date(),
    };

    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    saveTodos(newTodos);
    setInputText("");

    if (window.showAlert) {
      window.showAlert("待办事项已添加", "success");
    }
  };

  // 切换待办事项完成状态
  const toggleTodoCompleted = (id: string) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    saveTodos(newTodos);

    const todo = newTodos.find((t) => t.id === id);
    if (window.showAlert && todo) {
      window.showAlert(
        `待办事项已${todo.completed ? "完成" : "取消完成"}`,
        "success"
      );
    }
  };

  // 编辑待办事项
  const editTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const newText = prompt("编辑待办事项", todo.text);
    if (newText === null || !newText.trim()) return;

    const newTodos = todos.map((t) =>
      t.id === id ? { ...t, text: newText.trim() } : t
    );
    setTodos(newTodos);
    saveTodos(newTodos);

    if (window.showAlert) {
      window.showAlert("待办事项已更新", "success");
    }
  };

  // 删除待办事项
  const deleteTodo = (id: string) => {
    if (!confirm("确定要删除这个待办事项吗？")) return;

    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    saveTodos(newTodos);

    if (window.showAlert) {
      window.showAlert("待办事项已删除", "success");
    }
  };

  // 清除已完成
  const clearCompleted = () => {
    const completedTodos = todos.filter((todo) => todo.completed);
    if (completedTodos.length === 0) {
      if (window.showAlert) {
        window.showAlert("没有已完成的待办事项", "info");
      }
      return;
    }

    const newTodos = todos.filter((todo) => !todo.completed);
    setTodos(newTodos);
    saveTodos(newTodos);

    if (window.showAlert) {
      window.showAlert("已清除已完成的待办事项", "success");
    }
  };

  // 清除全部
  const clearAll = () => {
    if (todos.length === 0) {
      if (window.showAlert) {
        window.showAlert("没有待办事项可清除", "info");
      }
      return;
    }

    if (confirm("确定要清除所有待办事项吗？")) {
      setTodos([]);
      saveTodos([]);

      if (window.showAlert) {
        window.showAlert("已清除所有待办事项", "success");
      }
    }
  };

  // 计算统计信息
  const completedCount = todos.filter((todo) => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  return (
    <div className="container py-4">
      <div className="mx-auto" style={{ maxWidth: "36rem" }}>
        {/* 面包屑导航 */}
        <nav
          className="flex items-center text-sm mb-4"
          style={{ color: "var(--text-light)" }}
        >
          <Link href="/" className="hover:text-primary transition-colors">
            <FontAwesomeIcon icon={faHome} className="mr-1" />
            主页
          </Link>
          <span className="mx-2">/</span>
          <span>待办事项</span>
        </nav>

        {/* 页面头部 */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">待办事项</h1>
        </div>

        {/* 添加待办事项表单 */}
        <form onSubmit={addTodo} className="flex gap-2">
          <input
            type="text"
            className="input flex-1"
            placeholder="添加新的待办事项..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            添加
          </button>
        </form>

        {/* 待办事项列表 */}
        <div className="mt-6 border border-border rounded-lg overflow-hidden">
          {todos.length === 0 ? (
            <div
              className="p-8 text-center"
              style={{ color: "var(--text-light)" }}
            >
              <FontAwesomeIcon
                icon={faClipboardList}
                className="text-4xl mb-4"
                style={{ opacity: 0.5 }}
              />
              <p>暂无待办事项</p>
              <p className="text-sm mt-2">添加一些待办事项开始使用吧</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="p-4 border-b border-border last:border-b-0 flex items-center"
              >
                <div
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer mr-4 ${
                    todo.completed
                      ? "border-primary text-white"
                      : "border-border"
                  }`}
                  style={
                    todo.completed ? { backgroundColor: "var(--primary)" } : {}
                  }
                  onClick={() => toggleTodoCompleted(todo.id)}
                >
                  {todo.completed && (
                    <FontAwesomeIcon icon={faCheck} className="text-xs" />
                  )}
                </div>
                <div
                  className={`flex-1 ${todo.completed ? "line-through" : ""}`}
                  style={{ opacity: todo.completed ? 0.6 : 1 }}
                >
                  {todo.text}
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-outline p-2"
                    onClick={() => editTodo(todo.id)}
                    aria-label="编辑"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="btn btn-danger p-2"
                    onClick={() => deleteTodo(todo.id)}
                    aria-label="删除"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 待办事项统计 */}
        <div
          className="flex justify-between mt-4 text-sm"
          style={{ color: "var(--text-light)" }}
        >
          <div>已完成: {completedCount}</div>
          <div>待完成: {pendingCount}</div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-between mt-4">
          <button onClick={clearCompleted} className="btn btn-outline">
            <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
            清除已完成
          </button>
          <button onClick={clearAll} className="btn btn-danger">
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            清除全部
          </button>
        </div>
      </div>
    </div>
  );
}
