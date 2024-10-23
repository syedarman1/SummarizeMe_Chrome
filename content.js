chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'summarizeSelectedText') {
      const selectedText = window.getSelection().toString();
      sendResponse({ text: selectedText });
    }
  });
  