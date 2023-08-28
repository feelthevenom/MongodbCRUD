const express =require("express");
const app=express();
const bodyparser=require("body-parser");
const exhbs=require("express-handlebars");
const dbo=require('./db')//databaseobject
const ObjectID=dbo.ObjectID;

app.engine('hbs',exhbs.engine({layoutsDir:"views/",defaultLayout:"main",extname:"hbs"}))
app.set('view engine','hbs');
app.set('views','views')
app.use(bodyparser.urlencoded({extended: true}));//midle ware for body-parser


//Read operation
app.get('/',async (req,res)=>{
let database=await dbo.getDatabase();
const collection=database.collection("books");
const cursor=collection.find({})
let books=await cursor.toArray();

    let message='';
    let edit_id,edit_book;
    if(req.query.edit_id)
    {
        edit_id=req.query.edit_id;
        edit_book=await collection.findOne({_id:new ObjectID(edit_id)});
    }

    if(req.query.delete_id)
    {
        await collection.deleteOne({_id:new ObjectID(req.query.delete_id)});
        return res.redirect('/?status=3');
    }
    //get from created
    switch (req.query.status) {
            case '1':
            message="Inserted successfuly";
            break;
            case '2':
                message="Updated successfuly";
                break;
            case '3':
                message="Deleted successfuly";
                break;    
        default:
            break;
    }
    res.render('main',{message,books,edit_book,edit_id});
})


//Create
app.post('/store_book',async (req,res)=>{
    let database =await dbo.getDatabase();
    const collection=database.collection("books");
    let book ={title:req.body.title,auther:req.body.auther};
    await collection.insertOne(book);
    return res.redirect('/?status=1');
})
//Update
app.post('/update_book/:edit_id',async (req,res)=>{
    let database =await dbo.getDatabase();
    const collection=database.collection("books");
    let book ={title:req.body.title,auther:req.body.auther};
    let edit_id=req.params.edit_id;
    await collection.updateOne({_id:new ObjectID(edit_id)},{$set:book});
    return res.redirect('/?status=2');
})
app.listen(4000,()=>{
    console.log("Listening to the port 4000");
})