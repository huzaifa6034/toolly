
/**
 * Toolly.online - Core Engine (Vanilla JS Version)
 * Professional client-side image processing.
 */

// --- Global State ---
let currentTool = null;
let originalImg = new Image();
let originalFileName = "";
let originalFileType = "";

// --- View Router ---
function showView(view) {
    const homeView = document.getElementById('view-home');
    const toolView = document.getElementById('view-tool');
    const dropZone = document.getElementById('drop-zone');
    const workspace = document.getElementById('workspace');
    const settingsContainer = document.getElementById('tool-settings-container');
    const results = document.getElementById('results');

    if (view === 'home') {
        homeView.classList.remove('hidden');
        toolView.classList.add('hidden');
        currentTool = null;
    } else {
        homeView.classList.add('hidden');
        toolView.classList.remove('hidden');
        dropZone.classList.remove('hidden');
        workspace.classList.add('hidden');
        settingsContainer.classList.add('hidden');
        results.classList.add('hidden');
        currentTool = view;
        renderToolSettings(view);
    }
    window.scrollTo(0, 0);
}

// --- Settings Renderer ---
function renderToolSettings(tool) {
    const settings = document.getElementById('tool-settings');
    let html = '';

    if (tool === 'compress') {
        html = `
            <div class="space-y-6">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl"><i data-lucide="zap" class="w-6 h-6"></i></div>
                    <h3 class="text-xl font-bold">Compress Settings</h3>
                </div>
                <div class="space-y-4">
                    <div class="flex justify-between font-bold text-sm text-slate-500 uppercase tracking-widest">
                        <label>Quality</label>
                        <span id="q-val" class="text-blue-600">80%</span>
                    </div>
                    <input type="range" id="q-slider" min="5" max="100" value="80" 
                        class="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-600">
                    <p class="text-[11px] text-slate-400 font-medium">Lower quality results in smaller file sizes.</p>
                </div>
                <button onclick="processImage()" class="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all">Compress Now</button>
            </div>
        `;
    } else if (tool === 'resize') {
        html = `
            <div class="space-y-6">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl"><i data-lucide="maximize" class="w-6 h-6"></i></div>
                    <h3 class="text-xl font-bold">Resize Image</h3>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Width (px)</label>
                        <input type="number" id="w-input" class="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500" oninput="handleRescale(this, 'w')">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Height (px)</label>
                        <input type="number" id="h-input" class="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500" oninput="handleRescale(this, 'h')">
                    </div>
                </div>
                <label class="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" id="ratio-lock" checked class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                    <span class="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">Lock Aspect Ratio</span>
                </label>
                <button onclick="processImage()" class="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 transition-all">Resize Now</button>
            </div>
        `;
    } else if (tool === 'convert') {
        html = `
            <div class="space-y-6">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl"><i data-lucide="refresh-cw" class="w-6 h-6"></i></div>
                    <h3 class="text-xl font-bold">Convert Format</h3>
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Output Format</label>
                    <select id="fmt-select" class="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl font-bold outline-none cursor-pointer">
                        <option value="image/webp">WEBP (Highly Optimized)</option>
                        <option value="image/jpeg">JPEG (Standard Photo)</option>
                        <option value="image/png">PNG (Lossless)</option>
                    </select>
                </div>
                <button onclick="processImage()" class="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-emerald-500/30 hover:bg-emerald-700 transition-all">Convert All</button>
            </div>
        `;
    } else if (tool === 'crop' || tool === 'pdf') {
        const icon = tool === 'crop' ? 'scissors' : 'file-text';
        const color = tool === 'crop' ? 'orange' : 'rose';
        const label = tool === 'crop' ? 'Crop Image' : 'Generate PDF';
        html = `
            <div class="space-y-6 text-center">
                <div class="flex items-center justify-center gap-3 mb-4">
                    <div class="p-3 bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 rounded-2xl"><i data-lucide="${icon}" class="w-8 h-8"></i></div>
                </div>
                <h3 class="text-2xl font-black">${label}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">Settings for this tool will be expanded in the workspace view soon. For now, we use high-quality defaults.</p>
                <button onclick="processImage()" class="w-full py-5 bg-${color}-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-${color}-500/30 hover:bg-${color}-700 transition-all">${label}</button>
            </div>
        `;
    }

    settings.innerHTML = html;
    lucide.createIcons();

    // Event listeners for UI elements
    if (tool === 'compress') {
        const slider = document.getElementById('q-slider');
        const val = document.getElementById('q-val');
        slider.addEventListener('input', () => { val.innerText = `${slider.value}%`; });
    }
}

// --- Image Processing Engine ---
function handleRescale(el, type) {
    if (!document.getElementById('ratio-lock').checked) return;
    const ratio = originalImg.width / originalImg.height;
    const val = parseInt(el.value);
    if (isNaN(val)) return;

    if (type === 'w') {
        document.getElementById('h-input').value = Math.round(val / ratio);
    } else {
        document.getElementById('w-input').value = Math.round(val * ratio);
    }
}

async function processImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const results = document.getElementById('results');
    const dlBtn = document.getElementById('download-btn');

    let w = originalImg.width;
    let h = originalImg.height;
    let format = 'image/jpeg';
    let quality = 0.8;

    if (currentTool === 'compress') {
        quality = parseInt(document.getElementById('q-slider').value) / 100;
        format = originalFileType; // Try to keep original type
    } else if (currentTool === 'resize') {
        w = parseInt(document.getElementById('w-input').value) || w;
        h = parseInt(document.getElementById('h-input').value) || h;
    } else if (currentTool === 'convert') {
        format = document.getElementById('fmt-select').value;
    }

    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(originalImg, 0, 0, w, h);

    const dataUrl = canvas.toDataURL(format, quality);
    const ext = format.split('/')[1];
    
    dlBtn.href = dataUrl;
    dlBtn.download = `toolly-${currentTool}-${Date.now()}.${ext}`;
    
    results.classList.remove('hidden');
    results.scrollIntoView({ behavior: 'smooth' });
}

// --- File Handling ---
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-blue-500', 'bg-blue-50/10');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-blue-500', 'bg-blue-50/10');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-blue-500', 'bg-blue-50/10');
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleFile(e.target.files[0]);
});

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file.");
        return;
    }

    originalFileName = file.name;
    originalFileType = file.type;

    const reader = new FileReader();
    reader.onload = (e) => {
        originalImg.src = e.target.result;
        originalImg.onload = () => {
            document.getElementById('preview-image').src = originalImg.src;
            document.getElementById('drop-zone').classList.add('hidden');
            document.getElementById('workspace').classList.remove('hidden');
            document.getElementById('tool-settings-container').classList.remove('hidden');

            // Initialize tool-specific UI
            if (currentTool === 'resize') {
                document.getElementById('w-input').value = originalImg.width;
                document.getElementById('h-input').value = originalImg.height;
            }
        };
    };
    reader.readAsDataURL(file);
}

// --- Theme Management ---
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        themeIcon.setAttribute('data-lucide', 'sun');
    } else {
        document.documentElement.classList.remove('dark');
        themeIcon.setAttribute('data-lucide', 'moon');
    }
    localStorage.setItem('theme', theme);
    lucide.createIcons();
}

themeBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
});

// Init
const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);
lucide.createIcons();

// --- Service Worker ---
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').catch(() => {});
    });
}
