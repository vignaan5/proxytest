document.addEventListener('click', async (event) => {
  if (event.ctrlKey && event.target.tagName.toLowerCase() === 'textarea') {
    const textarea = event.target;
    const allText = document.body.innerText; // Capture all text from the webpage
    const response = await fetchResponse(allText + promptRules); // Use all text as prompt
    
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
        model: 'llama-3.1-sonar-small-128k-online', // Change this to a smaller or less expensive model
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

// Function to simulate typing with varying speed and occasional backspaces
function simulateTyping(text, element) {
  let currentIndex = 0;

  function typeCharacter() {
    if (currentIndex < text.length) {
      // Randomly decide to perform a backspace action
      if (Math.random() < 0.01 && currentIndex > 0) { // 1% chance to backspace
        element.value = element.value.slice(0, -1); // Remove last character
        currentIndex--; // Move back one character
      } else {
        element.value += text[currentIndex];
        currentIndex++;
      }

      // Randomly adjust speed between 60 and 90 WPM
      const wordsPerMinute = Math.floor(Math.random() * (36 - 28 + 1)) + 60;
      const charsPerMinute = wordsPerMinute * 5; // Average word length is 5 characters
      const typingInterval = 60000 / charsPerMinute; // Interval in milliseconds per character

      setTimeout(typeCharacter, typingInterval);
    }
  }

  typeCharacter();
}

const promptRules = "\n  1) please make sure the response is easy to copy and paste without editing. try to generate between 65 to 80 words. your response should only contain the answer. nothing else.\n 2) if you have seen this question before and responding to it again, make sure this time is unique or a bit different from the previous one. \n 3) show empathy towards the customer's concern and be professional. \n 4) the answer should not contain more than two paragraphs. \n 5) Don't use any bullet points and don't copy more onscreen information while generating answer. Be more creative 6) here is a sample question: You are a customer service agent for an online clothing company.\nAgent: How can I help you today?\nCustomer: I bought some sweaters from your company last week, they are great but now I get daily email advertisements. How can I stop advertisements coming to my email address?\n1. Open email\n2. Scroll down\n3. Find \"unsubscribe\" link\n4. Update and submit preferences \n Here is the sample response for the question : Apologies for the unwanted advertisements. I can assist you with removing them. I'll need you to open your email and open one of the ads you received. Scroll down until you find the \"unsubscribe\" link. It is usually on the lower right part of the message. Once you click that, it will give you a chance to update and submit your preferences. \n 6) please use the above question and the sample response and generate answers according to the context ";