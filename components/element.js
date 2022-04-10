import Input from "./elements/input";
import Select from "./elements/select";
import TextArea from "./elements/textarea";

function Element({formElement :{type, question, qid ,choices}}) {

    switch (type) {
        case 'Single-line text':
            return (<Input question={question} qid={qid}/>)
        case 'Multi-line text':
            return (<TextArea question={question} qid={qid}/>)
        case 'Select from list of options':
            return (<Select question={question} qid={qid} choices={choices ? JSON.parse(choices) : null}/>)
        default:
            return null;
        
    }
}

export default Element;