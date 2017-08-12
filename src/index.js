'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = 'amzn1.ask.skill.629520e3-0edd-473c-8547-dcefd3717690';  // can be replaced with your app ID if publishing
var facts = require('./facts');
var GET_FACT_MSG_EN = [
    "Here's your fact: ",
    "Following is your fact: ",
    "Here's an interesting fact: ",
    "Following is an interesting fact for you: ",
    "Got an interesting fact for you: "
]
// Test hooks - do not remove!
exports.GetFactMsg = GET_FACT_MSG_EN;
var APP_ID_TEST = "mochatest";  // used for mocha tests to prevent warning
// end Test hooks
/*
    TODO (Part 2) add messages needed for the additional intent
    TODO (Part 3) add reprompt messages as needed
*/
var languageStrings = {
    "en": {
        "translation": {
            "FACTS": facts.FACTS_EN,
            "SKILL_NAME": "My History Facts",  // OPTIONAL change this to a more descriptive name
            "GET_FACT_MESSAGE": GET_FACT_MSG_EN,
            "HELP_MESSAGE": "You can say tell me a fact, or, you can say exit... What can I help you with?",
            "HELP_REPROMPT": "What can I help you with?",
            "STOP_MESSAGE": "Goodbye!"
        }
    }
};

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // set a test appId if running the mocha local tests
    if (event.session.application.applicationId == "mochatest") {
        alexa.appId = APP_ID_TEST
    }
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

/*
    TODO (Part 2) add an intent for specifying a fact by year named 'GetNewYearFactIntent'
    TODO (Part 2) provide a function for the new intent named 'GetYearFact' 
        that emits a randomized fact that includes the year requested by the user
        - if such a fact is not available, tell the user this and provide an alternative fact.
    TODO (Part 3) Keep the session open by providing the fact with :askWithCard instead of :tellWithCard
        - make sure the user knows that they need to respond
        - provide a reprompt that lets the user know how they can respond
    TODO (Part 3) Provide a randomized response for the GET_FACT_MESSAGE
        - add message to the array GET_FACT_MSG_EN
        - randomize this starting portion of the response for conversational variety
*/

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'GetNewFactIntent': function () {
        var factArr = this.t('FACTS');
        var randomFact = randomPhrase(factArr);

        // Create speech output
        var speechOutput = randomPhrase(this.t("GET_FACT_MESSAGE")) + randomFact;
        this.emit(':askWithCard', speechOutput, this.t("HELP_REPROMPT"), "Here's an Interesting AI Fact:", randomFact)
    },
    'GetFact': function () {
        // Get a random fact from the facts list
        // Use this.t() to get corresponding language data
        var factArr = this.t('FACTS');
        var randomFact = randomPhrase(factArr);

        // Create speech output
        var speechOutput = randomPhrase(this.t("GET_FACT_MESSAGE")) + randomFact;
        this.emit(':tellWithCard', speechOutput, this.t("SKILL_NAME"), randomFact)
    },
    'GetNewYearFactIntent': function () {
        //TODO your code here
	if (this.event.request.intent.slots && this.event.request.intent.slots.FACT_YEAR && this.event.request.intent.slots.FACT_YEAR.value) {
       	    console.log("Found " + this.event.request.intent.slots.FACT_YEAR.value);
	    var year = this.event.request.intent.slots.FACT_YEAR.value;
	    var yearFact = GetYearFact(this.t('FACTS'),year);
            var speechOutput = randomPhrase(this.t("GET_FACT_MESSAGE")) + yearFact;
            this.emit(':askWithCard', speechOutput, this.t("HELP_REPROMPT"), "Here's an Interesting AI Fact About " + year + ":", yearFact)
    	}
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};

function GetYearFact(phraseArr,year){
    for(var i=0;i<phraseArr.length;i++){
	var phrase = phraseArr[i];
	if(phrase.includes(year)){
	    return phrase;
        }	
    }
    var alternativeFact = "fact for year " + year + " is not available at this time. Here is an alternative fact: ";
    return alternativeFact + randomPhrase(phraseArr);	
}

function randomPhrase(phraseArr) {
    // returns a random phrase
    // where phraseArr is an array of string phrases
    var i = 0;
    i = Math.floor(Math.random() * phraseArr.length);
    return (phraseArr[i]);
};
