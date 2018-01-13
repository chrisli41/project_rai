//edit this variable to change the base bet value.
var baseBet = 12;

//game will take a break after this many wins in a row.
var streakToBreak = 8;

//do not edit variables below this.
var username = engine.getUsername();
var startBalance = engine.getBalance();

var currentGameID = -1;
var currentBet = baseBet;
var currentMultipler = 2;

var firstGame = true;
var date = new Date();
var startTime = date.getTime();
var lastResult = 'WON';
var takeBreak = false;

var lastBet = 0;
var winStreak = 0;

console.log('[RaiBot] Welcome ' + username);
console.log('[RaiBot] Starting Balance: ' + (startBalance / 100).toFixed(2) + ' mXRB');

engine.on('game_starting', function(info) {

	currentGameID = info.game_id;
	console.log('---------------------');
	console.log('[Raibot] Game #' + currentGameID + ' started.');
	//check the result of the last game
	lastResult = engine.lastGamePlay();

	if(lastResult == 'LOST' || lastResult == 'NOT_PLAYED') {
		
		//if the result of the last game was 'LOST' or 'NOT_PLAYED', reset win streak back to 0.
		winStreak = 0;
		console.log('[Raibot] Last Result: ' + lastResult + ', Current Win Streak: ' + winStreak);
	} else {
		
		//if last game was won increase win streak by 1.
		winStreak++;
		console.log('[Raibot] Last Result: ' + lastResult + ', ' + 'Current Win Streak: ' + winStreak);
	}
	if(winStreak == streakToBreak) {

		//if win streak equals to 9, set takeBreak to true.
		console.log('[Raibot] ' + winStreak + ' reached, skipping this round.');
		takeBreak = true;
	}

	if(takeBreak == false) {

		//if the result of the last game was 'LOST', increase your last bet by 2.
		if(lastResult == 'LOST' && !firstGame) {
			currentBet = lastBet * 2;

		} else {

			//if last game was won, reset bet to base bet.
			currentBet = baseBet;
		}

		//set last result to 'LOST', value will be updated to 'WON' if the cashed out even occurs.
		firstGame = false;
		lastResult = 'LOST';

		console.log('[Raibot] Betting ' + currentBet + ' mXRB, cashing out at 2x');
		engine.placeBet(currentBet * 100, 200, false);
		lastBet = currentBet;
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


