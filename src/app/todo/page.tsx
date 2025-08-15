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
  faGripVertical,
  faArchive,
} from "@fortawesome/free-solid-svg-icons";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import InputDialog from "@/components/ui/InputDialog";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  archived?: boolean;
  order?: number;
  archivedAt?: Date;
}

interface SortableTodoItemProps {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function SortableTodoItem({ todo, onToggle, onEdit, onDelete }: SortableTodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 border-b border-border last:border-b-0 flex items-center"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing mr-3 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <FontAwesomeIcon icon={faGripVertical} className="text-gray-400" />
      </div>
      <div
        className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer mr-4 ${
          todo.completed
            ? "border-primary text-white"
            : "border-border"
        }`}
        style={
          todo.completed
            ? { backgroundColor: "var(--primary)" }
            : {}
        }
        onClick={() => onToggle(todo.id)}
      >
        {todo.completed && (
          <FontAwesomeIcon icon={faCheck} className="text-xs" />
        )}
      </div>
      <div
        className={`flex-1 ${
          todo.completed ? "line-through" : ""
        }`}
        style={{ opacity: todo.completed ? 0.6 : 1 }}
      >
        {todo.text}
      </div>
      <div className="flex gap-2">
        <button
          className="btn btn-outline p-2"
          onClick={() => onEdit(todo.id)}
          aria-label="编辑"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button
          className="btn btn-danger p-2"
          onClick={() => onDelete(todo.id)}
          aria-label="删除"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}

export default function TodoPage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [archivedTodos, setArchivedTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  
  // 对话框状态
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: "danger" | "warning" | "info";
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });
  
  const [inputDialog, setInputDialog] = useState<{
    isOpen: boolean;
    title: string;
    message?: string;
    defaultValue?: string;
    onConfirm: (value: string) => void;
  }>({ isOpen: false, title: "", onConfirm: () => {} });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 初始化
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    const savedArchivedTodos = localStorage.getItem("archivedTodos");
    
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        const todosWithDates = parsedTodos.map(
          (todo: TodoItem & { createdAt: string }) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            order: todo.order ?? 0,
          })
        );
        setTodos(todosWithDates.sort((a: TodoItem, b: TodoItem) => (a.order || 0) - (b.order || 0)));
      } catch (error) {
        console.error("Failed to parse todos:", error);
        setTodos([]);
      }
    }
    
    if (savedArchivedTodos) {
      try {
        const parsedArchivedTodos = JSON.parse(savedArchivedTodos);
        const archivedTodosWithDates = parsedArchivedTodos.map(
          (todo: TodoItem & { createdAt: string }) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
          })
        );
        setArchivedTodos(archivedTodosWithDates);
      } catch (error) {
        console.error("Failed to parse archived todos:", error);
        setArchivedTodos([]);
      }
    }
  }, []);

  // 保存待办事项到本地存储
  const saveTodos = (newTodos: TodoItem[]) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  // 保存已归档待办事项到本地存储
  const saveArchivedTodos = (newArchivedTodos: TodoItem[]) => {
    localStorage.setItem("archivedTodos", JSON.stringify(newArchivedTodos));
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
      order: todos.length,
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

    setInputDialog({
      isOpen: true,
      title: "编辑待办事项",
      defaultValue: todo.text,
      onConfirm: (newText: string) => {
        const newTodos = todos.map((t) =>
          t.id === id ? { ...t, text: newText } : t
        );
        setTodos(newTodos);
        saveTodos(newTodos);

        if (window.showAlert) {
          window.showAlert("待办事项已更新", "success");
        }
        setInputDialog({ ...inputDialog, isOpen: false });
      },
    });
  };

  // 删除待办事项
  const deleteTodo = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "删除待办事项",
      message: "确定要删除这个待办事项吗？",
      type: "danger",
      onConfirm: () => {
        const newTodos = todos.filter((todo) => todo.id !== id);
        setTodos(newTodos);
        saveTodos(newTodos);

        if (window.showAlert) {
          window.showAlert("待办事项已删除", "success");
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  // 拖拽结束处理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = todos.findIndex((todo) => todo.id === active.id);
    const newIndex = todos.findIndex((todo) => todo.id === over.id);

    const newTodos = arrayMove(todos, oldIndex, newIndex).map((todo, index) => ({
      ...todo,
      order: index,
    }));
    
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  // 归档已完成的待办事项
  const archiveCompleted = () => {
    const completedTodos = todos.filter((todo) => todo.completed);
    if (completedTodos.length === 0) {
      if (window.showAlert) {
        window.showAlert("没有已完成的待办事项可归档", "info");
      }
      return;
    }

    const remainingTodos = todos.filter((todo) => !todo.completed);
    const archivedTodosWithTimestamp = completedTodos.map((todo) => ({
      ...todo,
      archived: true,
      archivedAt: new Date(),
    }));
    
    const newArchivedTodos = [...archivedTodos, ...archivedTodosWithTimestamp];
    
    setTodos(remainingTodos);
    setArchivedTodos(newArchivedTodos);
    saveTodos(remainingTodos);
    saveArchivedTodos(newArchivedTodos);

    if (window.showAlert) {
      window.showAlert(`已归档 ${completedTodos.length} 个已完成的待办事项`, "success");
    }
  };

  // 删除归档的待办事项
  const deleteArchivedTodo = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "删除已归档待办事项",
      message: "确定要永久删除这个已归档的待办事项吗？",
      type: "danger",
      onConfirm: () => {
        const newArchivedTodos = archivedTodos.filter((todo) => todo.id !== id);
        setArchivedTodos(newArchivedTodos);
        saveArchivedTodos(newArchivedTodos);

        if (window.showAlert) {
          window.showAlert("已归档的待办事项已删除", "success");
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  // 恢复归档的待办事项
  const restoreArchivedTodo = (id: string) => {
    const todoToRestore = archivedTodos.find((todo) => todo.id === id);
    if (!todoToRestore) return;

    const restoredTodo = {
      ...todoToRestore,
      archived: false,
      order: todos.length,
    };
    delete (restoredTodo as any).archivedAt;

    const newArchivedTodos = archivedTodos.filter((todo) => todo.id !== id);
    const newTodos = [...todos, restoredTodo];

    setArchivedTodos(newArchivedTodos);
    setTodos(newTodos);
    saveArchivedTodos(newArchivedTodos);
    saveTodos(newTodos);

    if (window.showAlert) {
      window.showAlert("待办事项已恢复", "success");
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

    setConfirmDialog({
      isOpen: true,
      title: "清除所有待办事项",
      message: "确定要清除所有待办事项吗？这个操作不可撤销。",
      type: "danger",
      onConfirm: () => {
        setTodos([]);
        saveTodos([]);

        if (window.showAlert) {
          window.showAlert("已清除所有待办事项", "success");
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  // 计算统计信息
  const completedCount = todos.filter((todo) => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  return (
    <>
      <Navbar />
      <div className="container py-4 flex-1">
        <div className="mx-auto" style={{ maxWidth: "36rem" }}>
          {/* 页面头部 */}
          <div className="flex items-center justify-between mb-6">
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
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {showArchived ? "已归档" : "待办事项"}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowArchived(!showArchived)}
                  className="btn btn-outline"
                >
                  {showArchived ? "返回待办" : `查看归档 (${archivedTodos.length})`}
                </button>
                {!showArchived && (
                  <button
                    onClick={archiveCompleted}
                    className="btn btn-secondary"
                    disabled={todos.filter(todo => todo.completed).length === 0}
                  >
                    <FontAwesomeIcon icon={faArchive} className="mr-2" />
                    归档已完成
                  </button>
                )}
              </div>
            </div>
            
            <div className="border border-border rounded-lg overflow-hidden">
              {showArchived ? (
                archivedTodos.length === 0 ? (
                  <div
                    className="p-8 text-center"
                    style={{ color: "var(--text-light)" }}
                  >
                    <FontAwesomeIcon
                      icon={faArchive}
                      className="text-4xl mb-4"
                      style={{ opacity: 0.5 }}
                    />
                    <p>暂无已归档的待办事项</p>
                  </div>
                ) : (
                  archivedTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="p-4 border-b border-border last:border-b-0 flex items-center bg-gray-50 dark:bg-gray-800"
                    >
                      <div
                        className="w-5 h-5 border-2 rounded flex items-center justify-center mr-4 border-primary text-white"
                        style={{ backgroundColor: "var(--primary)" }}
                      >
                        <FontAwesomeIcon icon={faCheck} className="text-xs" />
                      </div>
                      <div
                        className="flex-1 line-through"
                        style={{ opacity: 0.6 }}
                      >
                        {todo.text}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-outline p-2"
                          onClick={() => restoreArchivedTodo(todo.id)}
                          aria-label="恢复"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          className="btn btn-danger p-2"
                          onClick={() => deleteArchivedTodo(todo.id)}
                          aria-label="删除"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  ))
                )
              ) : (
                todos.length === 0 ? (
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
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={todos.map(todo => todo.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {todos.map((todo) => (
                        <SortableTodoItem
                          key={todo.id}
                          todo={todo}
                          onToggle={toggleTodoCompleted}
                          onEdit={editTodo}
                          onDelete={deleteTodo}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )
              )}
            </div>
          </div>

          {/* 待办事项统计 */}
          <div
            className="flex justify-between mt-4 text-sm"
            style={{ color: "var(--text-light)" }}
          >
            {showArchived ? (
              <>
                <div>已归档: {archivedTodos.length}</div>
                <div></div>
              </>
            ) : (
              <>
                <div>已完成: {completedCount}</div>
                <div>待完成: {pendingCount}</div>
              </>
            )}
          </div>

          {/* 操作按钮 */}
          {!showArchived && (
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
          )}
        </div>
      </div>
      
      {/* 对话框组件 */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
      
      <InputDialog
        isOpen={inputDialog.isOpen}
        title={inputDialog.title}
        message={inputDialog.message}
        defaultValue={inputDialog.defaultValue}
        onConfirm={inputDialog.onConfirm}
        onCancel={() => setInputDialog({ ...inputDialog, isOpen: false })}
      />
      
      <Footer />
    </>
  );
}
