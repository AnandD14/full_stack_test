import { useContext } from "react";
import  {FormContext}  from "../FormContext";

function Select({question, qid, choices}) {
    const { handleChange } = useContext(FormContext)
    if(choices) {
        return (
            <div className="form-group p-3">
                <label htmlFor="question">{question}</label>
                <select className="form-select" name={"answer"+qid} onChange={event => handleChange(qid, event)} defaultValue={'DEFAULT'}> 
                    <option value="DEFAULT">Select an option</option>
                    {choices.map((choice, i) => 
                        <option key={i} value={choice}>{choice}</option>
                    )}
                </select>
            </div>         
        )
    }

    return null;
}

export default Select;