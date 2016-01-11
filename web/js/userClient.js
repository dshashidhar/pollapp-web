Parse.initialize("E6NcavnlQIXSS8dxbd5j6jaceeZhV9snl2A7RmVp", "kcR3JVGoXWAiEuwiKMxex3RiIhvlRg8rC1McBlR2");

var pollResults = Parse.Object.extend("pollResults");
var pubnub;
var currentQuestion = {};
var userAnswer = "";

pubnub = PUBNUB({
    publish_key : 'demo-36',
    subscribe_key : 'demo-36'
})

pubnub.time(function(time) {
    console.log(time);
});

pubnubSubscribe();

function pubnubSubscribe() {
    console.log("Subscribing..");
    pubnub.subscribe({
        channel : "hello_world",
        message : function(message, env, ch, timer, magic_ch) {
            messageReceived(message);
            console.log("Message Received." + '<br>' + "Channel: " + ch + '<br>' + "Message: " + JSON.stringify(message) + '<br>' + "Raw Envelope: " + JSON.stringify(env) + '<br>' + "Magic Channel: " + JSON.stringify(magic_ch));
        }
    });
}

function messageReceived(question) {
			 $("#welcomeMsg").css("display", "None");
    $(".btn-warning").removeClass("btn-warning");
    $("#mainContainer").css("display", "block");
    $('#btnSubmit').attr("disabled", false);
    currentQuestion = question;
    $("#questionTitle").text(question.question);
    $("#btnOption1").text("A ." + question.options[0].value);
    $("#btnOption2").text("B ." + question.options[1].value);
    $("#btnOption3").text("C ." + question.options[2].value);
    $("#btnOption4").text("D ." + question.options[3].value);
}

function answerClicked(event,answer) {
				var target = event.target || event.srcElement;
    $(".btn-warning").removeClass("btn-warning");
    $("#"+target.id).addClass("btn-warning");
    userAnswer = answer;
}

function doSubmit() {
     $('#btnSubmit').attr("disabled", true);
    var PollResults = Parse.Object.extend("pollResults");
    var pollResults = new PollResults();

    pollResults.set("QuestionId", currentQuestion.questionId);
    pollResults.set("Response", userAnswer);
    pollResults.set("userName", "Kamal-web");

    pollResults.save(null, {
        success : function(pollresult) {
            // Execute any logic that should take place after the object is saved.
            //alert('New object created with objectId: ' + pollresult.id);
        },
        error : function(gameScore, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            //alert('Failed to create new object, with error code: ' + error.message);
        }
    });
};

