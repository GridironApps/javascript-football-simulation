# Assignments
This holds various rules to help with giving players assignemnts

a player gets an assignment as well as an inital alignment

`
"player" : {
  "position" : ...this is the given position tag of the player
  "alignment" : {
    "horizontal" : ...assignment rules,
    "vertical" : ...assignment rules,
  },
  "assignment" : {
    "key" : ...this is a player determined pre-snap that can be used later for reads,
    "script" : ...this is where we tell the player what to do
  }
`

## Key and Target Player
Key and non-key target players use the same format
`
"key" OR "filter" : {
  "zone" : ...this is the zone we can find the target player in,
  "filter" : ...this is an optional set of filters we can use on the zone 
  "criteria" : ...this is the criteria we use to determine the target player
}
`

## Script
The script is what the player follows during simulation of a play.
- A script contains a series of actions in an array []. 
- Actions are performed in the order they appear in the array.
- An action can be a built-in action or a composite action created by combining built-in and/or other composite actions.
- Actions are objects {};

`
"script" : [
  {"name" : "action 1"},
  {"name" : "action 2"},
  {"name" : "composite action 1"}
]
`

### Actions
Actions can have multiple options/inputs, but all actions must have an action name. This name is unique and maps back to either a built-in action or a composite action.

### Built-in Actions
The following are names of built-in actions

#### go
This is a full speed "run" to a target location or player. // may be able to use smart pathing

sample syntax and options
`
{
  "name" : "go"
  "target" : ...this is a location or a player, follow target syntax
  "wait" : boolean
    if true, the script will wait for the action to finish before moving on to the next action
    if false, the script will perform the next action in parallel with this one during each tick (e.g. action 1 + action 2 in order)
  //might add a final or target speed field, defaults to full speed
}
`

#### cut
This is an automated action that will be activated when a players intended velocity isn't close to the same direction as their current velocity. *should not be included in a script*

#### step
This is a velocity limited version of "go" that will cause players to move slowly in a desired direction. 

sample syntax and options
`
{
  "name" : "step"
  "target" : ...this is a location or a player, follow target syntax
  "wait" : boolean
    if true, the script will wait for the action to finish before moving on to the next action
    if false, the script will perform the next action in parallel with this one during each tick (e.g. action 1 + action 2 in order)
}
`

#### read
This is used to branch the script in different directions based on some condition that the player attempts to "read".

sample syntax and options
`
{
  "name" : "read"
  "criteria" : ...what the player is reading (*should be able to return true/false*)
  "duration" : ...the player will read once during each "tick" this is how long should the player be allowed to keep trying to make a successful read.
  "default" : ...a script the player will perform if they fail to read during the duration given
  "true" : ...a script the player will perform if the read returns "true"
  "false" : ...a script the player will perform if the read returns "false"
  "wait" : boolean
    if true, the script will wait for the action to finish before moving on to the next action
    if false, the script will perform the next action in parallel with this one during each tick (e.g. action 1 + action 2 in order)
}
`

#### engage
This action will cause the player to attempt to engage a target player. When players are "engaged" their motion is no longer independent.

sample syntax and options
`
{
  "name" : "engage"
  "criteria" : ...what the player is reading (*should be able to return true/false*)
  "duration" : ...the player will perform the "engage" action once each "tick". this is how long should the player be allowed to keep trying to make a successful engage.
  "target" : ...must be a player 
    if player is within range then an engage attempt will be tried
    if the player is out of range, then the player will first try to "go" to the target player
  "wait" : boolean
    if true, the script will wait for the action to finish before moving on to the next action
    if false, the script will perform the next action in parallel with this one during each tick (e.g. action 1 + action 2 in order)
}
`

#### disengage
This action will cause the player to attempt to disengage any players that are currently engaged with them.

sample syntax and options
`
{
  "name" : "disengage"
  "wait" : boolean
    if true, the script will wait for the action to finish before moving on to the next action
    if false, the script will perform the next action in parallel with this one during each tick (e.g. action 1 + action 2 in order)
}
`

#### tackle
This action will cause the player to attempt to tackle (or takedown) a target player.

sample syntax and options
`
{
  "name" : tackle"
  "wait" : boolean
    if true, the script will wait for the action to finish before moving on to the next action
    if false, the script will perform the next action in parallel with this one during each tick (e.g. action 1 + action 2 in order)
}
`

#### block
This action will cause the player to attempt to block (e.g. engage and guide) a target player.

sample syntax and options
`
{
  "name" : "block"
  "wait" : boolean
    if true, the script will wait for the action to finish before moving on to the next action
    if false, the script will perform the next action in parallel with this one during each tick (e.g. action 1 + action 2 in order)
}
`

#### throw
This action will cause the player to throw the ball to a target location or player.

sample syntax and options
`
{
  "name" : "throw"
  "wait" : boolean
    if true, the script will wait for the action to finish before moving on to the next action
    if false, the script will perform the next action in parallel with this one during each tick (e.g. action 1 + action 2 in order)
}
`

#### handoff
This action will cause the player to hand the ball to another target player.

sample syntax and options
`
{
  "name" : "handoff"
  "wait" : boolean
    if true, the script will wait for the action to finish before moving on to the next action
    if false, the script will perform the next action in parallel with this one during each tick (e.g. action 1 + action 2 in order)
}
`

#### pitch 
This action will cause the player to pitch the ball to another target player.

sample syntax and options
`
{
  "name" : "pitch"
  "wait" : boolean
    if true, the script will wait for the action to finish before moving on to the next action
    if false, the script will perform the next action in parallel with this one during each tick (e.g. action 1 + action 2 in order)
}
`

#### snap
This is an automated action to snap the football and start the play. *should not be included in a script*

#### catch
This is an automated action to try and catch a football that is within range. *should not be included in a script*




  
