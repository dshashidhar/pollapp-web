Parse.initialize("E6NcavnlQIXSS8dxbd5j6jaceeZhV9snl2A7RmVp", "kcR3JVGoXWAiEuwiKMxex3RiIhvlRg8rC1McBlR2");

var pollResults = Parse.Object.extend("pollResults");
var pubnub;
var currentQuestion = "Q1";
var chartObj;
var timer;

pubnub = PUBNUB({
    publish_key : 'demo-36',
    subscribe_key : 'demo-36'
})

pubnub.time(function(time) {
    //console.log(time);
});

function pulishQuestion(questionId) {
    currentQuestion = questionId;
    //$("#selectedQuestionDetails").text(questionList[questionId].question);
    publish(questionId);
    showResults();
    clearInterval(timer);
    timer = setInterval(function() {
    				showResults();
    }, 1000);
}

function publish(questionId) {
    pubnub.publish({
        channel : 'hello_world',
        message : questionList[questionId],
        callback : function(m) {
            //console.log(m);
        }
    });
}

function pubnubSubscribe() {
    //console.log("Subscribing..");
    pubnub.subscribe({
        channel : "hello_world",
        message : function(message, env, ch, timer, magic_ch) {
            console.log("Message Received." + '<br>' + "Channel: " + ch + '<br>' + "Message: " + JSON.stringify(message) + '<br>' + "Raw Envelope: " + JSON.stringify(env) + '<br>' + "Magic Channel: " + JSON.stringify(magic_ch));
        },
        connect : pub
    });

    function pub() {
        console.log("Since we’re publishing on subscribe connectEvent, we’re sure we’ll receive the following publish.");
        pubnub.publish({
            channel : "hello_world",
            message : "Hello from PubNub Docs!",
            callback : function(m) {
                console.log(m);
            }
        });
    }

}

//createChart("Q2");

function showResults() {
    var query = new Parse.Query(pollResults);
    query.equalTo("QuestionId", currentQuestion);
    query.find({
        success : function(results) {
        		  var noOfItems = results.length;
            var counts = {
                A : 0,
                B : 0,
                C : 0,
                D : 0
            };
            console.log(" the length is ",results.length);
            
            _.each(results, function(item) {
                var response = item.get("Response");
                counts[response] = counts[response] ? counts[response] + 1 : 1;
            });
            
            //var chartData = [Math.round(counts["A"] * 100 / noOfItems), Math.round(counts["B"] * 100 / noOfItems), Math.round(counts["C"] * 100 / noOfItems), Math.round(counts["D"] * 100 / noOfItems)];
            var chartData = [counts["A"] , counts["B"], counts["C"], counts["D"]];
            //console.log("chartData ",chartData);
            if (chartObj) {
                chartObj.series[0].setData(chartData);
                chartObj.setTitle({ text: questionList[currentQuestion].question });
                chartObj.xAxis[0].setCategories(getxAxisLabels());
            } else {
                createChart(chartData);
            }

        },
        error : function(error) {
            //alert("Error: " + error.code + " " + error.message);
        }
    });
}

function createChart(chartData) {
    chartObj = new Highcharts.Chart({
        chart : {
            type : 'column',
            renderTo : 'container'
        },
        title : {
            text : questionList[currentQuestion].question
        },
        subtitle : {
            text : 'Deloitte'
        },
        xAxis : {
            categories : getxAxisLabels(),
            crosshair : true
        },
        yAxis : {
            min : 0,
            title : {
                text : 'Responses'
            }
        },
        tooltip : {
            headerFormat : '<span style="font-size:10px">Option {point.key}</span><table>',
            pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0">{point.y}</td></tr>',
            footerFormat : '</table>',
            shared : true,
            useHTML : true
        },
        plotOptions : {
            column : {
                pointPadding : 0.2,
                borderWidth : 0
            }
        },
        series : [{
            name : 'Count',
            data : chartData

        }]
    });
}

function getxAxisLabels() {
	var optionsObj = questionList[currentQuestion].options;
	return ['A .' + optionsObj[0].value, 'B .' + optionsObj[1].value, 'C .' + optionsObj[2].value, 'D .' + optionsObj[3].value];
}
