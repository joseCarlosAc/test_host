// cSpell:disable
function readUsers(con_auth) {
	let url = "https://elegant-sari-wasp.cyclic.app/users";
	// let url = "http://localhost:4000/users"
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	if (con_auth) {
		xhr.setRequestHeader("x-auth", "PASS123");
	}
	xhr.send();
	xhr.onload = function () {
		if (xhr.status != 200) {
			alert(xhr.status + ": " + xhr.statusText);
		} else {
			console.log("Usuarios:");
			console.table(JSON.parse(xhr.response));
			alert("Usuarios leídos!");
		}
	};
}

function testMobile() {
	window.addEventListener(
		"touchstart",
		(e) => {
			console.log(e.touches[0]);
			xTouch = e.touches[0].clientX;
			yTouch = e.touches[0].clientY;
		},
		{ once: true }
	);
	window.addEventListener(
		"touchmove",
		(e) => {
			console.log(e.changedTouches[0]);
			let xMove = e.changedTouches[0].clientX;
			let yMove = e.changedTouches[0].clientY;

			console.log(xMove + ", " + xTouch);
			console.log(yMove + ", " + yTouch);
			wait();
		},
		{ once: true }
	);
}

function wait() {
	console.log("esperando");
	setTimeout(function timeout() {
		console.log("fin espera");
		testMobile();
	}, 3000);
}

wait();
