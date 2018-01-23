'use strict';

const CELL_EMPTY='empty';
const CELL_CITY='city';
const CELL_MINE='mine';
const CELL_LINE='line';
const CELL_TURN='turn';
const CELL_CROSS='cross';
const PLAYGROUND_SIZE = 13;
const QUANTITY_MINES = 5;

function randomType() {
    let min = 1;
    let max = 10;
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    //rand = 1;
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

        let scoreDiv = document.createElement('div');
        scoreDiv.setAttribute("id", "scoreDivId");
        scorePanel.appendChild(scoreDiv);
        document.getElementById("scoreDivId").textContent = "Игрок1 " + players.score1 + ":" + players.score2 + " Игрок2";
    },

    showNewCard() {
        let newCardInHTML = document.createElement('img');
        newCardInHTML.setAttribute("src", "img/"+newCard.type+game.round+".svg");
        newCardInHTML.setAttribute("class", "newCardImg");
        newCardInHTML.setAttribute("id", "newCardImg");
        cardPanel.insertBefore(newCardInHTML, cardPanel.firstChild);
    },

    finish() {
        let confStart = confirm("Игра окончена! Победил Игрок" + game.round + ". Начать новую игру?");
        if (confStart) game.start();
        else game.newRound();
    }
};

let playground = {
    size: PLAYGROUND_SIZE,
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
        playgroundMassive[7][1].owner = 1;
        playgroundMassive[7][13].owner = 2;
        this.renderPlayground();
    },
    renderPlayground() {
        for (let i = 1; i <= this.size; i++) {
            for (let j = 1; j <= this.size; j++) {
                let newCell = document.createElement('img');
                newCell.setAttribute("id", "p" + i + "_" + j);
                newCell.setAttribute("class", playgroundMassive[i][j].type);
                if (i===7 && j===1) {
                    newCell.style.backgroundColor = "#a4a4a4"
                }
                if (i===7 && j===13) {
                    newCell.style.backgroundColor = "#ffc833"
                }
                newCell.addEventListener("click", function change(event) {
                    let target = event.target;
                    let targetId = target.id.toString();
                    let i = getIndexI(targetId), j = getIndexJ(targetId);
                    if (playground.canBuild(i, j)) {
                        target.setAttribute("class", newCard.type + game.round);
                        target.style.transform = 'rotate(' + newCard.angle + 'deg)';

                        for (let key in newCard) {
                            playgroundMassive[i][j][key] = newCard[key];
                        }
                        playgroundMassive[i][j].owner = game.round;
                        playground.isScore(i,j);
                        if (players.isWin()) game.finish();
                        else game.newRound();
                    }
                    else alert("Нельзя!");
                });
                playgroundPanel.appendChild(newCell);
            }
        }
    },

    isRoadsConnection(side1, owner1, side2, owner2) {
        if (side1 === 1 && side1 === side2 && owner1 === owner2) return true;
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
            (playground.isRoadsConnection(newCard.up(), newCard.owner,  playgroundMassive[i-1][j].down(), playgroundMassive[i-1][j].owner) ||
             playground.isRoadsConnection(newCard.right(), newCard.owner,  playgroundMassive[i][j+1].left(), playgroundMassive[i][j+1].owner) ||
             playground.isRoadsConnection(newCard.down(), newCard.owner, playgroundMassive[i+1][j].up(), playgroundMassive[i+1][j].owner) ||
             playground.isRoadsConnection(newCard.left(), newCard.owner, playgroundMassive[i][j-1].right(), playgroundMassive[i][j-1].owner)
            )) return true;
        else return false;
    },

    isMine(i,j) {
        if (playgroundMassive[i][j].type === CELL_MINE) {
            console.log(playgroundMassive[i][j].owner);
            return true;
        }
        else return false;
    },

    grabMine(i, j) {

        playgroundMassive[i][j].owner = game.round;
        players.upScore();
        playgroundMassive[i][j].directions = 0b0000;
        console.log(playgroundMassive[i][j].owner);
        console.log(playgroundMassive[i][j].directions);
    },

    isScore(i,j) {
        console.log(i,j);
        if (this.isMine(i-1,j) &&  playgroundMassive[i-1][j].owner === 0) {
            this.grabMine(i-1,j);

        }
        else if (this.isMine(i,j+1) && playgroundMassive[i][j+1].owner === 0) {
            this.grabMine(i,j+1);
        }
        else if (this.isMine(i+1,j) && playgroundMassive[i+1][j].owner === 0) {
            this.grabMine(i+1,j);
        }
        else if (this.isMine(i,j-1) && playgroundMassive[i][j-1].owner === 0) {
            this.grabMine(i,j-1);
        }

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
        this.angle = 0;
        switch (this.type) {
            case CELL_CITY :
                this.directions = 0b1111;  //up right down left
                this.owner = 0;
                break;
            case CELL_MINE :
                this.directions = 0b1111;
                this.owner = 0;
                break;
            case CELL_EMPTY :
                this.directions = 0b0000;
                this.owner = 0;
                break;
            case CELL_LINE :
                this.directions = 0b1010;
                this.owner = game.round;
                break;
            case CELL_TURN :
                this.directions = 0b1100;
                this.owner = game.round;
                break;
            case CELL_CROSS :
                this.directions = 0b1101;
                this.owner = game.round;
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
let players = {
  score1: 0,
  score2: 0,

  upScore() {
      if(game.round === 1) this.score1++;
      else this.score2++;
  },

  isWin() {
      if (Math.min(this.score1, this.score2) + QUANTITY_MINES - this.score1 - this.score2 < Math.max(this.score1, this.score2)){
          return true;
      }
      else return false;
  }

};
game.start();



