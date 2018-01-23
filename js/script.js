'use strict';

const CELL_EMPTY='empty';
const CELL_CITY='city';
const CELL_MINE='mine';
const CELL_LINE='line';
const CELL_TURN='turn';
const CELL_CROSS='cross';

function randomType() {
    let min = 1;
    let max = 10;
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    if (rand <= 4) return CELL_LINE;
    else if ( rand <= 7) return CELL_TURN;
    else return CELL_CROSS;
}

function Create2DArray(rows) {
    let arr = [];

    for (let i=0;i<rows;i++) {
        arr[i] = [];
    }

    return arr;
}

function getIndexI(strId) {
    if (strId[2] != '_') return (strId[1]-'0')*10+(strId[2]-'0');
    else return (strId[1]-'0');
}


function getIndexJ(strId) {
    if (strId[2] != '_') {
        if ('0' <= strId.charAt(5) && '9' >= strId.charAt(5)) return (strId[4]-'0')*10+(strId[5]-'0');
        else return (strId[4]-'0');
    }
    else {
        if ('0' <= strId.charAt(4) && '9' >= strId.charAt(4)) return (strId[3]-'0')*10+(strId[4]-'0');
        else return (strId[3]-'0');
    }
}

let game = {

    round: 1,

    start() {
        newCard = new Card(0);
        this.showNewCard();
        playground.create();
        this.showRound();
        left.addEventListener("click", function rotate(event) {
            newCard.rotate(-1);
            newCardImg.style.transform = 'rotate('+newCard.angle+'deg)';
        });
        right.addEventListener("click", function rotate(event) {
            newCard.rotate(1);
            newCardImg.style.transform = 'rotate('+newCard.angle+'deg)';
        });
        skip.addEventListener("click", function rotate(event) {
            game.newRound();
        });
    },

    newRound() {
        if (this.round === 1) this.round = 2;
        else this.round = 1;
        this.showRound();
        newCardImg.remove();
        newCard = new Card(0);
        this.showNewCard();
    },

    showRound() {
        let roundDiv = document.createElement('div');
        roundDiv.setAttribute("id", "roundDivId");
        roundPanel.appendChild(roundDiv);
        document.getElementById("roundDivId").textContent = "Ходит Игрок" + this.round;
    },

    showNewCard() {
        let newCardInHTML = document.createElement('img');
        newCardInHTML.setAttribute("src", "img/"+newCard.type+".svg");
        newCardInHTML.setAttribute("class", "newCardImg");
        newCardInHTML.setAttribute("id", "newCardImg");
        cardPanel.insertBefore(newCardInHTML, cardPanel.firstChild);
    }
};

let playground = {
    size: 13,
    create() {
        playgroundMassive = Create2DArray(this.size+2);

        for (let i = 0; i<this.size+2; i++) {
            for (let j = 0; j<this.size+2; j++) {
                if (i===7 && j===1 || i===7 && j===13) playgroundMassive[i][j] = new Card(CELL_CITY);
                else if (j === 7 && (i === 1 || i === 4 || i === 7 || i === 10 || i === 13)) playgroundMassive[i][j] = new Card(CELL_MINE);
                else playgroundMassive[i][j] = new Card(CELL_EMPTY);
                //console.log(playgroundMassive[i][j]);
            }
        }
        this.renderPlayground();
    },
    renderPlayground() {
        for (let i = 1; i <= this.size; i++) {
            for (let j = 1; j <= this.size; j++) {
                let newCell = document.createElement('img');
                newCell.setAttribute("id", "p" + i + "_" + j);
                newCell.setAttribute("class", playgroundMassive[i][j].type);
                newCell.addEventListener("click", function change(event) {
                    let target = event.target;
                    let targetId = target.id.toString();
                    let i = getIndexI(targetId), j = getIndexJ(targetId);
                    if (playground.canBuild(i, j)) {
                        target.setAttribute("class", newCard.type);
                        target.style.transform = 'rotate(' + newCard.angle + 'deg)';
                        for (let key in newCard) {
                            playgroundMassive[i][j][key] = newCard[key];
                        }
                        game.newRound();
                    }
                    else alert("Нельзя!");
                });
                playgroundPanel.appendChild(newCell);
            }
        }
    },

    isRoadsConnection(side1, side2) {
        if (side1 === 1 && side1 === side2) return true;
        else return false;
    },

    isCorrect(side1, side2, type) {
        if (type === CELL_EMPTY || side1 === side2) return true;
        else return false;
    },

    canBuild(i,j) {
        if (playgroundMassive[i][j].type != CELL_EMPTY)
            return false;
        else if (playground.isCorrect(newCard.up(),  playgroundMassive[i-1][j].down(), playgroundMassive[i-1][j].type) &&
            playground.isCorrect(newCard.right(),  playgroundMassive[i][j+1].left(), playgroundMassive[i][j+1].type) &&
            playground.isCorrect(newCard.down(),  playgroundMassive[i+1][j].up(), playgroundMassive[i+1][j].type) &&
            playground.isCorrect(newCard.left(),  playgroundMassive[i][j-1].right(), playgroundMassive[i][j-1].type) &&
            (playground.isRoadsConnection(newCard.up(),  playgroundMassive[i-1][j].down()) ||
             playground.isRoadsConnection(newCard.right(),  playgroundMassive[i][j+1].left()) ||
             playground.isRoadsConnection(newCard.down(),  playgroundMassive[i+1][j].up()) ||
             playground.isRoadsConnection(newCard.left(),  playgroundMassive[i][j-1].right())
            )) return true;
        else return false;
    }
};

class Card {
    constructor(type) {
        if (type != 0) {
            this.type = type;
        }
        else {
            this.type = randomType();
        }
        this.owner = 1;
        this.angle = 0;
        switch (this.type) {
            case CELL_CITY :
                this.directions = 0b1111;  //up right down left
                break;
            case CELL_MINE :
                this.directions = 0b1111;
                break;
            case CELL_EMPTY :
                this.directions = 0b0000;
                break;
            case CELL_LINE :
                this.directions = 0b1010;
                break;
            case CELL_TURN :
                this.directions = 0b1100;
                break;
            case CELL_CROSS :
                this.directions = 0b1101;
                break;
        }
    }
    rotate(side) {
        if (side === 1) {
            if ((this.directions & 0b0001) != 0) this.directions = (this.directions>>>1) | 0b1000;
            else this.directions = this.directions>>>1;
            this.angle +=90;
        }
        else {
            if ((this.directions & 0b1000) != 0) this.directions = ((this.directions<<1)&0b01111) | 0b0001;
            else this.directions = this.directions<<1;
            this.angle -=90;
        }
    }

    up() {
        if ((this.directions & 0b1000) != 0) return 1;
        else return 0;
    }
    right() {
        if ((this.directions & 0b0100) != 0) return 1;
        else return 0;
    }
    down() {
        if ((this.directions & 0b0010) != 0) return 1;
        else return 0;
    }
    left() {
        if ((this.directions & 0b0001) != 0) return 1;
        else return 0;
    }
}


let playgroundMassive;
let newCard;
game.start();



