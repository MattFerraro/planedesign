function redraw() {
	let nPoints = 100;
	let chord = 20;
	let m = $("#maxCamber").val() / 100; // 100m is the first digit of a NACA 4 digit
	let p = $("#maxCamberLoc").val() / 10;  // 10p is the second digit of a NACA 4 digit
	let t = $("#thickness").val() / 100; // 100t is the last 2 digits of a NACA 4 digit

	if (m*100 % 1 > .49 && m*100 % 1 < .51) {
		var mFormatted = Math.floor(m*100) + ".5";
	}
	else if (m*100 % 1 > .24 && m*100 % 1 < .26) {
		var mFormatted = Math.floor(m*100) + ".25";
	}
	else {
		var mFormatted = Math.floor(m*100) + "";
	}

	if (Math.round(t * 100) < 10) {
		var tFormatted = "0" + Math.round(t * 100);
	}
	else {
		var tFormatted = Math.round(t * 100);
	}
	$("#shape").html(mFormatted + "" + p * 10 + "" + tFormatted);

	let topxs = [];
	let bottomxs = [];
	let camberxs = [];
	let topys = [];
	let bottomys = [];
	let camberys = [];
	let camberSlopes = [];
	let thetas = [];

	// Generate the points
	for (let i = 0; i < nPoints; i++) {
		let bigTheta = i / nPoints * 3.14159;
		let x = 0.5 * (1 - Math.cos(bigTheta)) * chord;
		let xOverC = x / chord;
		camberxs.push(x);
		thetas.push(bigTheta);

		let cambery;
		let camberSlope;
		let theta;
		if (xOverC <= p) {
			cambery = m / (p * p) * (2 * p * xOverC - xOverC * xOverC) * chord;
			camberSlope = 2 * m / (p * p) * (p - xOverC);
			theta = Math.atan(camberSlope);
		}
		else {
			cambery = m / ((1 - p) * (1 - p)) * ((1 - 2 * p) + 2 * p * xOverC - xOverC * xOverC) * chord;
			camberSlope = 2 * m / ((1 - p) * (1 - p)) * (p - xOverC);
			theta = Math.atan(camberSlope);
		}
		camberys.push(cambery);
		camberSlopes.push(camberSlope);

		let yt = chord * 5 * t * (.2969 * Math.sqrt(xOverC) - .1260 * xOverC - 0.3516 * Math.pow(xOverC, 2) + 0.2843 * Math.pow(xOverC, 3) - 0.1015 * Math.pow(xOverC, 4));

		topxs.push(x - yt * Math.sin(theta));
		bottomxs.push(x + yt * Math.sin(theta));

		let topY = cambery + yt * Math.cos(theta);
		let bottomY = cambery - yt * Math.cos(theta)
		topys.push(topY);
		bottomys.push(bottomY);
	}

	drawProfile(chord, topxs, topys, bottomxs, bottomys, camberxs, camberys);

	drawCl(thetas, camberxs, camberSlopes);
}

function drawCl(thetas, camberxs, camberSlopes) {
	// we have a bunch of big thetas and the associated camberSlopes.
	// this is our version of f(theta)
	for (let alpha = -4; alpha<10; alpha += 0.5) {

	}

	let canvas = $("#clCanvas")[0];
	let ctx = canvas.getContext("2d");

	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,canvas.width,canvas.height);

	ctx.fillStyle = "#000000";
	ctx.fillRect(0,canvas.height / 2, canvas.width, 1);
	ctx.fillRect(canvas.width/2, 0, 1, canvas.height);
}

function drawProfile(chord, topxs, topys, bottomxs, bottomys, camberxs, camberys) {
	let nPoints = topxs.length;

	let canvas = $("#mainCanvas")[0];
	let ctx = canvas.getContext("2d");
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,canvas.width,canvas.height);

	ctx.fillStyle = "#000000";
	ctx.fillRect(0,canvas.height / 2, canvas.width, 1);

	// Draw the top curve
	ctx.strokeStyle="#0000FF";
	ctx.beginPath();
	for (let i = 0; i < nPoints; i++) {
		// units are cm
		let x = topxs[i];
		let y = topys[i];

		// units are pixels
		let graphicalX = x / chord * canvas.width;
		let graphicalY = (canvas.height / 2) - (y / chord) * canvas.width;

		if (i === 0) {
			ctx.moveTo(graphicalX, graphicalY);
		}
		else {
			ctx.lineTo(graphicalX, graphicalY);
		}
	}
	ctx.stroke();

	// Draw the bottom curve
	ctx.strokeStyle="#0000FF";
	ctx.beginPath();
	for (let i = 0; i < nPoints; i++) {
		// units are cm
		let x = bottomxs[i];
		let y = bottomys[i];

		// units are pixels
		let graphicalX = x / chord * canvas.width;
		let graphicalY = (canvas.height / 2) - (y / chord) * canvas.width;

		if (i === 0) {
			ctx.moveTo(graphicalX, graphicalY);
		}
		else {
			ctx.lineTo(graphicalX, graphicalY);
		}
	}
	ctx.stroke();


	// Draw the camber curve
	ctx.strokeStyle="#FF0000";
	ctx.beginPath();
	for (let i = 0; i < nPoints; i++) {
		// units are cm
		let x = camberxs[i];
		let y = camberys[i];

		// units are pixels
		let graphicalX = x / chord * canvas.width;
		let graphicalY = (canvas.height / 2) - (y / chord) * canvas.width;

		if (i === 0) {
			ctx.moveTo(graphicalX, graphicalY);
		}
		else {
			ctx.lineTo(graphicalX, graphicalY);
		}
	}
	ctx.stroke();
}
