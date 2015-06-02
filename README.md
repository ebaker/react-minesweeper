# basics
 - click or touch square to uncover
 - shift+click on a keyboard to place a flag
 - click/tough top left flag count to toggle flag placement on next click
 - game is won when all squares not containing bombs are uncovered
 - game is lost if bomb is clicked
 - flags are only for convenience and do not affect game result

# todo
 - [ ] change alerts to modals
 - [ ] style review
 - [ ] settings modal
 - [ ] more test edge cases

# completed
 - [x] make it so click 0 opens a bunch of squares
 - [x] make sure 1st click isnt bomb (create board after)
 - [x] see if you won/lost on click
 - [x] timer
 - [x] flags
 - [x] responsive

# rules outline (sweeper API)
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
 - [x] toggleFlag(y, x)
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
