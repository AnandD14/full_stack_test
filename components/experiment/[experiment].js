import Header from '../../pages/header';
import { useForm } from 'react-hook-form';
import { createRef, useEffect, useState,} from 'react';
import Element from '../element';         
import Link from 'next/link';
import { FormContext } from '../FormContext';



function Experiment (){

    const form = createRef();


    const [formElements, setFormElements] = useState(null);
    const [showForm, setShowForm] = useState(true);
    const [showAlert, setShowAlert] = useState(null);
    
    //get experiment question and set it to setFormElements state for dynamic form elements.
    useEffect( () => {
        const path = window.location.pathname.split("/");
        getElements();
        async function getElements() {
            const response = await fetch('http://localhost:3000/api/get-experiment', {
                method: 'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    experiment: path[1].replaceAll("-"," ").toLowerCase()
                })
            })
            const datas = await response.json() 
            setFormElements(datas);
    
        }
    },[])

    const {register, handleSubmit, formState:{errors}} = useForm();

    const handleEmailValidation = email => {
        const isValid =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
            email);

        return isValid;
      };

    
   
    const submitForm = (e) => {
        console.log(handleEmailValidation(form.current.email.value));
        const validate = true;
        validate = validateForm();
        
        if(validate){
            saveResponse();
        }
        
    }
    
    //form validation when form is submitted.
    function validateForm() {
        if(form.current.username.value === "" || form.current.email.value === "" || form.current.phoneNumber.value === ""){
            setShowAlert("Name, Email and Phone Number is required");
            return false;
        }else if(!handleEmailValidation(form.current.email.value)){
            setShowAlert("Please enter a valid email");
            return false;
        }else if(!/^[0-9\b]+$/.test(form.current.phoneNumber.value)){
            setShowAlert("Please enter a valid phone number");
            return false;
        }else {
           try { formElements.forEach(formElement => {
                    if(!formElement.answer) 
                        throw Exception;
                    else {
                        if(formElement.answer === "") 
                            throw Exception;                    
                    }
                })
            }catch(e) {
                setShowAlert("Please answer all the questions");
                return false;
            }
        }

        return true;
    }

    async function saveResponse(){
        const response = await fetch('../api/response-save', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formElements)
        })

        if (!response.ok){
            throw new Error(response.statusText);
        }else{
            setShowForm(false);
        }
    }

     
    const handleChange = (id, event) => {

        setShowAlert(null);
       
        if(event.target.name === "username" || event.target.name === "email" || event.target.name === "phoneNumber" ){
            formElements.map(field => {
                field[event.target.name] = event.target.value;
                setFormElements(formElements)
            });
        } else {
            formElements.map(field => {
                const { qid, type } = field;
                if (id === qid) {
                field['answer'] = event.target.value;
          /*   switch (type) {
              case 'Single-line text':
                field['answer'] = event.target.value;
                break;
              case 'Multi-line text':
                
    
              default:
                field['field_value'] = event.target.value;
                break;
            } */
                }
                setFormElements(formElements)
            });
        }
        console.log(formElements);
    }

    return (
        <>
            <Header/>
            <FormContext.Provider value={{ handleChange }}>
            {showForm ? <div className='row mt-5'>
                {showAlert && <div className="alert alert-danger text-center" role="alert">
                    {showAlert}
                </div>}
                <div className="col-md-4 card m-auto shadow{-lg">
                    <form onSubmit={handleSubmit(event =>submitForm(event))} ref={form}>
                        <div className="card-body">
                            <div className="form-group p-3">
                                <label htmlFor="name">Name</label>
                                <input className='form-control' name="username" onChange={event => handleChange(1,event)} ></input>    
                            </div>
                            <div className="form-group p-3">
                                <label htmlFor="email">Email</label>
                                <input className='form-control' name="email" onChange={event => handleChange(2,event)}></input>                  
                            </div>
                            <div className="form-group p-3">
                                <label htmlFor="phone-number">Phone Number</label>
                                <input className='form-control' name="phoneNumber" onChange={event => handleChange(3,event)}></input>                  
                            </div>
                            {
                               formElements ? formElements.map((formElement ,i) => <Element key={i} formElement={formElement}/>) : null
                            }
                            <div className="form-group p-3">
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </form> 
                </div>
            </div>:
           
           <div className="card text-center">
            <div className="card-header">
                FULL STACK TEST
            </div>
           <div className="card-body m-2 p-2">
             <h5 className="card-title">THANK YOU FOR YOR VALUABLE RESPONSE</h5>
             <p className="card-text">Please press the button below to go to next experiment.</p>
             <Link href="/">
                <button className="btn btn-primary m-2">Explore Experiments</button>
            </Link>
           </div>
         </div>
            }
            </FormContext.Provider>
        </>
    )

}

export default Experiment;
