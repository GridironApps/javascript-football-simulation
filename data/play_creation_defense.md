DEFENSE

play = {
    play_name: <string> //OPTIONAL, short descriptive name for the play
    play_diagram: <link to image> //OPTIONAL, https://www.madden-school.com/playbooks is a good source for simple play diagrams to link to    
    assignments: {
        <PLAYER_ID>: { //PLAYER_ID should be things like LDE, MLB, SS, etc. (it can be more or less than 2-3 letters if desired)
            run_left: { //this is the assignment for the player when the offense runs to their left
                job: <'fit-zone', 'pursue'> //'fit-zone' will assign defender to specified zone(s) while pursuit will assign defender to the runners target_zone
                
                OPTIONAL PARAMETERS
                
                run_zones: <array containing 1, 2, 3, 4, 5, and/or 6> //use only for the 'fit-zone' job, defender can have more than 1 run-fit zone
            },
            run_right: { //this is the assignment for the player when the offense runs to their right
                job: <'fit-zone', 'pursue'>

                OPTIONAL PARAMETERS
                
                run_zones: <array continaing 1, 2, 3, 4, 5, and/or 6> //use only for the 'fit-zone' job, defender can have more than 1 run-fit zone
            },
            pass: { //this is the assignment for the player when the offense passes
                job: <'rush', 'cover-man', 'cover-zone'>

                OPTIONAL PARAMETERS
                
                target_player: <PLAYER_ID> //use only with the 'cover-man' job, PLAYER_ID must match whatever the offense uses (for the time being)
                
                short_zones: <array containing 1, 2, 3, 4, 5, and/or 6> //use only for the 'cover-zone' job, defender can have more than 1 short-zone
                deep_zones: <array containing 1, 2, 3, 4, 5, and/or 6> //use only for the 'cover-zone' job, defender can have more than 1 deep-zone
            }
        }
    }
}

EXAMPLE

play = {
    play_name: '4-3 Normal Cover 1 Hole',
    play_diagram: 'https://www.madden-school.com/wp-content/plugins/playbook/playbook_images/27420_cover-1-hole.png',
    assignments: {
        LDE: {
            run_left: {
                job: 'fit-zone',
                run_zones: [5]
            },
            run_right: {
                job: 'fit-zone',
                run_zones: [5]
            }:,
            pass: {
                job: 'rush'
            }
        },
        ...
        MLB: {
            run_left: {
                job: 'fit-zone',
                run_zones: [3]
            },
            run_right: {
                job: 'fit-zone',
                run_zones: [4]
            }:,
            pass: {
                job: 'cover-zone',
                short_zones: [3,4],
                deep_zones: []
            }
        },
        ...
        SS: {
            run_left: {
                job: 'fit-zone',
                run_zones: [2]
            },
            run_right: {
                job: 'pursue'
            }:,
            pass: {
                job: 'cover-man',
                target_player: 'Y'
            }
        }
    }
}