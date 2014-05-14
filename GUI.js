
var gameOver = false;

function initialize_GUI(){
    // för loading screen
    $('#loading').hide();
    $('#WebGL-container').show();
    $('#stopwatch').css('margin-left', window.innerWidth*0.44);
}

function endGame(id){

        // stop loop
        window.cancelAnimationFrame(id);

        $('#WebGL-container').css('opacity', '1').fadeTo(500, 0.4)
        var time = $('#timer span').html();

        // show results
        $('#result #time').html(time);

        $('#gameOverScreen').css('height', window.innerHeight/2);
        $('#gameOverScreen').css('width', window.innerWidth/2);
        $('#gameOverScreen').css('margin-top', window.innerHeight/4);
        $('#gameOverScreen').css('margin-left', window.innerWidth/4);
        $('#gameOverScreen').css('opacity', '0').fadeTo(500, 0.8)

        //restart page
        $('a').click(function(){
            location.reload();
        });

        gameOver = true;

}
/// FÖR TIMERN ////
//////////////////
/////////////////
function pad(number, length) {

    var str = '' + number;
    while (str.length < length) {str = '0' + str;}

    return str;
}

function formatTime(time) {
    var min = parseInt(time / 6000),
        sec = parseInt(time / 100) - (min * 60),
        hundredths = pad(time - (sec * 100) - (min * 6000), 2);

    // return span tag instead of current time 
    if(gameOver)
		return $('#timer span').html();

    return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2) + ":" + hundredths;

}


var clock = new (function() {

    var $stopwatch, // Stopwatch element on the page
        incrementTime = 70, // Timer speed in milliseconds
        currentTime = 0, // Current time in hundredths of a second

        updateTimer = function() {
            $stopwatch.html(formatTime(currentTime));
            currentTime += incrementTime / 10;

        },
        init = function() {

            $stopwatch = $('#stopwatch');
            clock.Timer = $.timer(updateTimer, incrementTime, true);
        };

    this.resetStopwatch = function() {
        currentTime = 0;
        this.Timer.stop().once();
    };
    	$(init);
});
