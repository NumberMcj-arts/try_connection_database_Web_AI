var imgs_path = "../../../Web/ressources/";

var test = {
    curr_player_state: {
        cards_on_hand: [
            "blue:1", 
            "red:6", 
            "red:9", 
            "color_desire:nr:3", 
            "red:2", 
            "red:turn_around", 
            "yellow:3"
        ], 
        possible_actions: [
            "play:blue:1\n", 
            "play:color_desire:desired_color:yellow\n", 
            "play:color_desire:desired_color:blue\n", 
            "play:color_desire:desired_color:green\n", 
            "play:color_desire:desired_color:red\n", 
            "play:red:2\n", 
            "take:cards:from_stack\n"
        ]
    }, 
    current_player: "harald", 
    card_on_top: "blue:2", 
    CurrentPlayerIndex: 3, 
    IsForwardPlayingDirection: false, 
    NecessaryValue: "2", 
    NrOfCardsTaking: 0, 
    NecessaryColor: "blue", 
    players_cards_in_hand: [
        {
            nr_cards_in_hand: 5, 
            player_name: "arthur"
        }, 
        {
            nr_cards_in_hand: 6, 
            player_name: "hans"
        }, 
        {
            nr_cards_in_hand: 7, 
            player_name: "johannes"
        }, 
        {
            nr_cards_in_hand: 7, 
            player_name: "harald"
        }
    ]
};

//var players;
var img_idx = 0;
var card_idx = 0;

function readJSON(file) {
    var request = new XMLHttpRequest();
    request.open('GET', file, false);
    request.send(null);
    if (request.status == 200)
        return request.responseText;
};

function loadPlayers(){
	//players = [];
	var players_div = document.getElementById("players");
	test.players_cards_in_hand.forEach(function(currentPlayer, index){
		var player_in_div = document.createElement("output");
		if (currentPlayer.player_name == test.current_player){
			player_in_div.value = "->" + currentPlayer.player_name + ": " + currentPlayer.nr_cards_in_hand + "Cards";
		}
		else {
			player_in_div.value = currentPlayer.player_name + ": " + currentPlayer.nr_cards_in_hand + "Cards";
		}
		player_in_div.id = "player" + index.toString();
		//players.add(player_in_div);
		players_div.appendChild(player_in_div);
		players_div.appendChild(document.createElement("br"));
	});
}

function loadGameState(){
	var gamestate_div = document.getElementById("gamestate");
	
	// card on top
	var card_on_top_div = document.createElement("output");
	card_on_top_div.value = test.card_on_top;
	gamestate_div.appendChild(card_on_top_div);
	gamestate_div.appendChild(document.createElement("br"));
	
	// playing direction
	var play_direct_div = document.createElement("output");
	if (test.IsForwardPlayingDirection){
		play_direct_div.value = "->";
	}
	else{
		play_direct_div.value = "<-";
	}
	gamestate_div.appendChild(play_direct_div);
	gamestate_div.appendChild(document.createElement("br"));
	
	// nr of cards taking
	var nr_cards_taking_div = document.createElement("output");
	nr_cards_taking_div.value = "+" + test.NrOfCardsTaking.toString();
	gamestate_div.appendChild(nr_cards_taking_div);
	gamestate_div.appendChild(document.createElement("br"));
}

function add_image(parent_element_id, img_name){
	var parent_element = document.getElementById(parent_element_id);
	var img_fname = imgs_path + img_name;
	var image = document.createElement("img");
	
	image.src = img_fname;
	image.id = img_name + "_img_nr_" + img_idx.toString();
	img_idx += 1;
	//image.style = "background-color:red;";
	parent_element.appendChild(image);
}

function add_card(parent_element_id, card_name){
	var parent_element = document.getElementById(parent_element_id);
	
	var card_div = document.createElement("div");
	card_div.id = "card_div_" + card_idx.toString();
	card_idx += 1;
	
	var img_color = card_name.split(":")[0];
	var img_name;
	var description;
	var descr_div = document.createElement("output");
	
	if ((img_color == "yellow")
		|| (img_color == "blue")
		|| (img_color == "red")
		|| (img_color == "green"))
	{
		img_name = "cards/" + card_name.split(":")[1] + ".png";
		description = card_name.split(":")[0];
		}
	else{
		img_name = "cards/" + card_name.split(":")[0] + ".png";
		description = card_name.split(":")[2];
	}
	
	descr_div.value = description;
	
	add_image(card_div.id, img_name);
	card_div.appendChild(document.createElement("br"));
	card_div.appendChild(descr_div);
	card_div.appendChild(document.createElement("br"));
	
	parent_element.appendChild(card_div);
}

function loadImages(){
	add_image("images_test", "cards/5.png");
	add_image("images_test", "cards/8.png");
	add_card("images_test", "red:9");
	add_card("images_test", "color_desire:nr:3");
}

function initState(){
	//test = readJSON('sample.json');
	//test = parseJSON('sample.json');
	//document.getElementById('state').value = test;
	
	loadPlayers();
	loadGameState();
	
	loadImages();
}

function update(){
/*	var player = document.createElement("output");
	player.value = "Karsten\n";
	var players = document.getElementById("players");
	players.appendChild(player);
	players.appendChild(document.createElement("br"));*/
	document.getElementById('info').value = "NOT SUPPORTED";
}

