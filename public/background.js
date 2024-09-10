chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.text) {
      const blob = new Blob([request.text], { type: 'text/plain' });
      const reader = new FileReader();
  
      reader.onload = function() {
        chrome.downloads.download({
          url: reader.result,
          filename: 'webpage_text.txt',
          saveAs: true
        });
      };
  
      reader.readAsDataURL(blob);
    }
  });