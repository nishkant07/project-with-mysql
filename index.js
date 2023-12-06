const { faker } = require("@faker-js/faker");
const mysql=require("mysql2");
const express=require("express");
const methodOverride=require("method-override");
const path=require("path");
const {v4:uuidv4}=require("uuid");
const app=express();

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

app.listen("8080",()=>{
    console.log("server is runnnning...");
});


const connection =mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"sqlproject",
    password:"nishkant07"
});

//home page creation..
app.get("/",(req,res)=>{
    try{
    connection.query("select count(*) from user",(err,result)=>{
        if(err)throw err;
        let count=result[0]["count(*)"];
        res.render("home.ejs",{count});
    });
}catch(err){
    console.log(err);
};
});

//showpage
app.get("/users",(req,res)=>{
    try{
    connection.query("select * from user",(err,result)=>{
        if(err)throw err;
        res.render("show.ejs",{result});
    });
}catch(err){
    console.log(err);
};
});


//add new user
let newusrid="";
app.get("/users/new",(req,res)=>{
    newusrid=uuidv4();
    res.render("new.ejs",{newusrid});
});
app.post("/users/new",(req,res)=>{
    let q2="insert into user (id,username,email,password) values(?,?,?,?)";
    let {username,email,password}=req.body;
    let q2data=[newusrid,username,email,password];
    try{
    connection.query(q2,q2data,(err,result)=>{
        if(err)throw err;
        console.log(result);
        res.redirect("/users");
    });
}catch(err){
    console.log(err);
};
});



//edit user
app.get("/users/:id",(req,res)=>{
    let {id}=req.params;
    let q3=`select * from user where id="${id}"`;
    try{
    connection.query(q3,(err,result)=>{
        if(err)throw err;
        res.render("edit.ejs",{result});
    });
}catch(err){
    console.log(err);
};
});

app.patch("/users/:id",(req,res)=>{
    let {username,password}=req.body;
    let{id}=req.params;
    let q4=` select * from user where id="${id}"`;
    connection.query(q4,(err,result)=>{
        if(err)throw err;
        if(password==result[0].password){
            let q5=`update user set username="${username}" where id="${id}"`;
            connection.query(q5,(err,result)=>{
                if(err)throw err;
                console.log(result);
                res.redirect("/users");
            });
        }else{
            res.send("wrong password..............");
        };
    });
});


//delete page
app.get("/users/delete/:id",(req,res)=>{
    let {id}=req.params;
    res.render("delete.ejs",{id});
});

app.delete("/users/:id",(req,res)=>{
    let {id}=req.params;
    let{password}=req.body;
    let q6=`select * from user where id="${id}"`;
    let q7=`delete from user where id="${id}"`;
    connection.query(q6,(err,result)=>{
        if(err)throw err;
        if(password==result[0].password){
            connection.query(q7,(err,result)=>{
                if(err)throw err;
                console.log(result);
                res.redirect("/users");
            });
        }else{
            res.send("wrong password...............")
        };
        
    });
});









// let fakegen=()=>{
//     return[
//         faker.datatype.uuid(),
//         faker.internet.userName(),
//         faker .internet.email(),
//         faker.internet.password()
//     ];
// };

////fake data generate and uploder
// let qdata=[];
// for(let i=0;i<=50;i++){
//    qdata.push(fakegen());
// };
// console.log(qdata);

// let q=`insert into user (id,username,email,password) values?`;

// try{
// connection.query(q,[qdata],(err,result)=>{
//     if(err)throw err;
//     console.log(result);
// });
// }catch(err){
//     console.log(err);
// };
// connection.end();



