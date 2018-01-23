'use strict';

function randomType() {
    let min = 1;
    let max = 10;
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    if (rand <= 4) return "line";
    else if ( rand <= 7) return "turn";
    else return "cross";
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
        if ('0' <= strId.charAt(5) && '9' >= strId.charAt(5)) return (strId[4]-'0')*10+(strId[3]-'0');
        else return (strId[4]-'0');
    }
    else {
        if ('0' <= strId.charAt(4) && '9' >= strId.charAt(4)) return (strId[3]-'0')*10+(strId[4]-'0');
        else return (strId[3]-'0');
    }
}

let playground = {
    size: 13,
    create() {
        playArr = Create2DArray(this.size+2);

        for (let i = 0; i<this.size+2; i++) {
            for (let j = 0; j<this.size+2; j++) {
                if (i===7 && j===1 || i===7 && j===13) playArr[i][j] = new Card("city");
                else if (j === 7 && (i === 1 || i === 4 || i === 7 || i === 10 || i === 13)) playArr[i][j] = new Card("mine");
                else playArr[i][j] = new Card("empty");
                //console.log(playArr[i][j]);
            }
        }
        this.renderPlayground();
    },
    renderPlayground() {
        for (let i = 1; i <= this.size; i++) {
            for (let j = 1; j <= this.size; j++) {
                let newCell = document.createElement('img');
                newCell.setAttribute("id", "p" + i + "_" + j);
                newCell.setAttribute("class", playArr[i][j].type);
                newCell.addEventListener("click", function change(event) {
                    let target = event.target;
                    let targetId = target.id.toString();
                    let i = getIndexI(targetId), j = getIndexJ(targetId);
                    if (playground.canBuild(i, j)) {
                        target.setAttribute("class", newCard.type);
                        target.style.transform = 'rotate(' + newCard.angle + 'deg)';
                        for (let key in newCard) {
                            playArr[i][j][key] = newCard[key];
                        }
                        console.log(playArr[i][j]);
                        newCardImg.remove();
                        newCard = new Card(0);
                        newCard.showNewCard();
                    }
                    else alert("Нельзя!");
                });
                playgroundPanel.appendChild(newCell);
            }
        }
    },

    canBuild(i,j) {
        console.log(newCard);
        if (playArr[i][j].type != "empty") return false;
        if (newCard.up === 1 && (playArr[i-1][j].type==="line" || playArr[i-1][j].type==="turn" || playArr[i-1][j].type==="cross") && playArr[i-1][j].down != 1) return false;
        if (newCard.up === 0 && (playArr[i-1][j].type==="line" || playArr[i-1][j].type==="turn" || playArr[i-1][j].type==="cross") && playArr[i-1][j].down != 0) return false;
        if (newCard.right === 1 && (playArr[i][j+1].type==="line" || playArr[i][j+1].type==="turn" || playArr[i][j+1].type==="cross") && playArr[i][j+1].left != 1) return false;
        if (newCard.right === 0 && (playArr[i][j+1].type==="line" || playArr[i][j+1].type==="turn" || playArr[i][j+1].type==="cross") && playArr[i][j+1].left != 0) return false;
        if (newCard.down === 1 && (playArr[i+1][j].type==="line" || playArr[i+1][j].type==="turn" || playArr[i+1][j].type==="cross") && playArr[i+1][j].up != 1) return false;
        if (newCard.down === 0 && (playArr[i+1][j].type==="line" || playArr[i+1][j].type==="turn" || playArr[i+1][j].type==="cross") && playArr[i+1][j].up != 0) return false;
        if (newCard.left === 1 && (playArr[i][j-1].type==="line" || playArr[i][j-1].type==="turn" || playArr[i][j-1].type==="cross") && playArr[i][j-1].right != 1) return false;
        if (newCard.left === 0 && p(playArr[i][j-1].type==="line" || playArr[i][j-1].type==="turn" || playArr[i][j-1].type==="cross") && playArr[i][j-1].right != 0) return false;

        return true;
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
            case "city" :
                this.directions = 0b1111;  //up right down left
                break;
            case "mine" :
                this.directions = 0b0000;
                break;
            case "empty" :
                this.directions = 0b0000;
                break;
            case "line" :
                this.directions = 0b1010;
                break;
            case "turn" :
                this.directions = 0b1100;
                break;
            case "cross" :
                this.directions = 0b1101;
                break;
        }
    }
    rotate(side) {
        if (side === 1) {
            let save = this.left;
            this.left = this.down;
            this.down = this.right;
            this.right = this.up;
            this.up = save;
            this.angle +=90;
        }
        else {
            let save = this.right;
            this.right = this.down;
            this.down = this.left;
            this.left = this.up;
            this.up = save;
            this.angle -=90;
        }
    }

    showNewCard() {
        let newCardInHTML = document.createElement('img');
        newCardInHTML.setAttribute("src", "img/"+this.type+".svg");
        newCardInHTML.setAttribute("class", "newCardImg");
        newCardInHTML.setAttribute("id", "newCardImg");
        cardPanel.appendChild(newCardInHTML);
    }
}
let playArr;
let newCard = new Card(0);
newCard.showNewCard();
playground.create();


left.addEventListener("click", function rotate(event) {
    newCard.rotate(-1);
    newCardImg.style.transform = 'rotate('+newCard.angle+'deg)';
});
right.addEventListener("click", function rotate(event) {
    newCard.rotate(1);
    newCardImg.style.transform = 'rotate('+newCard.angle+'deg)';
});
