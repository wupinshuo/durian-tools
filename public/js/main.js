// 主题切换功能
function toggleTheme() {
  const body = document.body;
  if (body.classList.contains("dark-theme")) {
    body.classList.remove("dark-theme");
    localStorage.setItem("theme", "light");
    document.querySelectorAll(".theme-toggle-icon").forEach((icon) => {
      icon.textContent = "🌙";
    });
  } else {
    body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
    document.querySelectorAll(".theme-toggle-icon").forEach((icon) => {
      icon.textContent = "☀️";
    });
  }
}

// 初始化主题
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    document.querySelectorAll(".theme-toggle-icon").forEach((icon) => {
      icon.textContent = "☀️";
    });
  } else {
    document.querySelectorAll(".theme-toggle-icon").forEach((icon) => {
      icon.textContent = "🌙";
    });
  }
}

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", () => {
  initTheme();

  // 绑定主题切换按钮事件
  document.querySelectorAll(".theme-toggle").forEach((button) => {
    button.addEventListener("click", toggleTheme);
  });

  // 检查是否是首次访问
  const isFirstVisit = localStorage.getItem("visited") !== "true";
  if (isFirstVisit) {
    const guide = document.getElementById("first-visit-guide");
    if (guide) {
      guide.classList.remove("hidden");
    }
    localStorage.setItem("visited", "true");
  }

  // 关闭指南
  const closeGuideBtn = document.getElementById("close-guide");
  if (closeGuideBtn) {
    closeGuideBtn.addEventListener("click", () => {
      document.getElementById("first-visit-guide").classList.add("hidden");
    });
  }

  // 加载工具到iframe
  const toolLinks = document.querySelectorAll("[data-tool]");
  toolLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const toolName = link.getAttribute("data-tool");
      const iframe = document.getElementById("tool-frame");
      if (iframe) {
        iframe.src = `${toolName}.html`;

        // 更新活动链接样式
        document.querySelectorAll("[data-tool]").forEach((el) => {
          el.classList.remove("active");
        });
        link.classList.add("active");

        // 保存当前工具到本地存储
        localStorage.setItem("currentTool", toolName);
      }
    });
  });

  // 恢复上次使用的工具
  const currentTool = localStorage.getItem("currentTool");
  if (currentTool) {
    const toolLink = document.querySelector(`[data-tool="${currentTool}"]`);
    if (toolLink) {
      toolLink.click();
    }
  }
});

// 工具页面共享函数
function showAlert(message, type = "info") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;

  const alertContainer = document.getElementById("alert-container");
  if (alertContainer) {
    alertContainer.appendChild(alertDiv);

    // 3秒后自动移除
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }
}

// 复制到剪贴板
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showAlert("已复制到剪贴板", "success");
    })
    .catch((err) => {
      showAlert("复制失败: " + err, "error");
    });
}
