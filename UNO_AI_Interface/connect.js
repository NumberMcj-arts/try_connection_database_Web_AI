var imgs_path = "ressources/";

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
            "play:blue:1", 
            "play:color_desire:desired_color:yellow", 
            "play:color_desire:desired_color:blue", 
            "play:color_desire:desired_color:green", 
            "play:color_desire:desired_color:red", 
            "play:red:2", 
            "take:cards:from_stack"
        ]
    }, 
    current_player: "harald", 
    card_on_top: "blue:2", 
    CurrentPlayerIndex: 3, 
    IsForwardPlayingDirection: false, 
    NecessaryValue: "2", 
    NrOfCardsTaking: 4, 
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

function readJSON(file) {
    var request = new XMLHttpRequest();
    request.open('GET', file, false);
    request.send(null);
    if (request.status == 200)
        return request.responseText;
};

function loadPlayers(){
	var players_div = document.getElementById("players");
	test.players_cards_in_hand.forEach(function(currentPlayer, index){
		var player_in_div = document.createElement("div");
		var player_name_div = document.createElement("output");
		player_name_div.value = currentPlayer.player_name;
		if (currentPlayer.player_name == test.current_player){
			player_in_div.style = "border: 2px solid";
		}
		player_in_div.id = "player" + index.toString() + "     ";
		player_in_div.appendChild(player_name_div);
		
		players_div.appendChild(player_in_div);
		
		player_in_div.appendChild(document.createElement("br"));
		for (var i = 0; i < currentPlayer.nr_cards_in_hand; i += 1){
			add_image(player_in_div.id, "card.png", "");
		}
		players_div.appendChild(document.createElement("br"));
	});
}

function loadGameState(){
	var gamestate_div = document.getElementById("gamestate");
	
	// card on top
	add_card("card_on_top", test.card_on_top);
	
	// playing direction
	var direct_img_name;
	if (test.IsForwardPlayingDirection){
		direct_img_name = "forward.png";
	}
	else{
		direct_img_name = "backward.png";
	}
	add_image("playingDirection", direct_img_name, "");
	gamestate_div.appendChild(document.createElement("br"));
	
	// nr of cards taking
	for (var i = 0; i < test.NrOfCardsTaking; i += 1){
		add_image("nrOfCardsTaking", "evil_card.png", "");
	}
	document.getElementById("nrOfCardsTaking").appendChild(document.createElement("br"));
}

function add_image(parent_element_id, img_name, img_color){
	var parent_element = document.getElementById(parent_element_id);
	var img_fname = imgs_path + img_name;
	var image = document.createElement("img");
	
	image.width = 100;
	image.height = 100;
	image.src = img_fname;
	
	if ((img_color == "yellow")
		|| (img_color == "blue")
		|| (img_color == "red")
		|| (img_color == "green"))
	{
		image.style = "border: 5px solid " + img_color + ";";
	}
	parent_element.appendChild(image);
}

function add_card(parent_element_id, card_name){
	var img_color = card_name.split(":")[0];
	var img_name;
	
	if ((img_color == "yellow")
		|| (img_color == "blue")
		|| (img_color == "red")
		|| (img_color == "green"))
	{
		img_name = "cards/" + card_name.split(":")[1] + ".png";
		}
	else{
		img_name = "cards/" + card_name.split(":")[0] + ".png";
		img_color = "";
	}
	
	add_image(parent_element_id, img_name, img_color);
}

function add_possibility(parent_element_id, possibility_name){
	
	var img_name;
	var img_color;
	
	var general_action = possibility_name.split(":")[0];
	
	if ((general_action == "play")
		|| (general_action == "take")){
		
		img_color = possibility_name.split(":")[1];
		
		if (general_action == "play"){
			if ((img_color == "yellow")
				|| (img_color == "blue")
				|| (img_color == "red")
				|| (img_color == "green"))
			{
				img_name = "cards/" + possibility_name.split(":")[2] + ".png";
				}
			else{
				img_name = "cards/" + possibility_name.split(":")[1] + ".png";
				img_color = possibility_name.split(":")[3];
			}
		} else  {
			img_name = "take_cards.png";
			img_color = "";
		}
		
		add_image(parent_element_id, img_name, img_color);
		
	} else {
		document.getElementById('error').value = "you can only play or take cards :'(";
	}
}

function test_loadImages(){
	add_image("images_test", "cards/5.png", "Bonze");
	add_image("images_test", "cards/8.png", "blue");
	add_image("images_test", "cards/9.png", "Viech");
	add_card("My_Actions", "red:9");
	add_card("images_test", "color_desire:nr:3");
	add_card("images_test", "blue:turn_around");
	add_possibility("My_Actions", "play:blue:1");
	add_possibility("My_Actions", "play:color_desire:desired_color:yellow");
	add_possibility("My_Actions", "take:cards:from_stack");
	add_possibility("My_Actions", "play:color_desire:desired_color:green");
	add_possibility("My_Actions", "play:take_4:desired_color:red");
	add_possibility("My_Actions", "play:red:2");
	add_possibility("My_Actions", "play:yellow:turn_around");
}

function loadMyCards(){
	test.curr_player_state.cards_on_hand.forEach(function(curr_card, index){
		add_card("My_Cards", curr_card);
	});
}

function loadMyPossibilities(){
	test.curr_player_state.possible_actions.forEach(function(curr_action, index){
		add_possibility("My_Actions", curr_action);
	});
}

function initState(){
	//test_loadImages();
	
	document.getElementById('error').value = ":)";
	
	loadPlayers();
	loadGameState();
	
	
	loadMyCards();
	loadMyPossibilities();
}

function update(){
	document.getElementById('info').value = "NOT SUPPORTED";
}

