import { useContext } from "react";
import  {FormContext}  from "../FormContext";

function TextArea({question, qid}) {
    const { handleChange } = useContext(FormContext)
    return (
        <div className="form-group p-3">
            <label htmlFor="question">{question}</label>
            <textarea className='form-control' name={"answer"+qid} rows="3" onChange={event => handleChange(qid, event)}></textarea>                  
        </div>
    )
}

export default TextArea;