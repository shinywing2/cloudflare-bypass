chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ATTEMPT_BYPASS") {
    console.log("Content script received ATTEMPT_BYPASS:", request.settings);
    attemptBypass(request.settings);
    // Optionally send an immediate acknowledgement if needed
    // sendResponse({ status: "RECEIVED_REQUEST" }); 
  }
  return true; // Required for asynchronous sendResponse
});

function attemptBypass(settings) {
  console.log("Attempting Cloudflare bypass with settings:", settings);
  // Send message to popup that process started
  chrome.runtime.sendMessage({ action: "UPDATE_STATUS", message: "Bypass process started..." });

  // 1. Find the Cloudflare Turnstile iframe
  const iframe = document.querySelector('iframe[src*="challenges.cloudflare.com"]');
  if (!iframe) {
    console.error("Cloudflare Turnstile iframe not found.");
    chrome.runtime.sendMessage({ action: "UPDATE_STATUS", message: "WIDGET_NOT_FOUND" });
    return;
  }

  console.log("Cloudflare Turnstile iframe found:", iframe);

  // Function to handle interaction logic
  const interactWithTurnstile = () => {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    if (!iframeDoc) {
        console.error("Could not access iframe document.");
        chrome.runtime.sendMessage({ action: "UPDATE_STATUS", message: "IFRAME_ACCESS_DENIED" });
        return;
    }

    // 2. Find the checkbox within the iframe
    // This selector is a placeholder and VERY LIKELY needs to be adjusted.
    // Common alternatives: 'div[role="checkbox"]', elements with ARIA labels like "Verify you are human"
    const checkbox = iframeDoc.querySelector('input[type="checkbox"]'); 

    if (!checkbox) {
      console.error("Cloudflare Turnstile checkbox not found within iframe. Trying common alternative selectors.");
      // Try other potential selectors if the primary one fails
      const alternativeCheckboxes = [
        iframeDoc.querySelector('div[role="checkbox"]'),
        iframeDoc.querySelector('[aria-label*="Verify you are human"]'),
        iframeDoc.querySelector('span[class*="mark"]') // Example class, needs inspection
      ].filter(Boolean); // Remove nulls

      if(alternativeCheckboxes.length > 0) {
        checkbox = alternativeCheckboxes[0];
        console.log("Found checkbox with alternative selector:", checkbox);
      } else {
        console.error("Still could not find Cloudflare Turnstile checkbox within iframe.");
        chrome.runtime.sendMessage({ action: "UPDATE_STATUS", message: "WIDGET_CHECKBOX_NOT_FOUND" });
        return;
      }
    }

    if (!checkbox) { // Double check after alternatives
        console.error("Cloudflare Turnstile checkbox not found within iframe.");
        chrome.runtime.sendMessage({ action: "UPDATE_STATUS", message: "WIDGET_CHECKBOX_NOT_FOUND" });
        return;
    }
    
    console.log("Cloudflare Turnstile checkbox found:", checkbox);

    // 3. Click the checkbox
    checkbox.click();
    console.log("Clicked Cloudflare Turnstile checkbox.");
    chrome.runtime.sendMessage({ action: "UPDATE_STATUS", message: "CHECKBOX_CLICKED" });

    // 4. Monitor for completion
    let timeElapsed = 0;
    const intervalCheck = setInterval(() => {
      timeElapsed += settings.interval; // settings.interval is in seconds

      // Check for success: e.g., iframe disappears, or a specific element shows success
      const currentIframe = document.querySelector('iframe[src*="challenges.cloudflare.com"]');
      if (!currentIframe || getComputedStyle(currentIframe).display === 'none') {
        console.log("Cloudflare Turnstile likely bypassed (iframe disappeared or hidden).");
        chrome.runtime.sendMessage({ action: "UPDATE_STATUS", message: "BYPASS_SUCCESS" });
        clearInterval(intervalCheck);
        return;
      }
      
      // Alternative check: look for a success message or changed attributes on the checkbox
      // Example: if (checkbox.checked && checkbox.disabled) { ... }
      // This requires knowing the exact behavior of the widget post-verification.
      // For now, we rely on the iframe disappearing.

      if (timeElapsed >= settings.timeout) { // settings.timeout is in seconds
        console.warn("Timeout reached waiting for Cloudflare bypass.");
        chrome.runtime.sendMessage({ action: "UPDATE_STATUS", message: "BYPASS_TIMEOUT" });
        clearInterval(intervalCheck);
      }
    }, settings.interval * 1000); // Convert interval to milliseconds
  };
  
  // Check if iframe is already loaded, otherwise wait for onload
  if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
    console.log("Iframe already loaded.");
    interactWithTurnstile();
  } else {
    console.log("Waiting for iframe to load...");
    iframe.onload = () => {
      console.log("Iframe finished loading.");
      interactWithTurnstile();
    };
    iframe.onerror = () => {
        console.error("Could not load iframe content.");
        chrome.runtime.sendMessage({ action: "UPDATE_STATUS", message: "IFRAME_LOAD_ERROR" });
    }
  }
}

// Helper (though not strictly necessary as chrome.runtime.sendMessage is simple)
// function sendMessageToPopup(message) {
//   chrome.runtime.sendMessage(message);
// }

console.log("Cloudflare Bypass content script loaded.");
