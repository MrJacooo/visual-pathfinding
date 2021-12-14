import { useEffect, useState } from 'react';
import './App.css';
import astar from './astar';

//TODO: ADD Algorithm
//TODO: Drawing Tiles
//TODO: ADD Grid Size customisation

//tempgrid[x][y]


//FIXME: Closedlist gets rechecked again and again


//TODO: FIX draw speed bug where the speed change does not change actual speed

//Setup for the Animation Loop
// loop is a function that is executed every upadteInterval. Modified via changeLoopInterval
var loop; var updateInterval; let tempGrid; let startTile; let endTile;

let drawType = "" //defines what tile is being drawn at the moment

//Vars for a* sort
let openlist = []
let closedlist = []
let q = {}

let sortedList = []
let parent = {}

function App() {
  //Loop Administration
  const [counter, setCounter] = useState(0)
  const [toggleLoop, setToggleLoop] = useState(true)//used to prevent the loop from continuing
  const [loopInterval, setLoopInterval] = useState(50)

  //Grid Administration
  const [grid, setGrid] = useState([])
  const [gridX, setGridX] = useState(40)
  const [gridY, setGridY] = useState(40)
  const [tileSize, setTilesize] = useState(0)
  const [draw, setDraw] = useState(true)


  //This is the Loop thats used to animate the Algorithm. Created via updateInterval
  loop = () => {
    if (toggleLoop) {
      setCounter(counter + 1)
    }
    if (!draw) {
      //TODO: periodical Sorting

      //search
      if(sortedList[0]){
        tempGrid[sortedList[0].x][sortedList[0].y] = sortedList[0]
        tempGrid[sortedList[0].x][sortedList[0].y].style = {backgroundColor : "lightblue"}
        sortedList.shift()

      //Find path
      }else{
        tempGrid[parent.x][parent.y].style = {backgroundColor: "magenta"}
        parent = tempGrid[parent.parent.x][parent.parent.y]
        if(parent.x == startTile.x && parent.y == startTile.y){
          tempGrid[startTile.x][startTile.y].style = {backgroundColor: "green"}
          tempGrid[endTile.x][endTile.y].style = {backgroundColor: "blue"}
          setDraw(true)
        }
      }
    }
  }

  //return Distance between two Numbers
  const diff = (a, b) => a > b ? a - b : b - a

  function getDistanceBetweenTiles(tile1, tile2) {
    let diffX = (diff(tile1.y, tile2.y) * diff(tile1.y, tile2.y))
    let diffY = (diff(tile1.x, tile2.x) * diff(tile1.x, tile2.x))
    //Pythagoras a^2+b^2=c^2, gerundet auf zwei stellen
    return Math.floor(Math.sqrt(diffX + diffY) * 100) / 100
  }

  //This function prepares all of the Tiles for the Sorting and initates the Algorithm
  function startSort() {
    console.log("starting sort")
    //Check if Start and End are defined
    if (endTile) {
      //getting the h for every tile
      for (let i = 0; i < gridY; i++) {
        for (let j = 0; j < gridX; j++) {
          tempGrid[i][j] = { ...tempGrid[i][j], h: getDistanceBetweenTiles(tempGrid[i][j], tempGrid[endTile.x][endTile.y]) } //generate ROW, y=ROW x=FILE
        }
      }
      
      sortedList = astar(tempGrid, startTile, endTile, gridX, gridY)
      parent = sortedList[sortedList.length -2]
      //preventing from drawing
      setDraw(false)
    } else {
      alert("Define Start and End by pressing the mouse Button (Green: Start, Blue: End)")
    }
  }


  function endSort() {
    setDraw(true)
  }

  //Used to adjust the Animation Loop.
  //Takes e -> e.target.value and sets that as the new Interval for the Loop
  function changeLoopInterval(val) {
    console.log(val)
    let tempInterval = 1
    switch (val) {
      case "1": tempInterval = 20; break;
      case "2": tempInterval = 100; break;
      case "3": tempInterval = 500; break;
      default: tempInterval = 50; break;
    }
    if (draw) { tempInterval = 50 } //to set the Interval while drawing
    setLoopInterval(val)
    clearInterval(updateInterval)
    updateInterval = setInterval(() => loop(), tempInterval)
  }

  //generates the Grid
  function generateGrid() {
    console.log("Generating Grid")
    tempGrid = [];
    for (let i = 0; i < gridX; i++) {
      tempGrid = [...tempGrid, []] //generate file
      for (let j = 0; j < gridY; j++) {
        tempGrid[i] = [...tempGrid[i], { y: j, x: i, h: 0, style: { backgroundColor: "#e7e7e7" }, weight: 0, f: Number.MAX_VALUE, g: Number.MAX_VALUE }] //generate ROW, y=ROW x=FILE
      }
    }
    //start and End Tile
    tempGrid[5][5] = { ...tempGrid[5][5], style: { backgroundColor: "#109f10" }, status: "start" }
    startTile = { ...tempGrid[5][5], style: { backgroundColor: "#109f10" }, status: "start" }
    tempGrid[34][34] = { ...tempGrid[34][34], style: { backgroundColor: "#10109f" }, status: "end" }
    endTile = { ...tempGrid[34][34], style: { backgroundColor: "#10109f" }, status: "end" }
    setGrid(tempGrid)
  }

  //styles Grid according to Windowsize and Tile Amount
  function gridStyle() {
    let xmargin = (window.innerWidth - (window.innerWidth * 0.2)) / gridX
    let ymargin = (window.innerHeight - (window.innerHeight * 0.2)) / gridY
    setTilesize(xmargin < ymargin ? xmargin : ymargin) //chooses the smaller size so the Grid fits perfectly
  }

  function drawTile(rowId, tileId) {
    if (draw) {
      //Check which key is Pressed: W=Wand, G=Gewicht SPACE=Leeres_Feld 
      if (drawType === "wall") { //Wand
        tempGrid[rowId][tileId] = { ...tempGrid[rowId][tileId], weight: 1000000, style: { backgroundColor: "#404040" } }
      } else if (drawType === "weight") { //Gewicht
        tempGrid[rowId][tileId] = { ...tempGrid[rowId][tileId], weight: 2, style: { backgroundColor: "#e7a7a7" } }
      } else if (drawType === "none") { //leer
        tempGrid[rowId][tileId] = { ...tempGrid[rowId][tileId], weight: 0, style: { backgroundColor: "#e7e7e7" } }
      }
    }
  }



  //Setup, only executes at Start
  useEffect(() => {
    generateGrid()
    gridStyle()
    updateInterval = setInterval(() => loop(), 100)
  }, [])



  return (
    <div className="app">
      <div className="header">
        {counter}
        <button onClick={() => { setToggleLoop(!toggleLoop) }}>Toggle Count Up</button>
        <input type="range" step="1" max="3" min="1" value={loopInterval} onChange={e => changeLoopInterval(e.target.value)}></input>
        <button onClick={startSort}>Start</button>
        <button onClick={endSort}>stop</button>
        <button onClick={() => astar(tempGrid, startTile, endTile, 40, 40)}>ASTAR</button>
      </div>
      <div className="grid">
        {grid.map((row, rowId) =>
          <div key={"row-" + rowId} style={{ height: tileSize }}>
            {row.map((tile, tileId) =>
              <button key={"row-" + rowId + "tile-" + tileId} style={{ height: tileSize, width: tileSize, ...tile.style }} onMouseOver={() => drawTile(rowId, tileId)} ></button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

//Listens for Key Inputs. Press once to Draw, then again to stop Drawing
window.addEventListener("keydown", e => {
  switch (e.key) {
    case "w":
      drawType = drawType === "" ? "wall" : ""
      break
    case "g":
      drawType = drawType === "" ? "weight" : ""
      break
    case " ":
      drawType = drawType === "" ? "none" : ""
      break;
    default:
      //alert("Key not recognized! w: Wand, g: Gewicht, SPACE: leeres Feld")
      break;
  }
})

export default App;
