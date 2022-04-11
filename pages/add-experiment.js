import { useState, useEffect } from 'react';
import Header from './header';
import { useForm } from 'react-hook-form';
import { createRef } from 'react';
import Link from 'next/link';


function AddExperiment() {
  const optionInput = createRef();
  const form = createRef();

 
  //necessary state values for page interactivity.
  const [showSave, setShowSave] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showExperiment, setShowExperiment] = useState(true);
  const [experimentId, setExperimentId] = useState(0);
  const [optionInputCount, setOptionInputCount] = useState(false);
  const [optionCount, setOptionCount] = useState(0);
  const [optionNumber, setOptionNumber] = useState(1);
  const [counter, setCounter] = useState(1);
  const [option, setOption] = useState('option');
  const [options, setOptions] = useState([]);
  const [savedMessage, setSavedMessage] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  

  //to maintain persistence on the page which is called when the page loads for the first time for knowing the cuurent experience if user realoads the page.
  useEffect( () =>{
    const data  = window.localStorage.getItem('EXPERIMENT');
    if(data !== null ){
      setShowExperiment(JSON.parse(data));
      setShowQuestion(true);
    }
  },[])

 //handle change when a choice is made.
  const handleChange= (e) => {
    console.log(e.target.value);
    if(e.target.value === "Single-line text"){ 
      setShowInput(false);
      setOptionInputCount(false);
      setShowSave(true);
    }
    if(e.target.value === "Multi-line text"){
      setShowInput(false);
      setOptionInputCount(false);
      setShowSave(true);

    }
    if(e.target.value === "Select from list of options"){
      setOptionInputCount(true);
      setShowSave(false);
    }
  }

  //add option for selecting from list of options
  const addOption = (e) => {

    if(optionInput.current.value === ""){
      setAlertMessage("Please enter option number "+optionNumber);
      optionInput.current.focus();
    }
    else {
      if(optionNumber <= optionCount){

        if(optionNumber == optionCount){
          setShowInput(false);
          setOptionInputCount(false);
          setShowSave(true);
          setAlertMessage(null);
        }
        setOptionNumber(optionNumber + 1);
        setOption(option = optionInput.current.value);
        setOptions(options => [...options, option]);
        form.current.option.value = "";
        form.current.option.focus();
        setAlertMessage(null);
      }
    }
  }  

  //get option number on enter key presssed.
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if(e.target.value === "")
        setAlertMessage("Please enter options in number");
      else{ 
        setOptionCount(e.target.value);
        setShowInput(!showInput);
        setAlertMessage(null);
      }
    }
  }

  //use form hook for validation
  const {register, handleSubmit, formState:{errors}} = useForm();

  const submitForm = (e) => {
    saveQuestion();
  }
 
  
  async function saveQuestion(){
    const id = window.localStorage.getItem('EXPERIMENT_ID');
    console.log(id);
    const response = await fetch('/api/save-question', {
      method: 'POST',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        experimentId: id,
        question: form.current.experimentQuestion.value,
        type: form.current.choice.value,
        options: options
      })
    })

    if (!response.ok){
      throw new Error(response.statusText);
    }else{
      setShowSave(false);
      setSavedMessage("Question "+ counter +" has been added. Do you want add more questions?");
    }
  }

  async function saveExperiment(){

    if(form.current.experiment.value === "") {
      setAlertMessage("Please enter the name of the experiment");
      form.current.experiment.focus();
    }else {
  
      const response = await fetch('/api/save-experiment', {
        method: 'POST',
        body: JSON.stringify({
        experiment: form.current.experiment.value
        })
      })
      if (!response.ok){
        throw new Error(response.statusText);
      }else{
        setShowExperiment(false);
        setShowQuestion(true);
        window.localStorage.setItem('EXPERIMENT', JSON.stringify(false));
      }
      return await response.json();
    }
  }
  
    return (
        <>
          <Header/>
          <h1 className='display-3 text-center mt-5'>ADD EXPERIMENT</h1>
          <div className='row mt-5'>
            {alertMessage && <div className="alert alert-danger" role="alert">
                 {alertMessage}
            </div>}
            <div className="col-md-4 card m-auto shadow-lg">
              <form onSubmit={handleSubmit(submitForm)} ref={form}>
                <div className="card-body">
                  { showExperiment && <div><div className="form-group p-3">
                    <label htmlFor="experiment">Enter the name for the Experiment:</label>
                    <input className='form-control' name="experiment" ></input>    
                  </div>
                  <div className="form-group p-3">
                    <button type="button" className='btn btn-primary' onClick={ async () => {
                      const data = await saveExperiment();
                      data ? setExperimentId(data.id) : null;
                      data ? window.localStorage.setItem('EXPERIMENT_ID', JSON.stringify(data.id)): null;
                      }}>Save</button>
                  </div></div>}
                 {showQuestion && <div><div className="form-group p-3">
                    <label htmlFor="experiment-question">Enter question number {counter}:</label>
                    <input className='form-control' name="experiment-question" {...register('experimentQuestion', {required:true})}></input>
                    {errors.experimentQuestion && errors.experimentQuestion.type == 'required' && <p className='text-danger'>Please enter question number {counter}</p>}
                  </div>
                  <div className="form-group p-3">
                    <label htmlFor="experiment-question-type">Please choose the type of question.</label>
                  </div>
                  <div className="form-check ps-5">
                    <input className="form-check-input" type="radio" name="choice" id="single-line" value="Single-line text"  onChange={handleChange} />
                    <label className="form-check-label" htmlFor="single-line">Single-line text</label>
                  </div>
                  <div className="form-check ps-5">
                    <input className="form-check-input" type="radio" name="choice" id="multi-line" value="Multi-line text"   onChange={handleChange}/>
                    <label className="form-check-label" htmlFor="multi-line">Multi-line text</label>
                  </div>
                  <div className="form-check ps-5">
                    <input className="form-check-input" type="radio" name="choice" id="options" value="Select from list of options"   onChange={handleChange}/>
                    <label className="form-check-label" htmlFor="options">Select from list of options</label>
                  </div>
                  {optionInputCount && <div className="form-group p-3"><label htmlFor="option-number">Enter number of options you want to add:</label>
                    <input className="form-control" name="options" onKeyDown={handleKeyDown}></input>
                    <p className='text-primary'>Enter option number and press enter continue</p>
                  </div>}
                  {showInput && <div><div className="form-group p-3"><label htmlFor="option">Enter option number {optionNumber}: </label>
                    <input className="form-control" name="option" ref={optionInput}></input>
                  </div> 
                  <div className="form-group ps-3">
                    <button type="button" className="btn btn-success" onClick={addOption}>Add Option</button>
                  </div>
                  </div>}
                  {showSave && <div className="form-group ps-3"> <button type="submit" className="btn btn-primary">Save</button></div>}
                  </div> }
                </div>
               
          
              </form>
              {savedMessage && <div>
                   <div className="alert alert-info p-2" role="alert">
                    {savedMessage}
                 
                   <button type="button" className="btn btn-success m-2" onClick={() =>{
                         form.current.experimentQuestion.value = "";
                         form.current.experimentQuestion.focus();
                         form.current.choice.checked = false;
                         setCounter(counter + 1); 
                         setSavedMessage(null);  
                       }}>YES</button>
                  
                     <Link href="/">
                       <button type="button" className="btn btn-danger m-2"  onClick={() =>{
                         window.localStorage.clear();
                       }}>NO</button>
                     </Link>  
                   </div>
                 </div>
              
              
              }
              
              </div>
            </div>

           
            </>
           
     
    
    )



}

export default AddExperiment;



