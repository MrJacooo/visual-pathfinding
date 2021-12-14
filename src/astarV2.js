export default function astarV2(grid, start, end, gridx = 40, gridy = 40) {
    let exitByTries = 0
    let closedList = []
    let openList = [{ ...start, f: 0, g: 0 }]

    //currently selected Search center
    let q

    //Successors of Q
    let successors = []

    //Skip sucessor
    let skipSuccessor
    while (openList.length > 0 && exitByTries < 2000) {
        successors = []
        
        //sort so smalles F is at start 
        openList.sort((a, b) => a.f > b.f ? 1 : a.f < b.f ? -1 : 0)
        
        //Set q to Tile with smalles F and remove it from list
        q = openList.shift()
        console.log(q)
        
        //generate q's 8 Successors
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                //If node isnt q
                if (!(x === 0 && y === 0)) {
                    //if node is in grid
                    if (!(q.x + x < 0) && !(q.y + y < 0) && !(q.x + x > gridx-1) && !(q.y + y > gridy-1)) {
                        //add Successor to list and set its Parent to Q (Copy)
                        if ((x === 1 && y !== 0) || (x === -1 && y !== 0)) {
                            //edge
                            successors = [...successors, { ...grid[q.x + x][q.y + y], parent: q, distanceToQ: 1.41 }]
                        } else {
                            //non edge
                            successors = [...successors, { ...grid[q.x + x][q.y + y], parent: {x:q.x, y:q.y}, distanceToQ: 1 }]
                        }
                    }
                }
            }
        }
        
        //for each successor
        for (let i = 0; i < successors.length; i++) {
            skipSuccessor = false

            //If successor is End, exit
            if (successors[i].x === end.x && successors[i].y === end.y) {
                closedList.push(successors[i])
                exitByTries = 10000
            }

            //set price from start
            successors[i].g = q.g + successors[i].distanceToQ  + successors[i].weight 

            //estimate price to end
            successors[i].h = getH(successors[i], end)

            //Set overall estimated price
            successors[i].f = successors[i].g + successors[i].h

            for(let j = 0; j<openList.length; j++){
                if(openList[j].x == successors[i].x && openList[j].y == successors[i].y){
                    if(openList[j].f <= successors[i].f){
                        skipSuccessor = true
                    }
                }
            }

            for(let j = 0; j<closedList.length; j++){
                if(closedList[j].x == successors[i].x && closedList[j].y == successors[i].y){
                    if(closedList[j].f <= successors[i].f){
                        skipSuccessor = true
                    }
                }
            }

            if(skipSuccessor == false){
                openList.push(successors[i])
            }

            // //if Tile with smaller f than successor exists on openlist or closed list, skip this node ELSE add successor to openlist
            // if (openList[openList.findIndex(element => (element.x == successors[i].x && element.y == successors[i].y))]?.f <= successors[i].f || closedList[closedList.findIndex(element => (element.x == successors[i].x && element.y == successors[i].y))]?.f <= successors[i].f) {
            //     //skip
            //     console.log("skip")
            // } else {
            //     openList.push(successors[i])
            // }
        }

        //add q to closedlist
        closedList.push(q)
        exitByTries++
    }
    console.log("Index found:", closedList.findIndex(element => (element.x === end.x && element.y === end.y)))
    return closedList
}

function getH(tile, end) {
    let xdiff = Math.abs(tile.x - end.x)
    let ydiff = Math.abs(tile.y - end.y)
    return Math.sqrt(xdiff*xdiff + ydiff*ydiff)
}


//return Distance between two Numbers
const diff = (a, b) => a > b ? a - b : b - a

