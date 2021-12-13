export default function astar(grid, start, end, gridx = 40, gridy = 40) {
    let exitByTries = 0
    let closedList = []
    let openList = [{ ...start, f: 0, g: 0 }]

    //currently selected Search center
    let q

    //Successors of Q
    let successors = []
    while (openList.length > 0 && exitByTries < 1000) {
        successors = []

        //sort so smalles F is at start 
        openList.sort((a, b) => a.f > b.f ? 1 : a.f < b.f ? -1 : 0)

        //Set q to Tile with smalles F and remove it from list
        q = openList.shift()
        console.log(q.f)

        //generate q's 8 Successors
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                //If node isnt q
                if (!(x === 0 && y === 0)) {
                    //if node is in grid
                    if (!(q.x + x < 0) && !(q.y + y < 0) && !(q.x + x > gridx) && !(q.y + y > gridy)) {
                        //add Successor to list and set its Parent to Q (Copy)
                        if ((x === 1 && y !== 0) || (x === -1 && y !== 0)) {
                            //edge
                            successors = [...successors, { ...grid[q.x + x][q.y + y], parent: q, distanceToQ: 1.41 }]
                        } else {
                            //non edge
                            successors = [...successors, { ...grid[q.x + x][q.y + y], parent: q, distanceToQ: 1 }]
                        }
                    }
                }
            }
        }

        //for each successor
        for (let i = 0; i < successors.length; i++) {
            //If successor is End, exit
            if (successors[i].x === end.x && successors[i].y === end.y) {
                closedList.push(successors[i])
                exitByTries = 1000
            }

            //set price from start
            successors[i].g = (q.g * 100 + successors[i].distanceToQ * 100 + successors[i].weight * 100) / 100

            //estimate price to end
            successors[i].h = getH(successors[i], end)

            //Set overall estimated price
            successors[i].f = Math.round((successors[i].g + successors[i].h) * 100, 2) / 100

            //if Tile with smaller f than successor exists on openlist or closed list, skip this node ELSE add successor to openlist
            if (successors[openList.findIndex(element => (element.x === successors[i].x && element.y && successors[i].y))]?.f < successors[i].f || successors[closedList.findIndex(element => (element.x === successors[i].x && element.y && successors[i].y))]?.f < successors[i].f) {
            } else {
                openList.push(successors[i])
            }
        }

        //add q to closedlist
        closedList.push(q)
        exitByTries++
    }
    console.log("Index found:", closedList.findIndex(element => (element.x === end.x && element.y === end.y)))
}

function getH(tile, end) {
    let diffX = diff(tile.x, end.x)
    let diffY = diff(tile.y, end.y)
    let straights = diff(diffX, diffY)
    let edges = diffX > diffY ? diffY : diffX
    return (straights * 1) + (edges * 1.41)
}


//return Distance between two Numbers
const diff = (a, b) => a > b ? a - b : b - a