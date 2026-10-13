"use strict";

// Dữ liệu 5 công việc khởi tạo ban đầu
let tasks = [
  { id: 1, title: "Viết báo cáo HTML", dueDate: "2026-10-20", priority: "Cao", status: "pending" },
  { id: 2, title: "Ôn Flexbox", dueDate: "2026-10-23", priority: "Trung bình", status: "pending" },
  { id: 3, title: "Làm bài DOM", dueDate: "2026-10-19", priority: "Cao", status: "done" },
  { id: 4, title: "Đọc tài liệu CSS", dueDate: "2026-10-25", priority: "Thấp", status: "pending" },
  { id: 5, title: "Thiết kế trang cá nhân", dueDate: "2026-10-21", priority: "Trung bình", status: "done" }
];

// Lấy các element từ DOM
const taskForm = document.querySelector('#task-form');
const titleInput = document.querySelector('#task-name'); 
const dueDateInput = document.querySelector('#task-deadline');
const priorityInput = document.querySelector('#task-priority');
const errorMsg = document.querySelector('#error-msg');
const taskList = document.querySelector('#task-list');
const searchInput = document.querySelector('#search-input');
const filterStatus = document.querySelector('#filter-status');

// C1 & C3: Hiển thị dữ liệu, tìm kiếm và lọc trạng thái
function loadTasks() {
  const keyword = searchInput.value.toLowerCase().trim();
  const filterVal = filterStatus.value; 

  // Xóa nội dung cũ
  taskList.innerHTML = '';

  // Lọc dữ liệu theo từ khóa & trạng thái
  const filtered = tasks.filter(item => {
    const matchTitle = item.title.toLowerCase().includes(keyword);
    
    let matchStatus = true;
    if (filterVal === "Chưa hoàn thành") matchStatus = (item.status === "pending");
    else if (filterVal === "Đã hoàn thành") matchStatus = (item.status === "done");
    
    return matchTitle && matchStatus;
  });

  if (filtered.length === 0) {
    taskList.innerHTML = '<li class="empty-msg">Danh sách trống.</li>';
    return;
  }

  // Đổ dữ liệu lên giao diện HTML
  filtered.forEach(item => {
    const li = document.createElement('li');
    li.className = `task-item ${item.status === 'done' ? 'completed' : ''}`;
    
    let priorityClass = '';
    if (item.priority === 'Cao') priorityClass = 'badge-high';
    else if (item.priority === 'Trung bình') priorityClass = 'badge-medium';
    else priorityClass = 'badge-low';

    const statusText = item.status === 'done' ? 'Đã hoàn thành' : 'Chưa hoàn thành';
    const btnActionText = item.status === 'done' ? 'Hoàn tác' : 'Hoàn thành';

    li.innerHTML = `
      <div class="task-info">
        <h3 class="task-title">${item.title}</h3>
        <div class="task-meta">
          <span class="badge ${priorityClass}">${item.priority}</span>
          <span>📅 ${item.dueDate || 'Không hạn'}</span>
          <span class="status-label">${statusText}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn btn-toggle" onclick="toggleTask(${item.id})">${btnActionText}</button>
        <button class="btn btn-delete" onclick="deleteTask(${item.id})">Xóa</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// C2: Thêm công việc mới & Kiểm tra hợp lệ
taskForm.addEventListener('submit', function(e) {
  e.preventDefault(); 
  
  const title = titleInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;

  if (!title) {
    errorMsg.textContent = "Vui lòng không để trống tên công việc!";
    titleInput.focus();
    return;
  }

  errorMsg.textContent = ""; 

  const newTask = {
    id: Date.now(), 
    title: title,
    dueDate: dueDate,
    priority: priority,
    status: "pending" 
  };

  tasks.unshift(newTask); 
  loadTasks();
  taskForm.reset();
});

// C3: Gắn sự kiện để tìm kiếm và lọc tức thì
searchInput.addEventListener('input', loadTasks);
filterStatus.addEventListener('change', loadTasks);

// C4: Cập nhật trạng thái
window.toggleTask = function(id) {
  const idx = tasks.findIndex(item => item.id === id);
  if (idx !== -1) {
    tasks[idx].status = tasks[idx].status === "pending" ? "done" : "pending";
    loadTasks(); 
  }
};

// C4: Xóa công việc
window.deleteTask = function(id) {
  if (confirm("Bạn có muốn xóa công việc này không?")) {
    tasks = tasks.filter(item => item.id !== id);
    loadTasks(); 
  }
};

// Khởi chạy
loadTasks();