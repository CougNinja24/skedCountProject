/* globals jQuery, $, waitForKeyElements */

console.log(JSON.parse(localStorage.getItem("skedCount")));

let counter;
const datestr = new Date().toDateString(); // Use datestr for key

// Stored array of objects with `datestr` as keys
let countDataArray = JSON.parse(localStorage.getItem("skedCount")) || [
  { [datestr]: 0 },
];
const LATESTDATE = countDataArray[countDataArray.length - 1];

// If the current date str is in the array, grab it
// let previousCountExists = datestr in LATESTDATE;

if (LATESTDATE[datestr] > 0) {
  counter = LATESTDATE[datestr];
} else {
  counter = 0;
}

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
  cbox.innerHTML = ++LATESTDATE[datestr];
});

$(subBtn).on("click", function (e) {
  if (datestr in LATESTDATE) {
    // Just update the object value
    LATESTDATE[datestr] = counter;
  } else {
    // Doesnt exist, so push it on the count array
    countDataArray.push({ datestr: counter });
  }

  localStorage.setItem("skedCount", JSON.stringify(countData));
  cbox.innerHTML = --counter;
});

// Style the buttons
$(subBtn).hover(
  function () {
    $(this).css({ "background-color": "#ccbcbe" });
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

function updateStorage() {
  // Decide on how/when to update the count
  localStorage.setItem("skedCount", JSON.stringify(countData));
}
