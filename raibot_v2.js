//edit this variable to change the base bet value.
var baseBet = 12;
var baseMultiplier = 1.08;

//do not edit variables below this.
var username = engine.getUsername();
var startBalance = engine.getBalance();

var currentGameID = -1;
var currentBet = baseBet;
var currentMultiplier = baseMultiplier;
var lastMultiplier = baseMultiplier;
var takeBreak = false;

var firstGame = true;
var date = new Date();
var startTime = date.getTime();
var lastResult = 'WON';

var lastBet = 0;


var probability = function(n) {
	return !!n && Math.random() <= n;
};

console.log('[RaiBot] Welcome ' + username);
console.log('[RaiBot] Starting Balance: ' + (startBalance / 100).toFixed(2) + ' mXRB');

engine.on('game_starting', function(info) {

	currentGameID = info.game_id;
	console.log('---------------------');
	console.log('[Raibot] Game #' + currentGameID + ' started.');
	//check the result of the last game
	lastResult = engine.lastGamePlay();

	if(takeBreak == false) {

		//if the result of the last game was 'LOST', increase your last bet by 2.
		if(lastResult == 'LOST' && !firstGame) {
			if(lastMultiplier == 1.08) {
				currentBet = lastBet * 4;
				currentMultiplier = 1.25;
			}
			else if(lastMultiplier = 1.25) {
				currentBet = lastBet * 5;
				currentMultiplier = 1.25;
			}

		} else {

			//if last game was won, reset bet to base bet.
			currentBet = baseBet;
			currentMultiplier = baseMultiplier;
		}

		//set last result to 'LOST', value will be updated to 'WON' if the cashed out even occurs.
		firstGame = false;
		lastResult = 'LOST';

		console.log('[Raibot] Betting ' + currentBet + ' mXRB, cashing out at ' + currentMultiplier);
		engine.placeBet(currentBet * 100, (currentMultiplier * 100), false);
		lastBet = currentBet;
		lastMultiplier = currentMultiplier;
	};

	takeBreak = false;
});

engine.on('cashed_out', function(data) {
	if(data.username == engine.getUsername()) {
		console.log('[Raibot] Successfully cashed out at ' + (data.stopped_at / 100) + 'x');
		
		//indicates that this game was won.
		lastResult = 'WON';
	}
});

engine.on('game_crash', function(data) {
	var newDate = new Date();
	var timePlayed = ((newDate.getTime() - startTime) / 1000) / 60;

	if(takeBreak == false) {
		console.log('[Raibot] Game crashed at ' + (data.game_crash / 100) + 'x');
	} else {
		takeBreak = false;
	};
});









