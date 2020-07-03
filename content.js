console.log('content is up');
chrome.storage.onChanged.addListener(function(changes, namespace) {
  var paragraphs = document.getElementsByTagName('p');
  for (par in paragraphs) {
    par.innerHTML = "AUGHAGUH";
  }
  var opt = {
    type: "basic",
    title: "Test Notification",
    message: "Notification works!",
    iconUrl: "chrome-extension://paomcbcgpoikdcjhbanhllhdbemcjokf/Agenda_32.png"
    }
    chrome.notifications.create('test', opt);
});
