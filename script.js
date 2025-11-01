// Navigation
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.getAttribute('data-page');
        
        // Update active states
        navLinks.forEach(l => l.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));
        
        link.classList.add('active');
        document.getElementById(targetPage).classList.add('active');
        
        // Update dashboard when switching to it
        if (targetPage === 'dashboard') {
            updateDashboard();
        }
    });
});

// To-Do List
let todos = JSON.parse(localStorage.getItem('todos')) || [];

const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${index})">
            <span>${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
        `;
        todoList.appendChild(li);
    });
    saveTodos();
}

function addTodo() {
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ text, completed: false, date: new Date().toISOString() });
        todoInput.value = '';
        renderTodos();
        updateDashboard();
    }
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    renderTodos();
    updateDashboard();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
    updateDashboard();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

// Notes
let notes = JSON.parse(localStorage.getItem('notes')) || [];

const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const addNoteBtn = document.getElementById('add-note-btn');
const notesList = document.getElementById('notes-list');

function renderNotes() {
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const div = document.createElement('div');
        div.className = 'note-card';
        div.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button class="delete-note-btn" onclick="deleteNote(${index})">Delete</button>
        `;
        notesList.appendChild(div);
    });
    saveNotes();
}

function addNote() {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    if (title && content) {
        notes.push({ title, content, date: new Date().toISOString() });
        noteTitleInput.value = '';
        noteContentInput.value = '';
        renderNotes();
        updateDashboard();
    }
}

function deleteNote(index) {
    notes.splice(index, 1);
    renderNotes();
    updateDashboard();
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

addNoteBtn.addEventListener('click', addNote);

// Calendar
let currentDate = new Date();

function renderCalendar() {
    const monthYear = document.getElementById('calendar-month-year');
    const calendarGrid = document.getElementById('calendar-grid');
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    monthYear.textContent = currentDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    calendarGrid.innerHTML = '';
    
    // Day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // First day of month
    const firstDay = new Date(year, month, 1).getDay();
    
    // Days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Previous month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = prevMonthDays - i;
        calendarGrid.appendChild(dayDiv);
    }
    
    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = day;
        
        if (year === today.getFullYear() && 
            month === today.getMonth() && 
            day === today.getDate()) {
            dayDiv.classList.add('today');
        }
        
        calendarGrid.appendChild(dayDiv);
    }
    
    // Next month days
    const totalCells = calendarGrid.children.length - 7; // Minus headers
    const remainingCells = 42 - totalCells - 7; // 6 rows * 7 days - headers
    for (let day = 1; day <= remainingCells; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = day;
        calendarGrid.appendChild(dayDiv);
    }
}

document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Dashboard
function updateDashboard() {
    // Update current date
    const dateEl = document.getElementById('current-date');
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Update todos
    const dashboardTodos = document.getElementById('dashboard-todos');
    const incompleteTodos = todos.filter(t => !t.completed).slice(0, 5);
    if (incompleteTodos.length > 0) {
        dashboardTodos.innerHTML = '<ul>' + 
            incompleteTodos.map(t => `<li>• ${t.text}</li>`).join('') + 
            '</ul>';
    } else {
        dashboardTodos.innerHTML = '<p class="empty-state">No pending tasks</p>';
    }
    
    // Update notes
    const dashboardNotes = document.getElementById('dashboard-notes');
    const recentNotes = notes.slice(-3).reverse();
    if (recentNotes.length > 0) {
        dashboardNotes.innerHTML = recentNotes.map(n => `
            <div class="note-preview">
                <h4>${n.title}</h4>
                <p>${n.content.substring(0, 50)}${n.content.length > 50 ? '...' : ''}</p>
            </div>
        `).join('');
    } else {
        dashboardNotes.innerHTML = '<p class="empty-state">No notes yet</p>';
    }
}

// Chatbot with Gemini API
let apiKey = localStorage.getItem('geminiApiKey') || '';
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat-btn');
const apiKeyInput = document.getElementById('api-key-input');
const saveApiKeyBtn = document.getElementById('save-api-key');

function addChatMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    if (!apiKey) {
        addChatMessage('Please save your Gemini API key first!', false);
        return;
    }
    
    addChatMessage(message, true);
    chatInput.value = '';
    
    // Show loading
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.textContent = 'Thinking...';
    chatMessages.appendChild(loadingDiv);
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });
        
        const data = await response.json();
        loadingDiv.remove();
        
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            addChatMessage(data.candidates[0].content.parts[0].text, false);
        } else if (data.error) {
            addChatMessage(`Error: ${data.error.message}`, false);
        } else {
            addChatMessage('Sorry, I could not generate a response.', false);
        }
    } catch (error) {
        loadingDiv.remove();
        addChatMessage('Error: Could not connect to Gemini API. Please check your API key.', false);
    }
}

saveApiKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
        apiKey = key;
        localStorage.setItem('geminiApiKey', key);
        apiKeyInput.value = '';
        addChatMessage('API key saved successfully! You can now chat with me.', false);
    }
});

sendChatBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Initialize
renderTodos();
renderNotes();
renderCalendar();
updateDashboard();

if (apiKey) {
    addChatMessage('Hello! I\'m your AI assistant. How can I help you today?', false);
}