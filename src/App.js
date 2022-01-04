import { useEffect, useState } from 'react';
import './App.css';
import astar from './astar';
import astarV2 from './astarV2';
import "./console.css";

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
  const [loopInterval, setLoopInterval] = useState(10)

  //Grid Administration
  const [grid, setGrid] = useState([])
  const [gridX, setGridX] = useState(40)
  const [gridY, setGridY] = useState(40)
  const [tileSize, setTilesize] = useState(0)
  const [draw, setDraw] = useState(true)

  const [consoleInputs, setConsoleInputs] = useState([<div>Hover on Board and Press Key to draw:<br/>W: Wall<br/>G: Weight<br/>Space: Erase<br/>Press Key Again to stop Drawing</div>, <div>Type Commands to control the Sorting:<br/>start: Starts the Sort<br/>reset: reset the field<br/>resize (10-40): set new size of grid<br/>speed (1-3): adjust loop speed<br/><sm style={{color: "red"}}>If value is not in Range, there may occur errors</sm></div>])
  const [command, setCommand] = useState("")

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


  function reset() {
    setDraw(true)
    generateGrid()
  }

  //Used to adjust the Animation Loop.
  //Takes e -> e.target.value and sets that as the new Interval for the Loop
  function changeLoopInterval(val) {
    console.log(val)
    let tempInterval = 1
    switch (val) {
      case "1": tempInterval = 500; break;
      case "2": tempInterval = 100; break;
      case "3": tempInterval = 20; break;
      default: tempInterval = 50; break;
    }
    if (draw) { tempInterval = 20 } //to set the Interval while drawing
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
    let sc = Math.abs(gridX/5)
    let ec = Math.abs(gridX/5*4)
    tempGrid[sc][sc] = { ...tempGrid[sc][sc], style: { backgroundColor: "#109f10" }, status: "start" }
    startTile = { ...tempGrid[sc][sc], style: { backgroundColor: "#109f10" }, status: "start" }
    tempGrid[ec][ec] = { ...tempGrid[ec][ec], style: { backgroundColor: "#10109f" }, status: "end" }
    endTile = { ...tempGrid[ec][ec], style: { backgroundColor: "#10109f" }, status: "end" }
    setGrid(tempGrid)
  }

  //styles Grid according to Windowsize and Tile Amount
  function gridStyle() {
    let xmargin = (window.innerWidth - (window.innerWidth * 0.5)) / gridX
    let ymargin = (window.innerHeight - (window.innerHeight * 0.2)) / gridY
    setTilesize(xmargin < ymargin ? xmargin : ymargin) //chooses the smaller size so the Grid fits perfectly
  }

  function drawTile(rowId, tileId) {
    if (draw) {
      //Check which key is Pressed: W=Wand, G=Gewicht SPACE=Leeres_Feld 
      if (drawType === "wall") { //Wand
        tempGrid[rowId][tileId] = { ...tempGrid[rowId][tileId], weight: 1000000, style: { backgroundColor: "#404040" } }
      } else if (drawType === "weight") { //Gewicht
        tempGrid[rowId][tileId] = { ...tempGrid[rowId][tileId], weight: 1, style: { backgroundColor: "#e7a7a7" } }
      } else if (drawType === "none") { //leer
        tempGrid[rowId][tileId] = { ...tempGrid[rowId][tileId], weight: 0, style: { backgroundColor: "#e7e7e7" } }
      }
    }
  }

  function commandInput(e) {
    if(e.keyCode === 13 && command !== ""){
      let input = command.split(" ")
      switch (input[0].toLowerCase()) {
        case "start":
          startSort()
          input = "Starting the Sorting Process."
          drawType = 0
        break;
        case "reset":
            reset()
            gridStyle()
            drawType = 0
          input = "Resetting the Grid."
        break;
        case "resize":
          setGridX(input[1] || 20)
          setGridY(input[1] || 20)
          input = "Adjusted Grid size, reset the Grid for this to take effect."
        break;
        case "speed":
          changeLoopInterval(input[1] || 3)
          input = "Changing the loop speed."
          break;
        default:
          input = "There was an error, \"" + input + "\" is unknown"
      }
      setConsoleInputs([...consoleInputs, input])
      setCommand("")
    }else{
      setCommand(e.target.value)
    }
  }



  //Setup, only executes at Start
  useEffect(() => {
    generateGrid()
    gridStyle()
    updateInterval = setInterval(() => loop(), 10)
  }, [])



  return (
    <div className="app">
      <div style={{position:"absolute", top:0, left:0, fontSize:"0.5rem"}}>
        {counter}
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
      <div className='console'>
        <div className='console-text'>
            <ul>
              {consoleInputs.map((text,id) => <li key={id}>{text}</li>)}
            </ul>
        </div>
        <div className='console-input' >
          <div className='label'>Console Input</div>
          <input type="text"  className="input" onKeyDown={commandInput} value={command} onChange={commandInput} />
        </div>
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
