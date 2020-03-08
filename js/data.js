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
            "horizontal" : ["align","ball"],
            "vertical" : ["behind", "C", 0]
        },
        "T": {
            "horizontal": ["align", "ball"],
            "vertical": ["behind", "ball", 21]
        },
        "H": {
            "horizontal": ["align", "LG", 0],
            "vertical": ["behind", "ball", 12]
        },
        "X": {
            "horizontal": ["left-of", "numbers-left", 0],
            "vertical": ["behind", "ball", 0]
        },
        "Y": {
            "horizontal": ["align", "RG", 0],
            "vertical": ["behind", "ball", 12]
        },
        "Z": {
            "horizontal": ["right-of", "numbers-right", 0],
            "vertical": ["behind", "ball", 0]
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