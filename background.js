var hours = [7, 8, 9, 11, 13, 15, 17, 19, 21, 23];
//Fill an array with generated dates that have the day of today but have the hour of the hours desired to potentially ping someone.
var generatedHdates = [];
for (i = 0; i < hours.length; i++) {
  var generatedDate = new Date(getNow().year, getNow().month, getNow().day, hours[i]);
  generatedHdates.push(generatedDate);
}

function clr(id) {
  chrome.notifications.clear(id);
}
function getNow() {
  var rightNow = new Date();
  var now = {
    'total': rightNow,
    'year': rightNow.getFullYear(),
    'month': rightNow.getMonth(),
    'day': rightNow.getDate(),
    'hour': rightNow.getHours(),
    'minute': rightNow.getMinutes(),
    'second': rightNow.getSeconds(),
    'ms': rightNow.getMilliseconds()
  }

  return now;
}
function DiffofDatesInms(a, b) {
  //A and B are the dates a and b in ms
  var A = a.getTime();
  var B = b.getTime();

  return Math.abs(B - A);

}
function compareDates(a, b) {
  var A = a.getTime();
  var B = b.getTime();

  if (A < B) {
    return 'less';
  }
  if (A > B) {
    return 'greater';
  }
  if (A == B) {
    return 'equal';
  }
}
function getNextN() {
  var nextDate = 0;
  if (getNow().hour < 24) {
    for (i = generatedHdates.length-1; i >= 0; i = i - 1) {
      if (compareDates(generatedHdates[i], getNow().total) == 'greater') {
        nextDate = generatedHdates[i];
      }
      else {
        return nextDate;
      }
    }
  }
  else {
    return generatedHdates[0].setDate(generatedHdates[0].getDate() + 1);
    console.log("Setting to tmrw morning.");
  }
}
function setAtoNext() {
  if (getNow().hour < 24) {
    chrome.alarms.clearAll();

    console.log("Now: " + getNow().total + "(epoch: " + Date.now() + ")");
    console.log("Next notification: " + getNextN());

    try {
     var finalDate = getNextN().getTime();
    }
    catch {
      console.log("Next notification set to morning.");
      var morningCopy = generatedHdates[0]
      var finalDate = morningCopy.setDate(getNow().total.getDate() + 1);
      console.log("Morning notification, setting to: " + finalDate);
    }
     console.log('Timestamp set: ' + finalDate);
     chrome.alarms.create('ping', {when: finalDate});
  }
}
setAtoNext(); //on boot set A
var html = localStorage.getItem("tasklist");
chrome.runtime.onInstalled.addListener(function() {
  localStorage.setItem("lastAtime", getNow().total.toString())
  // chrome.storage.sync.set({"lastAtime": getNow().total.toString()});
  // var inst = {
  //   type: "basic",
  //   title: "Installed",
  //   message: 'Extension install',
  //   iconUrl: "chrome-extension://paomcbcgpoikdcjhbanhllhdbemcjokf/Agenda_32.png",
  //   buttons: [
  //     {
  //     title: 'OK'
  //     }
  //   ]
  // };
  // clr('install');
  // chrome.notifications.create('install', inst);
});

//7200000 = 2 hours in ms


function checkIfDueSoon() {
  function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / msPerDay);
  }
  var html = localStorage.getItem("tasklist");
  console.log(html);
  var div = document.createElement("div");
  div.innerHTML = html;
  var msPerDay = 1000 * 60 * 60 * 24;
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
    console.log(nameOfAssign);
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
  checkIfDueSoon();
  var lastA = localStorage.getItem("lastAtime");
  console.log("Last alarm was " + DiffofDatesInms(getNow().total, new Date(lastA)) / 60000 + " minutes ago.");
  if (DiffofDatesInms(getNow().total, new Date(lastA)) > 7200000) {
    console.log("MISSED!");
    checkIfDueSoon();
  }

  chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log("Beep from " + alarm.name);
    //Set last sucessful alarm time to right now.
    // chrome.storage.sync.set({"lastAtime": getNow().total.toString()});
    localStorage.setItem("lastAtime", getNow().total.toString());
    checkIfDueSoon();
    setAtoNext();
  });


chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
    var htmlCopy = localStorage.getItem("tasklist");
    console.log(htmlCopy);
    var doc = new DOMParser().parseFromString(htmlCopy, "text/html");
    doc.innerHTML = htmlCopy;
    console.log(doc);
    console.log(notifId);
    //
    // var win = window.open('mainWindow.html');

    var targets = Array.prototype.slice.call(doc.getElementsByTagName("li"));
    console.log(targets);
    var finalindex = 0;
    var finalTarget = 0;
    targets.forEach((item, index) => {
      console.log(item.id);
      console.log(notifId);
      if (item.id.trim() == notifId.trim()) {
        console.log("match found.")
        console.log(targets[index]);
        finalTarget = targets[index].outerHTML;
      }
    });

    console.log(finalTarget);

     var removedTargetHtml = htmlCopy.replace(finalTarget, "");
     console.log(removedTargetHtml);
     localStorage.setItem("tasklist", removedTargetHtml);
     window.location.href="mainWindow.html";
     // chrome.tabs.create({
     //   active: true,
     //   url:  'mainWindow.html'
     // }, null);

    // chrome.storage.sync.set({'tasklist': removedTargetHtml});
    // win.close();
    //setTimeout(function(){target.remove(); chrome.storage.sync.set({'tasklist': list.innerHTML});}, 250);
});

document.addEventListener('DOMContentLoaded', () => {
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
