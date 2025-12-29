
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2, Download, Copy, RefreshCw, Send } from 'lucide-react';

const AIGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateAIImage = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        },
      });

      let imageUrl = null;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          imageUrl = `data:image/png;base64,${base64EncodeString}`;
          break;
        }
      }

      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        throw new Error("No image data returned from AI.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate image. Please try a different prompt or check your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const download = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `toolly-ai-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 font-bold text-xs uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          <span>Next-Gen AI Generation</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">AI Art Studio</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Describe anything you can imagine and watch Toolly bring it to life in seconds.
        </p>
      </div>

      <div className="glass-card p-6 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500">Your Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic city with purple neon lights and flying cars, cinematic lighting..."
                className="w-full h-40 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 focus:ring-4 focus:ring-indigo-500/20 outline-none resize-none text-lg transition-all"
              />
            </div>

            <button
              onClick={generateAIImage}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xl shadow-indigo-500/30"
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> <span>Dreaming...</span></>
              ) : (
                <><Send className="w-5 h-5" /> <span>Generate Image</span></>
              )}
            </button>

            {error && (
              <p className="text-sm text-red-500 text-center font-medium bg-red-50 dark:bg-red-900/20 py-2 rounded-xl">
                {error}
              </p>
            )}
          </div>

          <div className="flex-1">
            <div className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-[2rem] overflow-hidden relative flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-inner">
              {generatedImage ? (
                <>
                  <img src={generatedImage} className="w-full h-full object-cover animate-in fade-in zoom-in duration-500" alt="AI Generated" />
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <button onClick={download} className="p-3 bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Download className="w-5 h-5" />
                    </button>
                    <button onClick={() => setGeneratedImage(null)} className="p-3 bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 space-y-4">
                  <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">Your masterpiece will appear here</p>
                </div>
              )}
              {isGenerating && (
                <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-indigo-600 animate-pulse" />
                  </div>
                  <p className="text-indigo-600 font-bold animate-pulse">Consulting the muse...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
