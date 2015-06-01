# todo
 - [x] make it so click 0 opens a bunch of squares
 - [ ] make sure 1st click isnt bomb (create board after)
 - [ ] see if you won/lost on click
 - [ ] timer
 - [ ] mobile/responsive

# rules architecture (sweeper API)
## Public
 - startGame(y, x, numOfBombs)
   - createBoard
   - addBombsWithHints(bombCoords = [])
     - cannot use y, x being uncovered
   - uncover(y, x)
   - save start time
 - uncover(y, x)
   - check if bomb, end game
   - check if # of squares == # of bomb (win)
   - traverse uncover
 - board = [[]]
   - where undefined are hidden
   - values are stored as int
   - 0 shows uncovered
 - placeFlag(y, x)
   - check if hidden (undefined)
   - else add flag (array or -1)
 - resetBoard(height, width)

# notes
 - http://www.minesweepers.org/clicking.asp
