// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const axios = require('axios');
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow AHU');
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  function googleAssistantHandler(agent) {
     let conv = agent.conv(); // Get Actions on Google library conv instance
    console.log('Dialogflow debug lhub');
     conv.ask('Nous prenons en compte votre demande depuis firebase'); // Use Actions on Google library
     agent.add(conv); // Add Actions on Google library responses to your agent's response
   }
  
  function callAPI(agent){

    const food = "chocoloate";//agent.parameters.number;
    const subject = "cake"; //agent.parameters.Subject;
    const number = 3;//agent.parameters.number;

    const question = subject + " "+number +" "+food;
    const questionReady = question.replace(/ /g, '+');

    const apiKey = "a8e8b61c46064a2a9c03a8bcad396d8c";
    const baseUrl = "https://api.spoonacular.com/recipes/quickAnswer?q=";
    const url = "https://api.spoonacular.com/recipes/quickAnswer?q=How+much+vitamin+c+is+in+2+apples?&apiKey=a8e8b61c46064a2a9c03a8bcad396d8c";
    const apiUrl =  baseUrl + questionReady + "&apiKey=" + apiKey;
    console.log('---AHU--> ' +apiUrl);
    return axios.get(url).then((result) => {
       console.log('---AHU--> ' + result);   
        console.log('---AHU--> ' + result.data);   
        console.log('---AHU--> ' + result.data.answer);

        agent.add(result);
        agent.add(result.data);
        agent.add(result.data.answer);
    }
    );
  }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  //intentMap.set('trouve', yourFunctionHandler);
   //intentMap.set('Trouve', googleAssistantHandler);
  intentMap.set('Trouve', callAPI);
  agent.handleRequest(intentMap);
});
