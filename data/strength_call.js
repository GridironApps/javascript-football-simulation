if non-rb left > non-rb right 
    strong left 
else if non-rb left < non-rb right 
    strong right 
else //balanced
    if ends left > ends right 
        strong left 
    else if ends left < ends right 
        strong right 
    else //balanced
        if fb left > fb right 
            strong left 
        else if fb left < fb right 
            strong right 
        else //balanced
            if rb left > rb right 
                strong right 
            else if rb left < rb right 
                strong left 
            else //balanced
                strong left //TODO add field and QB arm checks