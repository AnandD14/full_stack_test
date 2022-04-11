import { useContext } from "react";
import {FormContext}  from "../FormContext";

function Input({question, qid}) {
    const { handleChange } = useContext(FormContext)
    return (
        <div className="form-group p-3">
            <label htmlFor="question">{question}</label>
            <input className='form-control' name={"answer"+qid}  onChange={event => handleChange(qid, event)}></input>                  
        </div>
    )
}

export default Input;