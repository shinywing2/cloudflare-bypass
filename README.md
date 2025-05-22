# Cloudflare Bypass Chrome Extension

<div style="text-align: center; margin-bottom: 50px">
  <img src="assets/cf_bypass_logo.png" alt="Cloudflare Bypass Chrome Extension Logo" width="250">
</div>

This project provides a Chrome extension to detect and attempt to bypass Cloudflare Turnstile challenges. It was originally a Python utility and has been adapted to function as a browser extension for more integrated use.

<img src="assets/cf_turnstile.gif" alt="Bypassed image" width="200">


## Installation (Chrome Extension)

1.  **Download the code**:
    *   Clone the repository: `git clone https://github.com/your-username/your-repo-name.git`
    *   Or download the ZIP and extract it.
2.  **Open Chrome Extensions**: Navigate to `chrome://extensions` in your Chrome browser.
3.  **Enable Developer Mode**: Toggle the "Developer mode" switch, usually found in the top-right corner.
4.  **Load Unpacked**: Click the "Load unpacked" button.
5.  **Select Directory**: In the file dialog, select the directory where you cloned or extracted the extension files (this is the directory that contains the `manifest.json` file).

The extension icon should now appear in your Chrome toolbar.

## Usage (Chrome Extension)

1.  **Access the Popup**: Click the Cloudflare Bypass Extension icon in your Chrome toolbar. This will open a small popup window.
2.  **Adjust Settings (Optional)**:
    *   **Mode**: Choose 'light' or 'dark' based on the webpage's theme (this is a visual aid and does not directly affect bypass logic). Default is 'light'.
    *   **Timeout (seconds)**: Set how long the extension should wait for the Turnstile to be solved after attempting. Default is 20 seconds.
    *   **Interval (seconds)**: Set how frequently the extension checks for the Turnstile's completion. Default is 1 second.
    Settings are saved automatically.
3.  **Attempt Bypass**: On a page with a Cloudflare Turnstile widget, click the "Bypass on this page" button in the popup.
4.  **Monitor Status**: The popup will display status messages like "Bypass process started...", "CHECKBOX_CLICKED", "BYPASS_SUCCESS", or "BYPASS_TIMEOUT".

## Limitations
- This extension primarily targets Cloudflare Turnstile challenges.
- The speed of bypass can be relatively slow depending on the challenge and site.
- Effectiveness depends on Cloudflare's current Turnstile implementation. Selectors for the widget and the detection logic might need updates if Cloudflare changes its structure. This extension is provided as-is and may not always succeed.

## Disclaimer
Note: This extension is provided for educational and testing purposes only. Unauthorized use of this extension to circumvent security measures is strictly prohibited. The author and contributors are not responsible for any misuse or consequences arising from the use of this extension.

## Support
If you find this project helpful, consider buying me a coffee to support ongoing development

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/tamnvworkr)


## Contact
For inquiries or support, please contact me:
```
Name: Tam Nguyen
Email: tamnv.work@gmail.com
```

Feel free to open issues or contribute to the project on GitHub.

## Support My Side Project
- [IconFst](https://iconfst.com)
