# Defensive Formation - Formatting Rules

When writing a defensive formation you will have access to the following alignment rules and reference points.

## Coordinate System
All directions (left, right, forward, backward) are based on the players local coordinate system. It assumes the player is facing the line of scrimmage. A defensive player moving left will appear to move to the offenses right. Similarly a defensive player moving backward will be moving away from the line of scrimmage. Additionally you can make use of the following concepts to more easily set alignment:

- inside, the edge of the player closest to the ball
- outside, the edge of the player furthest from the ball
- strongside, the side of the player (left or right) the defense has identified as the strength of the offense
- weakside, the side of the player (left or right) opposite the strongside

## Determining Strength
Strength is determined by checking the following zones in order:

1. Strength to the side with the most non-RBs
2. Strength to the side with the most TEs
3. Strength to the side with the most FBs
4. Strength away from the side with the most RBs
5. Strength to the wide side of the field (ball is currently always centered)
6. Strength away from the QBs arm (currently all QBs are right handed, meaning strength call will be to the left)

### Player Zones
The following zones are used to group players based on their likely role in the offense: RB, FB, TE, WR. Players are NOT required to be listed as such on the depth chart, they merely lined up in that zone as shown in the figure below.

![player zones diagram](https://docs.google.com/drawings/d/e/2PACX-1vSmNdgwJ5VqTdHT3j4IHF79gIDh5n0sKTZ-c4vs9updak0mop-tRrBRWz7vNb4XNaRdL1ocJ-az5jwq/pub?w=829&h=313)

#### FB Zone
The FB zone is the width of the tackle box (outside foot of each OT) and extends 5 yards back from the LOS. A player is considered to be in the fullback zone as long as no part of their body is outside the tackle box (outside foot <= edge of tackle box) AND any part of their body is touching or in front of the FB/RB divider line (toes <= 5 yards behind the LOS). 

#### RB Zone
The RB zone is the width of the tackle box (outside foot of each OT) and starts at 5 yards from the LOS and continues infinitley backward. A players is considered to be in the running back zone as long as no part of their body is outside the tackle box (outside foot <= edge of tackle box) AND all parts of their body are behind the FB/RB divider line (toes > 5 yards behind the LOS).

#### TE Zone
The TE zone is infinitley deep and has a width starting from the outside foot of the OT and continuing 10 yards towards the sideline. A player is considered to be in the TE zone if any part of their body is inside the TE zone (inside foot < 10 yards past edge of tackle box AND outside foot > edge of tackle box).

#### WR Zone
The WR zone is infinitley deep and has a width starting 10 yards from the outside edge of the tackle box and continues to the sideline. A player is considered to be in the WR zone if all part of their body are inside (or just touching) the WR zone (inside foot >= 10 yards past edge of tackle box).

#### Left/Right Zone Split
Players with body parts in both the left and right RB or FB zone will count 0.5 of a person for each zone. A player who's edge is the ONLY thing touching the center line will only count in 1 of the zones.

## Alignment Criteria
To control when certain alignment rules are used you may include a criteria at the beginning of each alignment rule. Sets of criteria are stored in arrays.

**Example**
```"criteria" : [criteria 1, criteria 2, ...]```

Sets of criteria are evaluated in the order that they appear. The alignment rules associated with the FIRST matching set will be used to align that player. For a criteria to match, ALL criteria in the set must be met. 

### Individual Criteria
Each individual criteria is limited to comparison of the **count** of players in different player zones to other players counts or to constant values. Standard comparators can be used: 
- "=="
- "<="
- "<"
- ">"
- ">="

The player zones available (described earlier) are:
- RB
- FB
- TE
- WR

Each of these zones can be further reduced using the following selectors:
- \_left : players in specified zone left side of the center
- \_right : players in specified zone right side of the center
- \_strong : players in specified zone on the strong side of the center
- \_weak : players in specified zone on the weak side of the center
- \_all (or no selector)

Individual criteria are written as text with spaces seperating the quatities from the comparator.

**Example**
```"criteria" : ["RB_left <= 1", "TE_strong == WR_strong"]```

## Alignment Rules
In order to align players, use the following rules and padding (if available).

### Horizontal Alignment Rules
- align : sets the center of the player inline horizontally with the center of a reference 
- apex : centers the player halfway between the centers of two other references
- left-of : sets the right edge of the player inline with the left edge of a reference
- right-of : sets the left edge of the player inline with the right edge of a reference
- inside : sets the outside edge of the player inline with the inside edge of a reference
- outside : sets the inside edge of the player inline with the outside edge of a reference
- shade-left : sets the center of the player inline with the left edge of a reference
- shade-right : sets the center of the player inline with the right edge of a reference
- shade-in : sets the center of the player inline with the inside edge of a reference
- shade-out : sets the center of the player inline with the outside edge of a reference
- shade-strong : sets the center of the player inline with the strongside edge of a reference
- shade-weak : sets the center of the player inline with the weakside edge of a reference

### Vertical Alignment Rules
- align : sets the center of the player inline vertically with the center of a reference
- behind : sets the front edge of the player inline with the back edge of a reference (note: will use the "front" of an offensive player instead)

## Reference Points

### Landmarks
- ball
- sideline-left
- sideline-right
- numbers-left
- numbers-right
- hash-left
- hash-right

### Other Players
- other defensive players
- QB
- LT
- LG
- C
- RG
- RT
- X (typically a WR on a side by himself)
- Y (typically a slot WR or TE)
- Z (typically a WR on the same side as the Y)
- H (typically a TE or FB)
- T (typically a running back)
- OT-strong (strongside tackle)
- OG-strong (strongside guard)
- OG-weak (weakside guard)
- OT-weak (weakside tackle)
- TEx-left (x can be 1, 2, 3, or 4 where 1 is the inside most TE on the left side of the defense)
- TEx-right (x can be 1, 2, 3, or 4 where 1 is the inside most TE on the right side of the defense)
- TEx-strong (x can be 1, 2, 3, or 4 where 1 is the inside most TE on the strong side of the defense)
- TEx-weak (x can be 1, 2, 3, or 4 where 1 is the inside most TE on the weak side of the defense)
- WRx-left (x can be 1, 2, 3, or 4 where 1 is the outside most WR on the left side of the defense)
- WRx-right (x can be 1, 2, 3, or 4 where 1 is the outside most WR of the right side of the defense)
- WRx-strong (x can be 1, 2, 3, or 4 where 1 is the outside most WR on the strong side)
- WRx-weak (x can be 1, 2, 3, or 4 where 1 is the outside most WR on the weak side)
- FB-left
- FB-right
- FB-strong
- FB-weak
- RB-left
- RB-right
- RB-strong
- RB-weak 

TODO

- what about multiple FBs or 3 backs total or backs in the center
- Wings/Sniffers ???
