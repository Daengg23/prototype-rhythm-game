let root = document.documentElement; // will be used to access all css variables
const allKeys = document.querySelectorAll(".key");
const key_1 = document.querySelector("#key-1");
const key_2 = document.querySelector("#key-2");
const key_3 = document.querySelector("#key-3");
const key_4 = document.querySelector("#key-4");

const column_1 = document.querySelector("#column-1");
const column_2 = document.querySelector("#column-2");
const column_3 = document.querySelector("#column-3");
const column_4 = document.querySelector("#column-4");

const miss_counter = document.querySelector("#miss-counter");

const score_board = document.querySelector(".scoreboard-container");
const fade_away_container = document.querySelector(".fade-away-container");
const hit_display = document.querySelector(".hit-display");

let key_1_hold = false;
let key_2_hold = false;
let key_3_hold = false;
let key_4_hold = false;

let start = false;

let current_time = 0;
let chord_time = 0;
let larger_chord_time = 0;
let note_density = 120;
let score = 0;
let combo = 0;
let misses = 0;

let test_audio = new Audio('freedomdive.mp3'); // NOTE audio is failing to play, fix later
//test_audio.play();

window.setInterval(() => {
    if(start) {
        current_time += 1;
        chord_time += 1;
        larger_chord_time += 1;
        updateScoreBoard();
    }

}, 10);

window.addEventListener("keydown", (e) => { // use keydown
    if(start) {
        if(e.keyCode === 90) { // its a lowercase fucking key
            if(!key_1_hold) { // adds only one click, but the key becomes held
                key_1.classList.add("highlight-key");
                column_1.classList.add("highlight-column");
                key_1_hold = true;
                registerClick(1);
            }
            
        }
        if(e.keyCode === 88) {
            if(!key_2_hold) {
                key_2.classList.add("highlight-key");
                column_2.classList.add("highlight-column");
                key_2_hold = true;
                registerClick(2);
            }
            
        }
        if(e.keyCode === 188) {
            if(!key_3_hold) {
                key_3.classList.add("highlight-key");
                column_3.classList.add("highlight-column");
                key_3_hold = true;
                registerClick(3);
            }
        }
        if(e.keyCode === 190) {
            if(!key_4_hold) {
                key_4.classList.add("highlight-key");
                column_4.classList.add("highlight-column");
                key_4_hold = true;
                registerClick(4);
            }
        }
    }
    if(e.keyCode === 32) {
        start = true; // starts the game with a space press
        test_audio.play();
    }

});

fade_away_container.addEventListener('click', () => {
    if(root.style.getPropertyValue("--scroll-background") != "transparent") { // toggles between faded/non-faded
        root.style.setProperty('--scroll-background', "transparent");
        fade_away_container.classList.add("selected-green");
    } else {
        root.style.setProperty('--scroll-background', root.style.getPropertyValue("--note-color"));
        fade_away_container.classList.remove("selected-green");
    }
    
});


window.addEventListener("keyup", (e) => { // use keydown
    if(start) {
        if(e.keyCode === 90) {
            key_1.classList.remove("highlight-key");
            column_1.classList.remove("highlight-column");
            key_1_hold = false;
        }
        if(e.keyCode === 88) {
            key_2.classList.remove("highlight-key");
            column_2.classList.remove("highlight-column");
            key_2_hold = false;
        }
        if(e.keyCode === 188) {
            key_3.classList.remove("highlight-key");
            column_3.classList.remove("highlight-column");
            key_3_hold = false;
        }
        if(e.keyCode === 190) {
            key_4.classList.remove("highlight-key");
            column_4.classList.remove("highlight-column");
            key_4_hold = false;
        }
    }
});

function updateScoreBoard() {
    score_board.innerHTML = score;
}

function registerClick(column) {
   try {
       switch(column) {
        case 1:
            column_1.removeChild(document.querySelectorAll("#column-1 .note-type")[0]); // gets the first child inside column 1
            break;
        case 2:
            column_2.removeChild(document.querySelectorAll("#column-2 .note-type")[0]);
            break;
        case 3:
            column_3.removeChild(document.querySelectorAll("#column-3 .note-type")[0]); 
            break;
        case 4:
            column_4.removeChild(document.querySelectorAll("#column-4 .note-type")[0]); 
            break;
        }
        hit();
   } catch {
       miss();
   }
   
}

function showHitDisplay(message) {
    hit_display.innerHTML = message;
    hit_display.classList.add("pop-in"); // makes the hit screen pop in and out
    
    setTimeout(() => {
        hit_display.classList.remove("pop-in");
    }, 1000);
}

function miss() {
    combo = 0;
    misses++;
    miss_counter.innerHTML = misses;
    showHitDisplay("MISS");
}

function hit() {
    combo++;
    score += 50 * (1 + Math.round(combo/50));

    showHitDisplay(combo);

    
}

class Note {
    constructor(column, timing, type="click", sound="") {
        this.column = column;
        this.timing = timing;
        this.sound = sound;
        this.type = type;
    }
    getColumn() {
        return this.column;
    }
    getTiming() {
        return this.timing;
    }
}


function addNote(note) {
    let column = undefined;
    let noteColumn = note.getColumn();
    switch(noteColumn) {
        case 1:
            column = column_1;
            break;
        case 2:
            column = column_2;
            break;
        case 3:
            column = column_3;
            break;
        case 4:
            column = column_4;
            break;
    }
    setTimeout(() => {
        const noteEl = document.createElement("div");
        noteEl.className = "note-type"; // standard styling for all notes
        if(note.type == "click") {
            noteEl.className += " note";
        } else if(note.type == "hold") {
            noteEl.className += " note-hold";
        } else if(note.type == "release") {
            noteEl.className += " note-release";
        } else if(note.type == "filler") {
            noteEl.className += " note-filler";
        }
         
        column.appendChild(noteEl);

        // ignore for now
        const noteClass = document.querySelector(".note-type");
        const myStyle = getComputedStyle(noteClass);
        const tempAniDuration = parseInt(myStyle.animationDuration.substring(0, myStyle.animationDuration.length - 1));
        const aniDuration = tempAniDuration * 100;

        setTimeout(() => {
            if(document.body.contains(noteEl)) {
                miss();
            }
            noteEl.remove();
            
                
        }, 1000); // animation duration is the delete time

    }, note.getTiming());
}

function addHoldNote(column, start, end) {
    let note = createRandomizedNote();
    addNote(new Note(note.getColumn(), start, "hold"));
    for(let i = 50; i < end - 50; i += 50) {
        addNote(new Note(note.getColumn(), start + i, "filler"));
    }
    addNote(new Note(note.getColumn(), end, "release"));
}

//addHoldNote(1, 100, 900);
/*
addNote(new Note(1, 100, "hold"));
addNote(new Note(1, 150, "filler")); 
addNote(new Note(1, 200, "filler"));
addNote(new Note(1, 250, "filler"));
addNote(new Note(1, 300, "filler"));
addNote(new Note(1, 350, "filler"));
addNote(new Note(1, 400, "filler"));
addNote(new Note(1, 450, "filler"));
addNote(new Note(1, 500, "release"));
*/

window.setInterval(() => {
    let note_1 = createRandomizedNote();
    let note_2 = undefined;
    let note_3 = undefined;
    let a = 0;

   //Generating the note map
   // Be careful not to allow two notes to overlap with each other, try using get column and roll to make chords
   if(current_time < 150) {
       chord_time = 0; // waits until the map starts before chord progression
   } 
   if(current_time > 150) { // NOTE WARNING, THE REST OF THE CODE IS INSIDE THIS CURRENT TIME
        // First Segment
        /*
        if(current_time > 325 && current_time <= 2500) {
            note_1 = roll(-1);
            if(chord_time > note_density) {
                note_1 = roll(-1);
            } else if(chord_time == note_density) {
                note_2 = roll(1);
            }
            if(chord_time > note_density * 2) {
                note_1 = roll(-1);
                note_2 = roll(1);
                chord_time = 0;
            }
        }
        */

        //NOTE THere might be a corelation to the RANDOM message poping and a fuicked up chord being generated
        // A fucked up chord could happen during the first time the application is loaded up (no refreshes beforehand)

        /*if(current_time > 4300) { */ if(current_time > 0) {
            if(chord_time == note_density * 1) {
                note_1 = roll(1);
                note_2 = roll(1);
            }
            if(chord_time < note_density * 2) {
                note_1 = roll(1);
            }
            if(chord_time == note_density * 2) {
                note_1 = roll(-1);
                note_2 = roll(2);
            }
            if(chord_time > note_density * 2) {
                note_1 = roll(-1);
            }
            if(chord_time == note_density * 3) {
                note_2 = roll(3);
            }
            if(chord_time > note_density * 4) { // 3 note chord
                note_1 = roll(-2);
                note_2 = createRandomizedNote();
                note_3 = roll(note_2.getColumn() - 1);
                chord_time = 0;
            }
        }

        // Adding Notes
        // Make more efficent
        addNote(note_1); // Main note, is added once every interval

        // Case for Duplicates
        while(
            (note_2 != undefined && note_1.getColumn() === note_2.getColumn()) ||
            (note_3 != undefined && note_1.getColumn() === note_3.getColumn()) ||
            ((note_2 != undefined && note_3 != undefined) && note_2.getColumn() === note_3.getColumn())){ // prevents duplicate notes on the same column
            
            note_2 = createRandomizedNote();  
            note_3 = createRandomizedNote();
            console.log("RAANDOMIZED");
        }
        
        if(note_2 != undefined) {
            addNote(note_2);
        }
        if(note_3 != undefined) {
            addNote(note_3);
        }



    }


}, note_density);

/*
let temp = 0;
*/
let roll_timer = 0;
let roll_column = 0;

function roll(columnModifier) {
    roll_column += columnModifier;
    if(roll_column > 4) {
        roll_column = roll_column % 4;
    }
    if(roll_column < 1) {
        roll_column = 4;
    }

    let note = createRandomizedNote(roll_column);
    return note;
}


function createRandomizedNote(customColumn = undefined) { // change to createNote instead 
    let column = customColumn;
    if(customColumn === undefined) { // we dont want an undefined column number
        column = Math.round(Math.random() * 3) + 1;
    }
    

    const timing = current_time; //Math.round(Math.random() * 1000);
    const note = new Note(column, timing);
    return note;
}

createRandomizedNote();
