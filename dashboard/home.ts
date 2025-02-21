import { Request, Response } from "express";
import { config as sconfig } from "@/config";
import fs from "fs";

const rsslist: rssData[] = JSON.parse(
  fs.readFileSync("./service/rss.json", "utf-8")
);

export const Home = (req: Request, res: Response) => {
  if (req.session.authenticated) {
    res.redirect("/dashboard");
  } else {
    res.send(`
        <!doctype html>
  <html>
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/png" href="/assets/fav.png">      
      <script src="/assets/global.js"></script>
      <link rel="stylesheet" href="/assets/css/all.min.css" />
      <title>${sconfig.service_name} Dashboard</title>
  </head>
  <body>
      <div class="min-h-screen bg-gray-900 text-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="text-center">
            <h1 class="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Telegram Bot Dashboard
            </h1>
            <p class="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Manage your Telegram channels with automated RSS feed integration, scheduled posts, and real-time analytics.
            </p>
            
            <div class="flex justify-center gap-4 mb-20">
              <a href="/dashboard" class="bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all">
                Get Started
              </a>
            </div>

            <h2 class="text-3xl font-bold mb-8">Features</h2>
            <div class="grid md:grid-cols-4 gap-8 mb-16">
              <div class="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-colors">
                <div class="w-12 h-12 bg-purple-500/20 rounded-lg mb-4 flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Automated Feeds</h3>
                <p class="text-gray-400 mb-4">Connect RSS feeds and automate content delivery to your channels</p>
                <div class="bg-purple-500/10 p-3 rounded-lg">
                  <p class="text-sm text-purple-400">Supports multiple RSS sources with automatic content parsing and scheduling</p>
                </div>
              </div>


              <div class="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-colors">
                <div class="w-12 h-12 bg-blue-500/20 rounded-lg mb-4 flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Multi-channel</h3>
                <p class="text-gray-400 mb-4">Manage multiple channels simultaneously from one dashboard</p>
                <div class="bg-blue-500/10 p-3 rounded-lg">
                  <p class="text-sm text-blue-400">Easily switch between channels and manage content distribution across all platforms</p>
                </div>
              </div>

              <div class="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-colors">
                <div class="w-12 h-12 bg-green-500/20 rounded-lg mb-4 flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">AI Translation</h3>
                <p class="text-gray-400 mb-4">Automatically translate content to multiple languages with AI-powered accuracy</p>
                <div class="bg-green-500/10 p-3 rounded-lg">
                  <p class="text-sm text-green-400">Supports Farsi, Turkish, French, Spanish, and German translations</p>
                </div>
              </div>

              
              <div class="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-colors relative">
                <div class="w-12 h-12 bg-pink-500/20 rounded-lg mb-4 flex items-center justify-center">
                  <svg class="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Real-time Analytics</h3>
                <p class="text-gray-400 mb-4">Track engagement metrics and post performance in real-time</p>
                <div class="absolute top-4 right-4 bg-yellow-500/20 px-3 py-1 rounded-full text-sm text-yellow-400">
                  Coming Soon
                </div>
                <div class="bg-pink-500/10 p-3 rounded-lg">
                  <p class="text-sm text-pink-400">We're working hard to bring you advanced analytics features. Stay tuned!</p>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-800 pt-12">
              <h2 class="text-3xl font-bold mb-8">Supported RSS Sources</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-400 items-center">
                ${rsslist
                  .filter((f) => f.active)
                  .map(
                    (f) => `
                    <div class="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-center">${f.category}</div>
                  `
                  )
                  .join("")}
              </div>
            </div>
            <div class="pt-12">
            <h2 class="text-3xl font-bold mb-8">Supported Translation languages</h2>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-gray-400 items-center">
                <div class="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-center flex items-center justify-center gap-2">
                    🇮🇷 Farsi
                </div>
                <div class="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-center flex items-center justify-center gap-2">
                    🇹🇷 Turkish
                </div>
                <div class="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-center flex items-center justify-center gap-2">
                    🇫🇷 French
                </div>
                <div class="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-center flex items-center justify-center gap-2">
                    🇪🇸 Spanish
                </div>
                <div class="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-center flex items-center justify-center gap-2">
                    🇩🇪 German
                </div>
            </div>
            </div>
          </div>
        </div>
   <footer class="text-white p-4 mt-4 text-center flex-col items-center justify-center">
          <p>&copy; ${new Date().getFullYear()} ${
      sconfig.service_name
    }. All rights reserved.</p>
          <div>
               <a href="https://github.com/TelegramBotDashboards/rss-bot" class="text-cyan-400 hover:underline" target="_blank">
                  <i class="fab fa-github"></i> GitHub
              </a>
          </div>
      </footer>
      
      </div>
      </body>
      </html>
      `);
  }
};
