const express = require("express");

const { adminAuth } = require("./middleware/auth");

const app = express();

// app.use(
//     "/route",
//     (req, res, next) => {
//         console.log("from first router");
//         res.send("From server with defined port 3000");
//         next();
//     },
//     (req, res) => {
//         res.send("from router 2");
//     }
// );

// app.get("/user/:id/:name", (req, res) => {
//     console.log(req.params);
//     res.send("From get method");
// })

// app.get(
//     "/user",
//     (req, res, next) => {
//         console.log("Logged from route 1");
//         next();
//     },
//     (req, res) => {
//         console.log("Logged from route 2");
//         res.send("from route 2");
//     }
// );

// app.all("/user", (req, res) => {
//     res.send("From all method.");
// });

app.use("/admin", adminAuth);

app.get("/admin/getdata", (req, res) => {
    res.send("Admin authorised.")
})

app.get("/admin/deleteuser", (req, res) => {
    res.send("User deleted.")
})


app.listen(3000, () => {
    console.log("Hello world");
});
