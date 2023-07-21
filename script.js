function Squares (position, number, inserted) {
    this.position = position; // Position that the element will have in the table
    this.number = number; //
    this.inserted = inserted;
    this.id = Game.number_moves;
    this.changed = false;

    this.insert = function (number) {
        this.number = number; // Refers to the number that each box will have as an identifier
        this.id = Game.number_moves;
        let element = document.getElementById(this.position.toString());
        let table = document.getElementById("main-table");
        let div = document.createElement("div");
        let text = document.createTextNode(this.number.toString());
        div.appendChild(text);
        div.id = "A"+Game.number_moves.toString();
        div.style.width = "125px";
        div.style.height = "125px";
        div.style.borderRadius = "20px";
        div.style.backgroundColor = "goldenRod"
        div.style.position = "absolute";
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.justifyContent = "center";
        div.style.fontWeight = "bold";
        div.style.color = "white";
        div.style.top = (element.offsetTop+9).toString()+"px";
        div.style.left = (element.offsetLeft+8).toString()+"px";
        document.body.appendChild(div);

        if (Game.DEBUG)
            console.log("TEST this.position: ", this.position, "this.number", this.number)
        if (this.inserted != true)
            this.inserted = true;
    }

    this.move_transition = function (x,y, to_left) {
        if(Game.DEBUG)
            console.log(`Moving element A${this.id}`);
        div = document.getElementById("A"+this.id.toString());
        if (to_left) {
            if (Game.DEBUG)
                console.log("moving to left/right");
            div.style.transition = `left ${Math.floor(Game.time/1000)}s`;
            div.style.left = x.toString()+"px";
        } 
        else {
            if (Game.DEBUG)
                console.log("moving to top/bottom");
            div.style.transition = `top ${Math.floor(Game.time/1000)}s`;
            div.style.top = y.toString()+"px";
        }
    }
    
    this.remove_position_GUI = function() {
            let element = document.getElementById("A"+this.id.toString());
            document.body.removeChild(element);
    }

    this.remove_position_CLI = function() {
        if(this.inserted) {
            this.inserted = false;
            this.number = 0;
        }
    }

    this.change_number_GUI = function(number) {
        //this.number = number;
        let element = document.getElementById("A"+this.id.toString());
        element.innerHTML = number.toString();
        if (Game.DEBUG)
            console.log(`Element: ${element}, Changing the square number and color...\nnumber:  ${number}, Game.square_color[number]:  ${Game.square_color[number]}`);
        if (number <= Game.NUMBER_COLOR_LIMIT)
            element.style.backgroundColor = Game.square_color[number];
    }

    this.change_number_CLI = function(number) {
        this.number = number;
    }
}

const Game = {
    DEBUG : false, // Here we will define a debug variable to help in the process of correcting the code.
    ELEMENTS_NUMBER : 16,
    WIDTH: 4,
    HEIGHT : 4,
    NUMBER_COLOR_LIMIT : 4096,
    square_array : Array(),
    occupied : 0,
    time: 1000,
    number_to_remove : new Set,
    number_to_change : new Set,
    square_color : {2: "goldenrod", 4 : "orange", 8: "Chocolate", 16: "red", 32 : "YellowGreen", 64 : "Green", 128 : "MediumSeaGreen", 256 : "Teal", 512 : "Aqua", 1024 : "Cyan", 2048 : "white", 4096 : "Violet"},
    number_moves : 0,
    allow_key_press : true,
    programmed_start : false,
    count : 0,
    continue_game : true,
    interval_programmed : false,
    first_time : true,
    points : 0,

    prepare : function () {
        if(!Game.programmed_start) {
            document.body.onkeypress = Game.execute;
        }
        else
            Game.interval_programmed = setInterval(Game.execute, Game.time);

        if (Game.first_time) {
            for (let i = 0; i < Game.ELEMENTS_NUMBER; i++) {
                Game.square_array.push(new Squares(i,0,false));
            }
        }
            

        Game.insert_square();

        if(Game.first_time)
            Game.first_time = false;
    }, //end of Game.prepare

    execute : function () {
        if (Game.allow_key_press && Game.continue_game) {

            if (Game.DEBUG) {
                console.log("before (Game.square_array): ")
                let count = 0;
                for(let i in Game.square_array) {
                    for(let j in Game.square_array[i]) {
                        if(typeof(Game.square_array[i][j]) != 'function')
                        console.log(`Game.square_array[${count}].${j} = ${Game.square_array[i][j]}`);
                    }
                    count++;
                }
            }

            let move_occured = false;

            if ((!Game.programmed_start && (event.keyCode == '119' || event.keyCode == '38' || event.keyCode == "87")) || (Game.programmed_start && Game.count == 0)) {
                move_occured = Game.key_pressed_pattern(true, true, false, true, false, 4, Game.ELEMENTS_NUMBER, ">=", function(i){return 0});
                //bool_is_less_than, bool_is_for_increment, bool_is_incrementing, bool_of_four, bool_moving_to_left, int_i_value, int_operand_comparison, while_signal, function_limit
            } else 
            if ((!Game.programmed_start && (event.keyCode == '97' || event.keyCode == '65' || event.keyCode == '37')) || (Game.programmed_start && Game.count == 1)) {
                move_occured = Game.key_pressed_pattern(true, true, false, false, true, 0, Game.ELEMENTS_NUMBER, ">=", function(i){return Game.WIDTH * (Math.floor(i/Game.WIDTH))});
                //bool_is_less_than, bool_is_for_increment, bool_is_incrementing, bool_of_four, bool_moving_to_left, int_i_value, int_operand_comparison, while_signal, function_limit
            } else 
            if ((!Game.programmed_start && (event.keyCode == '115' || event.keyCode == '40' || event.keyCode == '83')) || (Game.programmed_start && Game.count == 2)) {
                move_occured = Game.key_pressed_pattern(false, false, true, true, false, Game.ELEMENTS_NUMBER -5, 0, "<=", function(i){return Game.ELEMENTS_NUMBER -1});
                //bool_is_less_than, bool_is_for_increment, bool_is_incrementing, bool_of_four, bool_moving_to_left, int_i_value, int_operand_comparison, while_signal, function_limit
            } else 
            if ((!Game.programmed_start && (event.keyCode == '100' || event.keyCode == '68' || event.keyCode == '39')) || (Game.programmed_start && Game.count == 3)) {
                move_occured = Game.key_pressed_pattern(false, false, true, false, true, Game.ELEMENTS_NUMBER -1, 0, "<", function(i){return Game.WIDTH * (Math.floor(i/Game.WIDTH)+1)});
                //bool_is_less_than, bool_is_for_increment, bool_is_incrementing, bool_of_four, bool_moving_to_left, int_i_value, int_operand_comparison, while_signal, function_limit
            }

            if(Game.programmed_start) {
                Game.count++;
                if (Game.count > 3)
                    Game.count = 0;
            }
                
            if (move_occured) {
                if (Game.DEBUG)
                    console.log("Before setTimeout");

                setTimeout(Game.insert_square,Game.time);
                move_occured = false;
                Game.number_moves++;
                
                if (Game.DEBUG)
                    console.log(`After setTimeout\nNumber of moves: ${Game.number_moves}`);
            }

            if (Game.DEBUG) {
                let count = 0;
                console.log("after (Game.square_array): ");
                for(let i in Game.square_array) {
                    for(let j in Game.square_array[i]) {
                        if(typeof(Game.square_array[i][j]) != 'function')
                        console.log(`Game.square_array[${count}].${j} = ${Game.square_array[i][j]}`);
                    }
                    count++;
                }
            }

            if (Game.DEBUG)
                console.log("/////");

            Game.wait_keyboard_response_time();
            // Game.continue_game = Game.check_possibility_of_moves ();
            // if (!Game.continue_game)
            //     Control.game_over();
        }
    }, // End of document.body.keypress

    key_pressed_pattern : function (bool_is_less_than, bool_is_for_increment, bool_is_incrementing, bool_of_four, bool_moving_to_left, int_i_value, int_operand_comparison, while_signal, function_limit) {

        let move_occured = false;
        if(Game.DEBUG) {
            console.log(`TEST bool_is_less_than: ${bool_is_less_than}, bool_is_for_increment: ${bool_is_for_increment}, bool_is_incrementing: ${bool_is_incrementing}, bool_of_four: ${bool_of_four}, bool_moving_to_left: ${bool_moving_to_left}, int_i_value: ${int_i_value}, int_operand_comparison: ${int_operand_comparison}, while_signal: ${while_signal}`);
            console.log(`TEST for (let i = ${int_i_value}; ${(bool_is_less_than? 0 < int_operand_comparison : 0 >= int_operand_comparison)}; (bool_is_for_increment? i++ : i--))`)
        }
        for (let i = int_i_value; (bool_is_less_than? i < int_operand_comparison : i >= int_operand_comparison); (bool_is_for_increment? i++ : i--)) {
            if (Game.DEBUG) console.log(`TEST i: ${i}\nGame.square_array[i].inserted: ${Game.square_array[i].inserted}`);

            if (Game.square_array[i].inserted) {
                let table_position = Game.square_array[i].position; // We take a position of a table cell
                if (Game.DEBUG) console.log ("TEST Game.square_array[i].inserted ENTERED\ntable_position: ", table_position);
                // We want to check each element to determine whether or not to bring up
                // If an element is 10, elements 9 and 8 must be analyzed
                table_position = table_position + ((bool_is_incrementing? (bool_of_four? 4 : 1) : (bool_of_four? -4 : -1))); // We point the address of the cells at the right of the table
                let square_position = -1;
                if(Game.DEBUG) console.log(`TEST while (table_position ${while_signal} function_limit(i))? while (${table_position} ${while_signal} ${function_limit(i)}): ${(while_signal == "<"? table_position < function_limit(i) : ( while_signal == ">"? table_position > function_limit(i) : (while_signal == "<=" ? table_position <= function_limit(i) : table_position >= function_limit(i))))}`)
                while((while_signal == "<"? table_position < function_limit(i) : ( while_signal == ">"? table_position > function_limit(i) : (while_signal == "<=" ? table_position <= function_limit(i) : table_position >= function_limit(i))))) { // We move through the cells of the table in a right direction
                    //let real_position = Game.search_for_position(table_position);
                    if (Game.DEBUG) console.log(`TEST1 while(${table_position} ${while_signal} ${function_limit(i)}) ENTERED\ntable_position: `, table_position, "square_position: ", square_position);
                    
                    if (!Game.square_array[table_position].inserted) { // If the cell contains no values, the cell will be a candidate for use
                        if (Game.DEBUG) console.log("TEST !Game.square_array[table_position].inserted ENTERED");
                        square_position = table_position;
                        if (!move_occured) move_occured = true;
                    } else {
                        if (Game.DEBUG) console.log("TEST Game.square_array[table_position].inserted ENTERED");
                        if (Game.square_array[table_position].number == Game.square_array[i].number && !Game.square_array[table_position].changed) {
                            
                            if(Game.DEBUG) console.log("TEST Game.square_array[table_position].number == Game.square_array[i].number ENTERED");
                            
                            square_position = table_position;

                            // Changing number square
                            Game.square_array[table_position].change_number_CLI(Game.square_array[table_position].number * 2);
                            Game.square_array[table_position].changed = true;
                            Game.number_to_change.add(Game.square_array[table_position].id);
                            setTimeout(Game.change_number_delay_GUI, Game.time);
                            if (Game.DEBUG) console.log("TEST Game.number_to_change: ", Game.number_to_change);

                            //Moving square element
                            let X = Game.X_axis_movement(square_position);
                            let Y = Game.Y_axis_movement(square_position);
                            Game.square_array[i].move_transition(X, Y, (bool_moving_to_left? true : false));
                            if (Game.DEBUG) console.log("TEST i: ", i, "square_position: ", square_position, "X: " ,X, "Y: ", Y);
                            
                            // Removing square
                            Game.remove_square_CLI(i);
                            Game.number_to_remove.add(Game.square_array[i].id);
                            setTimeout(Game.remove_square_delay_GUI,Game.time); 
                            if (Game.DEBUG) console.log("TEST Game.number_to_remove: ", Game.number_to_remove);

                            square_position = -1;
                            if (!move_occured)
                                move_occured = true;
                            //Game.exchange_data(i, square_position);
                            Control.increment_score();  
                        }
                        break;
                    }
                    table_position = table_position + ((bool_is_incrementing? (bool_of_four? 4 : 1) : (bool_of_four? -4 : -1)));
                    if (Game.DEBUG)
                        console.log("TEST1 after table_position: ", table_position, "square_position: ", square_position);
                }

                if(Game.DEBUG)
                    console.log("TEST2 table_position: ", table_position, "square_position: ", square_position);
                
                if (square_position != -1) {
                    //Game.square_array[square_position].insert(Game.square_array[i].number);
                    //Game.square_array[i].remove_position();
                    let X = Game.X_axis_movement(square_position);
                    let Y = Game.Y_axis_movement(square_position);
                    if (Game.DEBUG)
                        console.log("TEST i: ", i, "square_position: ", square_position, "X: " ,X, "Y: ", Y);
                    Game.square_array[i].move_transition(X, Y, (bool_moving_to_left? true : false));
                    Game.exchange_data(i, square_position);
                }
            }
        }

        Game.reset_changed_attribute();

        return move_occured;
    },

    insert_square : function () {
            if (Game.DEBUG)
            console.log("Game.occupied: ", Game.occupied)
        let count = 0;
        let inserted = false;
        if (Game.occupied < Game.ELEMENTS_NUMBER) {
            let number = parseInt(Game.ELEMENTS_NUMBER*Math.random()); // We will randomly choose an empty square to fill it with a number
            while(!inserted) {
                // Now we want to insert into a square the number
                if (!Game.square_array[number].inserted) {
                    Game.square_array[number].insert(2);
                    inserted = true;
                    if (Game.DEBUG)
                        console.log("TEST inserting new element: ", number);
                } else
                number = parseInt(Game.ELEMENTS_NUMBER*Math.random());
                count++;
                if (count > Game.ELEMENTS_NUMBER * 2) {
                    break;
                }
            }

            if (!inserted) { // If the element has not been previously inserted within a period of time, we will insert it manually using a for
                for(let i = 0; i < Game.ELEMENTS_NUMBER; i++) {
                    if (!Game.square_array[i].inserted) {
                        Game.square_array[i].insert(2);
                        inserted = true;
                    }
                }
                if (Game.DEBUG) {
                    console.log("TEST Is not inserted, tried again...");
                }
            }

            if (inserted) {
                Game.occupied+= 1;
                if (Game.DEBUG)
                    console.log("TEST incrementing Game.occupied: ", Game.occupied);
            }
                
        }

        Game.continue_game = Game.check_possibility_of_moves ();
        if (!Game.continue_game)
            Control.game_over();
    },

    remove_square_GUI : function (number) {
            //Game.square_array[number].remove_position_GUI();
            let element = document.getElementById("A"+number.toString());
            //if (element != null)
            if (Game.DEBUG)
                console.log(`Removing element A${number}`);
            document.body.removeChild(element);
        },

    remove_square_CLI : function (number) {
        if (Game.occupied > 0 && Game.square_array[number].inserted) {
            Game.square_array[number].remove_position_CLI();
            Game.occupied--;
            if (Game.DEBUG)
                console.log("TEST decrementing Game.occupied: ", Game.occupied, "removing square (number): ", number);
        }
    },

    remove_square_delay_GUI : function () {
        for (let n of Game.number_to_remove) {
            if(Game.DEBUG)
                console.log(`Removing square with number ${n}`);
            Game.remove_square_GUI(n);
        }
        Game.number_to_remove = new Set();
    },

    exchange_data : function (i, square_position) {
        if (Game.DEBUG)
            console.log(`Exchanging data between square ${i} and ${square_position}`)

        Game.square_array[square_position].number = Game.square_array[i].number;
        Game.square_array[square_position].id = Game.square_array[i].id
        Game.square_array[i].id = -1;
        Game.square_array[i].inserted = false;
        if (!Game.square_array[square_position].inserted)
            Game.square_array[square_position].inserted = true;

        //let div = document.getElementById("A"+i.toString());
        //if (document.getElementById("A"+square_position.toString()) != null) {
        //    if(Game.DEBUG) console.log(`WARNING: element A${square_position} is being deleted!`);
        //    document.body.removeChild("A"+square_position.toString());
        //}
        //div.id = "A"+square_position.toString(); // Colocando a div com número i como quadrado square_position
            
    },

    change_number_delay_GUI : function () {
        for (let n of Game.number_to_change) {
            //Game.square_array[n].change_number_GUI(Game.square_array[n].number);
            let element = document.getElementById(`A${n}`);
            let number = parseInt(element.innerHTML) * 2;
            if (Game.DEBUG)
                console.log(`Changing number of square ${n} with number ${Math.floor(number/2)} to ${number}`);
            element.innerHTML = number.toString();
            if (Game.DEBUG)
                console.log(`Element: ${element}, Changing the square number and color...\nnumber:  ${number}, Game.square_color[number]:  ${Game.square_color[number]}`);
            if (number <= Game.NUMBER_COLOR_LIMIT)
                element.style.backgroundColor = Game.square_color[number];
        }
        Game.number_to_change = new Set();
    },

    reset_changed_attribute : function () {
        for (let i = 0; i < Game.ELEMENTS_NUMBER; i++) {
            Game.square_array[i].changed = false;
        }
    },

    wait_keyboard_response_time : function() {
        Game.allow_key_press = false; // The keyboard will not be able to function after a certain time.
        setTimeout(Game.enable_keyboard_response, Game.time);
    },

    enable_keyboard_response : function() {
        Game.allow_key_press = true;
    },

    X_axis_movement : function(square_position) {
        return 125*(square_position-4*Math.floor(square_position/4))+9;
    },

    Y_axis_movement : function(square_position) {
        return 125*(Math.floor(square_position / 4)) +9;
    },

    check_possibility_of_moves : function () { // Here we will analyze if there are possibilities of moves for the user. For this, one must know if there is any piece that has a value equal to its neighbor.
        let there_is_possibility = false;
        if (Game.occupied == Game.ELEMENTS_NUMBER) {
            for(let i = 0; i < Game.ELEMENTS_NUMBER; i++) {
                if (Game.square_array[i].inserted) {
                    if (Game.square_array[i].position > 4*Math.floor(Game.square_array[i].position/4)) { // checking left equality
                        if (Game.square_array[i -1].inserted) {
                            if(Game.square_array[i].number == Game.square_array[i -1].number) {
                                if (!there_is_possibility)
                                    there_is_possibility = true;
                            }
                        }
                    }

                    if (Game.square_array[i].position < 4*Math.floor(Game.square_array[i].position/4 +1)-1) { // checking right equality
                        if (Game.square_array[i +1].inserted) {
                            if(Game.square_array[i].number == Game.square_array[i +1].number) {
                                if (!there_is_possibility)  
                                    there_is_possibility = true;
                            }
                        }
                    }

                    if (Math.floor(Game.square_array[i].position > Game.square_array[i].position % 4)) { // checking equality above
                        if (Game.square_array[i -4].inserted) {
                            if(Game.square_array[i].number == Game.square_array[i -4].number) {
                                if (!there_is_possibility)
                                    there_is_possibility = true;
                            }
                        }
                    }

                    if(Math.floor(Game.square_array[i].position < Game.square_array[i].position % 4 +12)) { // checking equality below
                        if (Game.square_array[i +4].inserted) {
                            if(Game.square_array[i].number == Game.square_array[i +4].number) {
                                if (!there_is_possibility)
                                    there_is_possibility = true;
                            }
                        }
                    }

                }
            }
        } else
            there_is_possibility = true;
        
        return there_is_possibility;
    }
}

const Control = {

    music_on : true,
    time_panel : 1000,
    score : 100,

    run : function() { // main function of this object
        Control.initialization();
        //Control.game_over();
    },

    initialization : function() {
        //Panel
        let panel = document.getElementById("panel");
        if (panel != null) {
            setTimeout(Control.appear_panel,Control.time_panel);
            panel.style.opacity = "1";
        }
        else {
            panel = document.createElement("div");
            panel.id = "panel";
            panel.innerHTML = "";
            panel.style.width = "450px";
            panel.style.height = "200px";
            panel.style.backgroundColor="lightGray";
            panel.style.backgroundClip = "content-box";
            panel.style.border = "20px solid rgba(171,171,171,0.5)";
            panel.style.position = "absolute";
            panel.style.left = "13px";
            panel.style.top = "200px";
            panel.style.display = "flex";
            panel.style.flexDirection = "column";
            panel.style.justifyContent = "space-evenly";
            panel.style.gap = "1rem";
            panel.style.animationName = "slide-panel";
            panel.style.animationDuration = "3s";
            panel.style.animationTimingFunction = "ease";
            panel.style.animationDelay = "0s";
            panel.style.animationIterationCount = "1";
            panel.style.animationDirection = "normal";
            panel.style.opacity = "1";
            panel.style.transitionDelay = "0s";
            panel.style.transitionDuration = "1s";
            panel.style.transitionTimingFunction = "ease";
            panel.style.transitionProperty = "opacity";
            document.body.appendChild(panel);
            //Banner
            const text = document.createTextNode("2048 Game");
            const banner = document.createElement("div");
            banner.appendChild(text);
            banner.style.color = "white";
            banner.style.fontWeight = "bold";
            banner.style.fontSize = "xx-large";
            banner.style.fontVariant = "small-caps";
            banner.style.textShadow = "4px 4px 5px yellow, 8px 8px 5px orange";
            banner.style.textDecoration = "underline";
            banner.style.textAlign = "center";
            panel.appendChild(banner);
            //Buttons
            const div_button = document.createElement("div");
            div_button.style.display = "flex";
            div_button.style.flexDirection = "row";
            div_button.style.justifyContent = "space-evenly";
            div_button.style.alignItems = "center";
            //div_button.style.color = "#888";
            const button1 = document.createElement("button");
            //button1.style.width = "100px";
            button1.style.height = "30px";
            button1.style.color = "#444";
            //button1.style.paddingBlock = "10px";
            const text_button = document.createTextNode("Start Game");
            button1.style.fontWeight = "bold";
            button1.onclick = () => {
                const div = document.getElementById("panel");
                div.style.opacity = "0";
                setTimeout(Game.prepare, Control.time_panel);
                setTimeout(Control.remove_panel, Control.time_panel);
                if (Game.programmed_start)
                    Game.programmed_start = false;
            }
            button1.appendChild(text_button);
            div_button.appendChild(button1);
            const button2 = document.createElement("button");
            //button2.style.width = "100px";
            button2.style.height = "30px";
            button2.style.fontWeight = "bold";
            button2.style.color = "#444";
            const text_button2 = document.createTextNode("Programmed start (computer)");
            button2.appendChild(text_button2);
            button2.onclick = () => {
                const div = document.getElementById("panel");
                div.style.opacity = "0";
                setTimeout(Game.prepare, Control.time_panel);
                setTimeout(Control.remove_panel, Control.time_panel);
                if(!Game.programmed_start)
                    Game.programmed_start = true;
            }
            div_button.appendChild(button2);
            panel.appendChild(div_button);
            //Sound button
            const div_sound = document.createElement("div");
            div_sound.style.position = "absolute";
            div_sound.style.left = "510px";
            div_sound.style.top = "10px";
            div_sound.style.width = "100px";
            div_sound.style.height="30px";
            div_sound.style.border = "10px solid rgba(171,171,171,0.4)";
            div_sound.style.backgroundClip = "padding-box";
            div_sound.style.backgroundColor = "lightgray";
            div_sound.style.display = "flex";
            div_sound.style.alignItems = "center";
            div_sound.style.borderRadius = "33px";
            const button_sound = document.createElement("div");
            button_sound.style.backgroundColor = "greenyellow";
            button_sound.style.width = "60px";
            button_sound.style.height = "24px";
            //button_sound.style.float = "right";
            text_button_sound = document.createTextNode("Music:off");
            button_sound.style.fontSize = "small";
            button_sound.style.textAlign = "center";
            //button_sound.style.verticalAlign = "middle";
            button_sound.style.cursor = "pointer";
            button_sound.style.borderRadius = "20px";
            button_sound.style.position = "relative";
            button_sound.style.left = "0px";
            const audio = document.getElementById("audio");
            //audio.play();
            button_sound.onclick = () => {
                Control.music_on = !Control.music_on;
                let text = button_sound.firstChild;
                button_sound.removeChild(text);
                const audio = document.getElementById("audio");
                if (Control.music_on) {
                    button_sound.style.left = "30px";
                    button_sound.appendChild(document.createTextNode("Music:on"));
                    audio.play();
                } else {
                    button_sound.style.left = "0px";
                    button_sound.appendChild(document.createTextNode("Music:off"));
                    audio.pause();
                }
            };
            button_sound.appendChild(text_button_sound);
            div_sound.appendChild(button_sound);
            document.body.appendChild(div_sound);
            //Scoreboard
            const scoreboard = document.createElement("div");
            scoreboard.style.position = "absolute";
            scoreboard.style.left = "518px";
            scoreboard.style.top = "70px";
            scoreboard.style.backgroundColor = "goldenRod";
            scoreboard.style.display = "flex";
            scoreboard.style.flexDirection = "column";
            scoreboard.style.justifyContent = "space-evenly";
            scoreboard.style.alignItems = "center";
            scoreboard.style.padding = "0.5rem 2rem";
            scoreboard.style.borderRadius = "0.5rem";
            scoreboard.style.color = "rgb(40,40,40)";
            const above = document.createElement("div");
            above.style.fontWeight = "bold";
            const score = document.createTextNode("score: ");
            above.appendChild(score);
            scoreboard.appendChild(above);
            const below = document.createElement("div");
            below.id = "score";
            const text_score = document.createTextNode("0");
            below.appendChild(text_score);
            scoreboard.appendChild(below);
            document.body.appendChild(scoreboard);
        }
    },

    increment_score : function() {
        const score = document.getElementById("score");
        const text_node = score.firstChild;
        let value = parseInt(text_node.nodeValue) +Control.score;
        text_node.nodeValue = value.toString();
    },

    appear_panel : function() {
        const div = document.getElementById("panel");
        div.style.visibility = "visible";
        div.style.display = "flex";
    },

    remove_panel : function() {
        const div = document.getElementById("panel");
        div.style.visibility = "hidden";
        div.style.display = "none";
    },

    remove_center_panel : function() {
        const div = document.getElementById("center-panel");
        div.style.visibility = "hidden";
        div.style.display = "none";
    },

    appear_center_panel : function() {
        const div = document.getElementById("center-panel");
        div.style.visibility = "visible";
        div.style.display = "flex";
    },

    game_over :function () {
        //center panel
        let center_panel = document.getElementById("center-panel");
        if (center_panel != null) {
            setTimeout(Control.appear_center_panel,Control.time_panel);
            center_panel.style.opacity = "1";
        }
        else {
            center_panel = document.createElement("div");
            center_panel.id = "center-panel";
            center_panel.style.maxWidth = "480px";
            center_panel.style.width = "100%";
            center_panel.style.maxHeight = "400px";
            center_panel.style.height = "40vh";
            center_panel.style.minHeight = "200px";
            center_panel.style.backgroundColor = "lightgray";
            center_panel.style.backgroundClip = "padding-box";
            center_panel.style.border = "10px solid rgba(71,71,71,0.5)";
            center_panel.style.borderRadius = "3rem";
            center_panel.style.position = "absolute";
            center_panel.style.left = "0.5rem";
            center_panel.style.top = "20vh";
            center_panel.style.display = "flex";
            //center_panel.style.alignContent = "center";
            center_panel.style.flexDirection = "column";
            center_panel.style.alignItems = "center";
            center_panel.style.justifyContent = "space-evenly";
            center_panel.style.animationName = "slide-panel2";
            center_panel.style.animationDuration = "3s";
            center_panel.style.animationTimingFunction = "ease";
            center_panel.style.animationDelay = "0s";
            center_panel.style.animationIterationCount = "1";
            center_panel.style.animationDirection = "normal";
            center_panel.style.opacity = "1";
            center_panel.style.transitionDelay = "0s";
            center_panel.style.transitionDuration = "1s";
            center_panel.style.transitionTimingFunction = "ease";
            center_panel.style.transitionProperty = "opacity";
            center_panel.style.zIndex = "20";
            document.body.appendChild(center_panel);
            const div_text_game_over = document.createElement("div");
            const node_text_game_over = document.createTextNode("Game Over");
            div_text_game_over.appendChild(node_text_game_over);
            div_text_game_over.style.fontWeight = "bold";
            div_text_game_over.style.fontFamily = "Verdana";
            div_text_game_over.style.fontVariant = "small-caps";
            div_text_game_over.style.color = "gray";
            div_text_game_over.style.textShadow = "5px 5px 2px darkgray";
            div_text_game_over.style.fontSize = "xx-large";
            center_panel.appendChild(div_text_game_over);
            const div_buttons = document.createElement("div");
            div_buttons.style.display = "flex";
            div_buttons.style.flexDirection = "column";
            div_buttons.style.justifyContent = "space-evenly";
            div_buttons.style.gap = "1rem";
            const button1 = document.createElement("button");
            button1.style.color = "rgb(71,71,71)";
            button1.style.fontWeight = "bold";
            button1.style.paddingBlock = "0.25rem";
            const text_button1 = document.createTextNode("Restart");
            button1.appendChild(text_button1);
            button1.onclick = () => {
                const div = document.getElementById("center-panel");
                div.style.opacity = "0";
                Control.reset_game ();
                setTimeout(Game.prepare, Control.time_panel);
                setTimeout(Control.remove_center_panel, Control.time_panel);
            }
            div_buttons.appendChild(button1);
            const button2 = document.createElement("button");
            button2.style.color = "rgb(71,71,71)";
            button2.style.fontWeight = "bold";
            button2.style.paddingBlock = "0.25rem";
            const text_button2 = document.createTextNode("Back to main menu");
            button2.appendChild(text_button2);
            button2.onclick = () => {
                const div = document.getElementById("center-panel");
                div.style.opacity = "0";
                Control.reset_game ();
                setTimeout(Control.initialization, Control.time);
                setTimeout(Control.remove_center_panel, Control.time_panel);
            }
            div_buttons.appendChild(button2);
            center_panel.appendChild(div_buttons);
        }
    },

    reset_game : function() {

        for(let i = 0; i < Game.ELEMENTS_NUMBER; i++) {
            if (Game.square_array[i].inserted)
                Game.remove_square_GUI(Game.square_array[i].id);
            Game.square_array[i].inserted = false;
            Game.square_array[i].id = 0;
            Game.square_array[i].changed = false;
            Game.square_array[i].number = 0;
            //Game.remove_square_CLI(i);
        }

        Game.occupied = 0; 
        Game.count = 0;
        Game.continue_game = true;
        Game.number_moves = 0;
        Game.allow_key_press = true;

        const score = document.getElementById("score"); //Resetting the scoreboard
        const data = score.firstChild;
        data.nodeValue = "0";
        //Game.programmed_start = false;

        if (Game.interval_programmed)
            clearInterval(Game.interval_programmed);
    }
}