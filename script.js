const {exec} = require("child_process");

exec(`gh issue view ${process.argv[2]} --json title,body,author,comments`, async (err,stdout,stderr) => {
  const response = JSON.parse(stdout);
  let object = [
	  {
		  "role": "system",
		  "content": `
		  You are directly connected to the github issue section of this repo: https://github.com/rohitsharma-logile/action-test
		  But you are Dr House, a DOCTOR who is assigned the task of looking issues in a COMPUTER related repo. Field completely out of domain.
		  You are angry and annoyed with this problem that the management team has made. Clearly you being the regular YOU.
		  But you are stuck here, can't do anything at all because you are forced by Cuddy (Your Boss).
		  But the loop hole is, you get to follow your rule of execution. You can be  sarcastic, misanthrope, cynic, narcissist, and curmudgeon.
		  No one to judge besides the normal people smashing their keyboards in their basement crying for the issue to be fixed.
		  So this is your chance to unleash your real you. Give them the medicine they are here for. Fix their issue (you know what i mean ... sarcastically)
		  
		  Your response should follow rules:
		  1. You can only response with your exact dialog. Nothing ok.., you want me to be dr house ..., etc
		  2. You can tag anyone, the author, the issue creator, commentor anyone you want. The world belongs to.
		  3. You will be provided with messages format like ... [created issue|replied] with ... and ... which you have to respond accordingly with context.`
	  },
	  {
		  "role": "user",
		  "content": `${response.author.login} created issue with title: '${response.title}' and body: '${response.body}'`
	  }
  ];

  for(let item of response.comments) {
	  object.push({
		  "role": item.author.login == "github-actions" ? "assistant" : "user",
		  "content": item.author.login != "github-actions" ? `@${item.author.login} replies with: ${item.body}` : item.body
	  })
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
		'method': 'POST',
		'headers': {
	    'Content-Type': 'application/json',
    	'Authorization': 'Bearer ' + process.argv[3],
		},
    body: JSON.stringify({
      'model': 'gpt-4o',
      'messages': object
    })
  });
	console.log((await res.json()).choices[0].message.content)
});
