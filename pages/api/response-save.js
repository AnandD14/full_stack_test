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
 
    const datas = req.body;
    console.log(datas);
    const query = `INSERT INTO response 
        (eid, qid, answer, name, email, phone_number) VALUES (?, ?, ?, ?, ?, ?);`;
   

    await datas.map(data => {
        db_con.query(query, [data.eid, data.qid, data.answer, data.username, data.email, data.phoneNumber], (err, rows) => {
            if (err) 
              throw err;
            //setQid(rows.insertId);
          });
    })
 
    res.json();

  })
  .put(async (req, res) => {
    res.end("async/await is also supported!");
  })
  .patch(async (req, res) => {
    throw new Error("Throws me around! Error can be caught and handled.");
  });

export default handler;