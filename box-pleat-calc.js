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
    ["advPleatUnit","advAttachUnit","advSeamUnit"].forEach(function(id) {
        document.getElementById(id).textContent = "(" + lbl + ")";
    });
}
function calculateSimple() {
    var pw=parseFloat(document.getElementById("simplePleatWidth").value);
    var np=parseFloat(document.getElementById("simpleNumPleats").value);
    var sa=parseFloat(document.getElementById("simpleSeam").value);
    if(!pw||pw<=0){alert("Please enter a valid box pleat width.");return;}
    if(!np||np<=0){alert("Please enter a valid number of pleats.");return;}
    if(isNaN(sa)||sa<0){alert("Please enter a valid seam allowance.");return;}
    var fw=(3*pw*np)+(2*sa);
    document.getElementById("simpleFabricValue").textContent=fw.toFixed(2)+" "+currentUnit;
    document.getElementById("simpleResults").classList.remove("hidden");
}
function nextStep(n) {
    if(n===3){var v=document.getElementById("advPleatWidth").value;if(!v||v<=0){alert("Please enter a valid box pleat width.");return;}}
    else if(n===4){var v=document.getElementById("attachWidth").value;if(!v||v<=0){alert("Please enter a valid attachment width.");return;}}
    document.querySelectorAll("#advancedCalculator .step").forEach(function(s){s.classList.remove("active");});
    document.getElementById("step"+n).classList.add("active");
}
function prevStep(n) {
    document.querySelectorAll("#advancedCalculator .step").forEach(function(s){s.classList.remove("active");});
    document.getElementById("step"+n).classList.add("active");
}
function calculateAdvanced() {
    var pw=parseFloat(document.getElementById("advPleatWidth").value);
    var aw=parseFloat(document.getElementById("attachWidth").value);
    var sa=parseFloat(document.getElementById("advSeamAllowance").value);
    if(isNaN(sa)||sa<0){alert("Please enter a valid seam allowance.");return;}
    var total=aw/pw;
    var C=Math.floor(total);
    var D=total-C;
    var fw=(C*pw*3)+(D*pw)+(2*sa);
    document.getElementById("fabricNeeded").textContent=fw.toFixed(2)+" "+advancedUnit;
    document.getElementById("numPleats").textContent=total.toFixed(2)+" pleats";
    document.getElementById("advancedResults").classList.remove("hidden");
}
function resetAdvanced() {
    document.getElementById("advPleatWidth").value="";
    document.getElementById("attachWidth").value="";
    document.getElementById("advSeamAllowance").value="0.5";
    document.getElementById("advancedResults").classList.add("hidden");
    document.querySelectorAll("#advancedCalculator .step").forEach(function(s){s.classList.remove("active");});
    document.getElementById("step1").classList.add("active");
}
