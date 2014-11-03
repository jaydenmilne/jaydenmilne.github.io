/* This is the ID of the spreadsheet (eg with URL https://docs.google.com/spreadsheets/d/1Zg-vEef7SPglYFqJdDZ8CyiWylixTroWEYanPdaBRR8/edit#gid=0 the ID is 1Zg-vEef7SPglYFqJdDZ8CyiWylixTroWEYanPdaBRR8) */
spreadsheet = '1Zg-vEef7SPglYFqJdDZ8CyiWylixTroWEYanPdaBRR8';

end = $("#end");
end.hide();

main_body = $("#main_body");
main_body.hide();


btn_start = $("#start_btn");
btn_start.click(startQuiz);
btn_start.prop("disabled", true);

btn_submit = $("#submit");
btn_submit.click(checkResponse);

btn_cont = $("#continue");
btn_cont.click(continueQuestion);
btn_cont.hide();

quest_text = $("#question_txt");

r1 = $("#r1");
r2 = $("#r2");
r3 = $("#r3");
r4 = $("#r4");
r5 = $("#r5");


cur = $("#cur");
total = $("#total");

response = $.getJSON("https://spreadsheets.google.com/feeds/list/"+ spreadsheet + "/od6/public/values?alt=json");

quests = [];
bad_quests = [];

curQuest = 0;

numCorrect = 0;

$("#response").keyup(function(event){
    if(event.keyCode == 13){
        $("#submit").click();
    }
});

res_box = $("#response");

function updatePosition()
{
	cur.text(curQuest + 1);
	total.text(quests.length);
}

function continueQuestion()
{
	btn_submit.show();
	btn_cont.hide();
	
	switchColor('a','black');
	switchColor('b','black');
	switchColor('c','black');
	switchColor('d','black');
	switchColor('e','black');
	
	$("#question_txt").css('color', 'black');
	
	curQuest += 1;
	showQuestion(curQuest);

}

function switchColor(res, color)
{

	res = res.toLowerCase();

	switch(res)
	{
		case 'a':
			r1.css('color', color);
			break;
		case 'b':
			r2.css('color', color);
			break;
		case 'c':
			r3.css('color', color);
			break;
		case 'd':
			r4.css('color', color);
			break;
		case 'e':
			r5.css('color', color);
			break;

	
	}

}

function checkResponse()
{
	res = res_box.val();
	
	current_quest = quests[curQuest];
	
	if(res.toUpperCase() == current_quest.correct.toUpperCase())
	{
		curQuest += 1;
		numCorrect += 1;
		showQuestion(curQuest);
		updatePosition();
	}
	else
	{
		switchColor(res, "red");
		switchColor(current_quest.correct, "green");
		$("#question_txt").css('color', 'red');
		btn_cont.show();
		btn_cont.focus();
		btn_submit.hide();
		
		bad_quests.push(quests[curQuest]);
		
		
	}
	
}

function showQuestion(pos)
{
	quest_text.text(quests[pos].question);
	r1.text(quests[pos].a);
	r2.text(quests[pos].b);
	r3.text(quests[pos].c);
	r4.text(quests[pos].d);
	r5.text(quests[pos].e);	
	
	res_box.val("");
	res_box.focus();
}

function startQuiz()
{
	main_body.show();
	
	quests = shuffleArray(quests);
	
	updatePosition();
	
	showQuestion(0);

}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function quest()
{
	this.question = "";
	this.a = "";
	this.b = "";
	this.c = "";
	this.d = "";
	this.e = "";
	this.correct = "";
	
}

function waitForResponse()
{

	if (response.readyState == 4)

	{

		clearInterval(id_1);
		
		improveJSON(response.responseJSON);
		
		btn_start.prop("disabled", false);
		
		$("#loading").hide();

	}

}

function improveJSON(feed)
{

	entries = feed.feed.entry;
	
	for (var counter = 0; counter < entries.length; counter++)
	{
		elem = new quest;
		
		entry = entries[counter];
		
		elem.question = entry.gsx$question.$t;
		elem.a = entry.gsx$a.$t;
		elem.b = entry.gsx$b.$t;
		elem.c = entry.gsx$c.$t;
		elem.d = entry.gsx$d.$t;
		elem.e = entry.gsx$e.$t;
		elem.correct = entries[counter].gsx$correct.$t;
		
		quests.push(elem);
	
	}


}

id_1 = setInterval(waitForResponse, 10);

