//creating required node objects
const express = require("express");
const bodyParser = require("body-parser")
const path = require('path');
const ejs=require('ejs');
const static_path =path.join(__dirname,"../styles");
const auth=require;

//for alert messages
let alert = require('alert'); 

//creating express object
app = express().use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));

app.set('view engine','ejs');//for rendering ejs files

app.use('/public', express.static('public'));//setting path to static(css) files

//creating mongoose object to access mongodb atlas and making connection with mongodb atlas
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://project:events2023@cluster0.6oh0gtt.mongodb.net/Project?retryWrites=true&w=majority',{useNewUrlParser: true,useUnifiedTopology: true}
); 
const db = mongoose.connection;
db.once('open', () => {
    console.log("DB connected successfully")
});

//creating mongodb schema to store admin details
var userSchema = new mongoose.Schema({
    email: String,
    password:String
});

//creating mongodb database-users using userSchema
var userModel=mongoose.model('users',userSchema);

//creating mongodb schema to store events
var eventSchema = new mongoose.Schema({
    name: String,
    description:String,
    venue:String,
    startDate:String,
    endDate:String,
    startTime:String,
    endTime:String,
    eligible:String,
    contact:String,
});

var edueventsModel=mongoose.model('eduEvents',eventSchema);//creating eduEvents database to store educational events

var culeventsModel=mongoose.model('culEvents',eventSchema);//creating culEvents database to store cultural events

var spoeventsModel=mongoose.model('spoEvents',eventSchema);//creating spoEvents database to store sports events

//schema to store user registrations
var userregSchema = new mongoose.Schema({
    eventID:String,
    name: String,
    email:String,
    usn:String,
    branch:String,
    sem:String,

});

var eduregModel=mongoose.model('eduRegister',userregSchema);//database to store edu events registrations

var culregModel=mongoose.model('culRegister',userregSchema);//database to store cultural events registrations

var sporegModel=mongoose.model('spoRegister',userregSchema);//database to store sports events registrations

//getting current date
var datetime = new Date();
var reqDate=datetime.toISOString().slice(0,10);

//rendering index.ejs file-home page
app.get("/", function(req, res) { 
    res.render('index')
 });


app.get("/admin_register.ejs", function(req, res) { 
    res.render('admin_register')
 });

//getting data from admin registration and storing in users database
 app.post("/admin_register.ejs", function(req, res) {
    
    var userDetails = new userModel({
        email: req.body.email,
        password: req.body.password,
      });
      db.collection('users').count(function(err, count) {
        
    
        if( count == 0) {
            
            userDetails .save().then(()=>{
                alert("Admin created.Login to proceed.")
              }).catch((err)=>{
                console.log('Error during record insertion : ' + err);
        
              })
        }
        else {
            alert("Admin exists")
            
        }
    });
    } 
          
    );



app.get("/admin_login.ejs", function(req, res) { 
    res.render('admin_login')
    });

//checking admin login
app.post("/admin_login.ejs", async(req,res)=> {
        try{const { email, password} = req.body
            
            const useremail=await userModel.findOne({email:email});
            
            if(useremail.password===password){
                res.status(201).render("admin_home");
                
            }
            else{
                alert("Wrong password");
            }
    
        }catch(error){
            alert("Invalid email")
        }
        
    })


app.get("/admin_setpass.ejs", function(req, res) { 
    res.render('admin_setpass')
    });

//resetting admin account password
app.post("/admin_setpass.ejs", async(req,res)=> {
    try{
        const{email,password,cpassword}=req.body
        
        const useremail=await userModel.findOne({email:email});

        if(useremail.email!=email){
            alert('Wrong email')
        }
        
                if(password===cpassword){
            
                    const updateDocument = {
                        $set: {
                           password: cpassword,
                        },
                     };
                     const result = await userModel.updateOne(useremail, updateDocument);
                     
                    res.render("admin_home1")
                }
                else{
                    alert("Passwords not matching")
                }
        
            }catch(error){
                alert("Invalid email")
            }
            
    });


    
    app.get("/admin.ejs", function(req, res) { 
        res.render('admin')
    });

    
    app.get("/admin_viewreg.ejs", function(req, res) { 
            res.render('admin_viewreg')
    });

    
    app.get("/admin_addevent.ejs", function(req, res) { 
            res.render('admin_addevent')
    });

    
    app.get("/admin_eduevent.ejs", function(req, res) { 
        res.render('admin_eduevent')
    });

    //storing educational event data entered by admin in database
    app.post("/admin_eduevent.ejs", function(req, res) {
    
        var edueventDetails = new edueventsModel({
            name: req.body.name,
            description: req.body.description,
            venue: req.body.venue,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            eligible: req.body.eligible,
            contact: req.body.contact
          });
          
            edueventDetails .save().then(()=>{
                res.render('admin_addevent')
                alert('Event posted')
                }).catch((err)=>{
                    console.log('Error during record insertion : ' + err);
                    })
            
        });
        
              
        
    
    app.get("/admin_culevent.ejs", function(req, res) { 
    res.render('admin_culevent')
    });

    
    //storing cultural event data entered by admin in database
    app.post("/admin_culevent.ejs", function(req, res) {
    
        var culeventDetails = new culeventsModel({
            name: req.body.name,
            description: req.body.description,
            venue: req.body.venue,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            eligible: req.body.eligible,
            contact: req.body.contact
          });
          
            culeventDetails .save().then(()=>{
                res.render('admin_addevent')
                alert('Event posted')
                
                }).catch((err)=>{
                    console.log('Error during record insertion : ' + err);
                    })
            
        });
        

    
    app.get("/admin_spoevent.ejs", function(req, res) { 
      res.render('admin_spoevent')
    });

    //storing educational event data entered by admin in database
    app.post("/admin_spoevent.ejs", function(req, res) {
    
        var spoeventDetails = new spoeventsModel({
            name: req.body.name,
            description: req.body.description,
            venue: req.body.venue,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            eligible: req.body.eligible,
            contact: req.body.contact
          });
          
            spoeventDetails .save().then(()=>{
                
                res.render('admin_addevent')
                alert('Event posted')
                }).catch((err)=>{
                    console.log('Error during record insertion : ' + err);
                    })
            
        });

    //getting educational events which are upcoming or ongoing from database and rendering to admin_viewedu.ejs file
    app.get("/admin_viewedu.ejs", function(req, res) { 
        //finding events whose end dates are greater than or equal to the current data and sorting them in ascending order of their start dates
        edueventsModel.find({endDate:{$gte:reqDate}}).sort({startDate:1}).then((events)=>{
            res.render('admin_viewedu', {
                eventList: events
            })
        })
        });

    app.get("/admin_eduVR.ejs", function(req, res) { 
            res.render('admin_viewreg')
          });

    app.get("/admin_eduEmail.ejs", function(req, res) { 
            res.render('admin_viewreg')
          });

    //rendering all educational events registrations from database to admin_eduVR.ejs file
    app.post("/admin_eduVR.ejs",function(req,res){
        const id=req.body.id;

        eduregModel.find({eventID:id}).sort({usn:1}).then((events)=>{
            
            res.render('admin_eduVR', {
                eventList: events
            })
        })

    })

    app.post("/admin_eduEmail.ejs",function(req,res){
        const id=req.body.id;

        eduregModel.find({eventID:id}).sort({usn:1}).then((events)=>{
            
            res.render('admin_eduEmail', {
                eventList: events
            })
        })

    })

    //getting cultural events which are upcoming or ongoing from database and rendering to admin_viewcul.ejs file
    app.get("/admin_viewcul.ejs", function(req, res) { 
    
            culeventsModel.find({endDate:{$gte:reqDate}}).sort({startDate:1}).then((events)=>{
                
                res.render('admin_viewcul', {
                    eventList: events
                })
            })
            });

    app.get("/admin_culVR.ejs", function(req, res) { 
                res.render('admin_viewreg')
              });
    
    app.get("/admin_culEmail.ejs", function(req, res) { 
                res.render('admin_viewreg')
              });

    //rendering all cultural events registrations from database to admin_culVR.ejs file
    app.post("/admin_culVR.ejs",function(req,res){
                const id=req.body.id;
        
                culregModel.find({eventID:id}).sort({usn:1}).then((events)=>{
                    
                    res.render('admin_culVR', {
                        eventList: events
                    })
                })
        
            })
        
    app.post("/admin_culEmail.ejs",function(req,res){
                const id=req.body.id;
        
                culregModel.find({eventID:id}).sort({usn:1}).then((events)=>{
                    
                    res.render('admin_culEmail', {
                        eventList: events
                    })
                })
        
            })

    
    //getting sports events which are upcoming or ongoing from database and rendering to admin_viewcul.ejs file
    app.get("/admin_viewspo.ejs", function(req, res) { 
    
           spoeventsModel.find({endDate:{$gte:reqDate}}).sort({startDate:1}).then((events)=>{
            
             res.render('admin_viewspo', {
             eventList: events
            })
                })
                });

    app.get("/admin_spoVR.ejs", function(req, res) { 
            res.render('admin_viewreg')
          });
                
    app.get("/admin_spoEmail.ejs", function(req, res) { 
            res.render('admin_viewreg')
          });

    //rendering all educational events registrations from database to admin_culVR.ejs file
    app.post("/admin_spoVR.ejs",function(req,res){
                    const id=req.body.id;
            
                    sporegModel.find({eventID:id}).sort({usn:1}).then((events)=>{
                        
                        res.render('admin_spoVR', {
                            eventList: events
                        })
                    })
            
                })

    
            
    app.post("/admin_spoEmail.ejs",function(req,res){
            const id=req.body.id;
            
            sporegModel.find({eventID:id}).sort({usn:1}).then((events)=>{
                        
               res.render('admin_spoEmail', {
                   eventList: events
                    })
            })
            
    })
    

    app.get("/events.ejs", function(req, res) { 
        res.render('events')
        });

    //rendering all educational events details from database to events_edu.ejs file
    app.get("/events_edu.ejs", function(req, res) { 
        edueventsModel.find({endDate:{$gte:reqDate}}).sort({startDate:1}).then((events)=>{
            
            res.render('events_edu', {
                eventList: events
            })
        })
        
        });

    app.post("/events_edu.ejs", function(req, res) {
        const id=req.body.id;
        
        res.render('events_edureg',{id})
                
            });
    //rendering all cultural events details from database to events_cul.ejs file
    app.get("/events_cul.ejs", function(req, res) { 
        culeventsModel.find({endDate:{$gte:reqDate}}).sort({startDate:1}).then((events)=>{
            
            res.render('events_cul', {
                eventList: events
            })
        })
       
        });

    app.post("/events_cul.ejs", function(req, res) {
            const id=req.body.id;
            
            res.render('events_culreg',{id})
                    
            });

    //rendering all sports events details from database to events_spo.ejs file
    app.get("/events_spo.ejs", function(req, res) { 
        spoeventsModel.find({endDate:{$gte:reqDate}}).sort({startDate:1}).then((events)=>{
            
            res.render('events_spo', {
                eventList: events
            })
        })
       
        });

    app.post("/events_spo.ejs", function(req, res) {
        const id=req.body.id;
        
        res.render('events_sporeg',{id})
                    
            });

     app.get("/events_edureg.ejs", function(req, res) { 
        res.render('events_edureg')
        });

    //storing educational event registrations in database
    app.post("/events_edureg.ejs", function(req, res) {
        var userDetails = new eduregModel({
            eventID: req.body.id,
            name: req.body.name,
            email: req.body.email,
            usn: req.body.usn,
            branch: req.body.branch,
            sem: req.body.sem
          });
          
            userDetails .save().then(()=>{
                alert("Successfully registered")
                res.render('events')
                  }).catch((err)=>{
                    console.log('Error during record insertion : ' + err);
            
                  })
                        
                });

    app.get("/events_culreg.ejs", function(req, res) { 
        res.render('events_culreg')
        });

    //storing cultural event registrations in database
    app.post("/events_culreg.ejs", function(req, res) {
            var userDetails = new culregModel({
                eventID: req.body.id,
                name: req.body.name,
                email: req.body.email,
                usn: req.body.usn,
                branch: req.body.branch,
                sem: req.body.sem
              });
              
                userDetails .save().then(()=>{
                    alert("Successfully registered")
                    res.render('events')
                      }).catch((err)=>{
                        console.log('Error during record insertion : ' + err);
                
                      })
                            
                    });

    app.get("/events_sporeg.ejs", function(req, res) { 
        res.render('events_sporeg')
        });

    //storing sports event registrations in database
    app.post("/events_sporeg.ejs", function(req, res) {
            var userDetails = new sporegModel({
                eventID: req.body.id,
                name: req.body.name,
                email: req.body.email,
                usn: req.body.usn,
                branch: req.body.branch,
                sem: req.body.sem
              });
              
                userDetails .save().then(()=>{
                    alert("Successfully registered")
                    res.render('events')
                      }).catch((err)=>{
                        console.log('Error during record insertion : ' + err);
                
                      })
                            
                    });
    




    app.listen(8000, function(){
    console.log("Server is running on port 8000");
});