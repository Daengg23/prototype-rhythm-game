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
const hit_display = document.querySelector(".hit-display");

let key_1_hold = false;
let key_2_hold = false;
let key_3_hold = false;
let key_4_hold = false;

let current_time = 0;
let chord_time = 0;
let larger_chord_time = 0;
let note_density = 100;
let score = 0;
let combo = 0;
let misses = 0;

let test_audio = new Audio('freedomdive.mp3'); // NOTE audio is failing to play, fix later
//test_audio.play();



window.setInterval(() => {
    current_time++;
    chord_time++;
    larger_chord_time++;
    updateScoreBoard();

}, 1);

window.addEventListener("keydown", (e) => { // use keydown
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
});

window.addEventListener("keyup", (e) => { // use keydown
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
});

function updateScoreBoard() {
    score_board.innerHTML = score;
}

function registerClick(column) {
   try {
       switch(column) {
        case 1:
            column_1.removeChild(document.querySelectorAll("#column-1 .note")[0]); // gets the first child inside column 1
            break;
        case 2:
            column_2.removeChild(document.querySelectorAll("#column-2 .note")[0]);
            break;
        case 3:
            column_3.removeChild(document.querySelectorAll("#column-3 .note")[0]); 
            break;
        case 4:
            column_4.removeChild(document.querySelectorAll("#column-4 .note")[0]); 
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
    constructor(column, timing, sound="") {
        this.column = column;
        this.timing = timing;
        this.sound = sound;
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
        noteEl.className = "note";
        column.appendChild(noteEl);

        // ignore for now
        const noteClass = document.querySelector(".note");
        const myStyle = getComputedStyle(noteClass);
        const tempAniDuration = parseInt(myStyle.animationDuration.substring(0, myStyle.animationDuration.length - 1));
        const aniDuration = tempAniDuration * 100;

        setTimeout(() => {
            if(document.body.contains(noteEl)) {
                miss();
            }
            noteEl.remove();
            
                
        }, 700); // animation duration is the delete time

    }, note.getTiming());
}

window.setInterval(() => {
    let note_1 = createRandomizedNote();
    let note_2 = createRandomizedNote();
    let note_3 = createRandomizedNote();
    let a = 0;
    
    while(
        (note_1.getColumn() === note_2.getColumn()) ||
        (note_1.getColumn() === note_3.getColumn()) ||
        (note_2.getColumn() === note_3.getColumn())) { // prevents duplicate notes on the same column
        
        note_1 = createRandomizedNote();
        note_2 = createRandomizedNote();
        note_3 = createRandomizedNote();
        a++;
    }
    
    
    /*
    if(larger_chord_time >= note_density * 2) {
        addNote(note_3);
        larger_chord_time = 0;
    }
    
/*
    if(chord_time >= note_density) {
        addNote(note_2);
        chord_time = 0;
    }

    addNote(note_1);
    
     */

    function checkRepeated() {
    while(
        (note_1.getColumn() === note_2.getColumn()) ||
        (note_1.getColumn() === note_3.getColumn())) {
            note_2 = createRandomizedNote();
            note_3 = createRandomizedNote();
        }
    }

    // CHORDS ARE OVERLAPPING IN A SINGLE COLUMN, ex. a 2 note chord may have 3 notes inside, and the third note fucks up your combo when it misses
    if(current_time > 0) { 
        if(chord_time < note_density * 2) {
            note_1 = roll(1);
            addNote(note_1);
        }
        if(chord_time > note_density * 2) {
            note_1 = roll(-1);
            addNote(note_1);
        } else if(chord_time == note_density * 2) {
            note_2 = roll(2);
            addNote(note_2);
        }
        if(chord_time > note_density * 4) { // note_1 would also get added, keep that in mind
            addNote(note_2);
            addNote(note_3);
            chord_time = 0;
        }
    }
    /*
    if(current_time > 100000) { // allows songs to be split up in generated sectons
        if(chord_time < note_density * 2) {
            note_1 = roll(1);
            addNote(note_1);
        }
        if(chord_time > note_density * 2) {
            note_1 = roll(2);
            addNote(note_1);
        }
        if(chord_time == note_density * 2) {
            addNote(note_2);
        }
        if(chord_time >  note_density * 4) {
            note_1 = roll(3);
            chord_time = 0;
            addNote(note_1);
            addNote(note_2);
            addNote(note_3);
        }
    }
    */


}, note_density)

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

    /* NOTE Work on preventing more than one note from being in one column
    while(column == temp) {
        column = Math.round(Math.random() * 3) + 1;
    }
    temp = column;
    */
    

    const timing = current_time; //Math.round(Math.random() * 1000);
    const note = new Note(column, timing);
    return note;
}

createRandomizedNote();
