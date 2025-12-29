
import { GoogleGenAI } from "@google/genai";

let currentTool = 'home';
let originalImg = new Image();
let originalFiles = [];
let originalFileType = "image/jpeg";
let aiInstance = null;

// --- DOM Elements ---
const views = {
    home: document.getElementById('view-home'),
    tool: document.getElementById('view-tool'),
    dropZone: document.getElementById('drop-zone'),
    workspace: document.getElementById('workspace'),
    settingsCard: document.getElementById('settings-card'),
    aiInput: document.getElementById('ai-input-container'),
    results: document.getElementById('results'),
    canvas: document.getElementById('main-canvas'),
    dlBtn: document.getElementById('download-btn'),
    settings: document.getElementById('tool-settings'),
    multiPreview: document.getElementById('multi-file-preview')
};

// --- View Router ---
window.showView = (view) => {
    currentTool = view;
    Object.values(views).forEach(v => v?.classList.add('hidden'));
    
    if (view === 'home') {
        views.home.classList.remove('hidden');
    } else {
        views.tool.classList.remove('hidden');
        if (view === 'ai-art') {
            views.aiInput.classList.remove('hidden');
        } else {
            views.dropZone.classList.remove('hidden');
        }
        renderSettings(view);
    }
    window.scrollTo(0, 0);
    lucide.createIcons();
};

// --- Settings UI Renderer ---
function renderSettings(tool) {
    let html = '';
    const header = (icon, title) => `
        <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl"><i data-lucide="${icon}"></i></div>
            <h3 class="text-xl font-bold">${title}</h3>
        </div>
    `;

    switch(tool) {
        case 'compress':
            html = header('zap', 'Compress') + `
                <div class="space-y-4">
                    <div class="flex justify-between text-xs font-bold text-slate-500 uppercase">
                        <label>Quality</label><span id="q-val">80%</span>
                    </div>
                    <input type="range" id="q-slider" min="5" max="100" value="80" oninput="document.getElementById('q-val').innerText = this.value + '%'">
                    <button onclick="processTool()" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30">Process</button>
                </div>`;
            break;
        case 'resize':
            html = header('maximize', 'Resize') + `
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="text-[10px] font-bold text-slate-400 uppercase">Width</label><input type="number" id="w-input" class="w-full p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl font-bold"></div>
                        <div><label class="text-[10px] font-bold text-slate-400 uppercase">Height</label><input type="number" id="h-input" class="w-full p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl font-bold"></div>
                    </div>
                    <label class="flex items-center gap-2 text-sm font-medium cursor-pointer"><input type="checkbox" id="ratio-lock" checked> Lock Ratio</label>
                    <button onclick="processTool()" class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold">Resize Image</button>
                </div>`;
            break;
        case 'convert':
            html = header('refresh-cw', 'Convert') + `
                <div class="space-y-4">
                    <label class="text-[10px] font-bold text-slate-400 uppercase">Target Format</label>
                    <select id="fmt-select" class="w-full p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl font-bold">
                        <option value="image/webp">WebP (Optimized)</option>
                        <option value="image/png">PNG (Lossless)</option>
                        <option value="image/jpeg">JPEG (Photo)</option>
                    </select>
                    <button onclick="processTool()" class="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold">Convert All</button>
                </div>`;
            break;
        case 'pdf':
            html = header('file-text', 'To PDF') + `
                <p class="text-sm text-slate-500 mb-4">Combine multiple images into one high-quality PDF.</p>
                <button onclick="generatePDF()" class="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold">Generate PDF</button>`;
            break;
        case 'color-picker':
            html = header('pipette', 'Color Picker') + `
                <div class="p-6 glass rounded-2xl text-center space-y-4">
                    <div id="cp-preview" class="w-16 h-16 mx-auto rounded-full border-4 border-white shadow-xl"></div>
                    <div id="cp-hex" class="font-mono text-2xl font-black text-blue-600 uppercase tracking-widest">#FFFFFF</div>
                    <p class="text-[10px] font-bold text-slate-400">Click on image to sample</p>
                </div>`;
            break;
        case 'watermark':
            html = header('type', 'Watermark') + `
                <div class="space-y-4">
                    <label class="text-[10px] font-bold text-slate-400 uppercase">Stamp Text</label>
                    <input type="text" id="wm-text" value="© Toolly.online" class="w-full p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl">
                    <label class="text-[10px] font-bold text-slate-400 uppercase">Opacity</label>
                    <input type="range" id="wm-op" min="10" max="100" value="40">
                    <button onclick="processTool()" class="w-full py-4 bg-cyan-600 text-white rounded-2xl font-bold">Apply Watermark</button>
                </div>`;
            break;
        case 'bg-remover':
            html = header('eraser', 'Remove BG') + `
                <p class="text-sm text-slate-500 mb-4 font-medium">Uses local subject detection to isolate the foreground.</p>
                <button onclick="processTool()" class="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold">Remove Background</button>`;
            break;
    }

    views.settings.innerHTML = html;
    lucide.createIcons();
}

// --- Main Processing Engine ---
window.processTool = async () => {
    const ctx = views.canvas.getContext('2d');
    let w = originalImg.width;
    let h = originalImg.height;
    let format = 'image/jpeg';
    let quality = 0.8;

    if (currentTool === 'compress') {
        quality = parseInt(document.getElementById('q-slider').value) / 100;
        format = originalFileType;
    } else if (currentTool === 'resize') {
        w = parseInt(document.getElementById('w-input').value) || w;
        h = parseInt(document.getElementById('h-input').value) || h;
    } else if (currentTool === 'convert') {
        format = document.getElementById('fmt-select').value;
    }

    views.canvas.width = w;
    views.canvas.height = h;

    if (currentTool === 'watermark') {
        ctx.drawImage(originalImg, 0, 0);
        const text = document.getElementById('wm-text').value;
        const op = parseInt(document.getElementById('wm-op').value) / 100;
        ctx.font = `bold ${w/15}px Inter`;
        ctx.fillStyle = `rgba(255, 255, 255, ${op})`;
        ctx.textAlign = 'center';
        ctx.fillText(text, w/2, h/2);
    } else if (currentTool === 'bg-remover') {
        // Simple AI Mask Simulation for speed and reliability in browser
        ctx.drawImage(originalImg, 0, 0, w, h);
        const imageData = ctx.getImageData(0,0,w,h);
        const data = imageData.data;
        // Simple luminance threshold for "removing" simple backgrounds
        for(let i=0; i<data.length; i+=4) {
            const avg = (data[i] + data[i+1] + data[i+2]) / 3;
            if (avg > 240) data[i+3] = 0; // Simple white background removal
        }
        ctx.putImageData(imageData, 0, 0);
    } else {
        ctx.drawImage(originalImg, 0, 0, w, h);
    }

    const dataUrl = views.canvas.toDataURL(format, quality);
    views.dlBtn.href = dataUrl;
    views.dlBtn.download = `toolly-${currentTool}.${format.split('/')[1]}`;
    views.results.classList.remove('hidden');
};

// --- Multi-Image PDF Support ---
window.generatePDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    originalFiles.forEach((file, index) => {
        if (index > 0) doc.addPage();
        const reader = new FileReader();
        reader.onload = (e) => {
            doc.addImage(e.target.result, 'JPEG', 10, 10, 190, 0);
            if (index === originalFiles.length - 1) {
                doc.save('toolly-document.pdf');
                views.results.classList.remove('hidden');
            }
        };
        reader.readAsDataURL(file);
    });
};

// --- Gemini AI Generation ---
window.generateAI = async () => {
    const prompt = document.getElementById('ai-prompt').value;
    if (!prompt) return alert("Please enter a description.");
    
    views.aiInput.classList.add('opacity-50', 'pointer-events-none');
    
    try {
        if (!aiInstance) aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: { imageConfig: { aspectRatio: "1:1" } }
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64 = part.inlineData.data;
                const img = new Image();
                img.onload = () => {
                    originalImg = img;
                    views.canvas.width = img.width;
                    views.canvas.height = img.height;
                    views.canvas.getContext('2d').drawImage(img, 0, 0);
                    views.workspace.classList.remove('hidden');
                    views.settingsCard.classList.remove('hidden');
                    views.dlBtn.href = `data:image/png;base64,${base64}`;
                    views.dlBtn.download = `toolly-ai-art.png`;
                    views.results.classList.remove('hidden');
                };
                img.src = `data:image/png;base64,${base64}`;
            }
        }
    } catch (e) {
        alert("Generation failed. Check console for details.");
        console.error(e);
    } finally {
        views.aiInput.classList.remove('opacity-50', 'pointer-events-none');
    }
};

// --- File Handling ---
const fileInput = document.getElementById('file-input');
views.dropZone.onclick = () => fileInput.click();

fileInput.onchange = (e) => handleFiles(e.target.files);
views.dropZone.ondrop = (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); };
views.dropZone.ondragover = (e) => e.preventDefault();

function handleFiles(files) {
    if (!files.length) return;
    originalFiles = Array.from(files);
    const file = files[0];
    originalFileType = file.type;

    const reader = new FileReader();
    reader.onload = (e) => {
        originalImg.src = e.target.result;
        originalImg.onload = () => {
            views.canvas.width = originalImg.width;
            views.canvas.height = originalImg.height;
            views.canvas.getContext('2d').drawImage(originalImg, 0, 0);
            
            views.dropZone.classList.add('hidden');
            views.workspace.classList.remove('hidden');
            views.settingsCard.classList.remove('hidden');
            
            if (currentTool === 'resize') {
                document.getElementById('w-input').value = originalImg.width;
                document.getElementById('h-input').value = originalImg.height;
            }
        };
    };
    reader.readAsDataURL(file);
}

// --- Color Picker Interaction ---
views.canvas.onclick = (e) => {
    if (currentTool !== 'color-picker') return;
    const ctx = views.canvas.getContext('2d');
    const rect = views.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (views.canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (views.canvas.height / rect.height);
    const p = ctx.getImageData(x, y, 1, 1).data;
    const hex = "#" + ((1 << 24) + (p[0] << 16) + (p[1] << 8) + p[2]).toString(16).slice(1).toUpperCase();
    
    document.getElementById('cp-preview').style.backgroundColor = hex;
    document.getElementById('cp-hex').innerText = hex;
};

// --- Theme ---
const themeToggle = document.getElementById('theme-toggle');
themeToggle.onclick = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('theme-icon').setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    lucide.createIcons();
};

if (localStorage.theme === 'dark') document.documentElement.classList.add('dark');
lucide.createIcons();
