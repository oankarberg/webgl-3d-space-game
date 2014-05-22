
var gameOver = false;
var controlsActivated = false;

//Kolla om startskärmen ska upp. jämför url, inte den bästa lösningen..
function checkRefresh()
{
    //hämta url
    var url = window.location.href;
    console.log("URL : " + url);
    var playagain = url.split('?',2)
    console.log(playagain[1]);
    return playagain[1];
} 

function initialize_GUI(){
    // för loading screen
    $('#loading').hide();
    $('#WebGL-container').show();
    $('#stopwatch').css('margin-left', window.innerWidth*0.43);
    $('#coins').css('margin-left', window.innerWidth*0.14);
    $('#coins').css('margin-top', window.innerHeight*0.04);

    $('#healthBar').css('margin-left', window.innerWidth*0.37);
    $('#healthBar').css('margin-top', window.innerHeight*0.05);
    
    //kollar om man klickat på playagain
    if(checkRefresh() != 'playagain'){
         startGameScreen();  
    }else
    {
        activateControls();
        startTimer();
    }
}
var activateControls = function(){

    controlsActivated = true;
}

function endGame(id, totalCoins){

    // stop loop
    window.cancelAnimationFrame(id);

    $('#WebGL-container').css('opacity', '1').fadeTo(500, 0.8)
    var time = $('#timer span').html();

    // show results
    $('.someInfo #time').html(time);
    $('.someInfo #totalcoins').html(totalCoins);

    $('#gameOverScreen').css('height', 300);
    $('#gameOverScreen').css('width', 830);
    $('#gameOverScreen').css('margin-top', window.innerHeight/4);
    $('#gameOverScreen').css('margin-left', window.innerWidth/4);
    $('#gameOverScreen').css('opacity', '0').fadeTo(500, 0.8)

    //restart page
    $('#playAgainButton').click(function(){
       //sätter url till playagain
        if(checkRefresh() != 'playagain'){
            location.href = location.href+'?playagain'; 
            console.log(location.href);
            location.reload();
        }else{
            location.reload(); 
        }
    });

    //restart page på ENTER 
    $(document).keypress(function(e) {
    if(e.which == 13) {
        //sätter url till playagain
        if(checkRefresh() != 'playagain'){
            location.href = location.href+'?playagain'; 
            console.log(location.href);
            location.reload();
        }else{
            location.reload();
             
        }
    }
});

    gameOver = true;

}

function startGameScreen(){

    $('#WebGL-container').css('opacity', '1').fadeTo(2000, 0.8)

    $('#startGameScreen').css('height', 380);
    $('#startGameScreen').css('width', 830);
    $('#startGameScreen').css('margin-top', window.innerHeight/8);
    $('#startGameScreen').css('margin-left', window.innerWidth/4);
    $('#startGameScreen #options').css('width', window.innerWidth/3);
    $('#startGameScreen #spaceshipdiv').css('height', window.innerHeight/2.5);

    $('#startGameScreen').css('opacity', '0').fadeTo(2000, 0.8)

    //gameOver = true; 

}

//about
var about = function(){

    alert("Made by Nova, Ogge, Kängen, Yosuf och Runkebaum")


}

//ta bort startscreen
function playGame()
{
    activateControls();
    gameOver = false;
    startTimer();
     // stop loop
    $('#WebGL-container').css('opacity', '1').fadeTo(500, 1);
    $('#startGameScreen').css('display', 'none');
       
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

    return (min > 0 ? pad(min, 2) : "0") + "'" + pad(sec, 2) + "''" + hundredths;

}

function sendHighscore(){

    var name = $('#playerNameField').val();

    if($.trim(name) != ''){

        $.post('php/send_highscore.php', {name: name, score : 1000}, function(data){
        
            $('#feedbackInput').html(data);

        });
    }

    else
        $('#feedbackInput').html("You have to enter a name");

}

function viewHighscores(){

    $('.someInfo').html("");
    $('.someInfo').append('<table style = "border-collapse:collapse; margin-top:10px;"><tr><td width ="300"><p style = "color:lightblue;">Player</p></td> <td><p style = "color:lightblue;" > Score</p></td></tr>');

    $.getJSON("php/get_highscores.php",function(result){
            
        for(var i = 0; i < result.length; i++){

            $('.someInfo').append("<tr ><td style = 'padding-top:5px;' width = '300'><p>" + (i + 1)  + '. ' + result[i].name + 
                                  '</td><td><p>' + result[i].score + '</p></td></tr>');
        }

        $('.someInfo').append('</table>');

    });

}

function startTimer() {

    var $stopwatch, // Stopwatch element on the page
        incrementTime = 70, // Timer speed in milliseconds
        currentTime = 0, // Current time in hundredths of a second

        updateTimer = function() {
            $stopwatch.html(formatTime(currentTime));
            currentTime += incrementTime / 10;

        },
        init = function() {

            $stopwatch = $('#stopwatch');
            this.Timer = $.timer(updateTimer, incrementTime, true);
        };

    this.resetStopwatch = function() {
        currentTime = 0;
        this.Timer.stop().once();
    };
    $(init);
};

