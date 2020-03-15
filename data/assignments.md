# Assignments
This holds various rules to help with giving players assignemnts

a player gets an assignment as well as an inital alignment

```
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
```

## Key and Target Player
Key and non-key target players use the same format
```
"key" OR "filter" : {
  "zone" : ...this is the zone we can find the target player in,
  "filter" : ...this is an optional set of filters we can use on the zone 
  "criteria" : ...this is the criteria we use to determine the target player
}
```

## Script
The script is what the player follows during simulation of a play.
- A script contains a series of actions in an array []. 
- Actions are performed in the order they appear in the array.
- An action is can be a simple action or a complex action created by combining simple and/or other complex actions.
- Actions are objects {};

```
"script" : [
  {"name" : "action 1"},
  {"name" : "action 2"},
  {"name" : "complex action 1"}
]
```

### Actions
Actions can have multiple options/inputs, but all actions must have a name. This name is unique and maps back to either a simple action or a complex action.

### Simple Actions
The following are names of simple (i.e built-in) actions
- go : This is a full speed "run" to a target location or player. // may be able to use smart pathing
- step : This is a velocity limited version of "go" that will cause players to move slowly in a desired direction.
- read : This is used to branch the script in different directions based on some condition that the player attempts to "read".
- engage : This action will cause the player to attempt to engage a target player. When players are "engaged" their motion is no longer independent.
- disengage : This action will cause the player to attempt to disengage any players that are currently engaged with them.
- tackle : This action will cause the player to attempt to tackle (or takedown) a target player.
- block : This action will cause the player to attempt to block (e.g. engage and guide) a target player.
- throw : This action will cause the player to throw the ball to a target location or player.
- handoff : This action will cause the player to hand the ball to another target player.
- pitch : This action will cause the player to pitch the ball to another target player.
- snap //might not need this one
  
