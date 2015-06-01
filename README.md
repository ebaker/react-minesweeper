# todo
 - [x] make it so click 0 opens a bunch of squares
 - [x] make sure 1st click isnt bomb (create board after)
 - [x] see if you won/lost on click
 - [x] timer
 - [x] flags
 - [ ] responsive
 - [ ] style review

# rules architecture (sweeper API)
## Public
 - [x] startGame(y, x, numOfBombs)
   - [x] resetBoard - createBoard
   - [x] addBombsWithHints(bombCoords = [])
     - [x] cannot use y, x being uncovered
   - [x] uncover(y, x)
   - [x] save start time
 - [x] uncover(y, x)
   - [x] if game hasnt started, start it
   - [x] check if bomb, end game
   - [x] check if # of squares == # of bomb (win)
   - [x] traverse uncover
 - board = [[]]
   - [x] where undefined are hidden
   - [x] values are stored as int
   - [x] 0 shows uncovered
 - placeFlag(y, x)
   - check if hidden (undefined)
   - else add flag (array or -1)
 - [x] resetBoard(height, width)
   - [x] set all to undefined
## Private
 - [x] _board (contains all board values)
## Web UI
 - [x] bomb count
 - [x] new game button
 - [x] timer incrementing

# notes
 - http://www.minesweepers.org/clicking.asp
