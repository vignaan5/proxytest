document.addEventListener('click', async (event) => {
  if (event.ctrlKey && event.target.tagName.toLowerCase() === 'textarea') {
    const textarea = event.target;
    const allText = document.body.innerText; // Capture all text from the webpage
    const response = await fetchResponse(allText+promptRules); // Use all text as prompt
    
    // Use the simulateTyping function to type the response
    simulateTyping(response, textarea);
  } else if (event.ctrlKey) {
    // Existing functionality: Capture all text on the page
    const allText = document.body.innerText;
    chrome.runtime.sendMessage({ text: allText });
  }
});

async function fetchResponse(prompt) {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [{ role: 'user', content: prompt }],
        stream: false
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching response:', error);
    return 'Error fetching response';
  }
}

// Function to simulate typing with varying speed
function simulateTyping(text, element) {
  let currentIndex = 0;

  function typeCharacter() {
    if (currentIndex < text.length) {
      element.value += text[currentIndex];
      currentIndex++;

      // Randomly adjust speed between 60 and 90 WPM
      const wordsPerMinute = Math.floor(Math.random() * (90 - 70 + 1)) + 60;
      const charsPerMinute = wordsPerMinute * 5; // Average word length is 5 characters
      const typingInterval = 58000 / charsPerMinute; // Interval in milliseconds per character

      setTimeout(typeCharacter, typingInterval);
    }
  }

  typeCharacter();
}



const promptRules = "\n -> please make sure the response is easy to copy and paste without editing. try to generate between 65 to 80 words. your response should only contain the answer. nothing else.\n -> if you have seen this question before and responding to it agian, make sure this time is unique or a bit different from the previous one. \n show empathy towards the customer's concern and be professional. \n -> the answer should not contain more than two paragraphs."