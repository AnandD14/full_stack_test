import Header from '../../pages/header';
import { useForm } from 'react-hook-form';
import { createRef, useEffect, useState,} from 'react';
import Element from '../element';         
import Link from 'next/link';
import { FormContext } from '../FormContext';
import { useRouter } from 'next/router';



function Experiment (){
    const nameInput = createRef();
    const emailInput = createRef();
    const phoneInput = createRef();
    const router = useRouter();
    const { query } = router;



    const [formElements, setFormElements] = useState(null);
    const [showForm, setShowForm] = useState(true);

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

    const form = createRef();
    const submitForm = (e) => {
        saveResponse();
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
       
        if(event.target.name === "username" || event.target.name === "email" || event.target.name === "phoneNumber" ){
            console.log(event.target.name, event.target.value);
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
                <div className="col-md-4 card m-auto shadow-lg">
                    <form onSubmit={handleSubmit(submitForm)}>
                        <div className="card-body">
                            <div className="form-group p-3">
                                <label htmlFor="name">Name</label>
                                <input className='form-control' name="username" onChange={event => handleChange(1,event)}></input>                  
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
           <div className="card-body">
             <h5 className="card-title">THANK YOU FOR YOR VALUABLE RESPONSE</h5>
             <p className="card-text">Please press the button below to go to next experiment.</p>
             <Link href="/">
                <button className="btn btn-primary">Explore Experiments</button>
            </Link>
           </div>
         </div>
            }
            </FormContext.Provider>
        </>
    )

}

export default Experiment;
