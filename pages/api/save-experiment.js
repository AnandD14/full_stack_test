import nc from "next-connect";
import Select from "../../components/elements/select";

import db_con from "../../config/db";

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})
  .post((req, res) => {

    const data = JSON.parse(req.body);
    const query = `INSERT INTO experiment 
        (name, status) VALUES (?, ?);`;
   
     // Value to be inserted
    const experiment = data.experiment;
    const status = 1;
 
     // Creating queries
    db_con.query(query, [experiment, 
    status], (err, rows) => {
         if (err) throw err;
         res.json({ id: rows.insertId });
     });
  })
  .put(async (req, res) => {
    const experimentId = req.body.experimentId;
    console.log(experimentId);

    const query = "UPDATE experiment SET status=0 WHERE eid = ?";

   const selectFromExperiment = () =>{

    db_con.query("Select * from experiment where status=1", function (err, result, fields) {
        if (err) 
            throw err;
            console.log(result);
        res.status(200).json(result);

    })
    }  
    
    await db_con.query(query, experimentId, function (err, result, fields) {
          if (err) 
            throw err;
          else  
            selectFromExperiment();
    });

    
  })

export default handler;