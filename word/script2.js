function processText() {
  // Get the input text from the text area
  const inputText = document.getElementById("input-text").value;

  // Replace all spaces with new line characters
  const processedText = inputText.replace(/\p{White_Space}/ug, "\n");

  // Remove all punctuation marks including ।
  const finalText = processedText.replace(/\p{P}/ug, "");

  // Split the processed text into an array of words
  const wordsArray = finalText.split(/\s+/);

  // Create a Set to remove duplicates
  const uniqueWordsSet = new Set(wordsArray);

  // Join the unique words back into a string with new lines
  const uniqueWordsString = Array.from(uniqueWordsSet).join("\n");

  // Update the output text area with the processed text
  document.getElementById("output-text").value = uniqueWordsString;
}

function copyOutput() {
  // Get the output text from the text area
  const outputText = document.getElementById("output-text").value;

  // Create a new temporary textarea element
  const tempTextArea = document.createElement("textarea");

  // Set the value of the temporary textarea to the output text
  tempTextArea.value = outputText;

  // Append the temporary textarea to the document body
  document.body.appendChild(tempTextArea);

  // Select the contents of the temporary textarea
  tempTextArea.select();

  // Copy the selected text to the clipboard
  document.execCommand("copy");

  // Remove the temporary textarea from the document body
  document.body.removeChild(tempTextArea);
}
