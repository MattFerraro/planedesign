function redraw() {
	let canvas = $("#mainCanvas")[0];
	let ctx = canvas.getContext("2d");
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,canvas.width,canvas.height);

	ctx.fillStyle = "#000000";

	ctx.fillRect(0,canvas.height / 2, canvas.width, 1);

	let nPoints = 100;
	let chord = 20;
	let m = $("#maxCamber").val() / 100; // 100m is the first digit of a NACA 4 digit
	let p = $("#maxCamberLoc").val() / 10;  // 10p is the second digit of a NACA 4 digit
	let t = $("#thickness").val() / 100; // 100t is the last 2 digits of a NACA 4 digit

	let topxs = [];
	let bottomxs = [];
	let camberxs = [];
	let topys = [];
	let bottomys = [];
	let camberys = [];

	// Generate the points
	for (let i = 0; i < nPoints; i++) {
		let x = 0.5 * (1 - Math.cos(i / nPoints * 3.14159)) * chord;
		let xOverC = x / chord;
		camberxs.push(x);

		let cambery;
		let theta;
		if (xOverC <= p) {
			cambery = m / (p * p) * (2 * p * xOverC - xOverC * xOverC) * chord;
			theta = Math.atan(2 * m / (p * p) * (p - xOverC));
		}
		else {
			cambery = m / ((1 - p) * (1 - p)) * ((1 - 2 * p) + 2 * p * xOverC - xOverC * xOverC) * chord;
			theta = Math.atan(2 * m / ((1 - p) * (1 - p)) * (p - xOverC));
		}
		camberys.push(cambery);

		let yt = chord * 5 * t * (.2969 * Math.sqrt(xOverC) - .1260 * xOverC - 0.3516 * Math.pow(xOverC, 2) + 0.2843 * Math.pow(xOverC, 3) - 0.1015 * Math.pow(xOverC, 4));

		topxs.push(x - yt * Math.sin(theta));
		bottomxs.push(x + yt * Math.sin(theta));

		let topY = cambery + yt * Math.cos(theta);
		let bottomY = cambery - yt * Math.cos(theta)
		topys.push(topY);
		bottomys.push(bottomY);
	}


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
