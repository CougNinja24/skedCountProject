// ==UserScript==
// @name         SS Schedule Counter
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  To Count the # of Games built each day.
// @author       Andy Lemberger
// @match        https://scorestream.com/gameScheduler
// @icon         https://icons.duckduckgo.com/ip2/scorestream.com.ico
// @grant        none
// ==/UserScript==

let data;
console.log("dbct: ", localStorage.dbct);

localStorage.dbct = localStorage.dbct || 0;
localStorage.dbct_date = new Date().getDate();

// Check and coerce to string if needed
// counter = (typeof counter === "number") ? counter : +counter
// counter = isNumber(counter) ? counter : +counter

// let scriptRunDate = dateFormater();

// Experimental
// Write to clipboard
// GM_setClipboard(localStorage.dbct_storage)

let cbox = document.createElement("p"); // The actual counter element
cbox.innerHTML = localStorage.dbct;
$(cbox).addClass("counter");

$(cbox).css({
  "float": "left",
  "backgroundColor": "beige",
  "paddingRight": "1px",
  "marginRight": "6px",
  "fontWeight": "300",
  "fontSize": "medium",
  "top": "3px",
  "position": "relative",
  "borderRadius": "5px",
});
let subBtn = document.createElement("button");
subBtn.innerText = "-";
$(subBtn).css({
  "padding-left": "3px",
  "padding-right": "3px",
  "display": "inline",
  "border-width": "thin",
  "width": "20px",
  "box-sizing": "border-box",
  "border-radius": "3px",
});

// Row where buttons will be appended
let workingRow = $(
  "#gameScheduler > div.card.withPadding.resetOverflow > div:nth-child(7) > div"
);
$(workingRow).append(cbox);
$(workingRow).append(subBtn);

$("#save").on("click", function (e) {
  localStorage.dow = new Date().getDay(); // 0 - Sun, 6 - Sat.
  cbox.innerHTML = ++localStorage.dbct;
});

$(subBtn).on("click", function (e) {
  if (localStorage.dbct > 0) {
    cbox.innerHTML = --localStorage.dbct;
  }
});

$(cbox).on("dblclick", function (e) {
  if (confirm("Update Storage?")) {
    localStorage.dow = prompt(
      `Last Recorded Input on: ${localStorage.dow} 
	enter correct day of week:
	ex.. 0 = Sun, 2 = Tue, 4 = Thur, 6 = Sat`,
      localStorage.dow
    );
    updateStorage();
    console.log(`storage updated`);
  }
  if (confirm("Clear the Current Counter?")) {
    localStorage.dbct = 0;
    cbox.innerHTML = localStorage.dbct;
    console.log("Counter reset to 0");
  }
});

$(subBtn).hover(
  function () {
    $(this).css({
      "background-color": "#ccbcbe",
    });
  },
  function () {
    $(this).css({ "background-color": "#dbd5d6" });
  }
);

$(cbox).hover(
  function () {
    $(this).css({ "font-weight": "600" });
  },
  function () {
    $(this).css({ "font-weight": "400" });
  }
);

$("body > .container .ssPageTitle").css({
  "padding": "0px",
  "margin-bottom": "4px",
});
$("#gameScheduler > div.card.withPadding.resetOverflow > div:nth-child(4)").css(
  { "margin-top": "-12px" }
);

function createStorableDate(shift = 0) {
  let d1 = new Date();
  let d1str =
    ("0" + (d1.getMonth() + 1)).slice(-2) +
    ("0" + (d1.getDate() + shift)).slice(-2) +
    d1.getFullYear();
  let confirmed = prompt("Enter Date to Store Game Count", d1str);
  return confirmed;
}

function updateStorage() {
  console.log("Updating Storage STARTING");
  let dstr = createStorableDate();
  let dayofweek = localStorage.dow || new Date().getDay();

  let arrayCopy = JSON.parse(localStorage.getItem("dbct_storage")) || [];

  // Filter out null values.
  if (arrayCopy.includes(null)) {
    arrayCopy = arrayCopy.filter((o) => o?.date);
  }

  if (
    // Previous game in storage exists for today, just update count and rewrite.
    arrayCopy.at(-1).date === dstr &&
    arrayCopy.at(-1).count < localStorage.dbct
  ) {
    arrayCopy.at(-1).count = localStorage.dbct;
  } else {
    // No copy of current date found
    // Add new date to the array
    arrayCopy.push({ date: dstr, dow: dayofweek, count: localStorage.dbct });
  }

  console.log("Rewriting Now with", arrayCopy);
  localStorage.setItem("dbct_storage", JSON.stringify(arrayCopy));
}
// Todo
// Create a filter function to remove duplicate entries.
function sortAndFilter(gamesArray) {
  let sorted = gamesArray.toSorted((a, b) => {
    if (a.count > b.count) {
      return 1;
    } else if (a.count < b.count) {
      return -1;
    } else {
      return 0;
    }
  });
  // Remove on the same date
  let filtered = sorted.filter((obj, idx) => {
    return idx === sorted.findLastIndex((o) => o.date === createStorableDate());
  });
  // Should I add if statement for findLastIndex to make sure that at least one object always remains?

  return filtered;
}
