//variables
var baseBet = 12;

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
	lastResult = engine.lastGamePlay();

	if(lastResult == 'LOST' || lastResult == 'NOT_PLAYED') {
		winStreak = 0;
		console.log('[Raibot] Current Win Streak: 0');
	} else {
		winStreak++;
		console.log('[Raibot Current Win Streak: ' + winStreak);
	}
	if(winStreak == 9) {
		console.log('[Raibot] Skipping this round.');
		takeBreak = true;
	}

	if(takeBreak == false) {

		if(lastResult == 'LOST' && !firstGame) {
			currentBet = lastBet * 2;

		} else {
			currentBet = baseBet;
		}

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


