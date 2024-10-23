function updateModeLabel(isDarkMode) {
  const modeLabel = document.getElementById('modeLabel');
  if (isDarkMode) {
    modeLabel.textContent = 'Dark Mode';
  } else {
    modeLabel.textContent = 'Light Mode';
  }
}

document.getElementById('toggleDarkMode').addEventListener('change', () => {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  chrome.storage.sync.set({ darkMode: isDarkMode });
  updateModeLabel(isDarkMode);
});

chrome.storage.sync.get('darkMode', (data) => {
  const darkModeEnabled = data.darkMode || false;
  document.body.classList.toggle('dark-mode', darkModeEnabled);
  document.getElementById('toggleDarkMode').checked = darkModeEnabled;
  updateModeLabel(darkModeEnabled);  
});

document.getElementById('summarizeBtn').addEventListener('click', async () => {
  const inputText = document.getElementById('inputText').value;
  if (inputText) {
    const response = await fetch('https://summarizeme-438906.uk.r.appspot.com/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputText })
    });
    const data = await response.json();
    document.getElementById('summaryResult').textContent = data.summary;
    document.getElementById('readAloudBtn').disabled = false;
  }
});

let audio = null;

document.getElementById('readAloudBtn').addEventListener('click', async () => {
  const summaryText = document.getElementById('summaryResult').textContent;
  
  if (audio && !audio.paused) {
    audio.pause();
    audio.currentTime = 0;
    audio = null;  
    document.getElementById('readAloudBtn').textContent = 'Read Aloud';  
    return;
  }

  if (summaryText) {
    document.getElementById('readAloudBtn').textContent = 'Stop'; 
    const response = await fetch('https://summarizeme-438906.uk.r.appspot.com/read-aloud', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: summaryText })
    });
    const blob = await response.blob();
    const audioURL = URL.createObjectURL(blob);
    audio = new Audio(audioURL);
    audio.play();
    
    audio.onended = () => {
      document.getElementById('readAloudBtn').textContent = 'Read Aloud'; 
      audio = null;
    };
  }
});
