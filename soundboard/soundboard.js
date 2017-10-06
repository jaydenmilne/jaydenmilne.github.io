console.log("hello")

var sounds = [ 
    { fl: "wood_needed.mp3", nm:"Wood Needed"},
    { fl:"cantplace.mp3", nm:"Can't place that there!"},
    { fl: "lionroars.mp3", nm:"Lionheart: Lion Roars"},
    { fl: "moreworkers.mp3", nm:"More Workers Needed"},
    { fl: "flyingpoo.mp3", nm:"Flying Poo"},
    { fl: "Peasant_Female73.mp3", nm:"Pop Rising"},
    { fl: "Pop_Falling.mp3", nm:"Popularity is Falling"},
    { fl: "stockpile_full.mp3", nm:"The Stockpile is Full!"},
    { fl: "woodneeded2.mp3", nm:"Wood Needed 2"},
    { fl: "donthurtme.mp3", nm:"Rat: Don't Hurt Me"},
    { fl: "megadeath.mp3", nm:"Mega Death"},
    { fl: "fatalexception.mp3", nm:"A Fatal Exception"},
    { fl: "lordjeff.mp3", nm:"Lord Jeff"},
    { fl: "lordrobert.mp3", nm:"Lord Robert"},
    { fl: "vader.mp3", nm:"Lord Vader"},
    { fl: "wood_stocks_low.mp3", nm:"Wood Stocks are Too Low"}]

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