var canvas;
var imgDataObstacles;

var isMouseDown = false;

var xEvent = 0;
var yEvent = 0;

var xStart = 0;
var yStart = 0;

var xFinish = 0;
var yFinish = 0;

var xPath = [];
var yPath = [];

var progress = 0;

function saveImage(){
	
	canvas = document.getElementById('obstaclesPath');
	var context = canvas.getContext('2d');
	context.putImageData(imgDataObstacles, 0, 0);
	var dataURL = canvas.toDataURL();
	
	var fileName = document.getElementById('savedImageName').value;
	fileName = fileName.split("/");
	fileName = fileName[fileName.length - 1];
	fileName = fileName.split(".")[0];
	
	$.ajax({
		type: "POST",
		url: "saveImage.php",
		data: {
			imgBase64: dataURL,
			imgFileName: fileName
		}
	}).done(function(o) {
		if (fileName != '') alert('saved ' + fileName + '.png');
		else alert('saved empty.png');
	});
}

function loadImage(){
	var img = new Image();
	var imgFileSelect = document.getElementById('obstacleImgFiles');
	img.src = 'obstacleImages/' + imgFileSelect.options[imgFileSelect.options.selectedIndex].text;
	canvas = document.getElementById('obstaclesPath');
	if (canvas.getContext){
		var context = canvas.getContext('2d');
		context.drawImage(img, 0, 0, canvas.width, canvas.height);
		imgDataObstacles = context.getImageData(0, 0, canvas.width, canvas.height);
	}
}

function initImageList(){
	$.ajax({
		url: "loadImageList.php",
		success: function(imgFiles){
			var imgFileList = imgFiles.split(" ");
			var imgFileSelect = document.getElementById('obstacleImgFiles');
			imgFileList.forEach(function(currentImage, index){
				var img = new Option(currentImage.replace("obstacleImages/", ""), index);
				imgFileSelect.options.add(img);
			});
		}
	});
}

function initObstaclesPath(){
	canvas = document.getElementById('obstaclesPath');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	if (canvas.getContext){
		var context = canvas.getContext('2d');
		context.fillStyle='black';
		context.fillRect(0, 0, canvas.width, canvas.height);
		imgDataObstacles = context.getImageData(0, 0, canvas.width, canvas.height);
	}
	
	isMouseDown = false;
	
	canvas.addEventListener('mousedown', function(e){startDrawing(e);}, false);
	canvas.addEventListener('mousemove', function(e){doDrawing(e);}, false);
	canvas.addEventListener('mouseup', function(e){finishDrawing(e);}, false);
	
	initImageList();
	document.getElementById('savedImageName').value = 'HHHNNNNGGG';
	document.getElementById('withDiagonale').checked = true;
}

function resizeObstaclesPath(){
	canvas = document.getElementById('obstaclesPath');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function setEventCoordinates(evt){
	
	canvas = document.getElementById('obstaclesPath');
	
	var left = canvas.getBoundingClientRect().left;
	var width = canvas.getBoundingClientRect().width;
	
	var top = canvas.getBoundingClientRect().top;
	var height = canvas.getBoundingClientRect().height;
	
	xEvent = Math.floor((evt.clientX - left) / width * canvas.width);
	yEvent = Math.floor((evt.clientY - top) / height * canvas.height);
}

function startDrawing(evt){
	var isDrawingMode = document.getElementById('drawObstacles').checked;
	var isErasingMode = document.getElementById('eraseObstacles').checked;
	if (isDrawingMode || isErasingMode){
		isMouseDown = true;
		canvas = document.getElementById('obstaclesPath');
		if (canvas.getContext){
			var context = canvas.getContext('2d');
			setEventCoordinates(evt);
			context.beginPath();
			context.moveTo(xEvent, yEvent);
		}
	}
}

function doDrawing(evt){
	var isDrawingMode = document.getElementById('drawObstacles').checked;
	var isErasingMode = document.getElementById('eraseObstacles').checked;
	if (isDrawingMode || isErasingMode && isMouseDown){
		canvas = document.getElementById('obstaclesPath');
		if (canvas.getContext){
			var context = canvas.getContext('2d');
			setEventCoordinates(evt);
			context.lineTo(xEvent, yEvent);
		}
	}
}

function finishDrawing(evt){
	var isDrawingMode = document.getElementById('drawObstacles').checked;
	var isErasingMode = document.getElementById('eraseObstacles').checked;
	if (isDrawingMode || isErasingMode){
		isMouseDown = false;
		canvas = document.getElementById('obstaclesPath');
		if (canvas.getContext){
			var context = canvas.getContext('2d');
			context.putImageData(imgDataObstacles, 0, 0);
			setEventCoordinates(evt);
			context.lineTo(xEvent, yEvent);
			context.closePath();
			context.lineWidth = 1;
			var color;
			var obstacleProbability = document.getElementById('obstacleProbability').value;
			obstacleProbability *= 2.55;
			obstacleProbability = Math.ceil(obstacleProbability);
			if (isDrawingMode) color = 'rgba(' + obstacleProbability + ',' + obstacleProbability + ',' + obstacleProbability + ', 1)';
			else if (isErasingMode) color = 'black';
			context.fillStyle = color;
			context.fill();
			context.strokeStyle = color;
			context.stroke();
			imgDataObstacles = context.getImageData(0, 0, canvas.width, canvas.height);
		}
	} else {
		setEventCoordinates(evt);
		if (document.getElementById('selectStart').checked){
			xStart = xEvent;
			yStart = yEvent;
			/*
			var gradient = context.createLinearGradient(0,0,context.width,0);
			gradient.addColorStop("0", "magenta");
			gradient.addColorStop("0.5", "blue");
			gradient.addColorStop("1.0", "red");
			context.fillStyle = gradient;
			context.font="20px Georgia";
			context.fillText("Start", xStart, yStart + 40);
			*/
		} else if (document.getElementById('selectFinish').checked) {
			xFinish = xEvent;
			yFinish = yEvent;
		}
	}
	repaintStartFinish();
}

function repaintStartFinish(){
		var context = canvas.getContext('2d');
		context.putImageData(imgDataObstacles, 0, 0);
		context.fillStyle = 'blue';
		context.fillRect(xStart - 5, yStart - 5, 10 , 10);
		context.fillStyle = 'yellow';
		context.fillRect(xFinish - 5, yFinish - 5, 10 , 10);
}

function process(){
	//setTimeout(planPath(), 0);
	progress = 0;
	//while (progress < 100) updateProgressBar();
	planPath();
	drawPath();
}

function updateProgressBar(){
	document.getElementById("progressLabel").innerHTML = progress + '%';
	var progressBar = document.getElementById("justBarOfProgress");
	progressBar.style.width = progress + '%';
}

function planPath(){
	
	canvas = document.getElementById('obstaclesPath');
	var rows = canvas.height;
	var cols = canvas.width;
	
	var neighbourIncrement;
	if (document.getElementById('withDiagonale').checked){
		neighbourIncrement = 1;
	} else {
		neighbourIncrement = 2;
	}
	
	var pathMap = [];
	var modifiedPathMap = [];
	
	// fill path map
	
	for (var i = 0; i < imgDataObstacles.data.length; i += 4){
		// if white (if obstacle)
		if ((imgDataObstacles.data[i] == imgDataObstacles.data[i + 1])
		&& (imgDataObstacles.data[i + 1] == imgDataObstacles.data[i + 2])){
			if (imgDataObstacles.data[i] > 250) {pathMap.push(-1); modifiedPathMap.push(1);}
			else {pathMap.push(imgDataObstacles.data[i] / 255); modifiedPathMap.push(0);}
		} else {
			pathMap.push(0);
			modifiedPathMap.push(0);
		}
	}
	
	modifiedPathMap[yFinish * cols + xFinish] = 2;
	
	// algorithm
	
	var changedNeighboursX = [xFinish];
	var changedNeighboursY = [yFinish];
	
	var tmpProgress = 1;
	var nrOfPixels = rows * cols;
	var diagDistance = Math.sqrt(2);
	// go through all relevant cells
	while ((changedNeighboursX.length > 0) && (changedNeighboursY.length > 0)){
		var currentX = changedNeighboursX.shift();
		var currentY = changedNeighboursY.shift();
		
		// look for all neighbours of changed neighbour
		for (var i = 0; i < 8; i += neighbourIncrement){
			var newX = currentX;
			var newY = currentY;
			
			if (((i >= 0) && (i <= 1)) || (i == 7)){
				newX++;
				if (newX >= cols) newX--;
			}
			if ((i >= 3) && (i <= 5)){
				newX--;
				if (newX < 0) newX = 0;
			}
			if ((i >= 1) && (i <= 3)){
				newY--;
				if (newY < 0) newY = 0;
			}
			if ((i >= 5) && (i <= 7)){
				newY++;
				if (newY >= rows) newY--;
			}
			
			// progress bar
			/*if ((pathMap[newY * cols + newX] == 0) || (pathMap[newY * cols + newX] == 1)){
				tmpProgress++;
				progress = Math.ceil(100 * tmpProgress / nrOfPixels);
				var progressLabel = document.getElementById("progressLabel");
				var progressBar = document.getElementById("justBarOfProgress");
				progressLabel.innerHTML = progress + '%';
				progressBar.style.width = progress + '%';
			}
			*/
			
			var cellIncrement = 1;
			// diagonal
			if ((i % 2) != 0){
				cellIncrement *= diagDistance;
			}
			
			// obstacle
			if ((pathMap[newY * cols + newX] == -1) || (modifiedPathMap[newY * cols + newX] == 1)) continue;
			
			// update neighbour cell if necessary
			if ((modifiedPathMap[newY * cols + newX] > (modifiedPathMap[currentY * cols + currentX] + cellIncrement + pathMap[newY * cols + newX]))
				|| (modifiedPathMap[newY * cols + newX] == 0)){
				
				modifiedPathMap[newY * cols + newX] = modifiedPathMap[currentY * cols + currentX] + cellIncrement + pathMap[newY * cols + newX];
				
				// add neighbour cell to list of relevant cells
				changedNeighboursX.push(newX);
				changedNeighboursY.push(newY);
			}
			
		} // look for all neighbours of changed neighbour
	} // go through all relevant cells
	
	progress = 100;
	var progressLabel = document.getElementById("progressLabel");
	var progressBar = document.getElementById("justBarOfProgress");
	progressLabel.innerHTML = progress + '%';
	progressBar.style.width = progress + '%';
	
	// fill path
	
	var pathPtX = xStart;
	var pathPtY = yStart;
	xPath = [];
	yPath = [];
	xPath.push(pathPtX);
	yPath.push(pathPtY);
	
	var minVal = modifiedPathMap[pathPtY * cols + pathPtX];
	// go through pathMap start--> finish
	while ((pathPtX != xFinish) || (pathPtY != yFinish)){
		
		var nextPtX;
		var nextPtY;
		
		// look for all neighbours of current path point to get the next path point
		for (var i = 0; i < 8; i += neighbourIncrement){
			var newX = pathPtX;
			var newY = pathPtY;
			
			if (((i >= 0) && (i <= 1)) || (i == 7)){
				newX++;
				if (newX >= cols) newX--;
			}
			if ((i >= 3) && (i <= 5)){
				newX--;
				if (newX < 0) newX = 0;
			}
			if ((i >= 1) && (i <= 3)){
				newY--;
				if (newY < 0) newY = 0;
			}
			if ((i >= 5) && (i <= 7)){
				newY++;
				if (newY >= rows) newY--;
			}
			
			// if cell value is lower than other neighbour's cell value then this cell is the next path point
			var tmpVal = modifiedPathMap[newY * cols + newX];
			if ((tmpVal <= minVal) && (pathMap[newY * cols + newX] != -1) && (modifiedPathMap[newY * cols + newX] != 1)){
				minVal = tmpVal;
				nextPtX = newX;
				nextPtY = newY;
			}
			
		} // look for all neighbours of path point to get the next path point
		
		// add the next path point to path
		xPath.push(nextPtX);
		yPath.push(nextPtY);
		if ((xPath.length > 9999) || (yPath.length > 9999)) break;
		pathPtX = nextPtX;
		pathPtY = nextPtY;
		
	} // go through pathMap start--> finish
	alert("Number of path points: " + xPath.length);
}

function drawPath(){
	canvas = document.getElementById('obstaclesPath');
	if (canvas.getContext){
		var context = canvas.getContext('2d');
		context.putImageData(imgDataObstacles, 0, 0);
		repaintStartFinish();
		context.fillStyle="green";
		for (var i = 0; i < xPath.length; i++){
			context.fillRect(xPath[i], yPath[i], 2, 2);
		}
	}
}
