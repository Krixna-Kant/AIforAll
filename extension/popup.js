document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get([
      'ttsEnabled', 'ttsLang',
      'dyslexiaFontEnabled', 'highContrastEnabled',
      'voiceCommandEnabled'
  ], function(data) {
      document.getElementById('toggleTTS').checked = data.ttsEnabled || false;
      document.getElementById('ttsLanguage').value = data.ttsLang || 'en-US';
      document.getElementById('toggleDyslexiaFont').checked = data.dyslexiaFontEnabled || false;
      document.getElementById('toggleHighContrast').checked = data.highContrastEnabled || false;
      document.getElementById('toggleVoiceCommand').checked = data.voiceCommandEnabled || false;
  });

  document.getElementById('toggleTTS').addEventListener('change', function() {
      chrome.storage.local.set({ ttsEnabled: this.checked });
  });

  document.getElementById('ttsLanguage').addEventListener('change', function() {
      chrome.storage.local.set({ ttsLang: this.value });
  });

  document.getElementById('toggleDyslexiaFont').addEventListener('change', function() {
      const enabled = this.checked;
      chrome.storage.local.set({ dyslexiaFontEnabled: enabled });
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleDyslexiaFont', enabled: enabled });
      });
  });

  document.getElementById('toggleHighContrast').addEventListener('change', function() {
      const enabled = this.checked;
      chrome.storage.local.set({ highContrastEnabled: enabled });
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleHighContrast', enabled: enabled });
      });
  });

  document.getElementById('toggleVoiceCommand').addEventListener('change', function() {
      const enabled = this.checked;
      chrome.storage.local.set({ voiceCommandEnabled: enabled });
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleVoiceCommand', enabled: enabled });
      });
  });

  document.getElementById('saveSettings').addEventListener('click', function() {
      const settings = {
          ttsEnabled: document.getElementById('toggleTTS').checked,
          ttsLang: document.getElementById('ttsLanguage').value,
          dyslexiaFontEnabled: document.getElementById('toggleDyslexiaFont').checked,
          highContrastEnabled: document.getElementById('toggleHighContrast').checked,
          voiceCommandEnabled: document.getElementById('toggleVoiceCommand').checked
      };

      chrome.storage.local.set(settings, function() {
          const saveButton = document.getElementById('saveSettings');
          saveButton.textContent = 'Saved!';
          setTimeout(() => saveButton.textContent = 'Save Settings', 1500);
      });
  });
});