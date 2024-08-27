export class Character {
    constructor(position,side) {
        this.position = position;
        this.kind = "Character"
    }
}

export class Pawn extends Character{
    constructor(position,side)
     {
        super(position)
        this.kind = "P"
        this.side = side;
    }
    
    move(direction) {
        if (direction === "L") {
            if (this.position[1] === 0) {
                return -1;
            } else {
                this.position[1] -= 1;
                return 1;
            }
        } else if (direction === "R") {
            if (this.position[1] === 4) {
                return -1;
            } else {
                this.position[1] += 1;
                return 1;
            }
        } else if (direction === "F") {
            if (this.position[0] === 0) {
                return -1;
            } else {
                this.position[0] -= 1;
                return 1;
            }
        } else if (direction === "B") {
            if (this.position[0] === 4) {
                return -1;
            } else {
                this.position[0] += 1;
                return 1;
            }
        }
    }
}

export class Hero1 extends Character{
    constructor(position,side) {
        super(position)
        this.side = side;
        this.kind = "H1"
    }
    
    move(direction) {
        if (direction === "L") {
            if (this.position[1] <= 1) {
                return -1;
            } else {
                this.position[1] -= 2;
                return 1;
            }
        } else if (direction === "R") {
            if (this.position[1] >= 3) {
                return -1;
            } else {
                this.position[1] += 2;
                return 1;
            }
        } else if (direction === "F") {
            if (this.position[0] <= 1) {
                return -1;
            } else {
                this.position[0] -= 2;
                return 1;
            }
        } else if (direction === "B") {
            if (this.position[0] >= 3) {
                return -1;
            } else {
                this.position[0] += 2;
                return 1;
            }
        }
    }
}

export class Hero2 extends Character{
    constructor(position,side) {
        super(position)  
        this.side = side;
        this.kind = "H2"
    }
    
    move(direction) {
        if (direction === "L") {
            if (this.position[1] <= 1) {
                return -1;
            } else {
                this.position[1] -= 2;
                return 1;
            }
        } else if (direction === "R") {
            if (this.position[1] >= 3) {
                return -1;
            } else {
                this.position[1] += 2;
                return 1;
            }
        } else if (direction === "F") {
            if (this.position[0] <= 1) {
                return -1;
            } else {
                this.position[0] -= 2;
                return 1;
            }
        } else if (direction === "B") {
            if (this.position[0] >= 3) {
                return -1;
            } else {
                this.position[0] += 2;
                return 1;
            }
        }
    }
}

