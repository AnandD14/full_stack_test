import db_con from "../../config/db";
import nc from "next-connect";


const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found really??");
  },
})
  .post(async (req, res) => {
 
    const experiment = req.body.experiment;
    console.log(experiment);

    await db_con.query("Select experiment.name, experiment.eid, question.qid, question.question, question.`type`,question.choices From question inner join experiment on question.eid=experiment.eid where experiment.name= ?",[ experiment ], function (err, result, fields) {
        if (err) 
            throw err;
            console.log(result);
        res.status(200).json(result);

    })

  })

export default handler;