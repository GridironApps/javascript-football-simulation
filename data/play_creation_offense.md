OFFENSE

play = {
    type: <'run', 'pass'> //REQUIRED, used to start the correct simulation function
    name: <string> //OPTIONAL, short descriptive name for the play
    diagram: <link to image> //OPTIONAL, https://www.madden-school.com/playbooks is a good source for simple play diagrams to link to
    assignments: {    
        <PLAYER_ID>: { //PLAYER_ID should be things like QB, HB, LT, etc. (it can be more or less than 2 letters if desired)
            job: <'throw', 'handoff', 'run', 'run-route', 'block'> //REQUIRED
            importance: <number> //REQUIRED, sets the relative importance of player (vs other players on offense) when determining play success ... try 0 = none, 1 = low, 2 = med, 4 = high, 8 = primary ball handler

            OPTIONAL PARAMETERS
            
            start_position: <'center', 'pistol', 'shotgun'> //use only with 'throw' job to indicate where QB starts, NOT CURRENTLY USED
            drop: <'3-step', '5-step', '7-step'> //use only with 'throw' job, this influences how pass rush and pass coverage are weighted
            
            run_zone: <1,2,3,4,5,6> //use only for 'run' job, this indicates the zone the runner will (try to) run through

            catch_zone: <1,2,3,4,5,6> //use only for 'run-route' job, this indicates the zone where the reciever would catch the pass
            catch_depth: <number> //use only for the 'run-route' job, this indicates the depth from the LOS where the reciver would catch the pass
        }
    }
}

EXAMPLE

play = {
    type: 'pass',
    name: 'I-Form Pro Curls',
    diagram: 'https://www.madden-school.com/wp-content/plugins/playbook/playbook_images/27982_curls.png',
    assignments: {
        QB: {
            job: 'throw',
            importance: 8
            start_position: 'center',
            drop: '5-step'
        },
        HB: {
            job: 'run-route',
            importance: 1,
            catch_zone: 1,
            catch_depth: 0
        },
        ...
        LT : {
            job: 'block'
        }
        ...
    }
}