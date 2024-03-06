// R: to work correctly, 1st go to the following page, then scroll to its bottom to get all the data needed from the oldest ( at bottom ) to the newest ( at top )
// https://myprivacy.uber.com/privacy/exploreyourdata/trips

var rowGroup = document.querySelector('div[role="rowgroup"]');
var rowsInfos = []; // 'll hold all our parsed stuff just in case it is useful
var rowsInfosCsv = ''; // 'll hold all our parsed stuff just in case it is useful
// prepend the rows's titles ( aka 1st row ) - for the infos I am interested in
rowsInfosCsv = 'Date+ Time+ Price+ Pickup+ Drop';
// corrected since uber has its own format using commas ..
//rowsInfosCsv = 'DateMonth, Year, Time, Price, PickupAddr, PickupArr, PickupCntry, DropAddr, DropArr, DropCntry';
// helper function to parse rows & build up an array of the infos
function parseRow(rowIdx){
  var row = rowGroup.children[rowIdx];
  // content of the row
  var time_date = row.children[0].innerText.split('\n')[0];
  var time_hourMin = row.children[0].innerText.split('\n')[1];
  var price = row.children[1].innerText;
  var city = row.children[2].innerText;
  var distance = row.children[3].innerText;
  var service = row.children[4].innerText;
  var pickup = row.children[5].innerText;
  var drop = row.children[6].innerText;
  // prepare the infos I am interested in for csv formatting
  var tripInfosArr = [time_date, time_hourMin, price, pickup, drop];
  rowsInfos.push(tripInfosArr);
  //var tripInfosCommasSpeTxt = tripInfosArr.join(',');
  var tripInfosCommasSpeTxt = tripInfosArr.join('+');
  // add to 'hacky textarea' added to uber website for easy copy then paste to google sheet ( or naything csv ) 
  //hackyTextArea.innerText += '\n' + tripInfosCommasSpeTxt;
  rowsInfosCsv += '\n' + tripInfosCommasSpeTxt;
}
// loop over n rows to add their content
// nb: we COULD filter by some infos ( but I'll do so afterward in google sheets
var rowsLen = rowGroup.childElementCount -1;
//var rowsLen = 5; // to test with less then 241 rows for 1st try ..
for( var i=0; i <= rowsLen; i++){
  parseRow(i); // parse the row & add it to our stuff
}
// inject a div right before the trip data
var divToPrependTo = document.querySelector('#riderTripsTable');
var divToPrependToParent = divToPrependTo.parentElement;
var containerDiv = document.createElement('div');
containerDiv.class = 'an ao bv bw'; // borrowed from uber clases, gives full width & auto-height for inner content
/*
// add a helper function to save as csv
function saveAsCsv(){
  var a = document.createElement('a');
  with(a){
    href = 'data:text/csv;base64,' + btoa(txtArea.innerHTML);
    download = 'uberDrives.csv';
  }
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
// add a button to it
var saveAsCsvBtn = document.createElement('button');
saveAsCsvBtn.innerText = 'download as CSV file';
saveAsCsvBtn.addEventListener('click', saveAsCsv, false);
containerDiv.appendChild(saveAsCsvBtn);
*/
// add our textarea to it
var txtArea = document.createElement('textarea');
txtArea.style.width = '99%';
txtArea.rows = rowsLen+2; //5; // helps auto-sizing it 100% in height based on its content
containerDiv.appendChild(txtArea);
txtArea.textContent = rowsInfosCsv;
divToPrependToParent.insertBefore(containerDiv, divToPrependTo);
