function check(baseBet, multipler, tries) {

	let bankRoll = 0;
	let previousBet = baseBet;
	let currentBet = 0;
	
	bankRoll += baseBet;

	console.log('Bet #0' + ' ' + baseBet);

	for(var i = 1; i < tries; i++) {

		currentBet = previousBet * multipler;
		previousBet = currentBet;
		bankRoll += currentBet;

		console.log('Bet #' + i + ' ' + currentBet);

	}
	console.log('Bank Roll needed: ' + bankRoll);
}

function prob(chance, number) {

	let probab = 0;

	for(var i = 1; i < number + 1; i++) {

		probab = Math.pow(chance, i) * 100;

		console.log(i + ' Red: ' + probab + '%');

	};
};