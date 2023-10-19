import visibleDirective from "astro/runtime/client/visible.js";

type Square = {
  col: number,
  row: number,
  isBlock: boolean,
  distance: number,
  prevSquare: Square,
  isVisited: boolean,
  heuristic: number,
  f: number
}

type grid = {
  squares: Array<Square>,
  startSquare: Square,
  goalSquare: Square
}


export default function (grid: grid): grid {

  const wallList = new Array<Square>;
  for (let square of grid.squares.flat()){
    if (square.col % 2 !== 0 || square.row % 2 !== 0){
      wallList.push(square)
    }
  }

  //apply walls
  for(let square of wallList){
    if(square !== grid.startSquare && square !== grid.goalSquare){
      square.isBlock = true;
    }
  }


  let pathList = new Array<Square>;
  let visitedSquares = new Array<Square>;

  pathList.push(grid.startSquare);
  visitedSquares.push(grid.startSquare);


  while (!!pathList){
    if(pathList.length === 0){
      pathList = undefined;
      continue;
    }

    let currSquare = pathList.pop();
    

    let unvisitedNeighbour = getNeighbour(currSquare, grid, visitedSquares);

    if(!!unvisitedNeighbour){
      pathList.push(currSquare);
      removeWall(currSquare, unvisitedNeighbour, grid);
      visitedSquares.push(unvisitedNeighbour);
      pathList.push(unvisitedNeighbour);
    }
  }


  return grid;
}

function getNeighbour(square: Square, grid: grid, visitedSquares: Array<Square>){
  let dirVectors = [
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2],
  ];

  shuffleArray(dirVectors);

  for(let dir of dirVectors){

    let neighbour = undefined;

    try {
      neighbour = grid.squares[square.col + dir[0]][square.row + dir[1]];
    } catch {}
    
    if(!!neighbour){
      if(!visitedSquares.includes(neighbour)){
        return neighbour;
      }
    }
  }

  return undefined;
}

function removeWall(currSquare: Square, neighbour: Square, grid: grid){
  grid.squares[currSquare.col + ((neighbour.col - currSquare.col) / 2)][currSquare.row + ((neighbour.row - currSquare.row) / 2)].isBlock = false;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}