let text = document.getElementById("text");
text.style.backgroundColor = "#eee";
text.innerText = chrome.runtime.getManifest().version;