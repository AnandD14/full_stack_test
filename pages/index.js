import Header from './header';
import Link from 'next/link';
import { useState, useEffect } from 'react';

//api call to get the available experiments.
export async function getServerSideProps() {
  const response = await fetch('http://localhost:3000/api/server-side')
  const experiments = await response.json()

  return {
    props: {
      experiments,
    }
  }
}


export default function Home({experiments}) {

  const [dataList, setDataList] = useState(null);
  
  //set experiments data as soon as page renders to maintain interactivity on page.
  useEffect( () =>{
    if(experiments !== null ){
      setDataList(experiments);
    }
  },[])


  //api call to disable the particular experiment on the basis of experiment id and 
  async function disableExperiment(e, id) {
    console.log(id);
    const response = await fetch('/api/save-experiment', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        experimentId: id
      })
    })
    if (!response.ok){
      throw new Error(response.statusText);
    }else{
      const datas = await response.json() 
      setDataList(datas); 
    }
  }

  //formatting for proper route in the url.(property report to property-report)
  const splitAndConcat = (experiment) => {
      return experiment.replaceAll(" ","-").toLowerCase();
  }
  
  //clear data stored on browser
  if(typeof window !== "undefined")
    window.localStorage.clear();
  
  return (
    <>
      <Header/>
      <div className="d-flex aligns-items-center justify-content-center">
        <main className='page-header'>
          <h1>
            EXPERIMENTATION
          </h1>
          {dataList && dataList.length > 0 ? 
          <table className="table">
            <thead>
              <tr>
                <th>
                  Experiments
                </th>
                <th>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {
                dataList.map((data, i) => {
                  return(
                    <tr key={i}>
                      <td>
                       <Link href={"/"+splitAndConcat(data.name)}>
                        {data.name}
                       </Link>
                      </td>
                      <td>
                        <button className="btn btn-danger" type="button" onClick={e => disableExperiment(e, data.eid)}>Disable</button>
                      </td>
                    </tr>
                   )
                })
              }

            </tbody>
          </table> :
          <div className="card text-center">
            <div className='card-body'>
              Currently there are no experiment running. Click the button below to add experiment.
            </div>
          </div>
          }

        <div className="container mt-2 p-4">
        <Link href="/add-experiment">
           <button className="btn btn-success">Add Experiment</button>
        </Link>
        </div>
      </main>
      </div>
    </>
  )
}