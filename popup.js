document.addEventListener('DOMContentLoaded', () => {
  const modeSelect = document.getElementById('mode');
  const timeoutInput = document.getElementById('timeout');
  const intervalInput = document.getElementById('interval');
  const bypassButton = document.getElementById('bypassButton');
  const statusArea = document.getElementById('statusArea');

  // Default settings
  const defaultSettings = {
    mode: 'light',
    timeout: 20,
    interval: 1
  };

  // Load settings
  chrome.storage.sync.get(['settings'], (result) => {
    const savedSettings = result.settings || defaultSettings;
    modeSelect.value = savedSettings.mode;
    timeoutInput.value = savedSettings.timeout;
    intervalInput.value = savedSettings.interval;
  });

  // Save settings on change
  modeSelect.addEventListener('change', saveSettings);
  timeoutInput.addEventListener('change', saveSettings);
  intervalInput.addEventListener('change', saveSettings);

  function saveSettings() {
    const settings = {
      mode: modeSelect.value,
      timeout: parseInt(timeoutInput.value, 10) || defaultSettings.timeout,
      interval: parseInt(intervalInput.value, 10) || defaultSettings.interval
    };
    chrome.storage.sync.set({ settings });
    statusArea.textContent = 'Settings saved.';
  }

  // Trigger bypass
  bypassButton.addEventListener('click', () => {
    const settings = {
      mode: modeSelect.value,
      timeout: parseInt(timeoutInput.value, 10) || defaultSettings.timeout,
      interval: parseInt(intervalInput.value, 10) || defaultSettings.interval
    };

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "ATTEMPT_BYPASS",
          settings: settings
        }, (response) => {
          if (chrome.runtime.lastError) {
            statusArea.textContent = `Error: ${chrome.runtime.lastError.message}`;
          } else if (response) {
            statusArea.textContent = response.status;
          } else {
            statusArea.textContent = "No response from content script.";
          }
        });
        statusArea.textContent = "Attempting bypass...";
      } else {
        statusArea.textContent = "No active tab found.";
      }
    });
  });

  // Listen for status updates
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "UPDATE_STATUS") {
      statusArea.textContent = request.message;
    }
  });
});
