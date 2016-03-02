
module.exports = {

	//secret: used when we create and verify JSON Web Tokens
    'secret'				: 'EpamEventsApp', 

    'database'				: 'mongodb://localhost/BadmintonEventsDatabase',
    //database BadmintonEventsDatabase
    //table badmintonEvents

    'GUNMAIL_API_KEY'       : "api:key-b44d014234e4765a45f20fae0c1f8b2e",
    'port'					: "6680", 
    'ip' 					: "http://localhost",

    'ADMIN_EMAIL'           : "Ricky_Tsao@epam.com",
    'ADMIN_PHONE'           : "18688752061",
    'ROOT_PATH'             : "/Users/rickytsao/Desktop/EPAM_events_LIVE/",

    "EVENT_DEADLINE_WITHIN_HOURS" 	: 24 //deadline of the event in "hours from the event"
};
