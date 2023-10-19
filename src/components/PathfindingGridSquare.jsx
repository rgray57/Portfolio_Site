export default function(props) {

    const {startSquare, goalSquare, isBlock, handleMouseDown, handleMouseEnter, handleMouseUp, row, col} = props
    

    const squareType = goalSquare ? 'goal-square' : startSquare ? 'start-square' : isBlock ? 'block-square' : '';
    return (

        <div
        id={`square${col},${row}`}
        className={`square ${squareType}`}
        onMouseDown={() => handleMouseDown(col,row)}
        onMouseEnter={() => handleMouseEnter(col,row)}
        onMouseUp={() => handleMouseUp(col,row)}
        ></div>
    )
}