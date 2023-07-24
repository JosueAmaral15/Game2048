function Squares (position, number, inserted) {
    this.position = position; // Position that the element will have in the table
    this.number = number; // Number that expresses the combination made between elements or between other squares.
    this.inserted = inserted; // Attribute that identifies whether data exists and values are in effect and whether the part or square is drawn.
    this.id = Game.number_moves; // ID of the game piece (or the div) that was inserted into the HTML through javacript.
    this.changed = false; // Attribute that identifies if the game piece has its number changed

    this.insert = function (number) { // Function that creates a game piece or square
        this.number = number; // Refers to the number that each box will have as an identifier
        this.id = Game.number_moves; // The game piece ID is stored in an attribute.
        let element = document.getElementById(this.position.toString()); // A game piece square, which would be a td element of a table, is extracted.
        let table = document.getElementById("main-table"); // The entire table in the HTML document is referenced.
        let div = document.createElement("div"); // A new game piece is created.
        let text = document.createTextNode(this.number.toString()); //The game piece number will be entered.
        div.appendChild(text);
        div.id = "A"+Game.number_moves.toString(); // The new game piece will have its identification number.
        // All game pieces will have their identification number starting with the capital letter A.
        div.style.width = (element.style.width != ""? element.style.width : "125px"); //"125px";
        div.style.height = (element.style.height != ""? element.style.height : "125px" ); //"125px";
        div.style.borderRadius = "20px";
        div.style.backgroundColor = (number <= Game.NUMBER_COLOR_LIMIT? Game.square_color[number] : "Violet");
        div.style.position = "absolute";
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.justifyContent = "center";
        div.style.fontWeight = "bold";
        div.style.color = "white";
        div.style.top = (element.offsetTop+Game.MARGIN_TOP).toString()+"px"; // Determining the position of the game piece vertically
        div.style.left = (element.offsetLeft+Game.MARGIN_LEFT).toString()+"px"; //Determining the position of the game piece horizontally
        document.body.appendChild(div);

        if (Game.DEBUG)
            console.log("TEST this.position: ", this.position, "this.number", this.number)
        if (this.inserted != true)
            this.inserted = true;
    }

    this.move_transition = function (x,y, to_left) { // Moving the game piece according to the moves made by the player
        if(Game.DEBUG)
            console.log(`Moving element A${this.id}`);
        div = document.getElementById("A"+this.id.toString()); // The game piece is extracted from the DOM to have its attributes manipulated.
        if (to_left) { // if the to left variable is set to true, move the game piece horizontally.
            if (Game.DEBUG)
                console.log("moving to left/right");
            div.style.transition = `left ${Game.time}ms`; // transition time is defined as the time of game events.
            div.style.left = x.toString()+Game.MEASURE_WIDTH;
        } 
        else { // otherwise, the game piece is moved horizontally.
            if (Game.DEBUG)
                console.log("moving to top/bottom");
            div.style.transition = `top ${Game.time}ms`;
            div.style.top = y.toString()+Game.MEASURE_HEIGHT;
        }
    }
    
    this.remove_position_GUI = function() { // we will remove the graphic piece from the game with this function.
            let element = document.getElementById("A"+this.id.toString()); // Identifying the element
            document.body.removeChild(element); // Removing the element
    }

    this.remove_position_CLI = function() { // we will remove the piece from the game and make it no longer seen by the program simply by setting the inserted attribute to false.
        if(this.inserted) {
            this.inserted = false;
            this.number = 0;
        }
    }

    this.change_number_GUI = function(number) { // With this function we will change the value of the graphic part of the game according to the supplied argument defined by the number parameter
        //this.number = number;
        let element = document.getElementById("A"+this.id.toString()); // Extracting the graphic part of the game.
        element.innerHTML = number.toString(); // We will change the value written on the graphic piece through the number variable.
        if (Game.DEBUG)
            console.log(`Element: ${element}, Changing the square number and color...\nnumber:  ${number}, Game.square_color[number]:  ${Game.square_color[number]}`);
        if (number <= Game.NUMBER_COLOR_LIMIT) // We want the graphic part to have its color changed, but we don't want the number that defines the color to be greater than the amount of colors available. 
            //For this we will place a conditional that limits the color assignment.
            element.style.backgroundColor = Game.square_color[number];
    }

    this.change_number_CLI = function(number) { // changing the number written on the game's Square object piece.
        this.number = number;
    }
}

const Game = {
    DEBUG : false, // Here we will define a debug variable to help in the process of correcting the code.
    ELEMENTS_NUMBER : 16, // Number of game pieces.
    HEIGHT : 4, // Number of game pieces vertically.
    INCREMENTAL_VALUE : -5,
    MARGIN_LEFT : 9, // Margin to the left of the table.
    MARGIN_TOP : 10, // Margin above the table.
    MEASURE_WIDTH : "px",
    MEASURE_HEIGHT : "px",
    NUMBER_COLOR_LIMIT : 4096, // Limit or Final value of game pieces that must have colors.
    WIDTH: 4, // number of game pieces horizontally.
    TABLE_WIDTH : 500,
    TABLE_HEIGHT :  500,
    allow_key_press : true, // Attribute that determines whether the user can interact with the game in terms of keystrokes.
    continue_game : true, // Attribute that defines whether or not the game should end.
    count : 0, // Count that guides the steps of the programmed game.
    first_time : true, // Attribute reporting whether the player is playing for the first time.
    interval_programmed : false, // Attribute that receives the value of setInterval and that serves to eliminate iterations later.
    number_moves : 0, // Number of game moves.
    number_to_remove : new Set, // Set of identification values (ID's) of game graphic pieces for removal of graphic pieces.
    number_to_change : new Set, // Set of identification values (ID's) of graphic game pieces to change the number of graphic pieces.
    occupied : 0, // Number of graphic game pieces that are on the table.
    programmed_start : false, // Attribute that determines whether or not the game must be programmed, that is, moved by the machine or by the computer.
    square_array : Array(), // Game pieces array.
    square_color : {2: "goldenrod", 4 : "orange", 8: "Chocolate", 16: "red", 32 : "YellowGreen", 64 : "Green", 128 : "MediumSeaGreen", 256 : "Teal", 512 : "Aqua", 1024 : "Cyan", 2048 : "white", 4096 : "Violet"},
    time: 250, // Time in milliseconds of game events and transitions.
    probability_four : 0.05, // Probability of the game piece with value four appearing in the game.

    prepare : function () { // Function that provides the program with the functionalities and elements necessary to start the game.
        if(!Game.programmed_start) { // If the game is not controlled by the computer, a function is loaded that grants the game the property of detecting keys pressed by the user.
            document.body.onkeypress = Game.execute;
        }
        else // Otherwise, the game will provide the computer with the ability to move game pieces around.
            Game.interval_programmed = setInterval(Game.execute, Game.time); // 

        if (Game.first_time) {
            for (let i = 0; i < Game.ELEMENTS_NUMBER; i++) { // All game pieces are loaded and stored inside the square_array variable.
                Game.square_array.push(new Squares(i,0,false));
            }
        }
            

        Game.insert_square(); // The first graphic piece of the game is placed on the table.

        if(Game.first_time) // first_time attribute is set to false.
            Game.first_time = false;
    }, //end of Game.prepare

    execute : function () { // This function is responsible for executing the main features of the game, such as detecting button presses, counting moves and inserting new game pieces.
        if (Game.allow_key_press && Game.continue_game) { // Whether the program accepts new keystrokes and whether the game has not yet ended:

            if (Game.DEBUG) { // Here we will display all the Squares attributes from the square_array array in console.log
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

            if ((!Game.programmed_start && (event.keyCode == '119' || event.keyCode == '38' || event.keyCode == "87")) || (Game.programmed_start && Game.count == 0)) { // Here we want to know if the user has pressed any keys and if the game is not programmed for the computer to play.
                move_occured = Game.key_pressed_pattern(true, true, false, true, false, 4, Game.ELEMENTS_NUMBER, ">=", function(i){return 0}); // To shorten the code, some modifications were made through pattern identification.
                //bool_is_less_than, bool_is_for_increment, bool_is_incrementing, bool_of_four, bool_moving_to_left, int_i_value, int_operand_comparison, while_signal, function_limit
            } else 
            if ((!Game.programmed_start && (event.keyCode == '97' || event.keyCode == '65' || event.keyCode == '37')) || (Game.programmed_start && Game.count == 1)) { // The first part refers to a playable system, while the second part is the machine playing itself.
                move_occured = Game.key_pressed_pattern(true, true, false, false, true, 0, Game.ELEMENTS_NUMBER, ">=", function(i){return Game.WIDTH * (Math.floor(i/Game.WIDTH))}); // Below in the comment are the variables that define the use of arguments in the Game.key_pressed_pattern function.
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

            if(Game.programmed_start) { // If the game was programmed for the computer to play, then this conditional will be activated.
                Game.count++;
                if (Game.count > 3)
                    Game.count = 0;
            }
                
            if (move_occured) { // If there was any play by both the player and the computer:
                
                setTimeout(Game.insert_square,Game.time); // It is determined that after a certain time a new game piece will be inserted.
                move_occured = false; // We set the move_occured variable to false, as it would only be used within this scope.
                Game.number_moves++; // The number of moves after a confirmed move is incremented.
                
            }

            if (Game.DEBUG) { // All properties or attributes of Square objects will be printed again in console.log.
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

            Game.wait_keyboard_response_time(); // With this attribute, the game will take a certain amount of time to respond again so that the user can perform the movements. The attribute responsible for the time value would be Game.time.
            
        }
    }, // End of document.body.keypress

    key_pressed_pattern : function (bool_is_less_than, bool_is_for_increment, bool_is_incrementing, bool_of_four, bool_moving_to_left, int_i_value, int_operand_comparison, while_signal, function_limit) { // These arguments interfere with the behavior of the method as a whole. It is good to point out that this method serves to shorten the code and to reduce the lines of code.

        let move_occured = false; // The move_occured value will be made available later in the method return. 
        if(Game.DEBUG) {
            console.log(`TEST bool_is_less_than: ${bool_is_less_than}, bool_is_for_increment: ${bool_is_for_increment}, bool_is_incrementing: ${bool_is_incrementing}, bool_of_four: ${bool_of_four}, bool_moving_to_left: ${bool_moving_to_left}, int_i_value: ${int_i_value}, int_operand_comparison: ${int_operand_comparison}, while_signal: ${while_signal}`);
            console.log(`TEST for (let i = ${int_i_value}; ${(bool_is_less_than? 0 < int_operand_comparison : 0 >= int_operand_comparison)}; (bool_is_for_increment? i++ : i--))`)
        }
        for (let i = int_i_value; (bool_is_less_than? i < int_operand_comparison : i >= int_operand_comparison); (bool_is_for_increment? i++ : i--)) {
            if (Game.DEBUG) console.log(`TEST i: ${i}\nGame.square_array[i].inserted: ${Game.square_array[i].inserted}`);

            if (Game.square_array[i].inserted) {
                let table_position = Game.square_array[i].position; // We take a position of a table cell
                if (Game.DEBUG) console.log ("TEST Game.square_array[i].inserted ENTERED\ntable_position: ", table_position);
                
                table_position = table_position + ((bool_is_incrementing? (bool_of_four? Game.WIDTH : 1) : (bool_of_four? -Game.WIDTH : -1))); // The elements of the square_array attribute must be traversed in such a way that it is possible to analyze the attributes of each game piece.
                let square_position = -1; // square_position would be a variable that defines the position where the desirable game piece should be in the square_array attribute. We want this game piece to move both graphically and by command.
                if(Game.DEBUG) console.log(`TEST while (table_position ${while_signal} function_limit(i))? while (${table_position} ${while_signal} ${function_limit(i)}): ${(while_signal == "<"? table_position < function_limit(i) : ( while_signal == ">"? table_position > function_limit(i) : (while_signal == "<=" ? table_position <= function_limit(i) : table_position >= function_limit(i))))}`)
                
                while((while_signal == "<"? table_position < function_limit(i) : ( while_signal == ">"? table_position > function_limit(i) : (while_signal == "<=" ? table_position <= function_limit(i) : table_position >= function_limit(i))))) { // with this repetition loop we want to move the game piece inside square_array, even though square_array is a vector.
                    if (Game.DEBUG) console.log(`TEST1 while(${table_position} ${while_signal} ${function_limit(i)}) ENTERED\ntable_position: `, table_position, "square_position: ", square_position);
                    
                    if (!Game.square_array[table_position].inserted) { // If the cell contains no values, the cell will be a candidate for use
                        if (Game.DEBUG) console.log("TEST !Game.square_array[table_position].inserted ENTERED");
                        square_position = table_position; // The game piece will be moved within the square array to the position defined by square_position, which is influenced by the table_position variable.
                        if (!move_occured) move_occured = true; // Game drive record
                    } else {
                        if (Game.DEBUG) console.log("TEST Game.square_array[table_position].inserted ENTERED");
                        if (Game.square_array[table_position].number == Game.square_array[i].number && !Game.square_array[table_position].changed) { // If there is an existing game piece in square_array[square_position], if the value of the game piece is the same as the one to be moved and if the target piece has not had its value changed, then this conditional will be set to true.
                            
                            if(Game.DEBUG) console.log("TEST Game.square_array[table_position].number == Game.square_array[i].number ENTERED");
                            
                            square_position = table_position; // We set square_position equal to table_position for adaptation reasons.

                            // Changing number square
                            Game.square_array[table_position].change_number_CLI(Game.square_array[table_position].number * 2); // We change the value of the game piece.
                            Game.square_array[table_position].changed = true; // We changed the changed attribute defining that the game piece had its value changed.
                            Game.number_to_change.add(Game.square_array[table_position].id); // We've added an identification number to the number_to_change attribute to graphically perform game tile number value changes.
                            setTimeout(Game.change_number_delay_GUI, Game.time); // Changing the value or number of the game piece will be performed after a certain time.
                            if (Game.DEBUG) console.log("TEST Game.number_to_change: ", Game.number_to_change);

                            //Moving square element
                            let X = Game.X_axis_movement(square_position); // Calculation of game piece coordinate horizontally.
                            let Y = Game.Y_axis_movement(square_position); // Calculation of the vertically defined game piece abscissa.
                            Game.square_array[i].move_transition(X, Y, (bool_moving_to_left? true : false)); // The game piece will be moved according to the arguments.
                            if (Game.DEBUG) console.log("TEST i: ", i, "square_position: ", square_position, "X: " ,X, "Y: ", Y);
                            
                            // Removing square
                            Game.remove_square_CLI(i); // The game piece will be "removed" in the square_array variable, only using the 'inserted' attribute.
                            Game.number_to_remove.add(Game.square_array[i].id); // So that the removal is not sudden, a new identification number will be inserted in the number_to_remove attribute to carry out the graphic removal of the element (or the game's graphic piece) that is being viewed by the user.
                            setTimeout(Game.remove_square_delay_GUI,Game.time); // The game graphics piece will be removed after some time, which time is set by Game.time.
                            if (Game.DEBUG) console.log("TEST Game.number_to_remove: ", Game.number_to_remove);

                            square_position = -1; // The movement of the game graphic piece has already been done, so we will assign -1 to the variable square_position so that there are no repetitions of commands.
                            if (!move_occured) // Moving game pieces has been done.
                                move_occured = true;
                            //Game.exchange_data(i, square_position);
                            setTimeout(Control.increment_score, Game.time); // The score will be incremented.
                        }
                        break;
                    }
                    table_position = table_position + ((bool_is_incrementing? (bool_of_four? Game.WIDTH : 1) : (bool_of_four? -Game.WIDTH : -1))); // The square_array will be traversed according to the increment/decrement of the table_position variable.
                    if (Game.DEBUG)
                        console.log("TEST1 after table_position: ", table_position, "square_position: ", square_position);
                }

                if(Game.DEBUG)
                    console.log("TEST2 table_position: ", table_position, "square_position: ", square_position);
                
                if (square_position != -1) { // If any game pieces were moved or if there was a combination of game pieces:
                    let X = Game.X_axis_movement(square_position); // We move the game piece horizontally.
                    let Y = Game.Y_axis_movement(square_position); // We move the game piece vertically.
                    if (Game.DEBUG)
                        console.log("TEST i: ", i, "square_position: ", square_position, "X: " ,X, "Y: ", Y);
                    Game.square_array[i].move_transition(X, Y, (bool_moving_to_left? true : false)); // We made the movement transition effect.
                    Game.exchange_data(i, square_position); // We moved the data that was from one part to another inside the square_array attribute.
                }
            }
        }

        Game.reset_changed_attribute(); // All 'changed' attributes of Square objects will be set to false, and this is so that you can change values or score numbers within each game tile.

        return move_occured;
    },

    insert_square : function () { // With this function we can define active elements in the Game.square_array attribute and we also have the possibility to insert div elements (game pieces) in the graphical environment.
            if (Game.DEBUG)
            console.log("Game.occupied: ", Game.occupied)
        let count = 0; // Counter to control iterations in order not to exceed the limit.
        let inserted = false;
        if (Game.occupied < Game.ELEMENTS_NUMBER) { // If we have a smaller amount of game pieces compared to the Game.ELEMENTS_NUMBER variable:
            let number = parseInt(Game.ELEMENTS_NUMBER*Math.random()); // We will randomly choose an empty square to fill it with a number
            while(!inserted && !(count > Game.ELEMENTS_NUMBER * 2)) { // If the game piece has not been inserted and the count is less than the maximum number of elements times two, then the loop continues with its true value.
                // Now we want to insert into a square the number
                if (!Game.square_array[number].inserted) { // If an object has not yet been allocated or recognized:
                    Game.square_array[number].insert((Math.random() > Game.probability_four? 2: 4)); // If the Math.random value is greater than the Game.probability_four attribute, then the value or number 2 must be placed.
                    inserted = true; // The game piece has been inserted.
                    if (Game.DEBUG)
                        console.log("TEST inserting new element: ", number);
                } else
                number = parseInt(Game.ELEMENTS_NUMBER*Math.random()); // Find the position of the game piece in the attribute square array at random.
                count++;
            }

            if (!inserted) { // If the element has not been previously inserted within a period of time, we will insert it manually using a for
                for(let i = 0; i < Game.ELEMENTS_NUMBER; i++) { // The square_array attribute will be traversed and its values read sequentially instead of randomly.
                    if (!Game.square_array[i].inserted) { 
                        Game.square_array[i].insert((Math.random() > Game.probability_four? 2: 4));
                        inserted = true;
                    }
                }
                if (Game.DEBUG) {
                    console.log("TEST Is not inserted, tried again...");
                }
            }

            if (inserted) { // If a new game piece has been inserted into the game, then we will increment the Game.occupied attribute.
                Game.occupied++;
                if (Game.DEBUG)
                    console.log("TEST incrementing Game.occupied: ", Game.occupied);
            }
                
        }

        Game.continue_game = Game.check_possibility_of_moves (); // During the insertion we will check if there is the possibility to continue the game.
        if (!Game.continue_game) // If the player cannot move the pieces, this will be notified as game over.
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

    change_number_delay_GUI : function () { // Function that will change the value or number of game pieces after a certain time, being this time determined by the Game.time attribute.
        for (let n of Game.number_to_change) { // All identification numbers are extracted and are used for game pieces to have their attributes modified.
            //Game.square_array[n].change_number_GUI(Game.square_array[n].number);
            let element = document.getElementById(`A${n}`); // The element is recovered and will have its value modified.
            let number = parseInt(element.innerHTML) * 2; // The value that is found is doubled.
            if (Game.DEBUG)
                console.log(`Changing number of square ${n} with number ${Math.floor(number/2)} to ${number}`);
            element.innerHTML = number.toString(); // The modified value is returned to the element or graphic game piece.
            if (Game.DEBUG)
                console.log(`Element: ${element}, Changing the square number and color...\nnumber:  ${number}, Game.square_color[number]:  ${Game.square_color[number]}`);
            if (number <= Game.NUMBER_COLOR_LIMIT) // This conditional is used so that the value in the game pieces does not cause an overflow in the dictionary or in the square_color object.
                element.style.backgroundColor = Game.square_color[number];
        }
        Game.number_to_change = new Set(); // The Game.number_to_change attribute is reset to a new set.
    },

    reset_changed_attribute : function () { // Method that resets all changed attributes to false.
        for (let i = 0; i < Game.ELEMENTS_NUMBER; i++) {
            Game.square_array[i].changed = false;
        }
    },

    wait_keyboard_response_time : function() { // The keyboard will become unresponsive for a while with this method.
        Game.allow_key_press = false; // The keyboard will not be able to function after a certain time.
        setTimeout(Game.enable_keyboard_response, Game.time);
    },

    enable_keyboard_response : function() { // The method must make the keyboard or keystroke work in the game.
        Game.allow_key_press = true;
    },

    X_axis_movement : function(square_position) { // Formula for horizontal movement.
        return Math.floor(Game.TABLE_WIDTH/Game.WIDTH)*(square_position % Game.WIDTH)+Game.MARGIN_LEFT;
    },

    Y_axis_movement : function(square_position) { // Formula for vertical movement.
        return Math.floor(Game.TABLE_HEIGHT/Game.HEIGHT)*(Math.floor(square_position / Game.WIDTH)) +Game.MARGIN_TOP;
    },

    check_possibility_of_moves : function () { // Here we will analyze if there are possibilities of moves for the user. For this, one must know if there is any piece that has a value equal to its neighbor.
        let there_is_possibility = false; // Whenever possible, we will check the four sides of the game piece, in this case, in relation to the square_array variable.
        if (Game.occupied == Game.ELEMENTS_NUMBER) { // If the amount of game pieces exactly equals the total capacity of pieces that can be inserted, then:
            for(let i = 0; i < Game.ELEMENTS_NUMBER; i++) {
                if (Game.square_array[i].inserted) { // If the game piece exists and is defined within the square_array attribute:
                    if (Game.square_array[i].position > Game.WIDTH*Math.floor(Game.square_array[i].position/Game.WIDTH)) { // checking left equality; In this conditional we are verifying that the position analysis does not exceed the limits horizontally or vertically of the game table.
                        if (Game.square_array[i -1].inserted) { // If the piece on the left exists and is placed inside the square_array attribute:
                            if(Game.square_array[i].number == Game.square_array[i -1].number) { // If the game tile's number or value is exactly the same as its neighbor's:
                                if (!there_is_possibility) // So there is possibility to continue the game.
                                    there_is_possibility = true;
                            }
                        }
                    }

                    if (Game.square_array[i].position < Game.WIDTH*Math.floor(Game.square_array[i].position/Game.WIDTH +1)-1) { // checking right equality; In this conditional we are verifying that the position analysis does not exceed the limits horizontally or vertically of the game table.
                        if (Game.square_array[i +1].inserted) { // If the piece on the right exists and is placed inside the square_array attribute:
                            if(Game.square_array[i].number == Game.square_array[i +1].number) { // If the game tile's number or value is exactly the same as its neighbor's:
                                if (!there_is_possibility)  // So there is possibility to continue the game.
                                    there_is_possibility = true;
                            }
                        }
                    }

                    if (Math.floor(Game.square_array[i].position > Game.square_array[i].position % Game.WIDTH)) { // checking equality above; In this conditional we are verifying that the position analysis does not exceed the limits horizontally or vertically of the game table.
                        if (Game.square_array[i -Game.WIDTH].inserted) { // If the top piece exists and is placed inside the square_array attribute:
                            if(Game.square_array[i].number == Game.square_array[i -Game.WIDTH].number) { // If the game tile's number or value is exactly the same as its neighbor's:
                                if (!there_is_possibility) // So there is possibility to continue the game.
                                    there_is_possibility = true;
                            }
                        }
                    }

                    if(Math.floor(Game.square_array[i].position < Game.square_array[i].position % Game.WIDTH +Game.ELEMENTS_NUMBER -Game.WIDTH)) { // checking equality below; In this conditional we are verifying that the position analysis does not exceed the limits horizontally or vertically of the game table.
                        if (Game.square_array[i +Game.WIDTH].inserted) { // If the bottom piece exists and is placed inside the square_array attribute:
                            if(Game.square_array[i].number == Game.square_array[i +Game.WIDTH].number) { // If the game tile's number or value is exactly the same as its neighbor's:
                                if (!there_is_possibility) //  So there is possibility to continue the game.
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

const Control = { // Object that is responsible for the integral control of the game.

    music_on : true, // Attribute that acts on the music.
    time_panel : 1000, // Transition time or duration of GUI events.
    inc_score : 100, // Variable responsible for determining how much increment the player's score should be.

    run : function() { // main function of this object
        Control.initialization();
    },

    initialization : function() { // Function that draws all initialization elements: text, buttons and panel.

        let panel = document.getElementById("panel");
        if (panel != null) {
            setTimeout(Control.appear_panel,Control.time_panel);
            panel.style.opacity = "1";
        }
        else {

            //Table
            const table = document.createElement("table");
            table.id = "main-table";
            table.style.width = `${Game.TABLE_WIDTH}${Game.MEASURE_WIDTH}`;
            table.style.height = `${Game.TABLE_HEIGHT}${Game.MEASURE_HEIGHT}`;
            table.style.borderCollapse = "collapse";
            table.style.backgroundColor = "brown";
            document.body.appendChild(table);
            const tbody = document.createElement("tbody");
            table.appendChild(tbody);
            //width:125px;
            //height:120px;
            for (let i  = 0; i < Game.HEIGHT; i++) {
                let tr = document.createElement("tr");
                tbody.appendChild(tr);
                for(let j = 0; j < Game.WIDTH; j++) {
                    let td = document.createElement("td");
                    td.id = String (j +i * Game.WIDTH);
                    td.style.border = "1px dashed black";
                    td.style.textAlign = "center";
                    td.style.verticalAlign = "center";
                    td.style.width = `${Math.floor(Game.TABLE_WIDTH/4)}${Game.MEASURE_WIDTH}`;
                    td.style.height = `${Math.floor(Game.TABLE_HEIGHT/4)+Game.INCREMENTAL_VALUE}${Game.MEASURE_HEIGHT}`;
                    tr.appendChild(td);
                    
                }
            }

            //Panel
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
            const button1 = document.createElement("button");
            button1.style.height = "30px";
            button1.style.color = "#444";
            const text_button = document.createTextNode("Start Game");
            button1.style.fontWeight = "bold";
            button1.onclick = () => { // Clicking on the button the user will start the game.
                const div = document.getElementById("panel");
                div.style.opacity = "0";
                setTimeout(Game.prepare, Control.time_panel); // Main function to start the game
                setTimeout(Control.remove_panel, Control.time_panel); // The panel and all of its underlying elements are removed.
                if (Game.programmed_start) // If the game was scheduled for the computer to play, the event is disabled.
                    Game.programmed_start = false;
            }
            button1.appendChild(text_button);
            div_button.appendChild(button1);
            const button2 = document.createElement("button");
            button2.style.height = "30px";
            button2.style.fontWeight = "bold";
            button2.style.color = "#444";
            const text_button2 = document.createTextNode("Programmed start (computer)");
            button2.appendChild(text_button2);
            button2.onclick = () => { // By clicking on the button, the user will start a programmed game with the computer playing.
                const div = document.getElementById("panel");
                div.style.opacity = "0";
                setTimeout(Game.prepare, Control.time_panel); // Main function to start the game
                setTimeout(Control.remove_panel, Control.time_panel); // The panel and all of its underlying elements are removed.
                if(!Game.programmed_start) // If the game was scheduled for the computer to play, the event is disabled.
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
            button_sound.onclick = () => { // Function that activates and deactivates the user's sound. The game starts with no sound, leaving it up to the user to turn on the sound.
                Control.music_on = !Control.music_on;
                let text = button_sound.firstChild;
                button_sound.removeChild(text);
                const audio = document.getElementById("audio");
                if (Control.music_on) { // If the sound is turned on by the user, the button is moved and the text is changed.
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

    increment_score : function() { // Function that increments the user's score.
        const score = document.getElementById("score");
        const text_node = score.firstChild;
        let value = parseInt(text_node.nodeValue) +Control.inc_score;
        text_node.nodeValue = value.toString();
    },

    appear_panel : function() { // Function that makes the launch panel appear.
        const div = document.getElementById("panel");
        div.style.visibility = "visible";
        div.style.display = "flex";
    },

    remove_panel : function() { // Function that makes the launch panel disappear.
        const div = document.getElementById("panel");
        div.style.visibility = "hidden";
        div.style.display = "none";
    },

    remove_endgame_panel : function() { // Function that causes the endgame panel to be removed.
        const div = document.getElementById("endgame-panel");
        div.style.visibility = "hidden";
        div.style.display = "none";
    },

    appear_endgame_panel : function() { // Function that causes the endgame panel to appear.
        const div = document.getElementById("endgame-panel");
        div.style.visibility = "visible";
        div.style.display = "flex";
    },

    game_over :function () { // end game function.
        //center panel
        let endgame_panel = document.getElementById("endgame-panel");
        if (endgame_panel != null) { // If the endgame panel exist:
            setTimeout(Control.appear_endgame_panel,Control.time_panel);
            endgame_panel.style.opacity = "1";
        }
        else { // If the endgame panel does not exist, all its elements are created from this line.
            // Endgame panel
            endgame_panel = document.createElement("div");
            endgame_panel.id = "endgame-panel";
            endgame_panel.style.maxWidth = "480px";
            endgame_panel.style.width = "100%";
            endgame_panel.style.maxHeight = "400px";
            endgame_panel.style.height = "40vh";
            endgame_panel.style.minHeight = "200px";
            endgame_panel.style.backgroundColor = "lightgray";
            endgame_panel.style.backgroundClip = "padding-box";
            endgame_panel.style.border = "10px solid rgba(71,71,71,0.5)";
            endgame_panel.style.borderRadius = "3rem";
            endgame_panel.style.position = "absolute";
            endgame_panel.style.left = "0.5rem";
            endgame_panel.style.top = "20vh";
            endgame_panel.style.display = "flex";
            //endgame_panel.style.alignContent = "center";
            endgame_panel.style.flexDirection = "column";
            endgame_panel.style.alignItems = "center";
            endgame_panel.style.justifyContent = "space-evenly";
            endgame_panel.style.animationName = "slide-panel2";
            endgame_panel.style.animationDuration = "3s";
            endgame_panel.style.animationTimingFunction = "ease";
            endgame_panel.style.animationDelay = "0s";
            endgame_panel.style.animationIterationCount = "1";
            endgame_panel.style.animationDirection = "normal";
            endgame_panel.style.opacity = "1";
            endgame_panel.style.transitionDelay = "0s";
            endgame_panel.style.transitionDuration = "1s";
            endgame_panel.style.transitionTimingFunction = "ease";
            endgame_panel.style.transitionProperty = "opacity";
            endgame_panel.style.zIndex = "20";
            document.body.appendChild(endgame_panel);
            // game over text
            const div_text_game_over = document.createElement("div");
            const node_text_game_over = document.createTextNode("Game Over");
            div_text_game_over.appendChild(node_text_game_over);
            div_text_game_over.style.fontWeight = "bold";
            div_text_game_over.style.fontFamily = "Verdana";
            div_text_game_over.style.fontVariant = "small-caps";
            div_text_game_over.style.color = "gray";
            div_text_game_over.style.textShadow = "5px 5px 2px darkgray";
            div_text_game_over.style.fontSize = "xx-large";
            endgame_panel.appendChild(div_text_game_over);
            // Buttons
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
            button1.onclick = () => { // If the button is clicked, a new interactive game will start.
                const div = document.getElementById("endgame-panel");
                div.style.opacity = "0";
                Control.reset_game ();
                setTimeout(Game.prepare, Control.time_panel);
                setTimeout(Control.remove_endgame_panel, Control.time_panel);
            }
            div_buttons.appendChild(button1);
            const button2 = document.createElement("button");
            button2.style.color = "rgb(71,71,71)";
            button2.style.fontWeight = "bold";
            button2.style.paddingBlock = "0.25rem";
            const text_button2 = document.createTextNode("Back to main menu");
            button2.appendChild(text_button2);
            button2.onclick = () => { // If the button is clicked, the player will be taken to the main menu.
                const div = document.getElementById("endgame-panel");
                div.style.opacity = "0";
                Control.reset_game ();
                setTimeout(Control.initialization, Control.time);
                setTimeout(Control.remove_endgame_panel, Control.time_panel);
            }
            div_buttons.appendChild(button2);
            endgame_panel.appendChild(div_buttons);
        }
    },

    reset_game : function() { // With this function, the main variables of the program that will be used return to the initial value.

        for(let i = 0; i < Game.ELEMENTS_NUMBER; i++) { // Each array element will have its attributes set to initial values.
            if (Game.square_array[i].inserted) // If an element is inserted in the array, and in its attribute it has an ID of an external div (which exists), this div is removed.
                Game.remove_square_GUI(Game.square_array[i].id);
            Game.square_array[i].inserted = false;
            Game.square_array[i].id = 0;
            Game.square_array[i].changed = false;
            Game.square_array[i].number = 0;
            //Game.remove_square_CLI(i);
        }

        Game.occupied = 0; // The number of elements inserted in the table will be set to zero.
        Game.count = 0; // The attribute that defines scheduled moves will be set to zero.
        Game.continue_game = true; // The game will start working.
        Game.number_moves = 0; // The number of moves made by the player will be set to zero.
        Game.allow_key_press = true; // The game will accept keystrokes made by the player.

        const score = document.getElementById("score"); //Resetting the scoreboard
        const data = score.firstChild;
        data.nodeValue = "0";
        //Game.programmed_start = false;

        if (Game.interval_programmed)
            clearInterval(Game.interval_programmed);
    }
}