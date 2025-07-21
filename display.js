var d = new Date(), interval= 60000-(d.getSeconds()*1000+d.getMilliseconds());
var events = [];
var cycle = 0;

const event_container = document.getElementById('evcon');
var display = 2;
for (let index = 0; index < display; index++) {
  var event = document.createElement('div');
  event.classList.add('eventbox');
  event_container.appendChild(event);
}

function getClock(){
  d= new Date();
  var nday=d.getDay(),nmonth=d.getMonth()+1,ndate=d.getDate(),nyear=d.getFullYear();
  var nhour=d.getHours(),nmin=d.getMinutes(),ap;

  //<script type="text/javascript">
  //var tday=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var tday=["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];
  var tmonth=["ינואר","פבואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];

  /*
  if(nhour==0){ap=" לפני הצהריים";nhour=12;}
  else if(nhour<12){ap=" לפני הצהריים";}
  else if(nhour==12){ap=" אחרי הצהריים";}
  else if(nhour>12){ap=" א";nhour-=12;}
  */

  var clocktext=nhour+":"+twoDigit(nmin);
  var daytext="יום "+tday[nday];
  var dateH= gregToHeb(new Date(nyear, nmonth-1, ndate+1));
  var datetextH=formatDateH(dateH);
  var datetext=ndate+"/"+nmonth+"/"+nyear;

  if(nhour == nmin){
    if(nhour == 0)
      document.getElementById('clock').style.color = '#2352B0';
      else
      document.getElementById('clock').style.color = '#FF0000';
  }
  else document.getElementById('clock').style.color = '#000';
  document.getElementById('clock').innerHTML=clocktext;
  document.getElementById('day').innerHTML=daytext;
  document.getElementById('heb').innerHTML=datetextH;
  document.getElementById('greg').innerHTML=datetext;

  var sunrise= getSunrise(32.09253, 34.89864, d);
  var sunset= getSunset(32.09253, 34.89864, d);

  var parasha = weeklyParasha(findShabbat(d));
  var holiday = holidays(dateH);
  var omer = omerCount(dateH);
  var times;
  if (nday == 5 || nday == 6)
    times = "<b>כניסת שבת:</b> "+msToTime(sunset.getTime()-1200000)+" <b>צאת שבת:</b> "+msToTime(sunset.getTime()+2400000);
    else times = "<b>זריחה:</b> "+msToTime(sunrise)+" <b>שקיעה:</b> "+msToTime(sunset);
  events = [parasha, times, holiday, omer];
}

function swapEvents(){
  var sets = Math.floor(events.length / display);
  var elemts = Array.from(event_container.children);
  for(let i = cycle*display; i < (cycle+1)*display; i++)
    if(events[i] != "")
      elemts[i % display].innerHTML=events[i];
  cycle = (cycle + 1) % sets;
}

getClock();
swapEvents();
setTimeout(function() {
  getClock();
  swapEvents();
  setInterval(getClock, 60000);
  setInterval(swapEvents, 10000);
}, interval);

function numLettr(num) {
  num%=1000;
  var ones=["א","ב","ג","ד","ה","ו","ז","ח","ט"];
  var tens=["י","כ","ל","מ","נ","ס","ע","פ","צ"];
  var huns=["ק","ר","ש","ת"];
  var output="";
  var c=parseInt(num/400);
  if(num >= 100){
    for (var i = 0; i < c; i++) { 
      output+=huns[3];
    }
    output+=huns[parseInt(num/100-4*c)-1];
  }
  if(num >= 10){
    if(num==15) output+= "טו";
      else if(num==16) output+= "טז";
        else if(num%10!=0) output+=tens[parseInt(num/10%10)-1]+ones[num%10-1];
          else output+=tens[parseInt(num/10%10)-1];
  }
  else output= ones[num%10-1];
  var n = output.length;
  if(n >= 2)
    output = output.slice(0, n-1) + '"' + output.slice(n-1, n);
    else output += "'";
  return output
}

function sameDate(d1, d2) {
  return (d1.getFullYear() == d2.getFullYear() && 
    d1.getMonth() == d2.getMonth() && 
    d1.getDate() == d2.getDate())
}

// Here are a few support functions for the sample web page

function formatDateH(cDate) {
  var cFormatDate = numLettr(Number(cDate[1])) + " ב";
  var hMonths = {
    1: "תשרי",
    2: "חשוון",
    3: "כסלו",
    4: "טבת",
    5: "שבט",
    6: "אדר א'",
    7: "אדר",
    8: "ניסן",
    9: "אייר",
    10: "סיוון",
    11: "תמוז",
    12: "אב",
    13: "אלול"
  }
  if(isLeapYear(Number(cDate[2])))
    hMonths[7] += " ב'";
  cFormatDate += hMonths[Number(cDate[0])];
  cFormatDate += ", " + numLettr(cDate[2])
  return cFormatDate
}

function getYearType(year) 
{
  var length = lengthOfYear(year);
  var output;
  if(isLeapYear(year)) {
    if(length == 383) return 'miss';
    if(length == 384) return 'norm';
      else return 'full';
  }
  else {
    if(length == 353) return 'miss';
    if(length == 354) return 'norm';
      else return 'full';
  }
}

function twoDigit(num)
{
  if (num<=9)
    return "0"+num.toString();
    else return num;
}

function findShabbat(date){
  date.setHours(12);
  var timeToShabbat = 6 - date.getDay();
  var newdate = new Date(date.setDate(date.getDate() + timeToShabbat));
  return gregToHeb(newdate);
}

function msToTime(ms)
{
  var dateObj = new Date(ms);
  var hours = dateObj.getHours();
  var minutes = twoDigit(dateObj.getMinutes());
  return hours+":"+minutes;
}

function omerCount(date){
  var month = date[0];
  var day = date[1];
  if(month < 8 || month > 10)
    return "";
  if(month == 8) {
    count = day - 15;
  }
  else if(month == 9) {
    count = day + 15;
  }
  else count = day + 44;
  if (count > 49 || count < 1)
    return "";
  return numLettr(count) + " בעומר";
}

function checkHDate(dateH, log){
  var month = dateH[0];
  var day = dateH[1];

  if(month in log && day in log[month])
      return log[month][day];
  return "";
}

function holidays(date){
  var condition = getYearType(date[2]);
  if(condition != 'miss'){
    holidayData[4][1] = 'חנוכה - נר שביעי';
    holidayData[4][2] = 'חנוכה - נר שמיני';
  }
  else {
    holidayData[4][1] = 'חנוכה - נר שישי';
    holidayData[4][2] = 'חנוכה - נר שביעי';
    holidayData[4][3] = 'חנוכה - נר שמיני';
  }
  return checkHDate(date, holidayData);
}

function weeklyParasha(date){
  if(date[0] == 1 && date[1] <= 22){
    date[2] -=1;
    parashot[1] = parashot[14];
  }
  var year = date[2];
  var week = ["a", "b", "c", "d", "e", "f", "s"];
  // get day of tishrei 1
  var config = week[tishrei1(year).getDay()];
  // get year type
  config += getYearType(year).substring(0, 1);
  // get day of passover
  config += week[hebToGreg(year, 8, 15).getDay()];
  var par = checkHDate(date, parashot[config]);
  if (par)
    return "פרשת " + par;
  return "";
}
