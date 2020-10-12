console.log("hello")

var sounds = [ 
    { fl: "wood_needed.mp3", nm:"Wood Needed"},
    { fl:"cantplace.mp3", nm:"Can't place that there!"},
	{ fl: "legospy.mp3", nm:"Lego Star Wars Spy"},
    { fl: "moreworkers.mp3", nm:"More Workers Needed"},
    { fl: "recruitsneeded.mp3", nm:"Recruits Needed"},
    { fl: "greatestlord.mp3", nm:"You are the greatest lord"},
    { fl: "2ndgreatestlord.mp3", nm:"You are the 2nd greatest lord"},
    { fl: "excellent.mp3", nm:"Excellent"},
    { fl: "feelthepower.mp3", nm:"Feel the power"},
    { fl: "itsaroute.mp3", nm:"It's a route"},
    { fl: "keepenclosed.mp3", nm:"Keep is enclosed"},
    { fl: "oncemoreuntothebreach.mp3", nm:"Once more unto the breach"},
    { fl: "whereisyourcastle.mp3", nm:"Where's your castle?"},
    { fl: "buildingsonfire.mp3", nm:"Buildings are on fire"},
    { fl: "constructingseigeequipment.mp3", nm:"Constructing seige equipment"},
    { fl: "thisdevicerequiresskilledengineers.mp3", nm:"This device requires skilled engineers"},
    { fl: "wood_stocks_low.mp3", nm:"Wood Stocks are Too Low"},
    { fl: "granaryempty.mp3", nm:"The granary is empty"},
	{ fl: "Peasant_Female73.mp3", nm:"Pop Rising"},
    { fl: "Pop_Falling.mp3", nm:"Popularity is Falling"},
    { fl: "stockpile_full.mp3", nm:"The Stockpile is Full!"},
    { fl: "lionroars.mp3", nm:"Lionheart: Lion Roars"},
    { fl: "donthurtme.mp3", nm:"Rat: Don't Hurt Me"},

    ]

function add_button(snd) {
    var button = document.createElement("button");
    button.innerHTML = snd.nm;
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(button);
    body.appendChild(document.createElement("br"));
    button.addEventListener ("click", function() {
        var audio = new Audio(snd.fl);
        audio.play();
    });
}

sounds.forEach(function(sound) {
    add_button(sound);
}, this);