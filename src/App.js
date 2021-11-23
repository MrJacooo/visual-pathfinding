import { useEffect, useState } from 'react';
import './App.css';

//TODO: ADD Algorithm
//TODO: Drawing nodes
//TODO: ADD Grid Size customisation
//TODO: ADD onhover for drawing nodes



//Setup for the Animation Loop
// loop is a function that is executed every upadteInterval. Modified via changeLoopInterval
var loop; var updateInterval = setInterval(() =>  loop(), 1000)
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
  
  //This is the Loop thats used to animate the Algorithm. Created via updateInterval
  loop = () => {
    if(toggleLoop){
      setCounter(counter+1)
    }
  }

  //Used to adjust the Animation Loop.
  //Takes e -> e.target.value and sets that as the new Interval for the Loop
  function changeLoopInterval(e){
    setLoopInterval(e.target.value) 
    clearInterval(updateInterval) 
    updateInterval = setInterval(() => loop(), e.target.value) 
  }

  //generates the Grid
  function generateGrid(){
    let tempGrid = [];
    for(let i = 0; i < gridY; i++){
      tempGrid = [...tempGrid , []] //generate file
      for(let j = 0; j < gridX; j++){
        tempGrid[i] = [...tempGrid[i], {x: j, y:i}] //generate ROW, x=ROW y=FILE
      }
    }
    setGrid(tempGrid)
  }

  //styles Grid according to Windowsize and Tile Amount
  function gridStyle(){
    let xmargin = (window.innerWidth - (window.innerWidth*0.2)) / gridX
    let ymargin = (window.innerHeight - (window.innerHeight*0.2)) / gridY
    setTilesize(xmargin<ymargin?xmargin:ymargin) //chooses the smaller size so the Grid fits perfectly
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
        <button onClick={() => {setToggleLoop(!toggleLoop)}}>Toggle Count Up</button>
        <input value={loopInterval} onChange={e => changeLoopInterval(e)}></input>
      </div>
      <div className="grid">
        {grid.map((row,rowId) => 
          <div key={"row-"+rowId} style={{height: tileSize}}>
            {row.map((tile,tileId) => 
              <button key={"row-"+rowId+"tile-"+tileId} style={{height: tileSize, width: tileSize}}></button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
 
export default App;
