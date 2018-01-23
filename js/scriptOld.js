'use strict';
let a = 8;
let card = {
    up: 0,
    left: 0,
    down: 0,
    right: 0,
    type: 0,
    angle: 0
};

let playgroundMassive;
let newCard;

function createCell(row, column) {
    let newCell = document.createElement('img');
    newCell.setAttribute("id", "p" + column + "_" + row);
    //alert("row="+row +" col="+column+" " + playgroundMassive[row][column].type);
    //if (row==7 && column==1) alert(playgroundMassive[column][row].type);
    switch (playgroundMassive[row][column].type) {
        case -1 :
            newCell.setAttribute("class", "city");
            break;
        case 0 :
            newCell.setAttribute("class", "tree");
            break;
        case -2 :
            newCell.setAttribute("class", "mine");
            break;
    }
    newCell.addEventListener("click", function change(event) {
        let target = event.target;
        target.setAttribute("class", getStringTypeOfNewCard(newCard));
        target.style.transform = 'rotate('+newCard.angle+'deg)';
        newCardImg.remove();
        newCard = generateNewCard();
    });
    playground.appendChild(newCell);
}


function renderPlayground(size) {
    for (let i = 1; i <= size; i++) {
        for (let j = 1; j <= size; j++) {
            createCell(i, j);
        }
    }
}

function Create2DArray(rows) {
    let arr = [];

    for (let i=0;i<rows;i++) {
        arr[i] = [];
    }

    return arr;
}

function createCardsInPlayground(size) {
    playgroundMassive = Create2DArray(size+2);

    for (let i = 0; i<size+2; i++) {
        for (let j = 0; j<size+2; j++) {
            playgroundMassive[i][j] = card;
            if (i==1 && j==1) playgroundMassive[i][j].type = -1;
            else playgroundMassive[i][j].type = 0;
            //alert(i +" "+j+" " + playgroundMassive[i][j].type);
            //playgroundMassive[1][1].type = -1;
        }
    }
}

function random(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

function generateNewCard() {
    newCard = card;
    newCard.type = random(1,3);
    switch (newCard.type) {
        case 1 :
            newCard.up = 2;
            newCard.left = 1;
            newCard.down = 2;
            newCard.right = 1;
            break;
        case 2 :
            newCard.up = 2;
            newCard.left = 1;
            newCard.down = 1;
            newCard.right = 2;
            break;
        case 3 :
            newCard.up = 2;
            newCard.left = 2;
            newCard.down = 1;
            newCard.right = 2;
            break;
    }
    newCard.angle = 0;
    showNewCard(newCard);
    return newCard;
}

function showNewCard(card) {
    let newCard = document.createElement('img');
    newCard.setAttribute("src", "img/"+getStringTypeOfNewCard(card)+".svg");
    newCard.setAttribute("class", "newCardImg");
    newCard.setAttribute("id", "newCardImg");
    cardPanel.appendChild(newCard);
}

function rotateCardLeft(card) {
    let save = card.right;
    card.right = card.down;
    card.down = card.left;
    card.left = card.up;
    card.up = save;
    newCard.angle-=90;
    return card;
}

function rotateCardRight(card) {
    let save = card.up;
    card.up = card.left;
    card.left = card.down;
    card.down = card.right;
    card.right = save;
    newCard.angle+=90;
    return card;
}

function getStringTypeOfNewCard(card) {
    switch (card.type) {
        case 1 :
            return "line";
            break;
        case 2 :
            return "turn";
            break;
        case 3 :
            return "cross";
            break;
    }
}


let size = 13;
createCardsInPlayground(size);
renderPlayground(size);

newCard = generateNewCard();
left.addEventListener("click", function rotate(event) {
    rotateCardLeft(newCard);
    newCardImg.style.transform = 'rotate('+newCard.angle+'deg)';
});
right.addEventListener("click", function rotate(event) {
    rotateCardRight(newCard);
    newCardImg.style.transform = 'rotate('+newCard.angle+'deg)';
});




/*
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
 */

/*
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
                this.up = 1;
                this.right = 1;
                this.down = 1;
                this.left = 1;
                break;
            case "mine" :
                this.up = 0;
                this.right = 0;
                this.down = 0;
                this.left = 0;
                break;
            case "empty" :
                this.up = 0;
                this.right = 0;
                this.down = 0;
                this.left = 0;
                break;
            case "line" :
                this.up = 1;
                this.right = 0;
                this.down = 1;
                this.left = 0;
                break;
            case "turn" :
                this.up = 1;
                this.right = 1;
                this.down = 0;
                this.left = 0;
                break;
            case "cross" :
                this.up = 1;
                this.right = 1;
                this.down = 0;
                this.left = 1;
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
 */