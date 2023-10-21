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

const GC = JSON.parse(localStorage.getItem('DBCT')) || {};
window.GC = GC;
if (Object.keys(GC).length == 0) {
    console.error(`Previous GC not found: ${GC}
    Creating new Object `);
}

var counter = 0;
let cbox = document.createElement('p'); // The actual counter element
cbox.innerHTML = counter;
$(cbox).addClass('counter');

$(cbox).css({
    "float": 'left',
    "backgroundColor": 'beige',
    "paddingRight": '1px',
    "marginRight": '6px',
    "fontWeight": '300',
    "fontSize": 'medium',
    "top": '3px',
    "position": 'relative',
    "borderRadius": '5px'
})
let subBtn = document.createElement('button')
subBtn.innerText = "-"
$(subBtn).css({
    "padding-left":"3px",
    "padding-right":"3px",
    "display":"inline",
    "border-width":"thin",
    "width":"20px",
    "box-sizing":"border-box",
    "border-radius": "3px"
})

// Row where buttons will be appended
let workingRow = $('#gameScheduler > div.card.withPadding.resetOverflow > div:nth-child(7) > div')
$(workingRow).append(cbox);
$(workingRow).append(subBtn);

$('#save').on('click', function(e){
    cbox.innerHTML = ++counter
});

$(subBtn).on('click',function(e){
    if (counter > 0) {
        cbox.innerHTML = --counter;
    }
});

$(subBtn).hover(
    function(){
        $(this).css({
            "background-color":"#ccbcbe"})
    },function(){
        $(this).css(
            {"background-color":"#dbd5d6"})
    });

// WRITE TO LOCALSTORAGE
$(subBtn).on('dblclick', writeToLS);

$(cbox).hover(
    function(){
        $(this).css(
            {"font-weight":"600"})
    },function(){
        $(this).css(
            {"font-weight":"400"})
    })




function writeToLS() {
    const data = updateGC();
    try {
        localStorage.setItem('DBCT',JSON.stringify(data))
        console.log(`Wrote ${updateGC()} to Storage`);
    }
    catch {
        console.error('Failed write to LocalStorage');
    }
}

// Needs testing
function updateGC(modify=true) {
    const d = new Date();
    let datestr = `${d.getMonth()+1}-${d.getDate()}`
    let day = d.getDay()
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day_actual = dayNames[day]
    if (modify) {
        GC[datestr] = { count : ($('p.counter').text() > 0) ? $('p.counter').text() : 0,  
                      DOW:day_actual }
        return GC
    }
    else {
        console.log(`datestr: ${datestr} created
                   GC[${datestr}]: ${GC[datestr]} `)
    }

}
