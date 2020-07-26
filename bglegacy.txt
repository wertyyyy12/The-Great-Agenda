document.addEventListener('DOMContentLoaded', () => {
  console.log('load');
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

  //This function sends a message to the main script "window.js" to check if there are any assignments due soon.
  function checkIfDueSoon() {
      // var html = saved.tasklist;
      // // var div = document.createElement("div");
      // // div.innerHTML = html;
      var tills = document.getElementsByClassName("daysTill");
      var items = document.getElementsByClassName("item");
      var dates = document.getElementsByClassName("dateStr");
      var len = tills.length;
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
  var hours = [7, 8, 9, 11, 13, 15, 17, 19, 21, 23];
  //Fill an array with generated dates that have the day of today but have the hour of the hours desired to potentially ping someone.
  var generatedHdates = [];
  for (i = 0; i < hours.length; i++) {
    var generatedDate = new Date(getNow().year, getNow().month, getNow().day, hours[i]);
    generatedHdates.push(generatedDate);
  }
  console.log(generatedHdates);

//  Get the next date (time) for a notification
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

  //Get the nearest notification time that was before the current time
  function getMissedN() {
    var missedN = 0;
    for (i = 0; i < generatedHdates.length; i++) {
      if (compareDates(generatedHdates[i], getNow().total) == 'less') {
        missedN = generatedHdates[i];
      }
      else {
        return missedN;
      }
    }
  }




  function missCheck() {
    if (getNow().hour <= 23) {
      chrome.storage.sync.get(['lastAtime'], function(result) {
        if (result.lastAtime != getMissedN()) {
          console.log(result.lastAtime);
          console.log(getMissedN());
          checkIfDueSoon();
        }

        else {
          console.log("All good!");
          console.log(result.lastAtime);
          console.log(getMissedN());
        }
      });
    }
    setAtoNext();

    }
  missCheck(); //on boot missCheck.

  chrome.runtime.onSuspend.addListener(function() {
    /////
  });




  //Given 2 date objects a and b, find whether a is greater than b or less than b
  //If a > b (a is a later date than b), returns "greater"
  //Is a < b, returns "less"
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

  // console.log(getNextN());
  function clr(id) {
    chrome.notifications.clear(id);
  }

  //set alarm to next available notification time
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

  function idealizeDate(date) {
    hour = date.getHours();
    var idealizedDate = new Date(getNow().year, getNow().month, getNow().day, hour);
    return idealizedDate;
  }


  chrome.storage.sync.get(['lastAtime'], function(result) {
    if (result.lastAtime != getMissedN()) {
      checkIfDueSoon();
    }
    setAtoNext();
  });
  chrome.alarms.onAlarm.addListener(function(alarm) {
    //Console logs and a notification when the alarm event is recieved for testing/clarity purposes
    console.log("beep from " + alarm.name);
    console.log("Delay set for this alarm was " + alarm.periodInMinutes);

    var sentDate = idealizeDate(getNow().total).toString();
    chrome.storage.sync.set({'lastAtime': sentDate});
    console.log("Last sucessful alarm time was set to " + sentDate);
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
    clr('gt');
    chrome.notifications.create('gt', yaay);
    checkIfDueSoon();
    setAtoNext();
});



chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
    if (btnIdx === 0) {
      console.log(document.getElementById(notifId));
    }
});

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
