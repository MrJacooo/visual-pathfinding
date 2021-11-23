import { useEffect, useState } from 'react';
import './App.css';

//TODO: ADD Algorithm
//TODO: Drawing nodes
//TODO: ADD Grid Size customisation


//TODO: FIX draw speed bug where the speed change does not change actual speed

//Setup for the Animation Loop
// loop is a function that is executed every upadteInterval. Modified via changeLoopInterval
var loop; var updateInterval = setInterval(() => loop(), 1); let tempGrid;
let drawType = "" //defines what tile is being drawn at the moment

let startEnd = 1 //Temporary variable to generate start and end

function App() {
  //Loop Administration
  const [counter, setCounter] = useState(0)
  const [toggleLoop, setToggleLoop] = useState(true)//used to prevent the loop from continuing
  const [loopInterval, setLoopInterval] = useState(1000)

  //Grid Administration
  const [grid, setGrid] = useState([])
  const [gridX, setGridX] = useState(20)
  const [gridY, setGridY] = useState(20)
  const [tileSize, setTilesize] = useState(0)
  const [draw, setDraw] = useState(true)

  //This is the Loop thats used to animate the Algorithm. Created via updateInterval
  loop = () => {
    if (toggleLoop) {
      setCounter(counter + 1)
    }
  }

  //Used to adjust the Animation Loop.
  //Takes e -> e.target.value and sets that as the new Interval for the Loop
  function changeLoopInterval(val) {
    console.log(val)
    let tempInterval = 1
    switch (val) {
      case "1": tempInterval = 1; break;
      case "2": tempInterval = 100; break;
      case "3": tempInterval = 500; break;
      default: tempInterval = 1; break;
    }
    if (draw) { tempInterval = 1 } //to set the Interval while drawing
    setLoopInterval(val)
    clearInterval(updateInterval)
    updateInterval = setInterval(() => loop(), tempInterval)
  }

  //generates the Grid
  function generateGrid() {
    tempGrid = [];
    for (let i = 0; i < gridY; i++) {
      tempGrid = [...tempGrid, []] //generate file
      for (let j = 0; j < gridX; j++) {
        tempGrid[i] = [...tempGrid[i], { x: j, y: i, style: { backgroundColor: "#e7e7e7" } }] //generate ROW, x=ROW y=FILE
      }
    }
    setGrid(tempGrid)
  }

  //styles Grid according to Windowsize and Tile Amount
  function gridStyle() {
    let xmargin = (window.innerWidth - (window.innerWidth * 0.2)) / gridX
    let ymargin = (window.innerHeight - (window.innerHeight * 0.2)) / gridY
    setTilesize(xmargin < ymargin ? xmargin : ymargin) //chooses the smaller size so the Grid fits perfectly
  }

  function drawNode(rowId, tileId) {
    if (draw) {
      //Check which key is Pressed: W=Wand, G=Gewicht
      if (drawType === "wall") { //Wand
        tempGrid[rowId][tileId] = { ...tempGrid[rowId][tileId], style: { backgroundColor: "#404040" } }
      } else if (drawType === "weight") { //Gewicht
        tempGrid[rowId][tileId] = { ...tempGrid[rowId][tileId], style: { backgroundColor: "#e7a7a7" } }
      } else if (drawType === "none") { //leer
        tempGrid[rowId][tileId] = { ...tempGrid[rowId][tileId], style: { backgroundColor: "#e7e7e7" } }
      }
    }
  }

  //Temporary function to draw start and end Nodes
  function addStartEnd(rowId, tileId) {
    if (startEnd === 1) {
      tempGrid[rowId][tileId] = { ...tempGrid[rowId][tileId], style: { backgroundColor: "#109f10" } }
    }
    if (startEnd === 2) {
      tempGrid[rowId][tileId] = { ...tempGrid[rowId][tileId], style: { backgroundColor: "#10109f" } }
    }
    startEnd++
  }

  //Setup, only executes at Start
  useEffect(() => {
    generateGrid()
    gridStyle()
  }, [])


  return (
    <div className="app">
      <div className="header">
        {counter}
        <button onClick={() => { setToggleLoop(!toggleLoop) }}>Toggle Count Up</button>
        <input type="range" step="1" max="3" min="1" value={loopInterval} onChange={e => changeLoopInterval(e.target.value)}></input>
      </div>
      <div className="grid">
        {grid.map((row, rowId) =>
          <div key={"row-" + rowId} style={{ height: tileSize }}>
            {row.map((tile, tileId) =>
              <button key={"row-" + rowId + "tile-" + tileId} style={{ height: tileSize, width: tileSize, ...tile.style }} onMouseOver={() => drawNode(rowId, tileId)} onClick={e => addStartEnd(rowId, tileId)}></button>
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
  }
})

export default App;
