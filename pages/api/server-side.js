import db_con from "../../config/db";

export default function handler(req, res) {

    db_con.query("Select * from experiment where status=1", function (err, result, fields) {
        if (err) 
            throw err;
            console.log(result);
        res.status(200).json(result);

    })
}