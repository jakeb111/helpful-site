
var flashitEnabled = getCookie("flashitEnabled")
if(flashitEnabled == "" || flashitEnabled == "false") {
    flashitEnabled = false
    document.cookie = "flashitEnabled=false"
}else{
    flashitEnabled = true
}
function enableFlashit() {
    if(flashitEnabled) {
        $("body").removeClass("flashit")
        flashitEnabled = false
        document.cookie = "flashitEnabled=false"
        stopPlaying();

    }else{
        $("body").addClass("flashit")

        flashitEnabled = true
        play();
        document.cookie = "flashitEnabled=true"
    }
    console.log(flashitEnabled)
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function play(){
    var audio = document.getElementById("audio");
    audio.play();
}
function stopPlaying(){
    var audio = document.getElementById("audio");
    audio.pause();
    audio.currentTime = 0;
}

$(document).ready(function() {
    if(flashitEnabled) {
        $("body").addClass("flashit");
        play();
    }else{
        $("body").removeClass("flashit");
    }
});

