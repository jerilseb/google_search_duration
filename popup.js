function click(e) {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

      var original_url = tabs[0].url;
      var found, new_url;

      if(original_url) {
        found = original_url.match(/tbs=qdr:(..)/);

        if(found) {
          new_url = original_url.replace(/tbs=qdr:(..)/, `tbs=qdr:${e.target.id}`)
          console.log(found[1]);
        }
        else {
          new_url = `${original_url}&tbs=qdr:${e.target.id}`;
        }
        chrome.tabs.update(null, {url: new_url});
      }

      window.close();
  });

}

document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});