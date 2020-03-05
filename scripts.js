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
const ok_counter = document.querySelector("#ok-counter");
const great_counter = document.querySelector("#great-counter");
const perfect_counter = document.querySelector("#perfect-counter");

const score_board = document.querySelector(".scoreboard-container");
const fade_away_container = document.querySelector(".fade-away-container");
const hit_display = document.querySelector(".hit-display");

let key_1_hold = false;
let key_2_hold = false;
let key_3_hold = false;
let key_4_hold = false;

let hit_line = 90; // the percentage of screen on where the notes will be judged for accuracy
let accuracyModifier = 30; // the allowed room for error (ex. 55 can be accepted in a hit_line of 60, but not 45)
//NOTE accuracy Modifier should be tweaked when used along with scroll speed
//NOTE animation duration should be modified to fit with the hit_line percentage

let start = false;

// These values should be able to be reseted
let current_time = 0;
let chord_time = 0;
let larger_chord_time = 0;
// to find note density, -> 1000 /(bpm/60), set difficultly by halfing for doubling
// Anima Difficulties -> 327, 163.5, 81.5
let note_density = 163.5;//freedomdive-222bpm anima-184bpm
let health = 100;
let score = 0;
let combo = 0;
let misses = 0;
let score_perfect = 0;
let score_great = 0;
let score_ok = 0;
let test_audio = new Audio('anima.mp3');

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
    let currentNote;
    let currentColumn;
   try {
       switch(column) {
        case 1:
            currentNote = document.querySelectorAll("#column-1 .note-type")[0];
            currentColumn = column_1;
            break;
        case 2:
            currentNote = document.querySelectorAll("#column-2 .note-type")[0];
            currentColumn = column_2;
            break;
        case 3:
            currentNote = document.querySelectorAll("#column-3 .note-type")[0];
            currentColumn = column_3;
            break;
        case 4:
            currentNote = document.querySelectorAll("#column-4 .note-type")[0];
            currentColumn = column_4;
            break;
        }
        hit(currentNote, currentColumn);
   } catch {
       miss(); // misses when no note was detected, to prevent spamming (can be disabled later when coded)
   }
}

function removeNote(note, column) { // note and column must be elements
    column.removeChild(note);
}

function showHitDisplay(message) {
    hit_display.innerHTML = message;
    hit_display.innerHTML += '<div>' + combo + '</div>';
    hit_display.classList.add("pop-in"); // makes the hit screen pop in and out

    setTimeout(() => {
        hit_display.classList.remove("pop-in");
    }, 1000);
}

function miss() {
    combo = 0;
    misses++;
    health -= 5;
    miss_counter.innerHTML = misses;
    showHitDisplay("MISS");
}

function registerScore(percentage) {
    // percentage is judged by how far away it is from the hit line by using accuracy modifier
    if(percentage > hit_line - accuracyModifier && percentage < hit_line - accuracyModifier * 0.6) {
        showHitDisplay("OK!");
        score_ok++;
        ok_counter.innerHTML = score_ok;
    }
    if(percentage > hit_line - accuracyModifier * 0.7 && percentage < hit_line - accuracyModifier * 0.4) {
        showHitDisplay("GREAT!");
        score_great++;
        great_counter.innerHTML = score_great
    }
    if(percentage > hit_line - accuracyModifier * 0.4 && percentage < hit_line + accuracyModifier * 0.4) {
        showHitDisplay("PERFECT!");
        score_perfect++;
        perfect_counter.innerHTML = score_perfect;
    }
    combo++;
    score += 50 * (1 + Math.round(combo/50));
    console.log(percentage);

}

function hit(noteHit, columnParent) { // gets the percentage of screen of where the hit hit was and calculates the score using another function
    let topPosition = window.getComputedStyle(noteHit).top; // getComputedStyle gets all styling of an element that was applied by classes (not in-line) // from top to bottom is 100%
    let percentage = Math.round(topPosition.substring(0, topPosition.length - 2)/window.innerHeight * 100); // converts topPosition into a number by removing the "px" at the end and dividing it by the height of the window
    
    if((percentage < hit_line - accuracyModifier && percentage > accuracyModifier) || percentage > hit_line + accuracyModifier) { // NOTE hitline should be shown in the game screen
        removeNote(noteHit, columnParent); // discards note when "Hit"
        miss();
    } else {
        removeNote(noteHit, columnParent);
        registerScore(percentage);
    }

    
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
            
                
        }, 700); // NOTE animation duration is the delete time

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


window.setInterval(() => {
    let note_1 = createRandomizedNote();
    let note_2 = undefined;
    let note_3 = undefined;
    let a = 0;

   //Generating the note map
   // Be careful not to allow two notes to overlap with each other, try using get column and roll to make chords
   if(current_time < 0) {
       chord_time = 0; // waits until the map starts before chord progression
   } 
   if(current_time > 0) { // NOTE WARNING, THE REST OF THE CODE IS INSIDE THIS CURRENT TIME
        // First Segment
        if(current_time < 325) {
            note_1 = undefined;
        }
            
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
