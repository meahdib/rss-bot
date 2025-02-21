import { Request, Response } from "express";
import { CONFIG_PATH, DATA_PATH, LOG_PATH } from ".";
import fs from "fs";
import { botProcess } from "@/service";
import { config as sconfig } from "@/config";
import { errorPage } from "./error";

export const Dashboard = (_req: Request, res: Response) => {
  const config: ConfigData = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
  const data: BotData = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  const logs: LogData[] = JSON.parse(fs.readFileSync(LOG_PATH, "utf-8")).slice(
    -10
  );
  const serviceStatus = botProcess ? "Running" : "Stopped";
  try {
    const categories = JSON.parse(
      fs.readFileSync("./service/rss.json").toString()
    ) as rssData[];

    const activeCategories = categories.filter((c) => c.active);

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
  <body class="bg-gray-900 text-white">
  <script>
      document.addEventListener("DOMContentLoaded", function() {
          const stopServiceButton = document.querySelector("form[action='/stop-service'] button");
          const restartServiceButton = document.querySelector("form[action='/restart-service'] button");
          const logoutButton = document.querySelector("form[action='/logout'] button");
          
          
          if (stopServiceButton) {
              stopServiceButton.addEventListener("click", function(event) {
                  event.preventDefault(); // Prevent the default form submission
                  // Add loading state to the button
                  
                  stopServiceButton.disabled = true; // Disable the button to prevent multiple clicks
      
                  stopServiceButton.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Stopping Service";
                  fetch("/stop-service", {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                      },
                  })
                  .then(response => {
                      if (response.redirected) {
                          window.location.href = response.url; // Redirect to the new URL
                      } else {
                          return response.json(); // Handle the response if needed
                      }
                  })
                  .catch(error => {
                      console.error("Error stopping service:", error);
                  })
                  .finally(() => {
                      // Reset button state after fetch completes
                      stopServiceButton.innerHTML = '<i class="fas fa-stop"></i> Stop Service'
                      stopServiceButton.disabled = false; // Re-enable the button
                  });
              });
          }
          
          restartServiceButton.addEventListener("click", function(event) {
              event.preventDefault(); // Prevent the default form submission
              // Add loading state to the button
              
              restartServiceButton.disabled = true; // Disable the button to prevent multiple clicks
  
              restartServiceButton.innerHTML = "<i class='fas fa-sync fa-spin'></i> Restart Service";
              
              fetch("/restart-service", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
              })
              .then(response => {
                  if (response.redirected) {
                      window.location.href = response.url; // Redirect to the new URL
                  } else {
                      return response.json(); // Handle the response if needed
                  }
              })
              .catch(error => {
                  console.error("Error restarting service:", error);
              })
              .finally(() => {
                  // Reset button state after fetch completes
                  restartServiceButton.innerHTML = "<i class='fas fa-sync'></i> Restart Service";
                  restartServiceButton.disabled = false; // Re-enable the button
              });
          });
      });
  </script>
  <div class="container mx-auto p-4">
      <div class="flex justify-between mb-8">
          <h1 class="text-3xl font-bold mb-4">
              <i class="fas fa-dashboard fa-lg"></i> ${
                sconfig.service_name
              } Dashboard
          </h1>
          <div class="flex flex-col md:flex-row items-center space-x-0 md:space-x-2">
              <div class="w-10 h-10 rounded-full border-3 border-blue-700 flex items-center justify-center">
                  <i class="fas fa-user text-white"></i>
              </div>
              <span class="text-lg text-gray-200">Admin</span>
              <div class="flex flex-col md:flex-row gap-2 mt-2 md:mt-0">
                  <form method="GET" action="/change-password">
                     <button type="submit" class="bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-700 cursor-pointer relative group" title="Change Password">
                         <i class="fas fa-key"></i>
                         
                     </button>
                 </form>
                  <form method="POST" action="/logout">
                      <button type="submit" class="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 cursor-pointer" title="log out">
                          <i class="fas fa-sign-out-alt"></i>
                      </button>
                  </form>
              </div>
          </div>
      </div>
      <div class="flex  flex-wrap row items-center gap-2 mb-4 bg-gray-800 p-6 rounded shadow-md">
          <h2 class="text-xl">Service Status: <span class="${
            botProcess ? "text-green-400" : "text-red-400"
          }">${serviceStatus}</span> ${
      serviceStatus === "Running"
        ? '<i class="fas fa-sync fa-spin text-green-400"></i>'
        : '<i class="fas fa-power-off text-red-400"></i>'
    }</h2>
    
          <form method="POST" action="/restart-service">
              <button type="submit" class="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 cursor-pointer">
                  <i class="fas fa-sync"></i> Restart Service
              </button>
          </form>
          ${
            serviceStatus === "Running"
              ? `
          <form method="POST" action="/stop-service">
              <button type="submit" class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 cursor-pointer">
                  <i class="fas fa-stop"></i> Stop Service
              </button>
          </form>
          `
              : ""
          }
          </div>
    
      <div class="flex-col gap-4 mb-8 flex-wrap">
          <div class="flex-1 flex-col h-full flex-wrap mb-8"> 
              <h2 class="text-xl mb-2"><i class="fas fa-robot"></i> Bot Configuration</h2>
              
                  <div class="flex-1 bg-gray-800 p-6 rounded shadow-md h-full">
                      
                      <form method="POST" action="/update-config" class="mb-4 flex space-x-2 flex-wrap gap-4">
                          <input type="text" name="botToken" placeholder="bot token" value="${
                            config.botToken
                          }" class="flex-2 border rounded p-2 bg-gray-700 text-white">
                          <button type="submit" class="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
                              <i class="fas fa-cog"></i> Update Token
                          </button>
                      </form>
                  </div>
             
          </div>   
          <div class="flex flex-col md:flex-row gap-4 flex-wrap">         
          <div class="flex-1 flex-col h-full"> 
              <h2 class="text-xl mb-2"><i class="fas fa-cogs"></i> Service Configuration</h2>
              <div class="flex-1 bg-gray-800 p-6 rounded shadow-md h-full">
                  <form method="POST" action="/update-service" class="mb-4 flex flex-col gap-4">
                      <select name="feedUrl" placeholder="Feed url"
                       class="flex-2 border rounded p-2 bg-gray-700 text-white">
                       ${activeCategories
                         .map(
                           (f) =>
                             `
                    <option value="${f.rss}" ${
                               f.rss == data.feedUrl ? "selected" : ""
                             } >${f.category}</option>
                    `
                         )
                         .join("")}
                       </select>
                       
                      <div class="flex items-center gap-2">
                          <input type="checkbox" name="enableTranslation" id="enableTranslation" 
                                 class="w-4 h-4" ${
                                   data.enableTranslation ? "checked" : ""
                                 }>
                          <label for="enableTranslation" class="text-gray-300">Enable Translation</label>
                      </div>
                      
                      <select name="translationLanguage" class="border rounded p-2 bg-gray-700 text-white">
                          <option value="fa" ${
                            data.translationLanguage === "fa" ? "selected" : ""
                          }>Farsi</option>
                          <option value="tr" ${
                            data.translationLanguage === "tr" ? "selected" : ""
                          }>Turkish</option>
                          <option value="es" ${
                            data.translationLanguage === "es" ? "selected" : ""
                          }>Spanish</option>
                          <option value="fr" ${
                            data.translationLanguage === "fr" ? "selected" : ""
                          }>French</option>
                          <option value="de" ${
                            data.translationLanguage === "de" ? "selected" : ""
                          }>German</option>
                      </select>
                      
                      <input type="text" name="googleApiKey" placeholder="Google Cloud API Key" 
                             value="${data.googleApiKey || ""}" 
                             class="flex-2 border rounded p-2 bg-gray-700 text-white">
                             
                      <button type="submit" class="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
                          <i class="fas fa-cog"></i> Update Service
                      </button>
                  </form>
              </div>
          </div>
                   <div class="flex-1 flex-col h-full"> 
                <h2 class="text-xl mb-2"><i class="fas fa-list"></i> Channel List(${
                  data.channels.length
                })</h2>
      <div class="flex-col bg-gray-800 p-6 rounded shadow-md mb-4">
          <div class="overflow-auto">
              <div class="grid grid-cols-1 gap-2">
                  ${data.channels
                    .map(
                      (channel) => `
                      <div class="bg-gray-700 p-2 rounded">
                          ${channel.title}
                      </div>
                  `
                    )
                    .join("")}
              </div>
          </div>
          <p class="mt-4">Last News: <span class="text-cyan-400">${new Date(
            data.lastFetch
          ).toLocaleString()}</span></p>
          </div>
      </div>
      </div>
      </div>

      <h2 class="text-xl mb-2"><i class="fas fa-file-alt"></i> Service Logs</h2>
      <div class="flex flex-col mb-4">
          <div class="overflow-auto bg-gray-800 rounded-lg shadow-md p-4">
              ${logs
                .map(
                  (log) => `
                  <div class="flex items-center mb-2">
                      <span class="text-sm text-cyan-400 mr-2">[${
                        log.timestamp
                      }]</span>
                      <span class="${
                        log.message.join(" ").includes("ERROR")
                          ? "text-red-500 bg-red-900/20"
                          : log.message.join(" ").includes("OK")
                          ? "text-green-400 bg-green-900/20"
                          : "text-gray-400"
                      } rounded px-2 py-1 text-sm">${log.message.join(
                    " "
                  )}</span>
                  </div>
              `
                )
                .join("")}
          </div>
      </div>    
      <footer class="text-white p-4 mt-4 text-center flex justify-between">
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
  </html>`);
  } catch (err) {
    console.log((err as Error).message);
    const html = errorPage();
    res.status(500).send(html);
  }
};
