//Settings              
var MaxProfitMode = false;       
var PercentOfTotal = 0.29;        

//24 - 7 attempts, 97 - 6 attempts, 390 - 5 attempts

var BaseBet = 390;                
var Multiplier = 1.04;                                                               

// Don't change anything below this if you don't know what you are doing!
var Username = engine.getUsername();
var StartBalance = engine.getBalance();
var CurrentGameID = -1;
var FirstGame = true;
var CurrentBet = BaseBet;
var CurrentMultiplier = Multiplier;
var d = new Date();
var StartTime = d.getTime();
var LastResult = "WON";

// Check previous bet
var LastBet = 0;
var LastProfit = 0;
var NewProfit = 0;
// Recovery variable's
var SessionLost = 0;
var PreviousMultiplier = 0;
var lostStreak = 0;
var MaxRecovery = true;

// Welcome message
console.log('[BustaBot] Welcome ' + Username);
console.log('[BustaBot] Your start ballance is: ' + (StartBalance / 100).toFixed(2) + ' bits');

//check if the multiplier is 1 or higher.
if(Multiplier < 1){
    console.log('[BustaBot] Your multiplier must be 1.0 or higher.');
    engine.stop();
}

// Start of a game.
engine.on('game_starting', function(info) {
    CurrentGameID = info.game_id;
    console.log('---------------------');
    console.log('[BustaBot] Game #' + CurrentGameID + ' started.');
    
        if(MaxProfitMode == true){
            BaseBet = Math.round((PercentOfTotal / 100) * (engine.getBalance() / 100).toFixed(2));
        }
        
        if (LastResult == 'LOST' && !FirstGame) { // Check if you lost the last game
                
                lostStreak++;
                console.log('[BustaBot] Lost Previous Bet, Lost #' + lostStreak);

                SessionLost = SessionLost + CurrentBet;
                CurrentBet = LastBet * 4;
                CurrentMultiplier = (SessionLost + CurrentBet) / CurrentBet;
                CurrentMultiplier = Math.round(CurrentMultiplier * 100) / 100;

                if(MaxRecovery == false) {
                    if(PreviousMultiplier == 1.33) {
                        CurrentMultiplier = 1.25;
                    }
                } else {
                    if(CurrentMultiplier > 1.32) {
                        CurrentMultiplier = 1.33;
                    }
                }

                /*
                if(CurrentMultiplier > 1.32) {
                    CurrentMultiplier = 1.33;
                }
                */

                console.log('Betting at ' + CurrentMultiplier);
        }
        else { // If won last game or first game
            
            lostStreak = 0;

            SessionLost = 0;
            CurrentBet = BaseBet;
            CurrentMultiplier = Multiplier;
            
        }
        
        //check if current bet is 0 or negative
        if(CurrentBet < 1){
            CurrentBet = 1;
        }
        
        // First game is set to false.
        FirstGame = false;
        // Changing last result
        LastResult = "LOST";

            if (CurrentBet <= engine.getBalance()) { // Check if the balance is high enough to place the bet.
                console.log('[BustaBot] Betting ' + (CurrentBet) + ' bits, cashing out at ' + CurrentMultiplier + 'x');
                engine.placeBet(CurrentBet * 100, Math.round(CurrentMultiplier * 100), false);
                LastBet = CurrentBet;
                PreviousMultiplier = CurrentMultiplier;

                LastProfit = (CurrentBet * CurrentMultiplier) - CurrentBet;
            }
            else { // Not enough balance to place the bet.
                if (engine.getBalance() < 100) { // Stop the bot if balance is less then 100 bits.
                    console.error('[BustaBot] Your account balance is to low to place a bet.... BustaBot will close now.');
                    engine.stop();
                }
                else { // Changes basebet to 1 if balance is to low to make the current bet.
                    console.warn('[BustaBot] Your balance is to low to bet: ' + (CurrentBet / 100) + ' bits.');
                    BaseBet = 1;
                }
            }
        
});

engine.on('cashed_out', function(data) {
    if (data.username == engine.getUsername()) {
      console.log('[BustaBot] Successfully cashed out at ' + (data.stopped_at / 100) + 'x');
      LastResult = "WON";
    }
});


engine.on('game_crash', function(data) {
    var newdate = new Date();
    var timeplaying = ((newdate.getTime() - StartTime) / 1000) / 60;
});