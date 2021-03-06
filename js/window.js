var first = false;
window.onload = function() {
  // document.getElementById('Name').value = 'abcdefgK';
  console.log("load");
  // document.getElementById("aInfo").addEventListener('submit', function() {
  //   event.preventDefault();
  // });
  // setTimeout(function() {
  //   document.getElementById("aInfo").submit()
  // }, 250);
  first = true;
  document.getElementById("DONEDONE").click();
  document.getElementById("Name").value = localStorage.getItem('nameField');
  if (document.getElementById("Name").value == "") {
    document.getElementById("Name").style["border-bottom"] = "2px solid red";
  }
  // document.getElementById("aInfo").submit();
  console.log('otherload');
  // document.getElementById('abcdefgK').remove();
  document.getElementById("Name").focus();




};

var items = document.getElementsByClassName('item');

//Get month, day, and year given a date in input form (ex: 2005-9-12)
//Acess with .month, .day, and .year properties of returned object
function getMDY(d) {
  var month = parseInt(d.slice(5, 7));
  var day = parseInt(d.slice(8, 10));
  var year = parseInt(d.slice(0, 4));

  var finaldate = {
    'month': month,
    'day': day,
    'year': year
  }

  return finaldate;
}

function isUrl(string) {
  //url cant start with "javascript:"
  if (string.trim().substring(0, 11) != "javascript:") {
    try {
      new URL(string);
    } catch (_) {
      return false;
    }

    return true;

  } else {
    return false;
  }
}

const _MS_PER_DAY = 1000 * 60 * 60 * 24;
// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

//Takes out the < and > characters from a string to prevent input fields from doing any stupid tricks with HTML.
//We also filter out the 'javascript:' prefix just to be safe.
function filter(string) {
  var given = string.replace("javascript:", "");
  if (given.substring(given.length - 3, given.length) == '.js') {
    given = given.slice(0, -3);
  }

  var blackListedCharacters = ['>', '<', '"', "'", '`', ';'];
  var finished = given;
  for (character of blackListedCharacters) {
    finished = finished.replace(new RegExp(character, 'g'), '');
  }
  return finished;
}

//Thx stack overflow lol
//When called on a Date object, will return a YYYY-MM-DD string based on the date.
Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
  ].join('-');
};


var months = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December"
};

var days = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday"
};

function changePrettyDate() {
  var prettyDate = document.getElementById("prettyDate");
  var date = document.getElementById("Date").value;
  //
  // var d = new Date(document.getElementById("Date").value);
  date = getMDY(date);
  var correctD = new Date(Date.UTC(date.year, date.month - 1, date.day + 1));
  var today = new Date();
  var daysRemaining = dateDiffInDays(today, correctD);
  // var dateString = days[correctD.getDay()] + ", " + months[date.month] + " " + date.day + " ";
  var dateString = `${days[correctD.getDay()]}, ${months[date.month]} ${date.day} (${daysRemaining})`
  prettyDate.innerHTML = dateString;
}

function changeTitle() {
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
    currentWindow: true
  }, tabs => {
    console.log(tabs);
    //If the url/titles are not valid, set them to blank and handle them accordingly (set favicon image and title field to blank.)
    try {

      var title = tabs[0].title;
      var url = tabs[0].url;
    } catch {
      var title = "";
      var url = "";
    }
    document.getElementById("LinkLabel").innerHTML = filter(title);
    if (url != "") {
      // var favicon = "https://s2.googleusercontent.com/s2/favicons?domain_url=" + url;
      var favicon = `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`
    } else {
      var favicon = "";
    }
    document.getElementById("FAVICON").setAttribute("src", favicon);
  });
}

function changeTitleExtUrl(url) {

  document.getElementById("LinkLabel").innerHTML = "";
  document.getElementById("FAVICON").setAttribute("src", "");

  if (url != "") {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true); //Async as shown by last parameter

      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) { //check if status == complete
          var htmlResponse = xhr.responseText;

          var title = filter(htmlResponse.match("<title>(.*?)</title>")[1]);
          document.getElementById("LinkLabel").innerHTML = title;
          if (url != "") {
            // var favicon = "https://s2.googleusercontent.com/s2/favicons?domain_url=" + url;
            var favicon = `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`
          } else {
            var favicon = "";
          }
          document.getElementById("FAVICON").setAttribute("src", favicon);
          return title;
        }
      }
      xhr.send();
    } catch {
      document.getElementById("LinkLabel").innerHTML = url;
      document.getElementById("FAVICON").setAttribute("src", "");
    }

  } else {
    document.getElementById("LinkLabel").innerHTML = "";
    document.getElementById("FAVICON").setAttribute("src", "");
  }



}


function checkIfMarked(listChildren) {
  var marked = false;
  listChildren.forEach(function(child) {
    if (child.innerHTML == 'Erase Highlight') {
      marked = true;
    }
  });

  return marked;
}

function resetForm() {
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
    currentWindow: true
  }, tabs => {
    var url = tabs[0].url;
    document.getElementById("Link").value = url;
    // use `url` here inside the callback because it's asynchronous!
  });
  changeTitle();
  document.getElementById("Date").valueAsDate = new Date();
  changePrettyDate();
  document.getElementById("Name").value = "";
}



var activeTab = 0;
document.addEventListener("DOMContentLoaded", function(event) {
  //Autofill url of open tab
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
    currentWindow: true
  }, tabs => {
    try {
      activeTab = tabs[0];
      var url = tabs[0].url;
    } catch {
      var url = "";
    }
    document.getElementById("Link").value = url;
  });
  changeTitle();
  // document.getElementById("Finish").click();
  document.getElementById("Date").valueAsDate = new Date();
  date = getMDY(document.getElementById("Date").value);
  var form = document.getElementById("aInfo");
  var list = document.getElementById("taskList");
  changePrettyDate();

  function handleKeys(e) {
    //Space key pressed
    if (e.keyCode == 32) {
      chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
        currentWindow: true
      }, tabs => {
        var url = tabs[0].url;
        document.getElementById("Link").value = url;
        // use `url` here inside the callback because it's asynchronous!
      });
    }
    //Backspace pressed
    if (e.keyCode == 8) {
      document.getElementById("Link").value = ' ';
    }
  }

  function removeItem(item) {
    lists = document.getElementsByTagName('li');
    //target is the li element
    var target = item;
    target.style.opacity = '0';
    setTimeout(function() {
      target.remove();
      localStorage.setItem('tasklist', list.innerHTML);
    }, 250);
    //          this.parentElement.parentElement.remove();
    //localStorage.setItem('tasklist', list.innerHTML);
  }
  

  function updateDateDistances() {
    tills = document.getElementsByClassName("daysTill");

    dates = document.getElementsByClassName("dateStr");
    len = tills.length;

    //Format assignment due date colors based on due dates.
    for (var i = 0; i < len; i += 1) {
      var today = new Date();
      var dateInfo = dates[i].id;
      // var dateInfo = originalID; //.replace(/ok/g, ' ');
      var storedDate = new Date(dateInfo);
      remainingDays = dateDiffInDays(today, storedDate);
      tills[i].innerHTML = remainingDays;
      tills[i].id = remainingDays;
      if (remainingDays == 1) {
        tills[i].style.color = "red";
      } else if (remainingDays == 0) {
        items[i].style.color = "DarkRed";
        items[i].style.fontWeight = 900;
        tills[i].innerHTML = 'TODAY';
        tills[i].style.color = "red";
      } else if (remainingDays < 0) {
        items[i].style.color = "red";
        items[i].style.fontWeight = 900;
        tills[i].innerHTML = 'OVERDUE';
        tills[i].style.color = "red";
      } else if (remainingDays > 1) {
        items[i].style.color = "black";
        items[i].style.fontWeight = 400;
        tills[i].style.color = "black";
      }

    }
  }



  // var firstNameClear = true;
  // document.getElementById("Name").addEventListener("keydown", function(key) {
  //   if (firstNameClear) {
  //     if (key.code == "Backspace") {
  //       document.getElementById("Name").value = "";
  //       firstNameClear = false;
  //     }
  //   }
  // });
  document.getElementById("Name").addEventListener("change", function() {
    if (document.getElementById("Name").value == "") {
      document.getElementById("Name").style["border-bottom"] = "2px solid red";
      // document.getElementById("Name").value = document.getElementById("LinkLabel").innerHTML;
    } else {
      document.getElementById("Name").style["border-bottom"] = "2px solid green";
    }

    localStorage.setItem('nameField', document.getElementById("Name").value);
  });

  var dateValues = ["", "", ""];
  document.getElementById("Date").addEventListener('change', function() {
    var date = this.value;
    dateValues.push(date);
    if (dateValues.length >= 4) {
      dateValues.splice(0, 1);
    }
    
    //dayN is N-1 days in the past
    var date1 = getMDY(dateValues[2]);
    var date2 = getMDY(dateValues[1]);
    var date3 = getMDY(dateValues[0]);

    console.log([date1, date2, date3]);

    if (((date2.day == 30 && (date2.month == 4 || date2.month == 6 || date2.month == 9 || date2.month == 11)) || (date2.day == 31) || (dateValues[2] == ""))) { //if last day of month OR day is nonexistent

      var day = date2.day;
      var month = date2.month;
      var year = date2.year;


      console.log("uh oh");
      console.log(day)
      console.log(month);
      day = "01";
      if (month != 12) {
        month++;
        if (month < 10) {
          month = `0${month}`;
        }
      }
      else {
        month = "01";
        year++;
      }
      // this.value = `${year}-${month}-${day}`;
      this.value = `${year}-${month}-${day}`;
    }

    changePrettyDate();
  });
  document.getElementById("Link").addEventListener('change', function() {
    if (isUrl(document.getElementById("Link").value) == false) {
      console.log('tf are u doing my guy');
      document.getElementById("LinkLabel").innerHTML = '';
      document.getElementById("FAVICON").setAttribute("src", '');
    } else {
      console.log(activeTab.url);
      console.log(document.getElementById("Link").value);
      if (activeTab.url == document.getElementById("Link").value) {
        console.log('regular title change');
        changeTitle();
      } else {
        console.log('ext;')
        changeTitleExtUrl(document.getElementById("Link").value);
      }

      // if (document.getElementById("Name").value != "undefined") {
      //   document.getElementById("Name").value = document.getElementById("LinkLabel").innerHTML;
      // } else {
      //   document.getElementById("Name").value = "";
      // }

    }
  });
  document.getElementById("Link").addEventListener("keydown", handleKeys);
  var itemHovered; //see line ~466

  //item hover + keyboard actions (backspace -> delete), (arrowup/down -> increment/decrement date on item)
  document.addEventListener("keydown", function(e) {
    if (itemHovered) {
      // if (e.code == "Backspace") {
      //   removeItem(itemHovered.parentElement);
      // }
      if (!editingFlag) {
        if (e.code == "ArrowUp" || e.code == "ArrowDown") {
          if (e.code == "ArrowUp") {
            var increment = 1;

          }

          if (e.code == "ArrowDown") {
            var increment = -1;
          }

          e.preventDefault(); //prevent scrolling while arrow editing a task
          var dateElement = itemHovered.parentElement.getElementsByClassName("dateStr")[0];
          var newDate = new Date(dateElement.id);
          newDate.setDate(newDate.getDate() + increment);
          dateElement.id = newDate;

          var dateString = `${days[newDate.getDay()]}, ${months[newDate.getMonth()]} ${newDate.getDate() + 1} `;
          dateElement.innerHTML = dateString;
          updateDateDistances();
          localStorage.setItem('tasklist', list.innerHTML);
      }
    }
  }
  });

  var editingFlag = false; //A boolean flag to use later
  var itemChanged = 0;
  // var bg = 0; //A flag that tells us the color of the item BEFORE changes are made to the background color.
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    var name = filter(document.getElementById("Name").value).trim();
    var date = document.getElementById("Date").value;
    //Date formatting
    var month = parseInt(date.slice(5, 7));
    var day = parseInt(date.slice(8, 10));
    var year = parseInt(date.slice(0, 4));
    var correctD = new Date(Date.UTC(year, month - 1, day + 1));
    // var dateString = days[correctD.getDay()] + ", " + months[month] + " " + day + " ";
    var dateString = `${days[correctD.getDay()]}, ${months[month]} ${day} `;
    var link = document.getElementById("Link").value;
    // var items = document.getElementsByClassName('item');
    var textBoxes = [document.getElementById('Link'), document.getElementById('Date'), document.getElementById('Name')];
    var editLabel = document.getElementById('editLabel');
    var cancel = document.getElementById("Cancel");

    // console.log(link);

    function setVisualtoNormal() {
      //Reverts any visual changes caused by edit button
      editLabel.style.display = 'none';
      textBoxes.forEach(function(box) {
        box.style.backgroundColor = '#ffffff';
      });

      var itemsAsArray = Array.prototype.slice.call(items);
      itemsAsArray.forEach(function(item) {
        var children = Array.prototype.slice.call(item.children);
        // console.log(marked);
        switch (checkIfMarked(children)) {
          case false:
            item.style.backgroundColor = '#ffffff';
            break;
          case true:
            item.style.backgroundColor = 'yellow';
        }
      });
      // console.log(itemChanged);
      // itemChanged.backgroundColor = '#ffffff';
      cancel.style.display = 'none';

      document.getElementById('DONEDONE').innerHTML = 'Create';
    }
    var duplicateName = false;
    if (name != '') { //EDIT: turns out ids CAN have spaces, u just have to put quotes around the id. Well guess what too bad I am so not going to go through the entire thing just to not okokokokokokok
      console.log(!duplicateName);
      if (isUrl(link) == false) {
        //The class of the li element tells whether the li is 'marked' or not                                                                                      //inject date into id lol. ids cant have spaces so we replace the spaces with "ok", then we replace the oks with spaces again when we want to decode.
        // var added = '<li id=' + '"' + name + '">' + '<div class=item id=item>' + '<span id="nameBox">' + name + ': ' + '</span>' + '<label class=dateStr id="' + correctD + '">' + dateString + '</label>' + '<strong>(<label class=daysTill>' + '</label>)</strong>' + '&nbsp' + '<button type=button class=Remove id=' + name + '>' + 'Delete' + '</button>' + '&nbsp&nbsp' + '<button type=button class=edit>Edit</button>' + '&nbsp&nbsp' + '<button type=button class=mark>Highlight</button>' + '<div>' + '</li>';
        var added = `<li id="${name}"><div class="item" id="item"><span id="nameBox">${name}: </span><label class="dateStr" id="${correctD}">${dateString}</label><strong>(<label class=daysTill></label>)</strong>&nbsp<button type=button class=Remove id=${name}>Delete</button>&nbsp&nbsp<button type=button class=edit>Edit</button>&nbsp&nbsp<button type=button class=mark>Highlight</button><div></li>`
      } else {
        // var added = '<li id=' + '"' + name + '">' + '<div class=item id=item>' + '<span id="nameBox">' + '<a target="_blank" href=' + link + '>' + name + '</a>' + '</span>' + ': ' + '<label class=dateStr id="' + correctD + '">' + dateString + '</label>' + '<strong>(<label class=daysTill>' + '</label>)</strong>' + '&nbsp' + '<button type=button class=Remove id=' + name + '>' + 'Delete' + '</button>' + '&nbsp&nbsp' + '<button type=button class=edit>Edit</button>' + '&nbsp&nbsp' + '<button type=button class=mark>Highlight</button>' + '<div>' + '</li>';

        var added = `<li id="${name}"><div class="item" id="item"><span id="nameBox"><a target="_blank" href="${link}">${name}</a></span>: <label class="dateStr" id="${correctD}">${dateString}</label><strong>(<label class="daysTill"></label>)</strong>&nbsp<button type="button" class="Remove" id="${name}">Delete</button>&nbsp&nbsp<button type="button" class="edit">Edit</button>&nbsp&nbsp<button type="button" class="mark">Highlight</button><div></li>`
      }

      //Change innerhtml of mark button to 'unmark' if the button was previously marked before editingFlag
      // console.log(itemChanged.children);
      if (editingFlag == true) {
        console.log('ok boomer');
        // document.getElementById(name).style.opacity = 0;
        localStorage.setItem('tasklist', list.innerHTML);

        if (checkIfMarked(Array.prototype.slice.call(itemChanged.children[0].children))) {
          added = added.replace('<button type=button class=mark>Highlight</button>', '<button type=button class=mark>Erase Highlight</button>');
          console.log(added);

        }

        var itemString = itemChanged.outerHTML;
        var current = localStorage.getItem('tasklist');
        var replaceHtml = current.replace(itemString, added);
        list.innerHTML = replaceHtml;

        setVisualtoNormal();
        editingFlag = false;
        //scroll to top
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } else {
        list.innerHTML += added;
      }


      document.getElementById("Name").value = "";
      document.getElementById("Link").value = "";
      document.getElementById("Name").focus();
      resetForm();
    } else {
      // if (link != "") {
      //   // name =
      // }
    }


    // localStorage.setItem('tasklist', list.innerHTML);
    // chrome.storage.local.set({'tasklist': list.innerHTML});
    //REMOVE BUTTON (X)
    buttons = document.getElementsByClassName('Remove');
    numB = buttons.length;
    for (button of buttons) {
      button.addEventListener('click', function() {
        removeItem(this.parentElement.parentElement);
      });
    }

    //hover listeners for each list item

    for (item of items) {
      item.addEventListener("mouseover", function() {
        itemHovered = this;
      });

      item.addEventListener("mouseout", function() {
        itemHovered = false;
      });
    }


    cancel.addEventListener('click', function() {
      setVisualtoNormal();
      resetForm();
      editingFlag = false;
    });



    var editButtons = document.getElementsByClassName('edit');



    //Yes, I use single and double quotes interchangably!
    //EDIT BUTTON
    for (button of editButtons) {
      // var button = editButtons[i];
      button.addEventListener('click', function() {
        //Reverting visual changes in case someone pressed a different edit assignment first.
        itemChanged = this.parentElement.parentElement;
        setVisualtoNormal();
        //Making the (Editing) h2 visible and turn the text boxes green.
        editLabel.style.display = 'inline-block';
        textBoxes.forEach(function(box) {
          box.style.backgroundColor = '#5af558';
        });
        cancel.style.display = 'inline-block';


        //Extracting the assignment info that the person selected to edit.
        var placeDate = new Date();
        var placeLink = '';
        var placeName = this.parentElement.parentElement.id;
        console.log(this.parentElement.children);
        for (child of this.parentElement.children[0].children) {
          if (child.tagName == "A") {
            placeLink = child.href;
            console.log(placeLink);
          }
        }

        for (child of this.parentElement.children) {
          if (child.tagName == "LABEL") {
            placeDate = child.id;
          }
        }


        //Autofill the date and name values with the pre existing ones for that assignment.
        var pDate = new Date(placeDate);
        var dStr = pDate.yyyymmdd();
        document.getElementById('Date').value = dStr;
        changePrettyDate();
        document.getElementById('Name').value = placeName;
        document.getElementById('Link').value = placeLink;
        console.log(placeLink);
        changeTitleExtUrl(placeLink);
        // changeTitle();
        // changePrettyDate();

        this.parentElement.style.backgroundColor = '#5af558';
        document.getElementById('DONEDONE').innerHTML = 'Save';

        document.getElementById('Name').focus();
        var val = document.getElementById('Name').value;
        document.getElementById('Name').value = val;

        window.scrollTo({
          top: document.body.scrollHeight,
          left: 0,
          behavior: 'smooth'
        });
        editingFlag = true;
      });
    }

    updateDateDistances();


    //MARK BUTTON
    var markButtons = document.getElementsByClassName('mark');
    for (markButton of markButtons) {
      // var markButton = markButtons[i];
      markButton.addEventListener('click', function() {
        //We use the buttons innerHTML property as our boolean flag.

        switch (this.innerHTML) {
          case 'Highlight':
            this.parentElement.style.backgroundColor = 'yellow';
            this.innerHTML = 'Erase Highlight';
            break;
          case 'Erase Highlight':
            this.parentElement.style.backgroundColor = '#ffffff';
            this.innerHTML = 'Highlight';
        }
        console.log(this.parentElement.parentElement.class);
        console.log(this.parentElement.parentElement);
        localStorage.setItem('tasklist', list.innerHTML);

      });
    }


    //Hide right click contextmenu so that right click scrolling is actually usable.
    document.addEventListener('contextmenu', event => event.preventDefault());

    links = document.getElementsByTagName('a');
    var scroll = 0; //FLAGS WHOHOOO
    for (item of items) {
      item.addEventListener("mousedown", function(event) {
        // console.log(item);
        var width = this.children[0].offsetWidth;
        // this.children[0].style.transform = 'translateX(-1000px)';
        //Handle the autoscroll on right click feature.
        var splits = Math.ceil(width / 1160) + 1;
        if (event.button == 2) {
          if (scroll == splits) {
            window.scrollTo({
              top: window.scrollY,
              left: 0,
              behavior: 'smooth'
            });
            scroll = 0;
          } else {
            window.scrollTo({
              top: window.scrollY,
              left: window.scrollX + (width / splits),
              behavior: 'smooth'
            });
            scroll = scroll + 1;
          }
          if (window.scrollX >= width) {
            window.scrollTo({
              top: window.scrollY,
              left: 0,
              behavior: 'smooth'
            });
            scroll = 0;
          }

        }
      });
    }

    // console.log($("li"));

    //PSEUDOCODE:
    //1. Loop through all assignments
    //2. Find earliest due date
    //3. Move this to top
    //4. Take out this one from the loop array
    //5. Repeat above until done (repeat as many items as there are items)


    var itemsAsArray = Array.prototype.slice.call(items);
    var listItems = Array.prototype.slice.call(document.getElementsByTagName("li"));
    var top = 0;
    itemsAsArray.forEach(function(index) { //step 5
      var minRemainingDays = 999999999999999999999999999999999999999999999999999999;
      var minElement = 0;
      listItems.forEach(function(item, index) { //step 1, this is loop for finding step 2
        var today = new Date();
        var dateInfo = dates[index].id;
        // var dateInfo = originalID; //.replace(/ok/g, ' ');
        var storedDate = new Date(dateInfo);
        remainingDays = dateDiffInDays(today, storedDate);
        if (remainingDays <= minRemainingDays) {
          // console.log(minRemainingDays);
          // console.log(remainingDays);
          minRemainingDays = remainingDays;
          minElement = listItems[index];
        }
      });


      // console.log(minElement);
      // console.log(document.getElementById("taskList"));
      // console.log(listItems.indexOf(minElement));

      //We finished step 2, now do step 3
      //Since this is inside another for loop, we repeat this as necessary.
      document.getElementById("taskList").appendChild(minElement);


      var removeIndex = listItems.indexOf(minElement);
      listItems = listItems.filter(item => item !== minElement); //step 4
      // console.log(listItems);
    });

    // var maxScrollLength = 0;
    // var maxScrollItem = 0;
    // for (item of items) {
    //   var width = item.offsetWidth;
    //   if (width > maxScrollLength) {
    //     maxScrollItem = item;
    //     maxScrollLength = width;
    //   }
    //
    // }
    // console.log(maxScrollLength);
    // document.getElementById("taskListBox").style.offsetWidth = maxScrollLength + 500;
    // console.log(document.getElementById("taskListBox").style.offsetWidth);

    if (!first) {
      localStorage.setItem("nameField", "");
    }

    console.log('potato');
    console.log(itemsAsArray);
    if (first) {
      itemsAsArray.forEach(function(item) {
        console.log(item.children[0]);
        try {
          var link = item.children[0].children[0].href;
        } catch {
          var link = "";
        }
        console.log(link);

        chrome.tabs.query({
          active: true,
          lastFocusedWindow: true,
          currentWindow: true
        }, tabs => {
          console.log(tabs);
          //If the url/titles are not valid, set them to blank and handle them accordingly (set favicon image and title field to blank.)
          try {
            var url = tabs[0].url;
          } catch {
            var url = "";
          }

          if (link == url) {
            item.style.backgroundColor = "#aeeb34";
          }
        });
      });
      first = false;
    }


    // chrome.storage.local.set({'tasklist': list.innerHTML});
    localStorage.setItem('tasklist', list.innerHTML);
  });


  if (localStorage.getItem('tasklist')) {
    list.innerHTML = localStorage.getItem('tasklist');
  }

});