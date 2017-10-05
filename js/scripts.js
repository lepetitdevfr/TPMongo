var lignes,lname,licon,ponctu,table,currentColor,graph,graphBar,load,menu,image;

var colors = {A:"#e1132b",B:"#4b90cd",C:"#ffe003",D:"#00ab67",E:"#d892bd",H:"#95564d",J:"#cacf3b",K:"#c6b205",L:"#7d84bd",N:"#02a88f",P:"#f0ae1c",R:"#e3b3d2",U:"#d5085c"};

document.addEventListener("DOMContentLoaded", function() {
	lname = document.getElementById('lname');
	licon = document.getElementById('licon');
	table = document.getElementById('stats');
	graph = document.getElementById('graph');
	menu = document.getElementById('menu');
	graphBar = document.getElementById('bars');
	load = document.getElementById('loadDB');
	image = document.getElementById('image');
	load.addEventListener("click",function () {
		loadDB();
	})
	init();
});

function init() {
	lignes = getAllLigne();
	if (lignes.length) {
		displayLignes(lignes);
		load.style.display = "none";
		menu.style.display = "block";
		image.style.display = "none";
	}else{
		load.style.display = "block";
		menu.style.display = "none";
	}
}

function displayLignes(lignes) {
	var rer = document.getElementById("rer");
	var ter = document.getElementById("ter");
	for (var i = 0; i < lignes.length; i++) {
		var icon = document.createElement("div");
		icon.id = lignes[i]._id.ligne;
		icon.className = lignes[i]._id.ligne;
		icon.innerText = lignes[i]._id.ligne;
		icon.addEventListener("click",function () {
			currentColor = colors[this.id];
			getLigne(this.id);
		})
		if (lignes[i]._id.type === "RER") {
			rer.appendChild(icon);
		}else{
			ter.appendChild(icon);
		}
	}
}

function displayInfo(data) {
	ponctu = 0;
	vhvr = 0;
	data.sort(function(a,b) { 
		return new Date(a.fields.date).getTime() - new Date(b.fields.date).getTime() 
	});
	lname.innerText = data[0].fields.nom_de_la_ligne;
	licon.innerText = data[0].fields.ligne;
	licon.className = data[0].fields.ligne;
	for (var i = 0; i < data.length; i++) {
		if (data[i].fields.ponctualite) {
			ponctu += data[i].fields.ponctualite;
		}
		if (data[i].fields.nombre_de_voyageurs_a_l_heure_pour_un_voyageur_en_retard) {
			vhvr += data[i].fields.nombre_de_voyageurs_a_l_heure_pour_un_voyageur_en_retard;
		}
	}
	ponctu = Math.round(ponctu/data.length);
	vhvr = vhvr/data.length;
	createPie();
	createGraph(data);
	console.log(vhvr, ponctu);
}


function createPie() {
	var canvas = document.createElement("canvas");
	canvas.id = "myPie";
	graph.innerHTML = "";
	graph.appendChild(canvas);
	var ctx = canvas.getContext('2d');

	Chart.defaults.global.defaultFontColor = 'black';
	Chart.defaults.global.defaultFontSize = 16;

	var data = {
		labels: ["% de train à l'heure","% de retard"],
		datasets: [
		{
			fill: true,
			backgroundColor: [
			currentColor,
			'black'],
			data: [ponctu, 100-ponctu],
			borderWidth: [2,2]
		}
		]
	};

	var options = {
		title: {
			display: true,
			text: 'Ponctualite sur la ligne',
			position: 'top'
		},
		responsive:false
	};


	var myBarChart = new Chart(ctx, {
		type: 'pie',
		data: data,
		options: options
	});
}

function createGraph(data) {
	var dates = [];
	var ponctua = [];
	for (var i = 0; i < data.length; i++) {
		if (data[i].fields.ponctualite) {
			dates.push(data[i].fields.date);
			ponctua.push(Math.round(data[i].fields.ponctualite.toString()));
		}
	}
	var canvas = document.createElement("canvas");
	canvas.id = "myBars";
	graphBar.innerHTML = "";
	graphBar.appendChild(canvas);
	var ctx = canvas.getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: dates,
			datasets: [{
				label: '% Ponctualite',
				data:ponctua,
				backgroundColor: hexToRgbA(currentColor)

			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						max: 100
					}
				}]
			}
				// responsive:false
			}
		});
}

function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.5)';
    }
    throw new Error('Bad Hex');
}
/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// API CALL /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

function getAll() {
	const req = new XMLHttpRequest();
	req.open('GET', 'http://localhost:8080/getAll', false);
	req.send(null);

	if (req.status === 200) {
		console.log(JSON.parse(req.responseText));
	} else {
		console.log("Status de la réponse: %d (%s)", req.status, req.statusText);
	}
}

function getAllLigne() {
	const req = new XMLHttpRequest();
	req.open('GET', 'http://localhost:8080/getAllLigne', false);
	req.send(null);

	if (req.status === 200) {
		console.log(JSON.parse(req.responseText));
		return JSON.parse(req.responseText);
	} else {
		console.log("Status de la réponse: %d (%s)", req.status, req.statusText);
	}
}

function getRer() {
	const req = new XMLHttpRequest();
	req.open('GET', 'http://localhost:8080/getRer', false);
	req.send(null);

	if (req.status === 200) {
		console.log(JSON.parse(req.responseText));
	} else {
		console.log("Status de la réponse: %d (%s)", req.status, req.statusText);
	}
}

function getTrans() {
	const req = new XMLHttpRequest();
	req.open('GET', 'http://localhost:8080/getTrans', false);
	req.send(null);

	if (req.status === 200) {
		console.log(JSON.parse(req.responseText));
	} else {
		console.log("Status de la réponse: %d (%s)", req.status, req.statusText);
	}
}

function getLigne(ligne) {
	const req = new XMLHttpRequest();
	req.open('GET', 'http://localhost:8080/getLigne?ligne='+ligne, false);
	req.send(null);

	if (req.status === 200) {
		console.log(JSON.parse(req.responseText));
		displayInfo(JSON.parse(req.responseText));
	} else {
		console.log("Status de la réponse: %d (%s)", req.status, req.statusText);
	}
}

function loadDB() {
		image.style.display = "block";

	const req = new XMLHttpRequest();
	req.open('GET', 'https://ressources.data.sncf.com/api/records/1.0/search/?dataset=ponctualite-mensuelle-transilien&rows=715&sort=date', false);
	req.send(null);

	if (req.status === 200) {
		console.log(JSON.parse(req.responseText));
		data = JSON.parse(req.responseText);
		writeDB(data.records);
	} else {
		console.log("Status de la réponse: %d (%s)", req.status, req.statusText);
	}
}

function writeDB(data) {
	const req = new XMLHttpRequest();
	req.open('POST', 'http://localhost:8080/writeDB', true);
	req.setRequestHeader("Content-type", "application/json");
	req.onreadystatechange = function() {
		if(req.readyState == 4 && req.status == 200) {
			console.log(req.responseText);
			init();
		}
	}
	req.send(JSON.stringify(data));
}