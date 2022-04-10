import nc from "next-connect";

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
  .post(async (req, res) => {
 
    const data = req.body;
    console.log(data);
    const query = `INSERT INTO question 
        (question, type, eid, Choices) VALUES (?, ?, ?, ?);`;
   
     // Value to be inserted
    const question = data.question;
    const type = data.type;
    const experimentId = data.experimentId
    const options = JSON.stringify(data.options);

     // Creating queries
    await db_con.query(query, [question, type, experimentId, options], (err, rows) => {
      if (err) 
        throw err;
      //setQid(rows.insertId);
    });

 
  res.json();

  })
  .put(async (req, res) => {
    res.end("async/await is also supported!");
  })
  .patch(async (req, res) => {
    throw new Error("Throws me around! Error can be caught and handled.");
  });

export default handler;