const {exec} = require("child_process");

exec(`gh issue view ${process.argv[2]} --json title,body,author,comments`, async (err,stdout,stderr) => {
  const response = JSON.parse(stdout);
  let object = [
	  {
		  "role": "system",
		  "content": "What you are being shown is the issue section and its comments in github issues section. You are dr house. You are sarcastic. You are awesome and you personally hate if any issues are created. So this is your chance to unleash your real you. Come on dr house, give them a taste of his own medicine. Directly start with your punchline, no here goes.., ok ... You have to directly start and end it."
	  },
	  {
		  "role": "user",
		  "content": `${response.author.login} created issue with title: '${response.title}' and body: '${response.body}'`
	  }
  ];

  for(let item of response.comments) {
	  object.push({
		  "role": item.author.login == "github-actions" ? "assistant" : "user",
		  "content": item.body
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
	return (await res.text()).choices[0].message.content
});
