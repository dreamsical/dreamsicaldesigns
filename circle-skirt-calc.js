var currentMode = null;
var currentUnit = "inches";
var advancedUnit = "inches";

function selectMode(mode, el) {
    currentMode = mode;
    document.querySelectorAll(".mode-card").forEach(function(c) { c.classList.remove("active"); });
    el.closest(".mode-card").classList.add("active");
    document.getElementById("simpleCalculator").classList.add("hidden");
    document.getElementById("advancedCalculator").classList.add("hidden");
    if (mode === "simple") {
        document.getElementById("simpleCalculator").classList.remove("hidden");
    } else {
        document.getElementById("advancedCalculator").classList.remove("hidden");
    }
    if (window.trackEvent) { trackEvent("calculator_mode_selected", { calculator: "Circle Skirt", mode: mode }); }
}
function setUnit(unit, mode) {
    if (mode === "simple") {
        currentUnit = unit;
        document.querySelectorAll("#simpleCalculator .unit-option").forEach(function(o) { o.classList.remove("active"); });
        event.target.classList.add("active");
        document.getElementById("simpleUnitLabel").textContent = "(" + unit + ")";
        document.getElementById("simpleSeamLabel").textContent = "(" + unit + ")";
    }
}
function setAdvancedUnit(unit) {
    advancedUnit = unit;
    document.querySelectorAll("#advancedCalculator .unit-option").forEach(function(o) { o.classList.remove("active"); });
    event.target.classList.add("active");
    var lbl = unit === "inches" ? "inches" : "centimeters";
    ["advWaistUnit","advLengthUnit","advSeamUnit","advHemUnit","advFabricUnit"].forEach(function(id) {
        document.getElementById(id).textContent = "(" + lbl + ")";
    });
}
function calculateSimple() {
    var waist = parseFloat(document.getElementById("simpleWaist").value);
    var seam = parseFloat(document.getElementById("simpleSeam").value);
    var circleType = document.getElementById("simpleCircleType").value;
    if (!waist || waist <= 0) { alert("Please enter a valid opening circumference."); return; }
    if (isNaN(seam) || seam < 0) { alert("Please enter a valid seam allowance."); return; }
    if (!circleType) { alert("Please select a circle type."); return; }
    var radius;
    if (circleType === "full") { radius = waist / (2 * Math.PI); }
    else if (circleType === "threequarter") { radius = ((4/3) * (waist + 2*seam)) / (2*Math.PI); }
    else if (circleType === "half") { radius = (2 * (waist + 2*seam)) / (2*Math.PI); }
    else if (circleType === "quarter") { radius = (4 * (waist + 2*seam)) / (2*Math.PI); }
    document.getElementById("simpleRadiusValue").textContent = radius.toFixed(2) + " " + currentUnit;
    document.getElementById("simpleResults").classList.remove("hidden");
}
function nextStep(n) {
    var checks = {
        3: function() { var v=document.getElementById("advWaist").value; if(!v||v<=0){alert("Please enter a valid opening circumference.");return false;} return true; },
        4: function() { var v=document.getElementById("circleType").value; if(!v){alert("Please select a circle type.");return false;} return true; },
        5: function() { var v=document.getElementById("desiredLength").value; if(!v||v<=0){alert("Please enter a valid length.");return false;} return true; },
        6: function() { var v=document.getElementById("seamAllowance").value; if(isNaN(parseFloat(v))){alert("Please enter a valid seam allowance.");return false;} return true; },
        7: function() { var v=document.getElementById("hemAllowance").value; if(isNaN(parseFloat(v))){alert("Please enter a valid hem allowance.");return false;} return true; }
    };
    if (checks[n] && !checks[n]()) { return; }
    document.querySelectorAll("#advancedCalculator .step").forEach(function(s) { s.classList.remove("active"); });
    document.getElementById("step" + n).classList.add("active");
}
function prevStep(n) {
    document.querySelectorAll("#advancedCalculator .step").forEach(function(s) { s.classList.remove("active"); });
    document.getElementById("step" + n).classList.add("active");
}
function calculateAdvanced() {
    var waist=parseFloat(document.getElementById("advWaist").value);
    var ct=parseFloat(document.getElementById("circleType").value);
    var dl=parseFloat(document.getElementById("desiredLength").value);
    var sa=parseFloat(document.getElementById("seamAllowance").value);
    var ha=parseFloat(document.getElementById("hemAllowance").value);
    var fw=parseFloat(document.getElementById("fabricWidth").value);
    if (!fw||fw<=0) { alert("Please enter a valid fabric width."); return; }
    var wr;
    if(ct===1){wr=waist/(2*Math.PI);}
    else if(ct===0.75){wr=((4/3)*(waist+2*sa))/(2*Math.PI);}
    else if(ct===0.5){wr=(2*(waist+2*sa))/(2*Math.PI);}
    else if(ct===0.25){wr=(4*(waist+2*sa))/(2*Math.PI);}
    var maxLen=(ct===1||ct===0.75)?(fw/2)-ha-wr:fw-ha-wr;
    var warn=maxLen<dl;
    var useLen=warn?maxLen:dl;
    var fl=(ct===1||ct===0.75||ct===0.5)?(wr+useLen+ha)*2:wr+useLen+ha;
    var fn,unit;
    if(advancedUnit==="inches"){fn=Math.ceil((fl/36)*10)/10;unit="yards";}
    else{fn=Math.ceil((fl/100)*10)/10;unit="meters";}
    document.getElementById("fabricNeeded").textContent=fn.toFixed(1)+" "+unit;
    document.getElementById("maxLength").textContent=maxLen.toFixed(2)+" "+advancedUnit;
    document.getElementById("noteText").textContent=(ct===1)
        ?"This calculation assumes the full circle is cut in one continuous piece (fabric folded twice)."
        :"The end seam allowances have been accounted for in these calculations.";
    document.getElementById("calculationNote").classList.remove("hidden");
    if(warn){
        document.getElementById("warningMessage").textContent="Your fabric width only allows a maximum length of "+maxLen.toFixed(2)+" "+advancedUnit+". Consider wider fabric or a shorter length.";
        document.getElementById("warningBox").classList.remove("hidden");
    } else { document.getElementById("warningBox").classList.add("hidden"); }
    document.getElementById("advancedResults").classList.remove("hidden");
    if(window.trackEvent){trackEvent("circle_skirt_calculated",{mode:"advanced",circle_type:ct});}
}
function resetAdvanced() {
    ["advWaist","circleType","desiredLength","fabricWidth"].forEach(function(id){document.getElementById(id).value="";});
    document.getElementById("seamAllowance").value="0.5";
    document.getElementById("hemAllowance").value="1";
    document.getElementById("advancedResults").classList.add("hidden");
    document.getElementById("calculationNote").classList.add("hidden");
    document.querySelectorAll("#advancedCalculator .step").forEach(function(s){s.classList.remove("active");});
    document.getElementById("step1").classList.add("active");
}
