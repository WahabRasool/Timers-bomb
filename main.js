const $timeDisplay = document.querySelector(".time-display");
const $bomb = document.getElementById("bomb");
const $textBomb = document.getElementById("text-bomb");
const $waterKey = document.getElementById("water-key");
const $waterTrap = document.getElementById("water-trap");
const $waterTap = document.getElementById("water-tap");
const $water = document.getElementById("water");
const $deadMessage = document.getElementById("dead-message");
const $coldScreen = document.getElementById("cold-screen");
const $electric = document.getElementById("electric");
const $key = document.getElementById("key");
const $electricScreen = document.getElementById("electric-screen");
const $offBomb = document.getElementById("off-bomb");

let isFive = false;
const bombOff = "https://www.svgrepo.com/show/422654/bomb.svg";
const bombOn = "https://www.svgrepo.com/show/404859/bomb.svg";
const bombEx = "https://www.svgrepo.com/show/248283/explosion-bomb.svg";
const initialTime = 15; //Seconds
let time = initialTime;
let timeFinish = false;
let clics = 0;
let bombWidth = 100;
const endings = [0, 0, 0, 0, 0];
const message = {
	water: "Yes, the bomb is off... but you drowned",
	cold: "It's cold here",
	electric: "Electricity is not for playing",
	fast: "What are you waiting for?",
	win: "Amazing, your fantastic, bombastic."
};

const renderTime = () => {
	const minutes = Math.floor(time / 60);
	const seconds = minutes > 0 ? time - minutes * 60 : time;
	$timeDisplay.innerText = `${minutes < 10 ? "0" + minutes : minutes} : ${
		seconds < 10 ? "0" + seconds : seconds
	}`;
};
const startTimer = () => {
	const timer = setInterval(() => {
		time--;
		renderTime();
		if (timeFinish) clearInterval(timer);
		if (time <= 0) {
			endings[3] = 1;
			$bomb.src = bombEx;
			showDeadMessage("fast");
			clearInterval(timer);
		} else if (time <= 5) {
			document.body.style.background = "var(--danger-color)";
			$waterTap.style.background = "var(--danger-color)";
			$bomb.style.animation = "pulseBomb .2s ease-in-out infinite alternate";
		} else if (time <= 10) {
			document.body.style.background = "var(--regular-color)";
			$waterTap.style.background = "var(--regular-color)";
			$bomb.style.animation = "pulseBomb .5s ease-in-out infinite alternate";
		}
	}, 1000);
};
const resetTimer = () => {
	$bomb.classList.remove("noVisible");
	isFive = false;
	time = initialTime;
	timeFinish = false;
	renderTime();
	clics = 0;
	bombWidth = 100;
	$bomb.style.width = bombWidth + "px";
	$textBomb.classList.remove("noVisible");
	$timeDisplay.classList.add("noVisible");
	$waterTrap.classList.add("noVisible");
	$electric.classList.add("noVisible");
	$bomb.src = bombOff;
	$bomb.style.animation = "none";
	$deadMessage.style.display = "none";
	$water.style.transform = "translateY(100%)";
	$coldScreen.style.animation = "none";
	$coldScreen.classList.add("noVisible");
	$bomb.style.left = "50%";
	$electricScreen.classList.add("noVisible");
	document.body.style.background = "var(--normal-color)";
	$waterTap.style.background = "var(--normal-color)";
	$key.classList.remove("noVisible");
};
const fiveClics = () => {
	$timeDisplay.classList.remove("noVisible");
	$waterTrap.classList.remove("noVisible");
	$electric.classList.remove("noVisible");
	$bomb.src = bombOn;
	$bomb.style.animation = "pulseBomb 1s ease-in-out infinite alternate";
	startTimer();
	isFive = true;
};
const showDeadMessage = (cause) => {
	$bomb.style.animationPlayState = "paused";
	$deadMessage.style.display = "flex";
	$deadMessage.innerHTML = `
	<div>
		<img src='https://www.svgrepo.com/show/228667/dead-toxic.svg' width='60' />
		<span>${endings.reduce((total, current) => total + current, 0)}/5</span>
		<p>${message[cause]}</p>
	</div>
	<p>( Clic to try again )</p>
	`;
	if (cause == "win") {
		confetti();
		$deadMessage.innerHTML = `
	<div>
		<img src='https://www.svgrepo.com/show/492545/happy-1.svg' width='60' />
		<span>${endings.reduce((total, current) => total + current, 0)}/5</span>
		<p>${message[cause]}</p>
	</div>
	<p>( Good job )</p>
	`;
	}
};

renderTime();
$bomb.addEventListener("click", () => {
	clics++;

	if (clics < 5) {
		bombWidth = bombWidth + 25;
		$bomb.style.width = bombWidth + "px";
	} else if (clics == 5) {
		$textBomb.classList.add("noVisible");
		fiveClics();
	} else if (clics == 10) {
		$bomb.style.left = "65%";
	}
});
$bomb.addEventListener("contextmenu", function (event) {
	event.preventDefault();
	if (isFive) {
		$offBomb.classList.remove("noVisible");
	}
});
document.querySelector("#off-bomb>span").addEventListener("click", () => {
	endings[4] = 1;
	$offBomb.classList.add("noVisible");
	timeFinish = true;
	$bomb.classList.add("noVisible");
	$key.classList.add("noVisible");
	setTimeout(() => {
		showDeadMessage("win");
	}, 1500);
});
$deadMessage.addEventListener("click", resetTimer);
$waterKey.addEventListener("click", () => {
	endings[0] = 1;
	$water.style.transform = "translateY(0%)";
	timeFinish = true;
	setTimeout(() => {
		showDeadMessage("water");
	}, 4000);
});
$timeDisplay.addEventListener("click", () => {
	endings[1] = 1;
	timeFinish = true;
	$coldScreen.classList.remove("noVisible");
	$coldScreen.style.animation = "showCold 4s linear forwards";
	setTimeout(() => {
		showDeadMessage("cold");
	}, 4000);
});
$key.addEventListener("dragstart", (e) => {
	e.dataTransfer.setData("id", e.target.id);
});
$electric.addEventListener("drop", (e) => {
	if (e.dataTransfer.getData("id") == "key") {
		$electricScreen.style.opacity = "1";
		$electricScreen.classList.remove("noVisible");
		endings[2] = 1;
		timeFinish = true;
		setTimeout(() => {
			$electricScreen.style.opacity = "0";
			showDeadMessage("electric");
		}, 400);
	}
});
$electric.addEventListener("dragover", (e) => {
	e.preventDefault();
});
