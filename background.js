chrome.storage.sync.get(['tasklist'], function(saved) {
  function clr(id) {
    chrome.notifications.clear(id);
  }
  var msPerDay = 1000 * 60 * 60 * 24;
  function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / msPerDay);
  }
  var html = saved.tasklist;
  var div = document.createElement("div");
  div.innerHTML = html;
  function checkIfDueSoon() {
  var tills = div.getElementsByClassName("daysTill");
  var items = div.getElementsByClassName("item");
  var dates = div.getElementsByClassName("dateStr");
  var len = tills.length;
  console.log(len);
  var sendNotfication;
  for (var i = 0; i < len; i += 1) {
    var today = new Date();
    var originalID = dates[i].id;
    var dateInfo = originalID.replace(/ok/g, ' ');
    var storedDate = new Date(dateInfo);
    var remainingDays = dateDiffInDays(today, storedDate);
    var nameOfAssign = items[i].parentElement.id;
    if (remainingDays <= 1) {
      sendNotfication = true;
    }
    else {
      sendNotfication = false;
    }

    if (remainingDays == 1) {
      var message = nameOfAssign + " is due tomorrow."
      var dueSoonopt = {
        type: "basic",
        title: "Assignment due",
        message: message,
        iconUrl: "chrome-extension://paomcbcgpoikdcjhbanhllhdbemcjokf/Agenda_32.png",
        buttons: [
          {
          title: 'Mark as done'
          }
        ]
      }
    }

    if (remainingDays == 0) {
      var message = nameOfAssign + " is due today."
      var dueSoonopt = {
        type: "basic",
        title: "Assignment due today",
        message: message,
        iconUrl: "chrome-extension://paomcbcgpoikdcjhbanhllhdbemcjokf/Agenda_32.png",
        buttons: [
          {
          title: 'Mark as done'
          }
        ]
      }
    }

    if (remainingDays < 0) {
      var message = nameOfAssign + " is overdue!"
      var dueSoonopt = {
        type: "basic",
        title: "Assignment overdue",
        message: message,
        iconUrl: "chrome-extension://paomcbcgpoikdcjhbanhllhdbemcjokf/Agenda_32.png",
        buttons: [
          {
          title: 'Mark as done'
          }
        ]
      }
    }

    if (sendNotfication) {
      clr(nameOfAssign);
      chrome.notifications.create(nameOfAssign, dueSoonopt);
      sendNotfication = false;
    }
  }
}

chrome.alarms.onAlarm.addListener(function() {
  console.log("beep");
  var yaay = {
    type: "basic",
    title: "yes",
    message: 'we did it',
    iconUrl: "chrome-extension://paomcbcgpoikdcjhbanhllhdbemcjokf/Agenda_32.png",
    buttons: [
      {
      title: 'yyyyy!'
      }
    ]
  };
  chrome.notifications.clear('gt');
  chrome.notifications.create('gt', yaay);
  checkIfDueSoon();
});




});

chrome.runtime.onInstalled.addListener(function() {
  console.log("inst");
  chrome.alarms.clearAll();
  chrome.alarms.create('ping', {periodInMinutes: 180});

});


chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
    var htmlCopy = html;
    var doc = new DOMParser().parseFromString(html, "text/html");
    var target = doc.getElementById(notifId).outerHTML;
    var win = window.open('mainWindow.html');

    // chrome.tabs.create({
    //   active: true,
    //   url:  'mainWindow.html'
    // }, null);
    var removedTargetHtml = htmlCopy.replace(target, "");
    console.log(removedTargetHtml);
    chrome.storage.sync.set({'tasklist': removedTargetHtml});
    win.close();
      //setTimeout(function(){target.remove(); chrome.storage.sync.set({'tasklist': list.innerHTML});}, 250);
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('load');

  chrome.alarms.getAll(function(array) {
    console.log("ALARMS: ");
    console.log(array);
  });
  //This function checks if there are any assignments due soon. Decodes the date stored in the id of the list html elements.
});


// //a and b are two date objects
// function DiffofDatesInms(a, b) {
//   //A and B are the dates a and b in ms
//   var A = a.getTime();
//   var B = b.getTime();
//
//   return Math.abs(B - A);
//
// }
