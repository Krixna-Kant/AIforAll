chrome.runtime.onInstalled.addListener(() => {
  console.log("AI Accessibility Assistant Installed");
  chrome.storage.local.set({
      ttsEnabled: false,
      ttsLang: "en-US",
      dyslexiaFontEnabled: false,
      highContrastEnabled: false,
      voiceCommandEnabled: false
  });

  chrome.contextMenus.create({
      id: "speakText",
      title: "Read Aloud",
      contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "speakText") {
      chrome.storage.local.get(["ttsLang"], function(data) {
          const lang = data.ttsLang || "en-US";
          chrome.tabs.sendMessage(tab.id, {
              action: "readAloud",
              text: info.selectionText,
              lang: lang
          });
      });
  }
});