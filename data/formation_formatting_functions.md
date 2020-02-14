# formation.json Formatting Instructions 
When setting the position of each player you have access to the following alignment rules (or functions)

## Horizontal Alignment

- align : this will align the center of the player horizontally with the center of a single reference object
- left-of : this will align the right edge of the player with the left edge of a single reference object
- right-of : this will align the left edge of the player with the right edge of a a single reference object

## Vertical Alignment

- align : this will align the center of the player vertically with the center of a single reference object
- behind : this will align the players front edge with the back edge of a single reference object

## Alignment Rules

### align
Description: This will align the center of the player horiztonally or vertically with the center of a single reference object.
You can also include padding (in feet) to move the player left, right, up, or down from the initial alignment.

Usage: "player reference" : ["align", "reference object", padding (optional)]

Example: "QB" : ["align", "", 3] 

### left-of
Description: this will align the right edge of the player with the left edge of a single reference object.
You can also include padding (in feet) to move the player left, right, up, or down from the initial alignment.

Usage: "player reference" : ["left-of", "reference object", padding (optional)]

### right-of
Description: this will align the left edge of the player with the right edge of a single reference object.
You can also include padding (in feet) to move the player left, right, up, or down from the initial alignment.

Usage: "player reference" : [right-of", "reference object", padding (optional)]

### behind
Description: this will align the front edge of the player with the back edge of a single reference object.
You can also include padding (in feet) to move the player left, right, up, or down from the initial alignment.

Usage: "player reference" : ["behind", "reference object", padding (optional)]

## Reference Objects (aka Landmarks)

- ball
- sideline-left
- sideline-right
- numbers-left
- numbers-right
- hash-left
- hash-right
- other players (e.g. "QB", "C", "LG")
