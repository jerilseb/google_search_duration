async function initializePopup() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  // Check if the URL is a Google search results page
  const isGoogleSearch = url && url.includes('://www.google.') && url.includes('/search');

  if (isGoogleSearch) {
    // Existing logic for Google Search pages
    function click(e) {
      var original_url = tab.url; // Use the URL already fetched
      var found, new_url;

      if (original_url) {
        found = original_url.match(/tbs=qdr:(..)/);

        if (found) {
          new_url = original_url.replace(/tbs=qdr:(..)/, `tbs=qdr:${e.target.id}`);
          console.log(found[1]);
        } else {
          new_url = `${original_url}&tbs=qdr:${e.target.id}`;
        }
        chrome.tabs.update(tab.id, { url: new_url }); // Use tab.id
      }
      window.close();
    }

    var divs = document.querySelectorAll('div.time-option'); // Make selector more specific if needed
    for (var i = 0; i < divs.length; i++) {
      divs[i].addEventListener('click', click);
    }
  } else {
    document.body.innerHTML = '<p>Not a Google Search page</p>';
    document.body.style.minWidth = '22ch';
    document.body.style.padding = '15px';
  }
}

document.addEventListener('DOMContentLoaded', initializePopup);