export function dijkstraSolve(grid) {
  // set all squares distance to infinity
  for (let col = 0; col < grid.squares.length; col++) {
    for (let row = 0; row < grid.squares[col].length; row++) {
      grid.squares[col][row].distance = Infinity;
      grid.squares[col][row].isVisited = false;
      grid.squares[col][row].heuristic = Infinity;
      grid.squares[col][row].f = Infinity;
      grid.squares[col][row].prevSquare = null;
    }
  }

  //array to hold the path of visited squares
  let closedSquares = [];

  // create queue of unvisited squares
  let openSquares = getQueue(grid.squares);

  //set start square's distance to 0
  grid.startSquare.distance = 0;

  while (!!openSquares) {
    //    check to make sure queue isn't empty
    if (openSquares.length === 0) {
      openSquares = null;
      continue;
    }

    //    sort the queue by distance from start
    openSquares = sortSquaresByDistance(openSquares);

    //    take out the closest square
    let currentSquare = openSquares.shift();

    //    break if we have already visited the square
    if (closedSquares.includes(currentSquare)) {
      continue;
    }

    //    break if the square is a block
    if (currentSquare.isBlock) {
      continue;
    }

    //    stop solve if we are surrounded by walls
    if (currentSquare.distance === Infinity) {
      return closedSquares;
    }

    //    set square to visited and add to visited squares array
    currentSquare.isVisited = true;
    closedSquares.push(currentSquare);

    //    check if we are at the finish square
    if (currentSquare === grid.goalSquare) {
      return closedSquares;
    }

    //    update neighbours distances
    setNeighboursDistances(currentSquare, grid.squares);
  }
}

function getQueue(squares) {
  const queue = [];
  for (let col = 0; col < squares.length; col++) {
    for (let row = 0; row < squares[col].length; row++) {
      queue.push(squares[col][row]);
    }
  }
  return queue;
}

function sortSquaresByDistance(squares) {
  return squares.sort((a, b) => {
    return a.distance - b.distance;
  });
}

function setNeighboursDistances(currentSquare, squares) {
  let neighbours = [];
  if (currentSquare.col > 0)
    neighbours.push(squares[currentSquare.col - 1][currentSquare.row]);
  if (currentSquare.col < squares.length - 1)
    neighbours.push(squares[currentSquare.col + 1][currentSquare.row]);
  if (currentSquare.row > 0)
    neighbours.push(squares[currentSquare.col][currentSquare.row - 1]);
  if (currentSquare.row < squares[0].length - 1)
    neighbours.push(squares[currentSquare.col][currentSquare.row + 1]);

  //filter out visited squares
  neighbours = neighbours.filter((neighbour) => {
    if (neighbour.isVisited) {
      return false;
    } else {
      return true;
    }
  });

  for (let i = 0; i < neighbours.length; i++) {
    neighbours[i].distance = currentSquare.distance + 1; //set distance of neighbours
    neighbours[i].prevSquare = currentSquare; //set previous square of neighbours
  }
}

export function aStarSolve(grid) {
  // reset all squares
  for (let col = 0; col < grid.squares.length; col++) {
    for (let row = 0; row < grid.squares[col].length; row++) {
      grid.squares[col][row].distance = Infinity;
      grid.squares[col][row].isVisited = false;
      grid.squares[col][row].heuristic = Infinity;
      grid.squares[col][row].f = Infinity;
      grid.squares[col][row].prevSquare = null;
    }
  }

  //array to hold the path of visited squares
  let closedSquares = [];

  // create queue of unvisited squares
  let openSquares = getQueue(grid.squares);

  //set start square's distance and f to 0
  grid.startSquare.distance = 0;
  grid.startSquare.f = 0;

  while (!!openSquares) {
    if (openSquares.length === 0) {
      openSquares = null;
      continue;
    }

    //sort our queue by their f value (g + h)
    openSquares = sortSquaresByF(openSquares);

    //take out the lowest f square
    let currentSquare = openSquares.shift();

    //    skip if we have already visited the square
    if (closedSquares.includes(currentSquare)) {
      continue;
    }

    //    skip if the square is a block
    if (currentSquare.isBlock) {
      continue;
    }

    //    stop solve if we are surrounded by walls
    if (currentSquare.distance === Infinity) {
      return closedSquares;
    }

    //    set square to visited and add to visited squares array
    currentSquare.isVisited = true;
    closedSquares.push(currentSquare);

    //    check if we are at the finish square
    if (currentSquare === grid.goalSquare) {
      return closedSquares;
    }

    //update the squares neighbours
    setNeighboursF(currentSquare, grid);
  }
}

function sortSquaresByF(squares) {
  return squares.sort((a, b) => {
    return a.f - b.f;
  });
}

function setNeighboursF(currentSquare, grid) {
  let neighbours = [];
  if (currentSquare.col > 0)
    neighbours.push(grid.squares[currentSquare.col - 1][currentSquare.row]);
  if (currentSquare.col < grid.squares.length - 1)
    neighbours.push(grid.squares[currentSquare.col + 1][currentSquare.row]);
  if (currentSquare.row > 0)
    neighbours.push(grid.squares[currentSquare.col][currentSquare.row - 1]);
  if (currentSquare.row < grid.squares[0].length - 1)
    neighbours.push(grid.squares[currentSquare.col][currentSquare.row + 1]);

  //filter out visited squares
  neighbours = neighbours.filter((neighbour) => {
    if (neighbour.isVisited) {
      return false;
    } else {
      return true;
    }
  });

  for (const neighbour of neighbours) {
    neighbour.distance = currentSquare.distance + 1;
    neighbour.heuristic = calcHeuristic(neighbour, grid);
    neighbour.f = neighbour.distance + neighbour.heuristic;
    neighbour.prevSquare = currentSquare;
  }
}

function calcHeuristic(neighbour, grid) {
  //Manhattan distance heuristic
  return (
    Math.abs(neighbour.col - grid.goalSquare.col) +
    Math.abs(neighbour.row - grid.goalSquare.row)
  );
}

export function shortestPath(finish) {
  const tmp = [];
  let currSquare = finish;

  while (currSquare != null) {
    tmp.unshift(currSquare);
    currSquare = currSquare.prevSquare;
  }

  return tmp;
}
