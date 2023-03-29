/************************************************************************
* Smart Mirror JavaScript
* February 2023
* KSU ECE
* 2023 Senior Design Project
* 
* 
************************************************************************/

// Speech Recognition variables
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');

//First setup variables
var currentApp = 0;                                                                  // Default App is time -- Maybe do a homescreen?
var currentVid = 0;                                                                  // Current tutorial is off
let timezone;                                                                         // Timezone for time as offset variable (minutes)
let timezoneWord;                                                                     // Timezone as a word
const firstdate = new Date();                                                          // Initial time 
const firsttimezone = firstdate.getTimezoneOffset();                                  // Initial timezone
timezone = firstdate.getTimezoneOffset() + 60;                                        // Adds 60 to counter daylight savings
timezoneWord = getTimezone(timezone);                                                 // Timezone for time app
document.getElementById("bString").innerHTML ="Timezone: " + timezoneWord;            // Puts first timezone down -- Check if actually needed?

// Runs the whole program every x milliseconds - current = 1/10th of a second
setInterval(getApp, 1000); 

// Gets the current app - mainly used for updating time and weather
// Also helps display proper youtube video
function getApp(){
  if(currentApp == 0)  // Time app
    {
      getDateAndTime();
    }
  else if(currentApp == 1) // Weather app
    {
      getWeather();
    }
  if(currentApp != 5) // If not youtube app
    {
      document.getElementById('winsorKnot').style.display = 'none';
      //Insert more vids here
      document.getElementById('vidButtons').style.display = 'none';
      document.getElementById('backButton').style.display = 'none';
      document.getElementById('rTop').style.display = 'block';
      document.getElementById('rMiddle').style.display = 'block';
      document.getElementById('rBottom').style.display = 'block';
      currentVid = 0;
    }
  else if(currentVid == 0) // Default view to select youtube app
    {
      document.getElementById('winsorKnot').style.display = 'none';
      //Insert more vids here
      document.getElementById('vidButtons').style.display = 'block';
      document.getElementById('backButton').style.display = 'none';
      document.getElementById('rTop').style.display = 'none';
      document.getElementById('rMiddle').style.display = 'none';
      document.getElementById('rBottom').style.display = 'none';
    }
  else if(currentVid == 1) // Winsor knot youtube app
    {
      document.getElementById('winsorKnot').style.display = 'block';
      //Insert more vids here
      document.getElementById('vidButtons').style.display = 'none';
      document.getElementById('backButton').style.display = 'block';
      document.getElementById('rTop').style.display = 'none';
      document.getElementById('rMiddle').style.display = 'none';
      document.getElementById('rBottom').style.display = 'none';
    }
}

// Gets the current weather -- NEEDS IMPLEMENTED
function getWeather(){
  document.getElementById("tString").innerHTML = "Day";
  document.getElementById("mString").innerHTML = "32 F";
  document.getElementById("bString").innerHTML = "Location?";
  document.getElementById('bButton1').style.visibility = 'hidden';
  document.getElementById('bButton2').style.visibility = 'hidden';
  document.getElementById('bButton3').style.visibility = 'hidden';
  document.getElementById('bButton4').style.visibility = 'hidden';
  document.getElementById('bButton5').style.visibility = 'hidden';
  document.getElementById('bButton6').style.visibility = 'hidden';
}

// The current time factors and displays 
// Day, year, month, date, hour, minute, second, timezone
function getDateAndTime(){
  const date = new Date(); 
  var year = date.getFullYear();
  var month = date.getMonth()+1; 
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var dayOfWeekNum = date.getDay();
  
  // checks for changed timezone
  if(timezone != firsttimezone)
    {
      hour = hour + (firsttimezone - timezone) / 60;
    }
  
  // Checks for late hour, used to make sure if time would reset to midnight and day would change, it actually works
  // Same for extreme month cases (even leap year) and new year year change
  if(hour >= 23)
    {
      hour = hour - 23;
      day = day + 1;
      dayOfWeekNum = dayOfWeekNum + 1;
      if(((month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) && day > 31)  // 31 days
         || ((month == 4 || month == 6 || month == 9 || month == 11) && day > 30)  // 30 days
         || (month == 2 && day > 28 && year % 4 != 0)  // february not leap year
         || (month == 2 && day > 29 && year % 4 == 0)) // february leap year
        {
          day = 1;
          month = month + 1;
          if(month > 12)
            {
              month = 1;
              year = year + 1;
            }
        }
    }
  hour = getHour(hour);
  var dayOfWeek = getDayOfWeek(dayOfWeekNum);
  var monthWord = getMonth(month);
  
  // Displays the time as a 00:00:00 format
  if(minute < 10 && second < 10)
  {
      document.getElementById("mString").innerHTML = hour + ":0" + minute + ":0" + second;
  }
  else if(minute < 10)
  {
    document.getElementById("mString").innerHTML = hour + ":0" + minute + ":" + second;  
  }
  else if(second < 10)
  {
      document.getElementById("mString").innerHTML = hour + ":" + minute + ":0" + second;
  }
  else
  {
    document.getElementById("mString").innerHTML = hour + ":" + minute + ":" + second;
  }
  document.getElementById("tString").innerHTML = dayOfWeek + ", " + monthWord + " " + day + " " + year;
  timezoneWord = getTimezone(timezone);
  document.getElementById("bString").innerHTML ="Timezone: " + timezoneWord;
  document.getElementById('bButton1').style.visibility = 'visible';
  document.getElementById('bButton2').style.visibility = 'visible';
  document.getElementById('bButton3').style.visibility = 'visible';
  document.getElementById('bButton4').style.visibility = 'visible';
  document.getElementById('bButton5').style.visibility = 'visible';
  document.getElementById('bButton6').style.visibility = 'visible';
}

// Gets the day of the week as a word
function getDayOfWeek(dayOfWeekNum)
{
  var dayOfWeek;
  if(dayOfWeekNum == 0)
      dayOfWeek = "Sunday";
  else if(dayOfWeekNum == 1)
      dayOfWeek = "Monday";
  else if(dayOfWeekNum == 2)
      dayOfWeek = "Tuesday";
  else if(dayOfWeekNum == 3)
      dayOfWeek = "Wednesday";
  else if(dayOfWeekNum == 4)
      dayOfWeek = "Thursday";
  else if(dayOfWeekNum == 5)
      dayOfWeek = "Friday";
  else if(dayOfWeekNum == 6)
      dayOfWeek = "Saturday";
  return dayOfWeek;
}

// Gets the current hour, uses a 12 hour clock
function getHour(hour)
{
  var num = hour + 1;
  if(hour > 12)
    num -= 12;
  else if(hour == 0)
  {
    num = 12;
  }
  return num;
}

// Gets the month as a word 
function getMonth(month)
{
  var monthWord;
  if(month == 1)
    monthWord = "January";
  else if(month == 2)
    monthWord = "February";
  else if(month == 3)
    monthWord = "March";
  else if(month == 4)
    monthWord = "April";
  else if(month == 5)
    monthWord = "May";
  else if(month == 6)
    monthWord = "June";
  else if(month == 7)
    monthWord = "July";
  else if(month == 8)
    monthWord = "August";
  else if(month == 9)
    monthWord = "September";
  else if(month == 10)
    monthWord = "October";
  else if(month == 11)
    monthWord = "November";
  else if(month == 12)
    monthWord = "December";
  return monthWord;
}

// Gets the time zone
function getTimezone(timezone)
{
  var tz = (0 - timezone)/60;
  let timezoneWord;
  if(tz == -10)
      timezoneWord = "Hawaii-Aleutian Standard Time";
  else if(tz == -9)
      timezoneWord = "Alaska Standard Time";
  else if(tz == -8)
      timezoneWord = "Pacific Standard Time";
  else if(tz == -7)
      timezoneWord = "Mountain Standard Time";
  else if(tz == -6)
      timezoneWord = "Central Standard Time";
  else if(tz == -5)
      timezoneWord = "Eastern Standard Time";
  return timezoneWord;
}

// Click selecting Hawaii time
function hTime()
{
  if(timezone != 600)
  {
    timezone = 600;
  }
  timezoneWord = getTimezone(timezone);
  document.getElementById("bString").innerHTML ="Timezone: " + timezoneWord;
}

// Click Selecting Alaskan time
function aTime()
{
  if(timezone != 540)
  {
    timezone = 540;
  }
  timezoneWord = getTimezone(timezone);
  document.getElementById("bString").innerHTML ="Timezone: " + timezoneWord;
}

// Click selecting pacific time
function pTime()
{
  if(timezone != 480)
  {
    timezone = 480;
  }
  timezoneWord = getTimezone(timezone);
  document.getElementById("bString").innerHTML ="Timezone: " + timezoneWord;
}

// Click selecting mountain time
function mTime()
{
  if(timezone != 420)
  {
    timezone = 420;
  }
  timezoneWord = getTimezone(timezone);
  document.getElementById("bString").innerHTML ="Timezone: " + timezoneWord;
}

// Click selecting central time
function cTime()
{
  if(timezone != 360)
  {
    timezone = 360;
  }
  timezoneWord = getTimezone(timezone);
  document.getElementById("bString").innerHTML ="Timezone: " + timezoneWord;
}

// Click Selecting eastern time
function eTime()
{
  if(timezone != 300)
  {
    timezone = 300;
  }
  timezoneWord = getTimezone(timezone);
  document.getElementById("bString").innerHTML ="Timezone: " + timezoneWord;
}

// Clicking the voice app
function voiceClick()
{
  currentApp = 4;
  document.getElementById("tString").innerHTML = "";
  document.getElementById("bString").innerHTML = "";
  document.getElementById('bButton1').style.visibility = 'hidden';
  document.getElementById('bButton2').style.visibility = 'hidden';
  document.getElementById('bButton3').style.visibility = 'hidden';
  document.getElementById('bButton4').style.visibility = 'hidden';
  document.getElementById('bButton5').style.visibility = 'hidden';
  document.getElementById('bButton6').style.visibility = 'hidden';
  document.getElementById("mString").innerHTML = "Choose App!";
  recognition.start();
}

// Gets the voice activation result
recognition.onresult = function(event) {
  var result = event.results[0][0].transcript;
  document.getElementById("mString").innerHTML = 'Result received: ' + result + '.';
  if(result == "time")
    {setTimeout(function(){ 

        timeClick();;
    }, 1000);
   }
  else if(result == "weather")
    {setTimeout(function(){ 

        weatherClick();;
    }, 1000);
   }
  else if(result == "daily quote" || result == "quote of the day")
    {setTimeout(function(){ 

        QOTDClick();;
    }, 1000);
   }
}

// Clicking the time app button
function timeClick()
{
  currentApp = 0;
}

// Clicking the weather button
function weatherClick()
{
  currentApp = 1;
}

// Clicking the daily quote button
function QOTDClick()
{
  currentApp = 2;
  const dqDate = new Date();
  var dQ = dqDate.getDay();
  document.getElementById("tString").innerHTML = "";
  if(dQ == 0)
    {
      document.getElementById("mString").innerHTML = "Quote 1";
    }
  else if(dQ == 1)
    {
      document.getElementById("mString").innerHTML = "“I’d rather regret the things I’ve done than regret the things I haven’t done.”";
      document.getElementById("bString").innerHTML = "— Lucille Ball";
    }
  else if(dQ == 2)
    {
      document.getElementById("mString").innerHTML = "“Opportunities don't happen, you create them.”";
      document.getElementById("bString").innerHTML = "— Chris Grosserv";
    }
  else if(dQ == 3)
    {
      document.getElementById("mString").innerHTML = "“Either you run the day or the day runs you.”";
      document.getElementById("bString").innerHTML = "— Jim Rohn";
    }
  else if(dQ == 4)
    {
      document.getElementById("mString").innerHTML = "Quote 5";
      document.getElementById("bString").innerHTML = "— Jim Rohn";
    }
  else if(dQ == 5)
    {
      document.getElementById("mString").innerHTML = "“Friday sees more smiles than any other day of the workweek!”";
      document.getElementById("bString").innerHTML = "— Kate Summers";
    }
  else if(dQ == 6)
    {
      document.getElementById("mString").innerHTML = "Quote 7";
      document.getElementById("bString").innerHTML = "—Jim Rohn";
    }
  document.getElementById('bButton1').style.visibility = 'hidden';
  document.getElementById('bButton2').style.visibility = 'hidden';
  document.getElementById('bButton3').style.visibility = 'hidden';
  document.getElementById('bButton4').style.visibility = 'hidden';
  document.getElementById('bButton5').style.visibility = 'hidden';
  document.getElementById('bButton6').style.visibility = 'hidden';
}

// Click the youtube button
function tubeClick()
{
  currentApp = 5;
  document.getElementById('bButton1').style.visibility = 'hidden';
  document.getElementById('bButton2').style.visibility = 'hidden';
  document.getElementById('bButton3').style.visibility = 'hidden';
  document.getElementById('bButton4').style.visibility = 'hidden';
  document.getElementById('bButton5').style.visibility = 'hidden';
  document.getElementById('bButton6').style.visibility = 'hidden';
}

// Click the winsor youtube button
function winsorClick(){
  currentVid = 1;
}

// Click the back video button
function backClick(){
  currentVid = 0;
}

//
// CAMERA STUFF
//  Interface
//
var elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

function toggle_fullscreen(e) {

  var background = document.getElementById("background");

  if(!background) {
    background = document.createElement("div");
    background.id = "background";
    document.body.appendChild(background);
  }
  
  if(e.className == "fullscreen") {
    e.className = "";
    background.style.display = "none";
    closeFullscreen();
  }
  else {
    e.className = "fullscreen";
    background.style.display = "block";
    openFullscreen();
  }

}

function set_display(value) {
   var d = new Date();
   var val;
   d.setTime(d.getTime() + (365*24*60*60*1000));
   var expires = "expires="+d.toUTCString();
   if (value == "SimpleOff") {
	   val = "Off";
   } else if (value == "SimpleOn") {
	   val = "Full";
   } else {
	   val = value
   }
   
   document.cookie="display_mode=" + val + "; " + expires;
   document.location.reload(true);
}

function set_stream_mode(value) {
   var d = new Date();
   d.setTime(d.getTime() + (365*24*60*60*1000));
   var expires = "expires="+d.toUTCString();
   
   if (value == "DefaultStream") {
      document.getElementById("toggle_stream").value = "MJPEG-Stream";
   } else {
      document.getElementById("toggle_stream").value = "Default-Stream";
   }
   document.cookie="stream_mode=" + value + "; " + expires;
   document.location.reload(true);
}

function schedule_rows() {
   var sun, day, fixed, mode;
   mode = parseInt(document.getElementById("DayMode").value);
   switch(mode) {
      case 0: sun = 'table-row'; day = 'none'; fixed = 'none'; break;
      case 1: sun = 'none'; day = 'table-row'; fixed = 'none'; break;
      case 2: sun = 'none'; day = 'none'; fixed = 'table-row'; break;
      default: sun = 'table-row'; day = 'table-row'; fixed = 'table-row'; break;
   }
   var rows;
   rows = document.getElementsByClassName('sun');
   for(i=0; i<rows.length; i++) 
      rows[i].style.display = sun;
   rows = document.getElementsByClassName('day');
   for(i=0; i<rows.length; i++) 
      rows[i].style.display = day;
   rows = document.getElementsByClassName('fixed');
   for(i=0; i<rows.length; i++) 
      rows[i].style.display = fixed;
}

function set_preset(value) {
  var values = value.split(" ");
  document.getElementById("video_width").value = values[0];
  document.getElementById("video_height").value = values[1];
  document.getElementById("video_fps").value = values[2];
  document.getElementById("MP4Box_fps").value = values[3];
  document.getElementById("image_width").value = values[4];
  document.getElementById("image_height").value = values[5];
  document.getElementById("fps_divider").value = values[6];
  
  set_res();
}

function set_res() {
  send_cmd("px " + document.getElementById("video_width").value + " " + document.getElementById("video_height").value + " " + document.getElementById("video_fps").value + " " + document.getElementById("MP4Box_fps").value + " " + document.getElementById("image_width").value + " " + document.getElementById("image_height").value + " " + document.getElementById("fps_divider").value);
  update_preview_delay();
  updatePreview(true);
}

function set_ce() {
  send_cmd("ce " + document.getElementById("ce_en").value + " " + document.getElementById("ce_u").value + " " + document.getElementById("ce_v").value);

}

function set_preview() {
  send_cmd("pv " + document.getElementById("quality").value + " " + document.getElementById("width").value + " " + document.getElementById("divider").value);
  update_preview_delay();
}

function set_encoding() {
  send_cmd("qp " + document.getElementById("minimise_frag").value + " " + document.getElementById("initial_quant").value + " " + document.getElementById("encode_qp").value);
}

function set_roi() {
  send_cmd("ri " + document.getElementById("roi_x").value + " " + document.getElementById("roi_y").value + " " + document.getElementById("roi_w").value + " " + document.getElementById("roi_h").value);
}

function set_at() {
  send_cmd("at " + document.getElementById("at_en").value + " " + document.getElementById("at_y").value + " " + document.getElementById("at_u").value + " " + document.getElementById("at_v").value);
}

function set_ac() {
  send_cmd("ac " + document.getElementById("ac_en").value + " " + document.getElementById("ac_y").value + " " + document.getElementById("ac_u").value + " " + document.getElementById("ac_v").value);
}

function set_ag() {
  send_cmd("ag " + document.getElementById("ag_r").value + " " + document.getElementById("ag_b").value);
}

function send_macroUpdate(i, macro) {
  var macrovalue = document.getElementById(macro).value;
  if(!document.getElementById(macro + "_chk").checked) {
	  macrovalue = "-" + macrovalue;
  }
  send_cmd("um " + i + " " + macrovalue);
}

function hashHandler() {
  switch(window.location.hash){
    case '#full':
    case '#fullscreen':
      if (mjpeg_img !== null && document.getElementsByClassName("fullscreen").length == 0) {
        toggle_fullscreen(mjpeg_img);
      }
      break;
    case '#normal':
    case '#normalscreen':
      if (mjpeg_img !== null && document.getElementsByClassName("fullscreen").length != 0) {
        toggle_fullscreen(mjpeg_img);
      }
      break;
  }
}

//
// System shutdow, reboot, settime
//
function sys_shutdown() {
  ajax_status.open("GET", "cmd_func.php?cmd=shutdown", true);
  ajax_status.send();
}

function sys_reboot() {
  ajax_status.open("GET", "cmd_func.php?cmd=reboot", true);
  ajax_status.send();
}

function sys_settime() {
  var strDate = document.getElementById("timestr").value;
  if(strDate.indexOf("-") < 0) {
	  ajax_status.open("GET", "cmd_func.php?cmd=settime&timestr=" + document.getElementById("timestr").value, true);
	  ajax_status.send();
  }
}

//
// MJPEG
//
var mjpeg_img;
var halted = 0;
var previous_halted = 99;
var mjpeg_mode = 0;
var preview_delay = 0;
var btn_class_p = "btn btn-primary"
var btn_class_a = "btn btn-warning"

function reload_img () {
  if(!halted) mjpeg_img.src = "cam_pic.php?time=" + new Date().getTime() + "&pDelay=" + preview_delay;
  else setTimeout("reload_img()", 500);
}

function error_img () {
  setTimeout("mjpeg_img.src = 'cam_pic.php?time=' + new Date().getTime();", 100);
}

function updatePreview(cycle)
{
   if (mjpegmode)
   {
      if (cycle !== undefined && cycle == true)
      {
         mjpeg_img.src = "/updating.jpg";
         setTimeout("mjpeg_img.src = \"cam_pic_new.php?time=\" + new Date().getTime()  + \"&pDelay=\" + preview_delay;", 1000);
         return;
      }
      
      if (previous_halted != halted)
      {
         if(!halted)
         {
            mjpeg_img.src = "cam_pic_new.php?time=" + new Date().getTime() + "&pDelay=" + preview_delay;			
         }
         else
         {
            mjpeg_img.src = "/unavailable.jpg";
         }
      }
	previous_halted = halted;
   }
}

//
// Ajax Status
//
var ajax_status;

if(window.XMLHttpRequest) {
  ajax_status = new XMLHttpRequest();
}
else {
  ajax_status = new ActiveXObject("Microsoft.XMLHTTP");
}

function setButtonState(btn_id, disabled, value, cmd=null) {
  btn = document.getElementById(btn_id);
  btn.disabled = disabled;
  btn.value = value;
  if (cmd !== null) btn.onclick = function() {send_cmd(cmd);};
}

ajax_status.onreadystatechange = function() {
  if(ajax_status.readyState == 4 && ajax_status.status == 200) {

    if(ajax_status.responseText == "ready") {
      setButtonState("video_button", false, "record video start", "ca 1");
      setButtonState("image_button", false, "record image", "im");
      setButtonState("timelapse_button", false, "timelapse start", "tl 1");
      setButtonState("md_button", false, "motion detection start", "md 1");
      setButtonState("halt_button", false, "stop camera", "ru 0");
      document.getElementById("preview_select").disabled = false;
      document.getElementById("video_button").className = btn_class_p;
      document.getElementById("timelapse_button").className = btn_class_p;
      document.getElementById("md_button").className = btn_class_p;
      document.getElementById("image_button").className = btn_class_p;
      halted = 0;
    }
    else if(ajax_status.responseText == "md_ready") {
      setButtonState("video_button", true, "record video start");
      setButtonState("image_button", false, "record image", "im");
      setButtonState("timelapse_button", false, "timelapse start", "tl 1");
      setButtonState("md_button", false, "motion detection stop", "md 0");
      setButtonState("halt_button", true, "stop camera");
      document.getElementById("preview_select").disabled = false;
      document.getElementById("video_button").className = btn_class_p;
      document.getElementById("timelapse_button").className = btn_class_p;
      document.getElementById("md_button").className = btn_class_a;
      document.getElementById("image_button").className = btn_class_p;
      halted = 0;
    }
    else if(ajax_status.responseText == "timelapse") {
      setButtonState("video_button", false, "record video start", "ca 1");
      setButtonState("image_button", true, "record image");
      setButtonState("timelapse_button", false, "timelapse stop", "tl 0");
      setButtonState("md_button", true, "motion detection start");
      setButtonState("halt_button", true, "stop camera");
      document.getElementById("preview_select").disabled = false;
      document.getElementById("video_button").className = btn_class_p;
      document.getElementById("timelapse_button").className = btn_class_a;
      document.getElementById("md_button").className = btn_class_p;
      document.getElementById("image_button").className = btn_class_p;
    }
    else if(ajax_status.responseText == "tl_md_ready") {
      setButtonState("video_button", true, "record video start");
      setButtonState("image_button", false, "record image", "im");
      setButtonState("timelapse_button", false, "timelapse stop", "tl 0");
      setButtonState("md_button", false, "motion detection stop", "md 0");
      setButtonState("halt_button", true, "stop camera");
      document.getElementById("preview_select").disabled = false;
      document.getElementById("video_button").className = btn_class_p;
      document.getElementById("timelapse_button").className = btn_class_a;
      document.getElementById("md_button").className = btn_class_a;
      document.getElementById("image_button").className = btn_class_p;
      halted = 0;
    }
    else if(ajax_status.responseText == "video") {
      setButtonState("video_button", false, "record video stop", "ca 0");
      setButtonState("image_button", false, "record image", "im");
      setButtonState("timelapse_button", false, "timelapse start", "tl 1");
      setButtonState("md_button", true, "motion detection start");
      setButtonState("halt_button", true, "stop camera");
      document.getElementById("preview_select").disabled = true;
      document.getElementById("video_button").className = btn_class_a;
      document.getElementById("timelapse_button").className = btn_class_p;
      document.getElementById("md_button").className = btn_class_p;
      document.getElementById("image_button").className = btn_class_p;
    }
    else if(ajax_status.responseText == "md_video") {
      setButtonState("video_button", true, "record video stop");
      setButtonState("image_button", false, "record image", "im");
      setButtonState("timelapse_button", false, "timelapse start", "tl 1");
      setButtonState("md_button", true, "recording video...");
      setButtonState("halt_button", true, "stop camera");
      document.getElementById("preview_select").disabled = true;
      document.getElementById("video_button").className = btn_class_a;
      document.getElementById("timelapse_button").className = btn_class_p;
      document.getElementById("md_button").className = btn_class_a;
      document.getElementById("image_button").className = btn_class_p;
    }
    else if(ajax_status.responseText == "tl_video") {
      setButtonState("video_button", false, "record video stop", "ca 0");
      setButtonState("image_button", true, "record image");
      setButtonState("timelapse_button", false, "timelapse stop", "tl 0");
      setButtonState("md_button", true, "motion detection start");
      setButtonState("halt_button", true, "stop camera");
      document.getElementById("preview_select").disabled = false;
      document.getElementById("video_button").className = btn_class_a;
      document.getElementById("timelapse_button").className = btn_class_a;
      document.getElementById("md_button").className = btn_class_p;
      document.getElementById("image_button").className = btn_class_p;
    }
    else if(ajax_status.responseText == "tl_md_video") {
      setButtonState("video_button", false, "record video stop", "ca 0");
      setButtonState("image_button", true, "record image");
      setButtonState("timelapse_button", false, "timelapse stop", "tl 0");
      setButtonState("md_button", true, "recording video...");
      setButtonState("halt_button", true, "stop camera");
      document.getElementById("preview_select").disabled = false;
      document.getElementById("video_button").className = btn_class_a;
      document.getElementById("timelapse_button").className = btn_class_a;
      document.getElementById("md_button").className = btn_class_a;
      document.getElementById("image_button").className = btn_class_p;
    }
    else if(ajax_status.responseText == "image") {
      setButtonState("video_button", true, "record video start");
      setButtonState("image_button", true, "recording image");
      setButtonState("timelapse_button", true, "timelapse start");
      setButtonState("md_button", true, "motion detection start");
      setButtonState("halt_button", true, "stop camera");
      document.getElementById("preview_select").disabled = false;
      document.getElementById("image_button").className = btn_class_a;
    }
    else if(ajax_status.responseText == "halted") {
      setButtonState("video_button", true, "record video start");
      setButtonState("image_button", true, "record image");
      setButtonState("timelapse_button", true, "timelapse start");
      setButtonState("md_button", true, "motion detection start");
      setButtonState("halt_button", false, "start camera", "ru 1");
      document.getElementById("preview_select").disabled = false;
      document.getElementById("video_button").className = btn_class_p;
      document.getElementById("timelapse_button").className = btn_class_p;
      document.getElementById("md_button").className = btn_class_p;
      document.getElementById("video_button").className = btn_class_p;
      document.getElementById("timelapse_button").className = btn_class_p;
      document.getElementById("md_button").className = btn_class_p;
      document.getElementById("image_button").className = btn_class_p;
      halted = 1;
    }
    else if(ajax_status.responseText.substr(0,5) == "Error") alert("Error in RaspiMJPEG: " + ajax_status.responseText.substr(7) + "\nRestart RaspiMJPEG (./RPi_Cam_Web_Interface_Installer.sh start) or the whole RPi.");

	updatePreview();
    reload_ajax(ajax_status.responseText);

  }
}

function reload_ajax (last) {
  ajax_status.open("GET","status_mjpeg.php?last=" + last,true);
  ajax_status.send();
}

//
// Ajax Commands
//
var ajax_cmd;

if(window.XMLHttpRequest) {
  ajax_cmd = new XMLHttpRequest();
}
else {
  ajax_cmd = new ActiveXObject("Microsoft.XMLHTTP");
}

function encodeCmd(s) {
   return s.replace(/&/g,"%26").replace(/#/g,"%23").replace(/\+/g,"%2B");
}

function send_cmd (cmd) {
  ajax_cmd.open("GET","cmd_pipe.php?cmd=" + encodeCmd(cmd),true);
  ajax_cmd.send();
}

function update_preview_delay() {
   var video_fps = parseInt(document.getElementById("video_fps").value);
   var divider = parseInt(document.getElementById("divider").value);
   preview_delay = Math.floor(divider / Math.max(video_fps,1) * 1000000);
}

//
// Init
//
function init(mjpeg, video_fps, divider) {
  mjpeg_img = document.getElementById("mjpeg_dest");
  hashHandler();
  window.onhashchange = hashHandler;
  preview_delay = Math.floor(divider / Math.max(video_fps,1) * 1000000);
  if (mjpeg) {
    mjpegmode = 1;
  } else {
     mjpegmode = 0;
     mjpeg_img.onload = reload_img;
     mjpeg_img.onerror = error_img;
     reload_img();
  }
  reload_ajax("");
}
