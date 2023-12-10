// ==UserScript==
// @name         SS Schedule Counter
// @namespace    http://tampermonkey.net/
// @version      1.3beta
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
let counter = localStorage.dbct;
// Check and coerce to string if needed
// counter = (typeof counter === "number") ? counter : +counter
// counter = isNumber(counter) ? counter : +counter

let datestr = dateFormater();

/*
// Experimental
if (!localStorage.getItem("dbct_storage")) { 
		localStorage.setItem("dbct_storage",JSON.stringify([])) 
}
else {
	let stored = JSON.parse(localStorage.getItem("dbct_storage"))
	lastObject = stored.at(-1)
	if (lastObject["date"] !== datestr) {
		counter = lastObject.count
	}
	data = [...stored];
	data.push({ date: datestr, count:localStorage.dbct })

}


*/

let cbox = document.createElement("p"); // The actual counter element
cbox.innerHTML = counter;
$(cbox).addClass("counter");

$(cbox).css({
  float: "left",
  backgroundColor: "beige",
  paddingRight: "1px",
  marginRight: "6px",
  fontWeight: "300",
  fontSize: "medium",
  top: "3px",
  position: "relative",
  borderRadius: "5px",
});
let subBtn = document.createElement("button");
subBtn.innerText = "-";
$(subBtn).css({
  "padding-left": "3px",
  "padding-right": "3px",
  display: "inline",
  "border-width": "thin",
  width: "20px",
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
  cbox.innerHTML = ++counter;
  localStorage.dbct = counter;
});

$(subBtn).on("click", function (e) {
  if (counter > 0) {
    cbox.innerHTML = --counter;
    localStorage.dbct = counter;
  }
});

$(subBtn).on("dblclick", function (e) {
  let today = new Date().getDate();
  if (today !== localStorage.dbct_date) {
    console.log(`storage updated`);
    updateStorage();
    localStorage.dbct_date = today;
  }
  counter = 0;
  cbox.innerHTML = 0;
  localStorage.dbct = 0;
  console.log("Counter reset to 0");
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
  padding: "0px",
  "margin-bottom": "4px",
});
$("#gameScheduler > div.card.withPadding.resetOverflow > div:nth-child(4)").css(
  { "margin-top": "-12px" }
);

function dateFormater(shift = 0) {
  let d1 = new Date();
  let d1str =
    ("0" + (d1.getMonth() + 1)).slice(-2) +
    ("0" + (d1.getDate() + shift)).slice(-2) +
    d1.getFullYear();
  return d1str;
}

function updateStorage() {
  console.log("Updating Storage STARTING");
  let dstr = dateFormater();
  console.log("dstr = ", dstr);
  let storedArray = JSON.parse(localStorage.getItem("dbct_storage")) || [];
  // Try withouth shallow copy
  // let arrayCopy = [...storedArray];
  let arrayCopy = storedArray;
  // End Try
  console.log(`Previous Games: ${arrayCopy}`);

  if (
    arrayCopy.at(-1).date === dstr &&
    arrayCopy.at(-1).count < localStorage.dbct
  ) {
    arrayCopy.at(-1).count = localStorage.dbct;
  } else {
    // No copy of current date found
    // Add new date to the array
    arrayCopy.push({ date: dstr, count: localStorage.dbct });
  }
  console.log("Rewriting Now with", arrayCopy);
  localStorage.setItem("dbct_storage", JSON.stringify(arrayCopy));
}
