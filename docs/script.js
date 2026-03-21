const SITE_STATE = Object.freeze({
    STARTING_SCREEN: 'starting-screen',
    DIFFICULTY: 'difficulty',
    GAME: 'game',
    LEADERBOARD: 'leaderboard'
});

const DIFFICULTY_STATE = Object.freeze({
	LEARNING: 'learning',
	CLASSIC: 'classic',
	HARD: 'hard',
	DONT_PLAY_THIS: 'dont-play-this'
});

const GAME_STATE = Object.freeze({
	NONE: 'none',
    START: 'start',
    GUESSING: 'guessing',
    ANSWER: 'answer',
    END: 'end'
});

const public_formatted_person = {
	name: "default",
	party: "default",
	image_url: "url"
};

const public_person_list = {
	people: [],
	amount: 0,
	parties: []
}

const game_data = {
	points: 0,
	powers: {
		power_5050: 0,
		power_post_jobs: 0,
		power_post_fellow_politicians: 0,
		power_post_region: 0
	},
	correct: 0,
	incorrect: 0,
	corr_incorr_per_party: {}
}

const party_data = {

}

var debug = 0;
let curr_person = 0;
let active_party = '';
let points = 0;
let currentSiteState = SITE_STATE.STARTING_SCREEN;
let currentGameState = GAME_STATE.NONE;

document.getElementById('API').addEventListener('click', async () => {
	try {
		const response = await fetch('https://data.riksdagen.se/personlista/?iid=&fnamn=&enamn=&f_ar=&kn=&parti=&valkrets=&rdlstatus=&org=&utformat=json&sort=parti&sortorder=asc&termlista=');
		if (!response.ok) {
			throw new Error(`HTTP Error. Status: ${response.status}`);
		}

		const data = await response.json();
		console.log(data);
		var people = data?.personlista?.person ?? [];
		public_person_list.amount = people.length;
		public_person_list.people = people.sort(() => 0.5 - Math.random());
		console.log(people);
		console.log(public_person_list)
		//renderPeople(people)
		renderPerson()

	} catch (error) {
		console.error('Error fetching data:', error);
	}
});

document.getElementById('next').addEventListener('click', async () => {
	try {
		renderPerson();

	} catch (error) {
		console.error('Error clicking \'next\' button:', error);
	}
});

document.getElementById('parties').addEventListener('click', (event) => {
	try {
		const button = event.target.closest('.party-button');
		if (!button) return;
		
		active_party = button.dataset.party ?? '';
		if (active_party == ''){
			document.getElementById('curr-party').textContent = 'Guess: -';
		} else {
			document.getElementById('curr-party').textContent = `Guess: ${active_party}`;
		}
			
		if (active_party == curr_person.parti){
			points += 1;
			showCorrectness(true);
		} else {
			showCorrectness(false);
		}
		renderPerson();

	} catch (error) {
		console.error('Error in \'parties buttons\':', error);
	}
});

function renderPeople(person_data_list){
	const container = document.getElementById('people');
	container.innerHTML = '';

	person_data_list.slice(0, person_list.amount).forEach(person => {
		const name = `${person.tilltalsnamn ?? ''} ${person.efternamn ?? ''}`.trim();
		const party = person.parti ?? '-';
		const imageUrl = person.bild_url_192 ?? '';

		const card = document.createElement('div');
		card.innerHTML = `
			${imageUrl ? `<img src="${imageUrl}" alt="${name}">` : ''}
			<h3>${name}</h3>
			<p>Party: ${party}</p>
			<hr>
		`;
		container.appendChild(card);
	});
}

function renderPerson(){
	const container = document.getElementById('people');
	container.innerHTML = '';
	curr_person = public_person_list.people.pop();
	const name = `${curr_person.tilltalsnamn ?? ''} ${curr_person.efternamn ?? ''}`.trim();
	const party = curr_person.parti ?? '-';
	const imageUrl = curr_person.bild_url_192 ?? '';
	const card = document.createElement('div');
	if (debug){
		card.innerHTML = `
			${imageUrl ? `<img src="${imageUrl}" alt="${name}">` : ''}
			<h3>${name}</h3>
			<p>Party: ${party}</p>
			<hr>
		`;
	} else {
		card.innerHTML = `
			${imageUrl ? `<img src="${imageUrl}" alt="${name}">` : ''}
			<h3>${name}</h3>
			<hr>
		`;
	}
	container.appendChild(card);
	
}

function showCorrectness(isCorrect, ms = 800) {
	const correctEl = document.getElementById('correct');
	const incorrectEl = document.getElementById('incorrect');
	document.getElementById('points').textContent = `Points: ${points}`;

	correctEl.hidden = !isCorrect;
	incorrectEl.hidden = isCorrect;

	setTimeout(() => {
		correctEl.hidden = true;
		incorrectEl.hidden = true;
	}, ms);
}


function handlePersonData(person_data_list){

}