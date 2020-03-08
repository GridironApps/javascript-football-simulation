var field = {
    "type": "pro",
    "unit": "feet",
    "total_length": 360,
    "total_width": 160,
    "border_thickness": 6,
    "endzone_depth": 30,
    "goalline_thickness": 0.667,
    "line_thickness": 0.333,
    "hash_width": 18.5,    
    "hash_length": 2,  
    "number_height": 6,
    "number_width": 4,
    "number_top": 36,
    "goalpost_width": 18.5,
    "crossbar_height": 10,
    "goalpost_height": 30,
    "goalpost_diameter": 0.333
};

var o_formation = {
    "name": "Strong I Pro Right",
    "unit": "feet",
    "positions": {
        "QB": {
            "horizontal" : ["align","ball", 0],
            "vertical" : ["behind", "spot", 15]
        },
        "T": {
            "horizontal": ["align", "ball", 0],
            "vertical": ["behind", "spot", 21]
        },
        "H": {
            "horizontal": ["align", "RG", 0],
            "vertical": ["behind", "spot", 15]
        },
        "X": {
            "horizontal": ["left-of", "LT", 2],
            "vertical": ["shade-back", "C", 0]
        },
        "Y": {
            "horizontal": ["right-of", "RT", 2],
            "vertical": ["shade-back", "C", 0]
        },
        "Z": {
            "horizontal": ["right-of", "numbers-right", 0],
            "vertical": ["behind", "C", 0]
        },
        "LT": {
            "horizontal": ["left-of", "LG", 2],
            "vertical": ["shade-back", "C", 0]
        },
        "LG": {
            "horizontal": ["left-of", "C", 2],
            "vertical": ["shade-back", "C", 0]
        },
        "C": {
            "horizontal": ["align", "ball", 0],
            "vertical": ["behind", "ball", 0]
        },
        "RG": {
            "horizontal": ["right-of", "C", 2],
            "vertical": ["shade-back", "C", 0]
        },
        "RT": {
            "horizontal": ["right-of", "RG", 2],
            "vertical": ["shade-back", "C", 0]
        }
    }
}

var d_formation = {
    "name": "54 Cover 4",
    "unit": "feet",
    "positions": {
        "LE": {
            "horizontal": ["shade-strong", "OT-left", 0],
            "vertical": ["behind", "spot", 0]
        },
        "N": {
            "horizontal": ["shade-strong", "OC", 0],
            "vertical": ["behind", "spot", 0]
        },
        "RE": {
            "horizontal": ["shade-strong", "OT-right", 0],
            "vertical": ["behind", "spot", 0]
        },
        "S": [
            {
                "criteria": [
                    "WR_strong == 3",
                    "TE_strong == 0",
                    "RB_all <= 1"
                ],
                "horizontal": ["align", "WR3-strong", 0],
                "vertical": ["behind", "spot", 7.5]
            },
            {
                "criteria": [
                    "FB_strong >= 0.5"
                ],
                "horizontal": ["outside", "OT-strong", 3.5],
                "vertical": ["behind", "spot", 0]
            },
            {
                "criteria": [
                    "WR_strong == 2",
                    "TE_strong == 0",
                    "RB_all <= 1"
                ],
                "horizontal": ["apex", "OT-strong", "WR2-strong"],
                "vertical": ["behind", "spot", 7.5]
            },
            {
                "criteria": [
                    "TE_strong == 1"
                ],
                "horizontal": ["shade-out", "TE1-strong", 0],
                "vertical": ["behind", "spot", 0]
            },
            {
                "criteria": [
                    "TE_strong == 2"
                ],
                "horizontal": ["align", "TE1-strong", 0],
                "vertical": ["behind", "spot",  0]
            },
            {
                "criteria": [
                    "RB_all == 2",
                    "RB_strong >= .5"
                ],
                "horizontal": ["outside", "OT-strong", 3.5],
                "vertical": ["behind", "spot", 0]
            }
        ],
        "M": [
            {
                "criteria": [
                    "WR_strong >= 3"
                ],
                "horizontal": ["shade-out", "OT-strong", 0],
                "vertical": ["behind","spot", 12]
            },
            {
                "criteria": [
                    "WR_strong <= 2"
                ],
                "horizontal": ["shade-out", "OG-strong", 0],
                "vertical": ["behind", "spot", 12]
            }
        ],
        "W": {
            "horizontal": ["shade-out", "OG-weak", 0],
            "vertical": ["behind", "spot", 12]
        },
        "B": [
            {
                "criteria": [
                    "WR_weak == 3",
                    "TE_weak == 0",
                    "RB_all <= 1"
                ],
                "horizontal": ["align", "WR3-weak", 0],
                "vertical": ["behind", "spot", 7.5]
            },
            {
                "criteria": [
                    "WR_weak == 2",
                    "TE_weak == 0",
                    "RB_all <= 1"
                ],
                "horizontal": ["apex", "OT-weak", "WR2-weak"],
                "vertical": ["behind", "spot", 7.5]
            },
            {
                "criteria": [
                    "TE_weak == 1"
                ],
                "horizontal": ["shade-out", "TE1-weak", 0],
                "vertical": ["behind", "spot", 0]
            },
            {
                "criteria": [
                    "TE_weak == 2"
                ],
                "horizontal": ["align", "TE1-weak", 0],
                "vertical": ["behind", "spot",  0]
            },
            {
                "criteria": [
                    "WR_weak == 1",
                    "RB_all <= 2",
                    "FB_weak >= 0.5"
                ],
                "horizontal": ["outside", "OT-weak", 3.5],
                "vertical": ["behind", "spot", 0]
            },
            {
                "criteria": [
                    "WR_weak == 1",
                    "TE_weak == 0",
                    "RB_all <= 1"
                ],
                "horizontal": ["outside", "OT-weak", 7.5],
                "vertical": ["behind", "spot", 7.5]
            },
            {
                "criteria": [
                    "RB_all == 2",
                    "RB_weak >= .5"
                ],
                "horizontal": ["outside", "OT-weak", 3.5],
                "vertical": ["behind", "spot", 0]
            }
        ],
        "R": [
            {
                "criteria": [
                    "WR_strong >= 2"
                ],
                "horizontal": ["inside", "WR2-strong", 4.5],
                "vertical": ["behind", "spot", 28.5]
            },
            {
                "criteria": [
                    "WR_strong == 1",
                    "TE_strong == 1",
                    "FB_strong <= 1",
                    "RB_strong <= 1"
                ],
                "horizontal": ["apex", "TE1-strong", "OT-strong"],
                "vertical": ["behind", "spot", 22.5]
            },
            {
                "criteria": [
                    "WR_strong == 1",
                    "TE_strong >= 2"
                ],
                "horizontal": ["shade-out", "TE1-strong", 0],
                "vertical": ["behind", "spot", 22.5]
            },
            {
                "criteria": [
                    "WR_strong == 0",
                    "TE_strong >=2"
                ],
                "horizontal": ["apex", "TE1-strong", "TE2-strong"],
                "vertical": ["behind", "spot", 22.5]
            },
            {
                "criteria": [
                    "WR_strong <= 1",
                    "TE_strong == 0",
                    "FB_strong >= 0.5"
                ],
                "horizontal": ["shade-out", "OT-strong", 0],
                "vertical": ["behind", "spot", 22.5]
            },
            {
                "criteria": [
                    "WR_strong == 1",
                    "TE_strong == 0",
                    "FB_strong == 0",
                    "WR_weak >= 3"
                ],
                "horizontal": ["shade-out", "OT-strong", 0],
                "vertical": ["behind", "spot", 28.5]
            },
            {
                "criteria": [
                    "WR_strong == 1",
                    "TE_strong == 0",
                    "FB_strong == 0",
                    "WR_weak == 2",
                    "TE_weak <= 1",
                    "FB_weak <= 1"
                ],
                "horizontal": ["shade-out", "OT-strong", 0],
                "vertical": ["behind", "spot", 22.5]
            },
            {
                "criteria": [
                    "WR_strong == 1",
                    "TE_strong == 0",
                    "FB_strong == 0",
                    "WR_weak == 1",
                    "TE_weak <= 2"
                ],
                "horizontal": ["shade-out", "OT-strong", 0],
                "vertical": ["behind", "spot", 22.5]
            }
        ],
        "F": [
            {
                "criteria": [
                    "WR_weak >= 2"
                ],
                "horizontal": ["inside", "WR2-weak", 4.5],
                "vertical": ["behind", "spot", 28.5]
            },
            {
                "criteria": [
                    "WR_weak == 1",
                    "TE_weak == 1",
                    "FB_weak <= 1",
                    "RB_weak <= 1"
                ],
                "horizontal": ["apex", "TE1-weak", "OT-weak"],
                "vertical": ["behind", "spot", 22.5]
            },
            {
                "criteria": [
                    "WR_weak == 1",
                    "TE_weak >= 2"
                ],
                "horizontal": ["shade-out", "TE1-weak", 0],
                "vertical": ["behind", "spot", 22.5]
            },
            {
                "criteria": [
                    "WR_weak == 0",
                    "TE_weak == 1"
                ],
                "horizontal": ["apex", "TE1-weak", "OT-weak"],
                "vertical": ["behind", "spot", 22.5]
            },
            {
                "criteria": [
                    "WR_weak == 0",
                    "TE_weak >= 2"
                ],
                "horizontal": ["apex", "TE1-weak", "TE2-weak"],
                "vertical": ["behind", "spot", 22.5]
            },
            {
                "criteria": [
                    "WR_weak <= 1",
                    "TE_weak == 0",
                    "FB_weak >= 0.5"
                ],
                "horizontal": ["shade-out", "OT-weak", 0],
                "vertical": ["behind", "spot", 22.5]
            },
            {
                "criteria": [
                    "WR_weak == 1",
                    "TE_weak == 0",
                    "FB_weak == 0",
                    "WR_strong >= 3"
                ],
                "horizontal": ["shade-out", "OT-weak", 0],
                "vertical": ["behind", "spot", 28.5]
            },
            {
                "criteria": [
                    "WR_weak == 1",
                    "TE_weak == 0",
                    "FB_weak == 0",
                    "WR_strong == 2",
                    "TE_strong <= 1",
                    "FB_strong <= 1"
                ],
                "horizontal": ["shade-out", "OT-weak", 0],
                "vertical": ["behind", "spot", 22.5]
            },
            {
                "criteria": [
                    "WR_weak == 1",
                    "TE_weak == 0",
                    "FB_weak == 0",
                    "WR_strong == 1",
                    "TE_strong <= 2"
                ],
                "horizontal": ["shade-out", "OT-weak", 0],
                "vertical": ["behind", "spot", 22.5]
            }
        ],
        "RC": [
            {
                "criteria": [
                    "WR_right >= 1"
                ],
                "horizontal": ["shade-out", "WR1-right",0],
                "vertical": ["behind", "spot", 0]
            },
            {
                "criteria": [
                    "WR_right == 0",
                    "TE_right >= 1"
                ],
                "horizontal": ["outside", "TE1-right", 10.5],
                "vertical": ["behind", "spot", 16.5]
            },
            {
                "criteria": [
                    "WR_right == 0",
                    "TE_right == 0"
                ],
                "horizontal": ["outside", "OT-right", 10.5],
                "vertical": ["behind", "spot",  16.5]
            }
        ],
        "LC": [
            {
                "criteria": [
                    "WR_left >= 1"
                ],
                "horizontal": ["shade-out", "WR1-left",0],
                "vertical": ["behind", "spot", 0]
            },
            {
                "criteria": [
                    "WR_left == 0",
                    "TE_left >= 1"
                ],
                "horizontal": ["outside", "TE1-left", 10.5],
                "vertical": ["behind", "spot", 16.5]
            },
            {
                "criteria": [
                    "WR_left == 0",
                    "TE_left == 0"
                ],
                "horizontal": ["outside", "OT-left", 10.5],
                "vertical": ["behind", "spot",  16.5]
            }
        ]
    }
}