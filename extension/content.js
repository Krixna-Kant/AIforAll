(function() {
  console.log("AI Accessibility Assistant loaded");
  let dyslexiaFontEnabled = false;
  let highContrastEnabled = false;
  let voiceCommandEnabled = false;
  let recognition = null;
  let lastHoveredElement = null;
  let hoverDelay = null;

  chrome.storage.local.get(
      ["dyslexiaFontEnabled", "highContrastEnabled", "voiceCommandEnabled"],
      function(data) {
          dyslexiaFontEnabled = data.dyslexiaFontEnabled || false;
          highContrastEnabled = data.highContrastEnabled || false;
          voiceCommandEnabled = data.voiceCommandEnabled || false;
          if (dyslexiaFontEnabled) toggleDyslexiaFont(true);
          if (highContrastEnabled) toggleHighContrast(true);
          if (voiceCommandEnabled) toggleVoiceCommand(true);
      }
  );

  document.addEventListener('mouseover', function(e) {
      const element = e.target;
      if (element !== lastHoveredElement && element.textContent.trim()) {
          lastHoveredElement = element;
          clearTimeout(hoverDelay);
          hoverDelay = setTimeout(() => {
              chrome.storage.local.get(['ttsEnabled', 'ttsLang'], function(data) {
                  if (data.ttsEnabled) {
                      const text = element.textContent.trim();
                      const lang = data.ttsLang || 'en-US';
                      readTextAloud(text, lang);
                  }
              });
          }, 500); // Delay before reading
      }
  });

  document.addEventListener('mouseout', function(e) {
      clearTimeout(hoverDelay);
      if (e.target === lastHoveredElement) {
          speechSynthesis.cancel();
      }
  });

  function readTextAloud(text, lang) {
      if (!text || !lang) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.onerror = (event) => console.error('Speech error:', event.error);
      speechSynthesis.speak(utterance);
  }

  function toggleDyslexiaFont(enabled) {
      if (enabled) {
          const style = document.createElement('style');
          style.id = 'dyslexia-font-style';
          style.textContent = `
              body, p, h1, h2, h3, h4, h5, h6, span, a, div, button, input, textarea, select, option {
                  font-family: 'OpenDyslexic', sans-serif !important;
                  line-height: 1.5 !important;
                  letter-spacing: 0.05em !important;
              }
          `;
          document.head.appendChild(style);
          const fontLink = document.createElement('link');
          fontLink.id = 'dyslexia-font-link';
          fontLink.rel = 'stylesheet';
          fontLink.href = 'https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic-regular.css';
          document.head.appendChild(fontLink);
      } else {
          document.getElementById('dyslexia-font-style')?.remove();
          document.getElementById('dyslexia-font-link')?.remove();
      }
  }

  function toggleHighContrast(enabled) {
      if (enabled) {
          const style = document.createElement('style');
          style.id = 'high-contrast-style';
          style.textContent = `
              body { background-color: #000 !important; color: #fff !important; }
              p, h1, h2, h3, h4, h5, h6, span, a, div { color: #fff !important; background-color: #000 !important; }
              a { color: #ffff00 !important; text-decoration: underline !important; }
              img { filter: brightness(0.8) contrast(1.2) !important; }
              button, input, textarea, select { background-color: #333 !important; color: #fff !important; border: 1px solid #fff !important; }
          `;
          document.head.appendChild(style);
      } else {
          document.getElementById('high-contrast-style')?.remove();
      }
  }

  function toggleVoiceCommand(enabled) {
      if (!('webkitSpeechRecognition' in window)) return;
      
      if (enabled) {
          recognition = new webkitSpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = false;
          recognition.lang = 'en-US';

          recognition.onresult = (event) => {
              const result = event.results[event.results.length - 1][0];
              const transcript = result.transcript.toLowerCase().trim();
              const confidence = result.confidence;

              console.log("Recognized:", transcript, "Confidence:", confidence);

              if (confidence < 0.5) {
                  giveFeedback("Low confidence, please try again.");
                  return;
              }

              if (transcript.includes('scroll')) {
                  if (transcript.includes('down')) {
                      window.scrollBy(0, 300);
                      giveFeedback("Scrolling down...");
                  } else if (transcript.includes('up')) {
                      window.scrollBy(0, -300);
                      giveFeedback("Scrolling up...");
                  }
              } else if (transcript.includes('go')) {
                  if (transcript.includes('back')) {
                      window.history.back();
                      giveFeedback("Going back...");
                  } else if (transcript.includes('forward')) {
                      window.history.forward();
                      giveFeedback("Going forward...");
                  }
              } else if (transcript.includes('read')) {
                  if (transcript.includes('page')) {
                      speechSynthesis.speak(new SpeechSynthesisUtterance(document.body.innerText));
                      giveFeedback("Reading page...");
                  } else if (transcript.includes('stop')) {
                      speechSynthesis.cancel();
                      giveFeedback("Stopped reading.");
                  }
              }
          };

          recognition.onerror = (event) => {
              console.error("Speech recognition error:", event.error);
              if (event.error === 'no-speech' || event.error === 'audio-capture') {
                  recognition.start(); // Restart if no speech or audio capture error
              }
          };

          recognition.onend = () => {
              chrome.storage.local.get(['voiceCommandEnabled'], function(data) {
                  if (data.voiceCommandEnabled) recognition.start(); // Restart if enabled
              });
          };

          recognition.start();
          const indicator = document.createElement('div');
          indicator.id = 'voice-command-indicator';
          indicator.textContent = '🎤 Listening...';
          Object.assign(indicator.style, {
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              zIndex: '10000'
          });
          document.body.appendChild(indicator);
      } else {
          recognition?.stop();
          document.getElementById('voice-command-indicator')?.remove();
      }
  }

  function giveFeedback(message) {
      const feedbackDiv = document.createElement('div');
      feedbackDiv.textContent = message;
      Object.assign(feedbackDiv.style, {
          position: 'fixed',
          bottom: '60px',
          right: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          zIndex: '10000'
      });
      document.body.appendChild(feedbackDiv);
      setTimeout(() => feedbackDiv.remove(), 2000); // Remove after 2 seconds
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'toggleDyslexiaFont') toggleDyslexiaFont(request.enabled);
      else if (request.action === 'toggleHighContrast') toggleHighContrast(request.enabled);
      else if (request.action === 'toggleVoiceCommand') toggleVoiceCommand(request.enabled);
      else if (request.action === 'readAloud') readTextAloud(request.text, request.lang);
      return true; 
  });
})();