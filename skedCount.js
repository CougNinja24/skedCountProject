/* globals jQuery, $, waitForKeyElements */

/*
Implement this into the subtract listener
Need best way to pass the stored count around
if (storedCount != undefined && storedCount.length != 0) {JSON.stringify()}
*/

console.log(JSON.parse(localStorage.getItem("skedCount")));

let counter = 0;
let datestr = new Date().toDateString();

// Stored array of objects with `datestr` as keys
let storedCountArr = JSON.parse(localStorage.getItem("skedCount")) || [];

//let lastItemIsCurrent = storedCount[storedCount.length-1]

/*  Use this when reliably able to get previous count.
try {

    if (storedCount.length === 0) {
        console.log("DID NOT FIND PREVIOUS COUNT");
       }
    else {
       let lastArrElement = storedCount[storedCount.length-1]
       counter = lastArrElement[datestr]
         }
     }
catch (error) { throw new Error("ERROR ON LOCALSTORAGE RETRIEVAL"); }

*/

// Set counter to zero if undefined or use updated counter number
counter = counter == 0 || counter == undefined ? 0 : counter;

let cbox = document.createElement("p"); // The actual counter element
cbox.innerHTML = counter;
$(cbox).addClass("counter");

// Style the box around the counter
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

// Shrink padding and margins of two elements to fit nicely on small screen
$("body>.container .ssPageTitle").css({
  padding: "0px",
  "margin-bottom": "4px",
});
$("#gameScheduler > div.card.withPadding.resetOverflow > div:nth-child(4)").css(
  { "margin-top": "-12px" }
);

// Create the button to subtract a game.
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

// Update the counter
$("#save").on("click", function (e) {
  cbox.innerHTML = ++counter;
});

$(subBtn).on("click", function (e) {
  storedCountArr.push({ datestr: counter });
  localStorage.setItem("skedCount", JSON.stringify(storedCountArr));
  cbox.innerHTML = --counter;
});

// Style the buttons
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
