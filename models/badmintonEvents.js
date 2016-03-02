
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var eventAttendee = new mongoose.Schema({
    email:                  {type: String, required: true}, 
    sha:                    {type: String, required: true}, 
    registered:             Boolean
});


//BadmintonEvents is model name for when you instantiate 
module.exports = mongoose.model('BadmintonEvents', new Schema({ 

    attendees_table_name:     {type: String, required: true, unique: true }, 
    date:                     {type: Date, required: true}, 
    description:              {type: String, required: true}, 
    attendees:                [eventAttendee]

  }, { collection: 'badmintonEvents' }) 

  //badmintonEvents name of table so in db you can do
  // db.badmintonEvents.find()

);



/*

////////// FLOW DATES ///////////////////////////

var FlowDateSchema = new mongoose.Schema({
    startDate:                String,
    endDate:                  String
});


////////// BBT  SCHEMAS //////////////////////////

var bbtTimeTempSchema = new mongoose.Schema({
    time:                     String,
    temperature:              String,
});

var bbtDaysSchema = new mongoose.Schema({
    date:                     {type: String, required: true}, 
    recordings:               [bbtTimeTempSchema]
});


////////// SIGN SCHEMAS ////////////////////

var SignDataSchema = new mongoose.Schema({

    signName:                 String,
    date:                     String,
    original_prob:            String,
    calculated_prob:          String
});




//////////// USER SCHEMA //////////////////////

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({ 

    email:                    {type: String, required: true, unique: true }, 
    name:                     {type: String, required: true}, 
    password:                 {type: String, required: true}, 
    admin:                    Boolean,
    
    //user settings
    status:                   String, 
    ave_cycle_length:         String,
    birthday:                 String,
    age_first_period:         String,
    physical_experiences:     String,
    how_long_trying_conceive: String,
    is_this_first_baby:       String,
    physical_activity:        String,
    bmi:                      String,

    allSigns:                 [SignDataSchema], 
    flowDates:                [FlowDateSchema], // array of {startDate, endDate}
    bbtRecordings:            [bbtDaysSchema]

  }, { collection: 'user' })

);
*/


/*
// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: Date,
  updated_at: Date
}, { collection: 'person'});


// custom method to add string to end of name
// you can create more important methods like name validations or formatting
// you can also do queries and find similar users 
userSchema.methods.dudify = function() {
  // add some stuff to the users name
  this.name = this.name + '-dude'; 

  return this.name;
};


// the schema is useless so far
// we need to create a model using it
var Person = mongoose.model('person', userSchema);

// make this available to our users in our Node applications
module.exports = Person;
*/