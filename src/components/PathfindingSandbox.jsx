import { useState } from "preact/hooks"
import "../styles/pathfinder.css"
import AlgorithmSelect from "./AlgorithmSelect"
import PathfindingGridSquare from "./PathfindingGridSquare";
import { aStarSolve, dijkstraSolve, shortestPath } from "../scripts/pathing-solve";
import mazeGen from "../scripts/maze-gen.ts";

const GRID_HEIGHT = 27;
const GRID_WIDTH = 45;
const INIT_START_SQUARE_ROW = 2;
const INIT_START_SQUARE_COLUMN = 2;
const INIT_FINISH_SQUARE_ROW = 25;
const INIT_FINISH_SQUARE_COLUMN = 35;


export default function () {

    //states and handlers
    
    const [ grid, setGrid ] = useState(generateBlankGrid())
    const [ currentAlgorithm, setCurrentAlgorithm ] = useState("Algos");
    function handleAlgoSelect(e){
        setCurrentAlgorithm(e.target.value);
    }

    const [ cursorMode, setCursorMode ] = useState('block');
    function handleCursorSelect(e){
        setCursorMode(e.currentTarget.value);
    }

    const [ mousePressed, setMousePressed ] = useState(false);


    //mouse handlers
    function handleMouseDown(col,row){
        if(cursorMode === 'block'){
            //check if square to be blocked is a goal or start square
            if(grid.squares[col][row] !== grid.startSquare && grid.squares[col][row] !== grid.goalSquare){
                    let tmp = grid.squares.slice()
                    tmp[col][row].isBlock = true;
                    updateGridSquares(tmp);
            }
        }
        else if(cursorMode === 'erase'){
            let tmp = grid.squares.slice()
            tmp[col][row].isBlock = false;
            updateGridSquares(tmp);
        }
        else if(cursorMode === 'moveStart'){
            updateGridStart([col,row])
        }
        else if(cursorMode === 'moveGoal'){
            updateGridGoal([col,row])
        }

        setMousePressed(true);
    }
    function handleMouseEnter(col,row){
        if(mousePressed){
            if(cursorMode === 'block'){
                //check if square to be blocked is a goal or start square
                if(grid.squares[col][row] !== grid.startSquare && grid.squares[col][row] !== grid.goalSquare){
                    let tmp = grid.squares.slice()
                    tmp[col][row].isBlock = true;
                    updateGridSquares(tmp);
                }
            }
            else if(cursorMode === 'erase'){
                let tmp = grid.squares.slice()
                tmp[col][row].isBlock = false;
                updateGridSquares(tmp);
            }
        }

    }
    function handleMouseUp(col,row){
        setMousePressed(false)
    }
    
    //grid functions
    function generateBlankGrid(){

        let squares = [];

        for (let col = 0; col < GRID_WIDTH; col++){
            let thisCol = [];

            for (let row = 0; row < GRID_HEIGHT; row++){
                thisCol.push(newSquareProps(col,row))
            }
            squares.push(thisCol);
        }

        let tmpGrid = {
            startSquare: squares[INIT_START_SQUARE_COLUMN][INIT_START_SQUARE_ROW],
            goalSquare: squares[INIT_FINISH_SQUARE_COLUMN][INIT_FINISH_SQUARE_ROW],
            squares: squares
        }
        return tmpGrid;
    }

    function updateGridSquares(newSquares){
        setGrid({
            startSquare: grid.startSquare,
            goalSquare: grid.goalSquare,
            squares: newSquares
        })
    }
    function updateGridStart(newStart){
        //new start cannot be a block or goal
        if (grid.squares[newStart[0]][newStart[1]] !== grid.goalSquare){
            let tmp = grid.squares.slice()
            tmp[newStart[0]][newStart[1]].isBlock = false;

            setGrid({
                startSquare: grid.squares[newStart[0]][newStart[1]],
                goalSquare: grid.goalSquare,
                squares: tmp
            })
        }
        
    }
    function updateGridGoal(newGoal){
        //new goal cannot be a block or start
        if(grid.squares[newGoal[0]][newGoal[1]] !== grid.startSquare){
            let tmp = grid.squares.slice()
            tmp[newGoal[0]][newGoal[1]].isBlock = false;
            setGrid({
                startSquare: grid.startSquare,
                goalSquare: grid.squares[newGoal[0]][newGoal[1]],
                squares: tmp
            })
        }
        
    }

    function newSquareProps(col, row){
        return {
            col: col,
            row: row,
            isBlock: false,
            distance: Infinity,
            prevSquare: null,
            isVisited: false,
            heuristic: Infinity,
            f: Infinity
        }
    }

    function handleMazeClick(){
        clearAnimationStyles()
        setGrid(mazeGen(generateBlankGrid()));
    }

    function handleSolve(){
        clearAnimationStyles();
        if(currentAlgorithm === 'Dijkstra'){
            let visitedSquares = dijkstraSolve(grid);
            let path = shortestPath(grid.goalSquare);

            solveAnimation(visitedSquares, path);
        }
        else if(currentAlgorithm === 'A*'){
            let visitedSquares = aStarSolve(grid);
            let path = shortestPath(grid.goalSquare);

            solveAnimation(visitedSquares, path);
        }
    }

    function solveAnimation(visitedSquares, shortestPath){
        for(let i = 0; i <= visitedSquares.length; i++){
            if(i === visitedSquares.length){
                //if at end of visited squares animate the shortest path
                shortestAnimation(shortestPath)
            }
            else{
                setTimeout(() => {
                    document.getElementById(`square${visitedSquares[i].col},${visitedSquares[i].row}`).classList.add('visited-square')
                }, 2 * i)
            }
            
        }
    }

    function shortestAnimation(shortestPath){
        for(let i = 0; i < shortestPath.length; i++){
            setTimeout(() => {
                document.getElementById(`square${shortestPath[i].col},${shortestPath[i].row}`).classList.add('shortest-path-square')
            }, 2 * i)
        }
    }

    function clearAnimationStyles(){
        const squares = document.getElementsByClassName("square");
        for(const square of squares){
            square.classList.remove("visited-square", "shortest-path-square")
        }
    }

    return (
        <div className="pathfinder">
            <div className="control-bar">
                <AlgorithmSelect algos={['Dijkstra','A*']} value={currentAlgorithm} onSelect={handleAlgoSelect}/>
                <div className="control-bar-cursor-btns">
                    <button value={'block'} onClick={handleCursorSelect}><div className={"square block-square btn-icon"}></div></button>
                    <button value={'erase'} onClick={handleCursorSelect}><div className={"square btn-icon"}></div></button>
                    <button value={'moveStart'} onClick={handleCursorSelect}><div className={"square start-square btn-icon"}></div></button>
                    <button value={'moveGoal'} onClick={handleCursorSelect}><div className={"square goal-square btn-icon"}></div></button>
                </div>
                <div className="control-bar-btns">
                    <button onClick={handleMazeClick}>Generate Maze</button>
                    <button onClick={e => {
                        setGrid(generateBlankGrid);
                        clearAnimationStyles();
                        }}>Reset</button>
                    <button onClick={handleSolve}>Solve</button>
                </div>
            </div>
            <div className="grid-section">
                <div className="grid">
                    {grid.squares.map((col, colIndx) => {
                        return (
                            <div className="column" key={colIndx}>
                                {col.map((square, squareIndx) => {
                                    const {isBlock, row, col} = square;
                                    return <PathfindingGridSquare
                                    key={squareIndx}
                                    row={row}
                                    col={col}
                                    startSquare={grid.startSquare === grid.squares[col][row]}
                                    goalSquare={grid.goalSquare === grid.squares[col][row]}
                                    isBlock={isBlock}
                                    handleMouseDown={(col,row) => handleMouseDown(col,row)}
                                    handleMouseEnter={(col,row) => handleMouseEnter(col,row)}
                                    handleMouseUp={(col,row) => handleMouseUp(col,row)}
                                    ></PathfindingGridSquare>
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}