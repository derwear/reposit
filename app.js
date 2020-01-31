console.log('[Prog] started bot..');
const { VK } = require('vk-io');
const {Keyboard} = require('vk-io');
const keyboard = Keyboard
const vk = new VK(); 
const { updates } = vk; 
const lobby = require('./lobby.json');
const commands = [];
const request = require('prequest');
let user = new VK();
const requests = require('request');
const fs = require("fs");
const rq = require("prequest");

const bot_owner = 239323586;



const utils = {
	sp: (int) => {
		int = int.toString();
		return int.split('').reverse().join('').match(/[0-9]{1,3}/g).join('.').split('').reverse().join('');
	},
	rn: (int, fixed) => {
		if (int === null) return null;
		if (int === 0) return '0';
		fixed = (!fixed || fixed < 0) ? 0 : fixed;
		let b = (int).toPrecision(2).split('e'),
			k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3),
			c = k < 1 ? int.toFixed(0 + fixed) : (int / Math.pow(10, k * 3) ).toFixed(1 + fixed),
			d = c < 0 ? c : Math.abs(c),
			e = d + ['', 'тыс', 'млн', 'млрд', 'трлн'][k];

			e = e.replace(/e/g, '');
			e = e.replace(/\+/g, '');
			e = e.replace(/Infinity/g, 'pnt');

		return e;
	},
	gi: (int) => {
		int = int.toString();

		let text = ``;
		for (let i = 0; i < int.length; i++)
		{
			text += `${int[i]}&#8419;`;
		}

		return text;
	},
	decl: (n, titles) => { return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2] },
	random: (x, y) => {
		return y ? Math.round(Math.random() * (y - x)) + x : Math.round(Math.random() * x);
	},
	pick: (array) => {
		return array[utils.random(array.length - 1)];
	},
	time: () => {
		return parseInt(new Date().getTime()/1000)
	}
}



let btc = 6000;

let users = require('./users.json');
let buttons = [];

setTimeout(async () => {
	const rq = await request('https://api.cryptonator.com/api/ticker/btc-usd');

	if(!rq.ticker) return;
	if(!rq.ticker.price) return;

	btc = Math.floor(Number(rq.ticker.price));
}, 5);

setInterval(async () => {
	const rq = await request('https://api.cryptonator.com/api/ticker/btc-usd');

	if(!rq.ticker) return;
	if(!rq.ticker.price) return;

	btc = Math.floor(Number(rq.ticker.price));
}, 60000);

setInterval(async () => {
	await saveUsers();
	console.log('saved');
}, 10000);



setInterval(async () => {
	users.map(user => {
		for(var i = 0; i < user.business.length; i++)
		{
			const biz = businesses[user.business[i].id - 1][user.business[i].upgrade - 1];
			user.business[i].moneys += Math.floor(biz.earn / biz.workers * user.business[i].workers)
		}
	});
}, 3600000);

function clearTemp()
{
	users.map(user => {
		user.timers.hasWorked = false;
		user.timers.bonus = false;
   user.timers.text = false;
	});
}

clearTemp();

async function saveUsers()
{
	require('fs').writeFileSync('./users.json', JSON.stringify(users, null, '\t'));
	return true;
}

vk.setOptions({ token: '2ef904700df74564064565cc3d90c5dd5d1efa3d28338afb94725cb30e88cca4e1b85cdfb470e469b50a2', pollingGroupId: 190468255 });


updates.startPolling();
updates.on('message', async (message) => {
	if(Number(message.senderId) <= 0) return;
	if(/\[public190468255'''\|(.*)\]/i.test(message.text)) message.text = message.text.replace(/\[public190468255\|(.*)\]/ig, '').trim();
	if(/\[club190468255'''\|(.*)\]/i.test(message.text)) message.text = message.text.replace(/\[club190468255\|(.*)\]/ig, '').trim();
	if(/\[redelore'''\|(.*)\]/i.test(message.text)) message.text = message.text.replace(/\[redelore\|(.*)\]/ig, '').trim();
	if(/^(?:@redelore)$/i.test(message.text)) message.text = message.text.replace(/^(?:@redelore)$/i, '').trim();
	message.text = message.text.replace(/\[public190468255\|(.*)\]/ig, '').trim();
	message.text = message.text.replace(/\[club190468255\|(.*)\]/ig, '').trim();
	if(!users.find(x=> x.id === message.senderId))
	{
		const [user_info] = await vk.api.users.get({ user_id: message.senderId });
		const date = new Date();
		return message.send(`Позволь рассказать кое что.
		В 2095 году, во времена новых технологий, группа учёных и программистов объединились для одной единственной цели: предоставить возможность людям войти в матрицу.
		Для этой цели они решили создать кибердеку - компьютер, используемый для подключения человека к сети посредством нейроинтерфейса.
		Это было новым, большим шагом человечества в киберпространство.
		
		Когда завершились тесты и проверки, кибердека стал продоваться во всем мире. Теперь люди могут войти в матрицу, и вполне жить там.
		Но к сожелению, за кровное место им пришлось бороться. И вы туда тоже пойдете.
		
		📖 | Для продолжения, пройдите обучение кнопкой ниже.`,
		{
			keyboard:JSON.stringify( 
				{ 
				"one_time": true, 
				"buttons": [ 
				[{ 
					"action": { 
					"type": "text", 
					"payload": "{}", 
					"label": "Начать обучение" 
					},
					"color": "positive"
						}] 
			]
			})}),
		users.push({
			id: message.senderId,
			uid: users.length,
			admin: 1,
			lobby: -1,
			lobbym: 2,
			str: 1000,
			vit: 100000,
			reg: 0,
			unite: ``,
			hp_mon: 0, 
			sil_mon: 0,
			quest_1: false,
			quest_2: false,
			quest_3: false,
			timers: {
				hasWorked: false
			},
			rating: 0,
			level: 1,
			exp: 0,
            train: 0,
            promo: [],
			exp: 0,
			rub: 0,
			sm: 0,
			um: 0,
			se: 0,
			active: 0,
			pk: 0,
			tag: user_info.first_name,
			balance: 100,
			cyberdeka: false,
			aspects: 0,
			nc: 0,
		    dc: 0,
			admins: 0,
			one_sc: false,
		    ban: false,
			regDate: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`,
			timers: {
				hasWorked: false,
				bonus: false,
       text: false
			},
			tag: user_info.first_name,
			blocked: false

		});
	}
	message.user = users.find(x=> x.id === message.senderId);
	if(message.user.ban) return;

	const bot = (text, params) => {
		return message.send(`${message.user.mention ? `@id${message.user.id} (${message.user.tag})` : `${message.user.tag}`}, ${text}`, params);
	}

	const command = commands.find(x=> x[0].test(message.text));
	if(!command) return;

	if(message.user.exp >= 100)
	{
		message.user.exp = 0;
		message.user.level += 1;
	}

	message.args = message.text.match(command[0]);
	await command[1](message, bot);

	console.log(`[User-${message.user.uid}] — ${message.text}`)
});

const cmd = {
	hear: (p, f) => {
		commands.push([p, f]);
	}
}
cmd.hear(/^(?:начать обучение)$/i, async (message, bot) => {
if(message.user.train == 0) {
	message.user.train += 1;
	  return message.send({message: `
Арни > Все что тебе нужно, будет во вкладке справка. Я лишь разъясню основные моменты. Видишь эту панель? Эта панель твоей кибердеки. Она появится у тебя после обучения, а пока разберем все её части.`, attachment: 'photo-190468255_457239031',
		  keyboard:JSON.stringify({
					  "inline": true,
					  "buttons": [[{
						  "action": {
						  "type": "text",
						  "payload": "{\"command\": \"bla\"}",
						  "label": "🔎 Изучить"
						},
					  "color": "positive"
					  }]]})})}})
  cmd.hear(/^(?:🔎 Изучить)$/i, async (message, bot) => {
  if(message.user.train == 1){
  message.user.train += 1;
  return message.send(`
> Аккаунт — подробная информация о Вашем персонаже.
> Эмулятор — запускаемый модуль, который позволит эмулировать кибердеку как оружие хакера.
> Чёрный лёд — порошок, который развивает Вашего персонажа искусственно.
> Тёмная сторона (Dark Side) — тёмная часть матрицы, в котором происходят самые ужасные вещи, но там можно хорошо заработать.
> Журнал — Ваш личный журнал-помощник, в котором содержится информация о достижениях и текущих заданиях.
> Справка — место, где собраны ответы на часто задаваемые вопросы.

Арни > Все понял? Дальше больше.`,
	  {
					  keyboard:JSON.stringify({
					  "inline": true,
					  "buttons": [[{
						  "action": {
						  "type": "text",
						  "payload": "{\"command\": \"bla\"}",
						  "label": "🧐 Понял"},
					  "color": "positive"}]]})});
  }
  });
  
  cmd.hear(/^(?:🧐 Понял)$/i, async (message, bot) => {
	if(message.user.train == 0) return;
  if(message.user.train == 2){
  message.user.train += 1;
  return message.send(`
Арни > И ещё кое что, запомни 2 правила: PVP - для рейтинга, PVE - для развития.`,
	  {
					  keyboard:JSON.stringify({
					  "inline": true,
					  "buttons": [[{
						  "action": {
						  "type": "text",
						  "payload": "{\"command\": \"attack\"}",
						  "label": "🧐 Да понял я"},
					  "color": "negative"}]]})});
  }
  });
  cmd.hear(/^(?:🧐 Да понял я)$/i, async (message, bot) => {
	if(message.user.train == 0) return;
  if(message.user.train == 3){
	message.user.train += 1;
	return message.send(`
Арни > Раз понял, то держи монеты и покупай Кибердеку.`,
		{
						keyboard:JSON.stringify({
						"inline": true,
						"buttons": [[{
							"action": {
							"type": "text",
							"payload": "{\"command\": \"rassat\"}",
							"label": "👾 Кибердека"},
						"color": "secondary"}]]})});
	
	}
	});
  
//ЮЗЕР
/*cmd.hear(/^(?:Начать|Старт|Начать игру)$/i, async (message, bot) => {
	message.user.foolder += 1;
	return bot(`позволь рассказать тебе кое что.
	В 2095 году, во время новых технологий, группа учёных и программистов объединились для одной единственной цели: предоставить возможность людям войти в матрицу.
	Для этой цели они решили создать кибердеку - компьютер, используемый для подключения человека к сети посредством нейроинтерфейса.
	Это было бы новым, большим шагом человечества в киберпространство.
	
	Когда завершились тесты и проверки, кибердека стал продоваться во всем мире. Теперь люди могут войти в матрицу.
	Но к сожелению, за кровное место им пришлось бороться. И вы туда тоже пойдете.
	
	[Арни]: Эй, ты тут не зевай, хорошо? Для начала пойди и купи кибердеку. Для этого просто нажми на вон ту кнопку снизу.

	📖 | Для продолжения купите кибердеку, нажав на кнопку "Кибердека", либо напишите в чат "Кибердека".
`, { 
	keyboard:JSON.stringify( 
	{ 
	"one_time": false, 
	"buttons": [ 
	[{ 
		"action": { 
		"type": "text", 
		"payload": "{}", 
		"label": "👾 Кибердека" 
		},
		"color": "positive"
			}] 
]
})
}
)
});*/
cmd.hear(/^(?:👾 Кибердека|Кибердека|Кибер дека|👾)$/i, async (message, bot) => {
	message.user.foolder += 1;
	if(message.user.cyberdeka == false) {
		message.user.cyberdeka = true
		message.user.balance -= Number(100)
		return message.send(`Вы успешно купили себе "Кибердеку" за 100 монет.
Арни > Так то лучше! Теперь ты вполне можешь войти в киберпространство. Удачи, и не умри в первые 3 секунды.
`, { 
	keyboard:JSON.stringify( 
	{ 
	"inline": true,
	"buttons": [ 
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "👾 Кибердека" 
	}, 
	"color": "secondary" 
}]]})})
	}else{
		return message.send(`💾 | Добро пожаловать в киберпространство.`, { 
			keyboard:JSON.stringify( 
			{ 
			"one_time": false, 
			"buttons": [ 
			[{ 
			"action": { 
			"type": "text", 
			"payload": "{}", 
			"label": "📒 Аккаунт" 
			}, 
			"color": "positive" 
			}, 
			{ 
			"action": { 
			"type": "text", 
			"payload": "{}", 
			"label": "🖥 Эмулятор" 
			}, 
			"color": "secondary" 
			}, 
			{ 
			"action": { 
			"type": "text", 
			"payload": "{}", 
			"label": "💉 Чёрный лёд" 
			}, 
			"color": "secondary" 
			}], 
			[{ 
			"action": { 
			"type": "text", 
			"payload": "{}", 
			"label": "🔪 Dark Side" 
			}, 
			"color": "negative" 
			}, 
			{ 
			"action": { 
			"type": "text", 
			"payload": "{}", 
			"label": "📕 Журнал" 
			}, 
			"color": "secondary" 
		}, 
		{ 
		"action": { 
		"type": "text", 
		"payload": "{}", 
		"label": "🔎 Справка" 
		}, 
		"color": "positive" 
			}] 
		] 
		}) 
		});
	}
})

cmd.hear(/^(?:🔪 Dark Side|Darkside|Dark Side|dark side|dark Side|DARKSIDE|DARK SIDE|Темная сторона|Тёмная сторона)$/i, async (message, bot) => {
	return message.send(`
🛒 | Тёмный магазин

Нелегальный магазин, где продаётся кибер-оружие, кибер-броня и все что нужно для выживания в тёмной части киберпространства.

⚔ | PVP

Режим, в котором вы сражаетесь в другими игроками и зарабатываете монеты.

🚪 | PVE

Режим, в котором вы проходите локации и получаете монеты.

⛏ | Dark Work

Самая тёмная и отвратительная работа в киберпространстве, но платят за неё хорошо.
`, { 
	keyboard:JSON.stringify( 
	{ 
	"inline": true,
	"buttons": [ 
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "🛒" 
	}, 
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "⚔" 
	}, 
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "🚪" 
	}, 
	"color": "secondary" 
	},
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "⛏" 
	},
	"color": "secondary" 
	}]
] 
})}
)});
cmd.hear(/^(?:⛏|darkwork|dark work|тёмная работа|темная работа)$/i, async (message, bot) => {
if(message.user.timers.hasWorked) return message.send(`⚡ | Прекрасно то, что ты еще хочешь работать, но придется подождать.`);
		setTimeout(() => {
			message.user.timers.hasWorked = false;
		}, 80000);
		let worker = utils.pick([`Целый день Вы подделывали паспорта, и видимо не зря`, `Оказалось, подбирать пороль к учетной записи администрации города не такая уж и простая работа`, `Убивать роботов - нехорошо, но когда за это платят тогда можно`, `28 успешных сделок о наркоторговли! Ты действовал наверняка, да.`, `Подделывать подпись целых 7 часов - да, в этом весь ты.`, `Что-ж, теперь можно уматывать подальше - главный поставщик чёрного льда - ты.`]);
	
		message.user.timers.hasWorked = true;
		message.user.exp += 2;
	
		const earn = utils.random(100, 5000);
	
		message.user.balance += earn;
	
	
		return message.send(`${worker}\n+${utils.sp(earn)} монет.`);
	

})
cmd.hear(/^(?:🛒|Темный магазин|магаз|shop|Тёмный магазин|магазин)$/i, async (message, bot) => {
	return message.send(`
> Разделы

🗡 | Мечи
👕 | Нагрудники
👖 | Поножи`, { 
	keyboard:JSON.stringify( 
	{ 
	"inline": true,
	"buttons": [ 
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "🗡" 
	}, 
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "👕" 
	}, 
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "👖" 
	}, 
	"color": "secondary" 
}]]})})})
cmd.hear(/^(?:👖|Поножи)$/i, async (message, bot) => {
	return message.send(`
1 | <<Seventh Race>> — 1.200 монет.
Очень легкие и почти не чувствуются.
Здоровье: +30 💙

2 | <<Effortless>> — 3.300 монет.
Шутки шутками, но эти штаны на четверть из бумаги.
Здоровье: +70 💙

3 | <<Particular>> — 9.900 монет.
В этих штанахх и лут забрать не стыдно.
Здоровье: +110 💙

4 | <<Number 13>> — 26.100 монет.
А в этих можно смело идти в стелс, но иногда ты будешь забывать что ты в штанах.
Здоровье: +150 💙

5 | <<Valuable>> — 46.000 монет.
Те самые, которые сложны в технологии, но цена того стоит.
Здоровье: +170 💙

> Внимание. Купив однажды поножи, вы не сможете его продать, вы сможете купить новые, и он прибавит максимум здоровья.
`, { 
	keyboard:JSON.stringify( 
	{ 
	"inline": true,
	"buttons": [ 
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "👖 1" 
	}, 
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "👖 2" 
	}, 
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "👖 3" 
	}, 
	"color": "secondary" 
	},
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "👖 4" 
	},
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "👖 5" 
	}, 
	"color": "secondary" 
}]]})})});
cmd.hear(/^(?:👕|Нагрудники)$/i, async (message, bot) => {
	return message.send(`
1 | <<Royal Family>> — 1.000 монет.
Нагрудник из простейшей технологии, известна всем.
Здоровье: +50 💙

2 | <<Dangerous R>> — 2.100 монет.
Смешное название, смешная цена, однако защищает неплохо.
Здоровье: +80 💙

3 | <<SteelBlood>> — 15.300 монет.
Так просто этот нагрудник не достать, поэтому за нее хорошо платят.
Здоровье: +120 💙

4 | <<Dead Arnie>> — 33.200 монет.
Этим нагрудником занималась та самая королевская династия, цена для такого соответствующая.
Здоровье: +160 💙

5 | <<Corn John>> — 52.000 монет.
Не холодно, не жарко, под этот нагрудник не надо постраиваться, он сам это сделает.
Здоровье: +200 💙

> Внимание. Купив однажды нагрудник, вы не сможете его продать, вы сможете купить новый, и он прибавит максимум здоровья.
`, { 
	keyboard:JSON.stringify( 
	{ 
	"inline": true,
	"buttons": [ 
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "👕 1" 
	}, 
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "👕 2" 
	}, 
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "👕 3" 
	}, 
	"color": "secondary" 
	},
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "👕 4" 
	},
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "👕 5" 
	}, 
	"color": "secondary" 
}]]})})});
cmd.hear(/^(?:🗡|Мечи)$/i, async (message, bot) => {
	return message.send(`
1 | <<Виртуальный эскалибур>> — 2.500 монет.
Первый меч новичка. Очень дешёвый и легкий.
Сила: +5 💪🏻

2 | <<Cyber-Razor>> — 7.500 монет.
Чуть потяжелее, чем эскалибур, но все таки силы много не прибавит.
Сила: +9 💪🏻

3 | <<Ernard>> — 21.300 монет.
Оружие из королевских династий киберпространства. Когда они пришли к власти, то только и поддерживали войну.
Сила: +16 💪🏻

4 | <<Razorblade>> — 53.900 монет.
Считался редким и сильным мечом, но действительная технология создания сделала из меча что-то среднее.
Сила: +23 💪🏻

5 | <<Corn Billie>> — 82.000 монет.
Самый лучший меч, который вы сможете купить. Однако есть мечи и покруче.
Сила: +50 💪🏻

> Внимание. Купив однажды меч, вы не сможете его продать, вы сможете купить новый, и он прибавит силы.
`, { 
	keyboard:JSON.stringify( 
	{ 
	"inline": true,
	"buttons": [ 
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "🗡 1" 
	}, 
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "🗡 2" 
	}, 
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "🗡 3" 
	}, 
	"color": "secondary" 
	},
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "🗡 4" 
	},
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "🗡 5" 
	}, 
	"color": "secondary" 
}]]})})});
cmd.hear(/^(?:🚪|pve|PVE|p v e|pv e|p ve|пве|п в е)$/i, async (message, bot) => {
	message.send(`
🌎 | Выберите локацию

> Северный мост
> Южный мост

[C 25-го уровня]
> Сетевой экран
> Транзистор

[С 50-го уровня]
> Альтернативная матрица`, { 
	keyboard:JSON.stringify( 
	{ 
	"inline": true,
	"buttons": [ 
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "Северный мост" 
	}, 
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "Южный мост" 
	}, 
	"color": "secondary" 
	}], 
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "Сетевой экран" 
	}, 
	"color": "secondary" 
	},
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "Транзистор" 
	}, 
	"color": "secondary" 
	}],
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "Альтернативная матрица" 
	}, 
	"color": "secondary" 
	},
	]
] 
})})})
	

cmd.hear(/^(?:🖥 Эмулятор|Эмулятор)$/i, async (message, bot) => {
	return message.send(`
⚡ | Ваши хакерские способности

SQL Injection - подмена данных в базе.
DDoS - массовые запросы на сервер.
Man-in-the-Middle - перехват канала.
IP spoofing - подмена IP.


🧨 | Создание вирусов

trojan:win32/occamy.c - 150 Монет
rearme.sd:nimda.exe - 230 Монет
сonficker:win32/rznd.dd - 480 Монет


💾 | Подключаемые модули

arn01_cc7_ios - Германия
eq_i_01191810 - Япония
qwr_77d_nr47z - США
`, { 
	keyboard:JSON.stringify( 
	{ 
	"inline": true,
	"buttons": [ 
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "⚡" 
	}, 
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "🧨" 
	}, 
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "💾" 
	}, 
	"color": "secondary" 
	}]
] 
})}
)});

cmd.hear(/^(?:💉 Чёрный лёд|Чёрный лёд|Черный лед|Black Ice|Blackice)$/i, async (message, bot) => {
	return message.send(`
> Чёрный лёд - чёрный порошок, выступающий катализатором в формировании новых нитей ДНК. Собрав их, вы сможете улучшить своего персонажа.

💉 | Ваш лёд: ${message.user.aspects}/32`)})
cmd.hear(/^(?:📒 Аккаунт|Профиль)$/i, async (message, bot) => {
	return message.send(`
👾 | ID: ${message.user.uid}
⭐ | Уровень ${message.user.level} [${message.user.exp}/100]
🏆 | Рейтинг: ${message.user.rating}

💰 | Монет: ${message.user.balance}
🌕 | Лицевой счёт: ${message.user.rub}
💉 | Лёд: [${message.user.aspects}/32]
`
    );
});  
cmd.hear(/^(?:🔎 Справка|Справка)$/i, async (message, bot) => {
	return message.send(`
> Раздел 1. Об Киберпространстве.
> Раздел 2. Об Кибер-оружии.
> Раздел 3. Dark Side.
> Раздел 4. Чёрный лёд.
> Раздел 5. Журнал.
> Раздел 6. Эмулятор.`, { 
	keyboard:JSON.stringify( 
	{ 
	"inline": true,
	"buttons": [ 
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "Р. 1" 
	}, 
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "Р. 2" 
	}, 
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "Р. 3" 
	}, 
	"color": "secondary" 
	}],
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "Р. 4" 
	}, 
	"color": "secondary" 
	},
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "Р. 5" 
	}, 
	"color": "secondary" 
	},
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "Р. 6" 
	}, 
	"color": "secondary" 
	}]
] 
})})})
cmd.hear(/^(?:📕 Журнал|Журнал)$/i, async (message, bot) => {
	return message.send(`

1 | [✚] Задания
2 | [✚] Достижения

📖 | Для выбора нажмите на соответствующую кнопку.
`, { 
	keyboard:JSON.stringify( 
	{ 
	"inline": true,
	"buttons": [ 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "№ 1" 
	}, 
	"color": "secondary" 
	}, 
	{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "№ 2" 
	}, 
	"color": "secondary" 
	}]})})})

cmd.hear(/^(?:баланс|balance|money|деньги)$/i, async (message, bot) => {
	return bot(`На счете ${message.user.tag}: ${message.user.balance} монет.`
    );
});  

/*
cmd.hear(/^(?:работать)$/i, async (message, bot) => {
	if(message.user.timers.hasWorked) return bot(`Вы уже хорошо поработали.\nОтдохни 2 минуты..😘`);

	setTimeout(() => {
		message.user.timers.hasWorked = false;
	}, 80000);

	message.user.timers.hasWorked = true;
	message.user.exp += 1;

	const earn = utils.random(10, 25);

	message.user.balance += earn;


	return bot(`рабочий день закончен😘
\nВы заработали ${utils.sp(earn)}$`);
});
*/
cmd.hear(/^(?:бонус)$/i, async (message, bot) => {


	if(message.user.timers.hasWorked) return message.send(`⚡ | Похоже вы уже получили бонус.\nСледующий через 24 часа.`);

	setTimeout(() => {
		message.user.timers.hasWorked = false;
	}, 120000);

	message.user.timers.hasWorked = true;

	const earn = utils.random(50, 200);

	message.user.balance += earn;

	return message.send(`Вы активировали бонус и получили ${utils.sp(earn)}монет.`);
});
/*
cmd.hear(/^(?:магазин|shop)\s?([0-9]+)?$/i, async (message, bot) => {
	if(!message.args[1]) return bot(`Список устройств:

1. ⌨️ Калькулятор
 Цена: 500$
 Заработок с одного заказа: 10-20$

2.📱 Телефон
  Цена: 1.000$
  Заработок с одного заказа: 10-30$

 3.📺 Телевизор
  Цена: 3.000$
  Заработок с одного заказа: 30-90$

4. 📟 Бабушкин ноутбук
  Цена: 5.000$
  Заработок с одного заказа: 90-200$

5. 💻 Ноутбук
  Цена: 20.000$
  Заработок с одного заказа: 200-500$

6. ⌨ Компьютер
  Цена: 100.000$
  Заработок с одного заказа: 1.000-2.000$

7. 📺 Микроволновка
  Цена: 500.000$
  Заработок с одного заказа: 5.000-20.000$

💰 Для покупки введи: магазин <цифра товара>

❌ Не хватает денег? Пиши «работать»`);

const sell = pks.find(x=> x.id === Number(message.args[1]));
	if(!sell) return;
	if(message.user.pk) return bot(`У Вас уже есть оборудование.\n📗Чтобы продать "Продать устройство"`);

	if(message.user.balance < sell.cost) return bot(`недостаточно денег`);
	else if(message.user.balance >= sell.cost)
	{
		message.user.balance -= sell.cost;
		message.user.pk = sell.id;

		return bot(`Вы успешно купили "${sell.name}" за ${utils.sp(sell.cost)}$`);
	}
});

cmd.hear(/^(?:Написать)$/i, async (message, bot) => {
	if(!message.user.pk) return bot(`У тебя нет оборудования! Купить его можно в магазине. 📌`);
	if(message.user.timers.text) return bot(`Писать программу можно раз в минуту. Отдохни!`);

	setTimeout(() => {
		message.user.timers.text = false;
	}, 60000);

	message.user.timers.text = true;

 const pk = pks.find(x=> x.id === message.user.pk);
	const earn = utils.random(pk.min, pk.max);
	if(utils.random(0, 150) < 75)
	{
		message.user.balance += earn;
   message.user.dc += 1;
		bot(`Ты написал программу, и она порадовала клиента! 📰
Ты заработал: ${utils.sp(earn)}$`);
	}
	else
	{
		message.user.nc += 1;
		bot(`Ты написал программу, и она не очень порадовала клиента! 💸
`);
	}
});


cmd.hear(/^(?:передать)\s([0-9]+)\s(.*)$/i, async (message, bot) => {
	message.args[2] = message.args[2].replace(/(\.|\,)/ig, '');
	message.args[2] = message.args[2].replace(/(к|k)/ig, '000');
	message.args[2] = message.args[2].replace(/(м|m)/ig, '000000');
	message.args[2] = message.args[2].replace(/(все|всё)/ig, message.user.balance);

	if(!Number(message.args[2])) return;
	message.args[2] = Math.floor(Number(message.args[2]));

	if(message.args[2] <= 0) return;

	if(message.args[2] > message.user.balance) return bot(`У вас нет столько денег!\n
💰 Ваш Баланс: ${utils.sp(message.user.balance)}$`);
	else if(message.args[2] <= message.user.balance)
	{
		let user = users.find(x=> x.uid === Number(message.args[1]));
		if(!user) return bot(`Игрок не найден!`);

		if(user.uid === message.user.uid) return bot(`Игрок не найден!`);

		message.user.balance -= message.args[2];
		user.balance += message.args[2];

		await bot(`Вы успешно передали игроку ${user.tag} » ${utils.sp(message.args[2])}$`);

	}
});



//Игры

cmd.hear(/^(?:казино)\s(.*)$/i, async (message, bot) => {
	message.args[1] = message.args[1].replace(/(\.|\,)/ig, '');
	message.args[1] = message.args[1].replace(/(к|k)/ig, '000');
	message.args[1] = message.args[1].replace(/(м|m)/ig, '000000');
	message.args[1] = message.args[1].replace(/(вабанк|вобанк|все|всё)/ig, message.user.balance);

	if(!Number(message.args[1])) return;
	message.args[1] = Math.floor(Number(message.args[1]));

	if(message.args[1] <= 0) return;

	if(message.args[1] > message.user.balance) return bot(`У Вас нет столько денег!`);
	else if(message.args[1] <= message.user.balance)
	{
		message.user.balance -= message.args[1];
		const multiply = utils.pick([2, 0, 0.5, 0, 2, 0.5]);

		message.user.balance += Math.floor(message.args[1] * multiply);
		return bot(`${multiply === 1 ? `ваши деньги остаются при вас` : `${multiply < 1 ? `вы проиграли ${utils.sp(message.args[1] * multiply)}$` : `вы выиграли ${utils.sp(message.args[1] * multiply)}$`}`}
		💰 Баланс: ${utils.sp(message.user.balance)}$`);
	}
});
*/


cmd.hear(/^(?:псевдоним)\s(.*)$/i, async (message, bot) => {
	if(message.args[1].length >= 16) return message.send(`> Длина ника не должна превышать 16 символов.`);

	message.user.tag = message.args[1];
	return message.send(`☁ | Псевдоним успешно сохранен.`);
});

cmd.hear(/^(?:репорт|реп|rep|жалоба)\s([^]+)$/i, async (message, bot) => {
	if(message.isChat) return bot(`> Команда работает только в ЛС.`);

	vk.api.messages.send({ user_id: 239323586, forward_messages: message.id, message: `🐩 | Player ID: ${message.user.uid}` }).then(() => {
		return message.send(`👌🏻 | Репорт успешно отправлен.`);
	}).catch((err) => {
		return bot(`Что-то пошло не так...`);
	});
});
/*
//админ
cmd.hear(/^(?:накрути)\s([0-9]+)\s(.*)$/i, async (message, bot) => {
	message.args[2] = message.args[2].replace(/(\.|\,)/ig, '');
	message.args[2] = message.args[2].replace(/(к|k)/ig, '000');
	message.args[2] = message.args[2].replace(/(м|m)/ig, '000000');
	message.args[2] = message.args[2].replace(/(вабанк|вобанк|все|всё)/ig, message.user.balance);

	if(!Number(message.args[2])) return;
	message.args[2] = Math.floor(Number(message.args[2]));
if(message.user.admin == false) return;
	if(message.args[2] <= 0) return;

	{
		let user = users.find(x=> x.uid == Number(message.args[1]));
		if(!user) return bot(`Игрок не найден!`);
		if(user.uid === message.user.uid) return bot(`Игрок не найден!`);
		if(user.admin == true) {
		message.user.balance += Number(message.args[1])
		await bot(`Вы успешно выдали игроку ${user.tag} ${utils.sp(message.args[2])}$`);
		}
	}
});
cmd.hear(/^(?:~dev.coins)\s?([0-9]+)?\s?([0-9]+)?/i, async (message, args, bot) => {
	let user = users.find(x=> x.uid === Number(message.args[1]));
    message.args[1] = message.args[1].replace(/(\.|\,)/ig, '');
	message.args[1] = message.args[1].replace(/(к|k)/ig, '000');
	message.args[1] = message.args[1].replace(/(м|m)/ig, '000000');
	if(message.user.admin == false) return message.send(`🔸 » Вы не Администратор`);
	if(!message.args[1] || !users[message.args[1]] || !message.args[2] || message.args[2] < 0) return message.send(`💰 » Пример: 'giverub [ID] [COUNT]'`); 
	users[message.args[1]].balance += Number(message.args[2]);
 	 
	return message.send(`💰 » Вы выдали игроку [@id${users[message.args[1]].id}(${users[message.args[1]].tag})] ${utils.sp(message.args[2])} коинов💰`);
});
cmd.hear(/^(?:~dev.rub)\s?([0-9]+)?\s?([0-9]+)?/i, async (message, args, bot) => {
	let user = users.find(x=> x.uid === Number(message.args[1]));
   message.args[1] = message.args[1].replace(/(\.|\,)/ig, '');
	message.args[1] = message.args[1].replace(/(к|k)/ig, '000');
	message.args[1] = message.args[1].replace(/(м|m)/ig, '000000');
    if(message.user.admin == false) return message.send(`🔸 » Вы не Администратор`);
	if(!message.args[1] || !users[message.args[1]] || !message.args[2] || message.args[2] < 0) return message.send(`💰 » Пример: 'giverub [ID] [COUNT]'`); 
	users[message.args[1]].rub += Number(message.args[2]);
 	 
	return message.send(`💰 » Вы выдали игроку [@id${users[message.args[1]].id}(${users[message.args[1]].tag})] ${utils.sp(message.args[2])} рублей 💰`);
});
cmd.hear(/^(?:~dev.get)\s?([0-9]+)?/i, async (message, args, bot) => {  
	let user = users.find(x=> x.uid === Number(message.args[1]));
	if(!message.args[1] || !Number(message.args[1]) || !users[message.args[1]]) return message.send(`🔸 » Проверьте вводимые данные.`);
	if(message.user.admin == false) return; 
	let id = users[message.args[1]]
	if(message.user.admin == true) {
	return message.send(`
fff
`
		);
}});

cmd.hear(/^(?:~dev.newRight)\s?([0-9]+)?\s?([0-9]+)?/i, async (message, args, bot) => {
	let user = users.find(x=> x.uid === Number(message.args[1]));
    message.args[1] = message.args[1].replace(/(\.|\,)/ig, '');
	message.args[1] = message.args[1].replace(/(к|k)/ig, '000');
	message.args[1] = message.args[1].replace(/(м|m)/ig, '000000');
	if(message.user.admin == false) return message.send(`🔸 » Вы не Администратор`);
	if(!message.args[1] || !users[message.args[1]] || !message.args[2] || message.args[2] < 0) return message.send(`💰 » Пример: 'giverub [ID] [COUNT]'`); 
	users[message.args[1]].right = Number(message.args[2]);
 	 
	return message.send(`💰 » Вы выдали игроку [@id${users[message.args[1]].id}(${users[message.args[1]].tag})] ${utils.sp(message.args[2])} коинов💰`);
});
cmd.hear(/^(?:~dev.removeCoins)\s?([0-9]+)?/i, async (message, args, bot) => {
    let user = users.find(x=> x.uid === Number(message.args[1]));
	if(message.user.admin == false) return message.send(`🔸 » У вас нету доступа`);
	if(!message.args[1] || !users[message.args[1]]) return message.send(`💰 » Пример: 'removerub [ID]'`); 
	users[message.args[1]].balance = 0; 
	return message.send(`💰 » Вы забрали все койны у игрока [@id${users[message.args[1]].id}(${users[message.args[1]].tag})]`);
	});
	cmd.hear(/^(?:~dev.removeRub)\s?([0-9]+)?\s([0-9]+)?/i, async (message, args, bot) => {
		let user = users.find(x=> x.uid === Number(message.args[1]));
		if(message.user.admin == false) return message.send(`🔸 » У вас нету доступа`);
		if(!message.args[1] || !users[message.args[1]]) return message.send(`💰 » Пример: 'removerub [ID] [COUNT]'`); 
		users[message.args[1]].rub -= Number(message.args[2]); 
		return message.send(`💰 » Вы забрали ${message.args[2]} рублей у игрока [@id${users[message.args[1]].id}(${users[message.args[1]].tag})]`);
	});
	*/
cmd.hear(/^(?:root.botRestart)$/i, async (message, bot) => {
	if(message.senderId !== 239323586) return;
	await bot(`Bot reboot.`);
	await saveUsers();
	process.exit(-1);
});

cmd.hear(/^(?:рассылка)\s([^]+)$/i, async (message, bot) => {
message.user.foolder += 1;
	if(message.user.admin == false) return;
 			 users.filter(x=> x.id !== 1).map(zz => { 
  vk.api.messages.send({ user_id: zz.id, message: `${message.args[1]}`}); 
 }); 
 			let people = 0;
        for(let id in users) {
            vk.api.call('messages.send', {
             chat_id: id,
              message: `${message.args[1]}` });
        }
        return message.send(`📣 Рассылочка\n\n"${message.args[1]}"`);
 
})

cmd.hear(/^(?:пострассылка)\s([^]+)$/i, async (message, bot) => {
message.user.foolder += 1;
	if(message.user.admin == false) return;
 			 users.filter(x=> x.id !== 1).map(zz => { 
  vk.api.messages.send({ user_id: zz.id, message: `тест:`, attachment: `${message.args[1]}`}); 
 }); 
 			let people = 0;
        for(let id in users) {
            vk.api.call('messages.send', {
             chat_id: id,
              message: `📣 Рассылочка:`,
              attachment: `${message.args[1]}` });
        }
        return message.send(`Успешно.`);
 
})

cmd.hear(/^(?:ответ)\s([0-9]+)\s([^]+)$/i, async (message, bot) => {
		if(message.user.admin == false) return;
	const user = await users.find(x=> x.uid === Number(message.args[1]));
	if(!user) return;
	vk.api.messages.send({ user_id: user.id, message: `🦊 | ${user.tag}, Администрация ответила на Ваш вопрос\n\n🦊 | Ответ: ${message.args[2]}`});
	message.send(`${user.tag}, сообщение успешно доставлено. `)
});
setInterval(async () => {
fs.writeFileSync("./lobby.json", JSON.stringify(lobby, null, "\t"));
     for(i in lobby){
     if(lobby[i].time < getUnix()){
        if(lobby[i].players > 0){
  vk.api.call("messages.send", {
    user_id: users[lobby[i].plid[0].uid].id,
     message: `🌧 | Прошло 5 минут. Комната, в которой Вы находились отключена.`,
     random_id: 0
	}).then((res) => {}).catch((error) => {console.log('Ошибка'); });    
      users[lobby[i].plid[0].uid].lobby = -1;
      users[lobby[i].plid[0].uid].lobbym = 2;
if(lobby[i].players > 1){
vk.api.call("messages.send", {
    user_id: users[lobby[i].plid[1].uid].id,
     message: `🌧 | Прошло 5 минут. Комната, в которой Вы находились отключена.`,
     random_id: 0
	}).then((res) => {}).catch((error) => {console.log('Ошибка'); });    
      users[lobby[i].plid[1].uid].lobby = -1;
      users[lobby[i].plid[1].uid].lobbym = 2;
               }
            lobby[i].players = 0;
            lobby[i].plid = [];
           }
         }
      }
}, 15000);
cmd.hear(/^(?:подключиться|присоедениться)\s?([0-9]+)?$/i, async (message, bot) => {
	if(message.user.lobby != -1) return message.send(`🔥 | Вы уже находитесь в комнате.`);
	if(!message.args[1]) return message.send(`🍒 | Пожалуйста, введите номер комнаты.`);
	let lob = lobby.find(x=> x.uid == message.args[1]);
	if(!lob) return bot(`🍒 | Комната №${message.args[1]} не существует.`);
	if(lob.players <= 0) return bot(`🍒 | Комната №${message.args[1]} не существует.`);
	if(lob.players > 1) return bot(`🍒 | Комната №${message.args[1]} не существует.`);
			lobby[message.args[1]].plid.push({
				uid: message.user.uid,
				   hod: 2,
				   str: message.user.str,
				   vit: message.user.vit
			});
			  lobby[message.args[1]].players += 1;
			  message.user.lobby = message.args[1];
			  message.user.lobbym = 1;
			  lobby[message.args[1]].time += 300000;
	  message.send(`🥑 | Вы присоединились к комнате №${message.user.lobby}.\n🥑 | Для атаки используйте команду ≪Атака≫.\n🥑 | На бой выдаётся 5 минут и 2 хода.`);
	});
	cmd.hear(/^(?:комнаты)$/i, async (message, bot) => {
	let text = `🥑 | Для присоединения к комнате используйте команду ≪подключиться [номер]≫ \nСписок доступных комнат для вас:\n`;
	let h = 0;
	for(i in lobby){
	if(lobby[i].players == 1){
	h++;
	text += `${utils.gi(h)} • Комната №${lobby[i].uid}\n`;
	}
	}
	if(text == `🥑 | Для присоединения к комнате используйте команду ≪подключиться [номер]≫ \nСписок доступных комнат для вас:\n`) return message.send(`🎗 | Доступных для вас комнат не обнаружено.`);
	return bot(text);
	});
	cmd.hear(/^(?:атака)$/i, async (message, bot) => {
	if(message.user.lobby == -1) return message.send(`🎗 | Вы не в комнате.`);
	if(lobby[message.user.lobby].players < 2) return message.send(`🎗 | В комнате недостаточно людей`);
	if(lobby[message.user.lobby].plid[message.user.lobbym].hod < 1) return message.send(`🎗 | У вас недостаточно ходов.`);
	let udar = message.user.str + utils.random(0,30);
	let r = message.user.lobby;
	if(message.user.lobbym == 1){
	
	lobby[r].plid[0].vit -= udar;
	lobby[r].plid[1].hod -= 1;
	if(lobby[r].plid[0].vit <= 0){
	lobby[r].players = 0;
	vk.api.call("messages.send", {
		user_id: users[lobby[r].plid[0].uid].id,
		 message: `🎗 | Вы проиграли бой в комнате №${message.user.lobby}`,
		 random_id: 0
		}).then((res) => {}).catch((error) => {console.log('Ошибка'); });
	users[lobby[message.user.lobby].plid[0].uid].lobby = -1;
	users[lobby[message.user.lobby].plid[0].uid].lobbym = 2;
	return message.send(`🎗 | Вы победили игрока: ${users[lobby[message.user.lobby].plid[0].uid].tag}`);
	}else{
	return message.send(`🎗 | Вы ударили игрока на ${udar} ед. урона.`);
	}
	}
	if(message.user.lobbym == 0){
	lobby[message.user.lobby].plid[1].vit -= udar;
	lobby[message.user.lobby].plid[0].hod -= 1;
	if(lobby[message.user.lobby].plid[1].vit <= 0){
	lobby[message.user.lobby].players = 0;
	vk.api.call("messages.send", {
		user_id: users[lobby[message.user.lobby].plid[1].uid].id,
		 message: `🎗 | Вы проиграли бой в комнате №${message.user.lobby} `,
		 random_id: 0
		}).then((res) => {}).catch((error) => {console.log('Ошибка'); });
	users[lobby[message.user.lobby].plid[1].uid].lobby = -1;
	users[lobby[message.user.lobby].plid[1].uid].lobbym = 2;
	message.user.lobby = -1;
	message.user.lobbym = 1;
	return message.send(`🎗 | Вы победили игрока: ${users[lobby[message.user.lobby].plid[1].uid].tag}
`);
	}else{
	return message.send(`🎗 | Вы ударили игрока на ${udar} ед. урона.`);
	}
	}
	if(lobby[r].plid[1].hod < 1 && lobby[r].plid[0].hod < 1){
	lobby[r].players = 0;
	users[lobby[r].plid[1].uid].lobby = -1;
	users[lobby[r].plid[1].uid].lobbym = 2;
	users[lobby[r].plid[0].uid].lobby = -1;
	users[lobby[r].plid[0].uid].lobbym = 2;
	return message.send(`🎗 | Бой окончился ничьей.`);
	}
	});
	cmd.hear(/^(?:результат)$/i, async (message, bot) => {
		let r = message.user.lobby
		if(message.user.lobby == -1) return message.send(`🎗 | Вы не в комнате.`);
		if(lobby[message.user.lobby].players < 2) return message.send(`🎗 | В комнате недостаточно людей`);
		if(lobby[message.user.lobby].plid[message.user.lobbym].hod < 1) {
			let hp1 = lobby[r].plid[1].vit;
			let hp0 = lobby[r].plid[0].vit;
			if(lobby[r].plid[1].hod < 1 && lobby[r].plid[0].hod < 1){
			lobby[r].players = 0;
			if(hp1> hp0){
			// В этом месте можешь шо-то начислять
			users[lobby[r].plid[1].uid].balance += Number(650)
			users[lobby[r].plid[1].uid].rating += Number(10)
			message.send(`Победил: ${users[lobby[r].plid[1].uid].tag}!
⭐ | Награда: 10 🏆 | 650 Монет`);
			}else{
			// В этом месте можешь шо-то начислять
			users[lobby[r].plid[0].uid].balance += Number(650)
			users[lobby[r].plid[0].uid].rating += Number(10)
			message.send(`Победил: ${users[lobby[r].plid[0].uid].tag}!
⭐ | Награда: 10 🏆 | 650 Монет `);
			}
			users[lobby[r].plid[1].uid].lobby = -1;
			users[lobby[r].plid[1].uid].lobbym = 2;
			users[lobby[r].plid[0].uid].lobby = -1;
			users[lobby[r].plid[0].uid].lobbym = 2;
			}}});

	cmd.hear(/^(?:комната)$/i, async (message, bot) => {
	if(message.user.lobby != -1) return message.send(`⏳ | Вы уже в комнате.`);
	let lobid = -1;
	for(i in lobby){
	 if(lobby[i].players > 0 && lobby[i].players < 2){
		if((lobby[i].plid[0].str + lobby[i].plid[0].vit + utils.random(0,100)) > (message.user.str + message.user.vit + utils.random(0,100)) || (lobby[i].plid[0].str + lobby[i].plid[0].vit + utils.random(0,100)) < (message.user.str + message.user.vit + utils.random(0,100))){
	lobid = lobby[i].uid;
	}
	}
	}
	if(lobid = -1){
	let bl = lobby.length;
	let sh = getUnix() + 300000;
			lobby.push({
				uid: lobby.length,
				players: 1,
				   plid: [],
				   time: sh
			});
			lobby[bl].plid.push({
				uid: message.user.uid,
				   hod: 2,
				   str: message.user.str,
				   vit: message.user.vit
			});
			 message.user.lobby = bl;
			 message.user.lobbym = 0;
	 message.send(`⏳ | Вы создали комнату №${bl}.\nЖдите, когда присоединится ещё 1 человек. \nВремя ожидания составляет всего 5 минут, затем комната становится недоступной.`);
	}else{
			lobby[lobid].plid.push({
				uid: message.user.uid,
				   hod: 2,
				   str: message.user.str,
				   vit: message.user.vit
			});
			  lobby[lobid].players += 1;
			  message.user.lobby = lobid;
			  message.user.lobbym = 1;
			  message.send(`⏳ | Вы присоединились к комнате №${lobid}. Для атаки используйте команду <<Атака>>.`);
	}
	});
	cmd.hear(/^(?:Быстрый бой)$/i, async (message, bot) => {
	let nap = [];
	let user = 0;
	let one = message.user.str + message.user.vit;
	let two = 0;
	let useri = 0;
	let y = false;
	let bla = users.length - 1;
	// Выбираем 10 рандомных челиков из базы
			for(i=0;i<10;i++){ 
		 user = utils.random(0,bla);
					nap.push({id: users[user].uid, idvk: users[user].id, na: users[user].tag, sila: users[user].str, hp: users[user].vit}); 
		}
	
	// Сортируем этих 10 челиков
	for(i in nap){
	  if(nap[i].sila > 0 && nap[i].hp > 0){
		if(nap[i].idvk != message.senderId){
			if((nap[i].sila + utils.random(0,100)) < (message.user.str + utils.random(0,100)) || (nap[i].sila + utils.random(0,100)) > (message.user.str + utils.random(0,100))){
		 user = nap[i].id;
		 useri = i;
		 y = true;
	}
	}
	}
	}
	if(y != false){
	if(users[user].str + users[user].vit + utils.random(0,150) > message.user.str + message.user.vit + utils.random(0,150)){
	return message.send(`💊 | Вы проиграли бой. Вас победил игрок #${users[user].uid}`);
	}else{
	return message.send(`💊 | Вы выйграли бой. Вы победили игрока #${users[user].uid}`);
	}
	}else{
	return message.send(`💊 | К сожелению, найди подходящего врага не удалось.`);
	}
	});
	function getUnix() {
		return Date.now();
	}
	cmd.hear(/^(?:-dev)\s?([0-9]+)\s(.*)\s(.*)?$/i, async (message, bot) => {
		if(message.user.admin < 1) return bot(`Нет доступа`);
		//// Не работает
		if(!message.args[1]) return bot(`Введите ID игрока`);
		////
		let user = users.find(x=> x.uid == message.args[1]);
		if(!user) return bot(`Игрок не найден`);
		//Не работают т.к если поставить между ними "?", то считает только 2 аргумента
		if(!message.args[2]) return bot(`Введите название переменной`);
		 if(!message.args[3]) return bot(`Введите значение переменной`);
		//////
		let per = message.args[2];
		let zn = Number(message.args[3]);
		user[per] = Number(zn);
		return bot(`Значение переменной "${per}" игрока "${user.tag}" изменено на "${zn}" `);
		});

//Х
cmd.hear(/^(?:Южный мост|⏳ Продолжить)$/i, async (message, bot) => {
	let mobs = utils.pick([`Еретика`, `Киберзомби`, `Рабомеханика`, `Деморга`, `Альвиона`, `Каронса`, `Форна`, `Эвилона`])
	let heal = utils.pick([`170`, `215`, `310`, `120`, `380`])
	let uron = utils.pick([`8`, `12`, `22`, `28`, `30`])
	let earn = 0
	message.user.active = 2
		if(message.user.se == 0 && message.user.um == 0 && message.user.sm == 0 && message.user.active == 2) {
			saveUsers()
setTimeout(() => {message.send(`
⚙ | Вы, взяв карту, посмотрели на рядом стоящий щит: <<Вам предстоит уничтожить 20 монстров за раз, что-бы пройти эту локацию.>>\nВзяв кирматовый меч, вы двинулись в путь...`); }, 1);
		}
		if(message.user.um >= 0 && message.user.active == 2) {
			message.user.um += Number(1) 
			message.user.hp_mon = heal
			message.user.sil_mon = uron
			message.user.unite = mobs
setTimeout(() => {message.send(`
> Бродя по окружностям южного моста, вы встретили <<${mobs}>>

🌑 | Здоровье: ${heal} | Сила: ${uron}

🌕 | Вы
Здоровье: ${message.user.vit} | Сила: ${message.user.str}

Атака — 🔥 | Выйти — 🏳`, { 
	keyboard:JSON.stringify( 
	{ 
	"inline": true,
	"buttons": [ 
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "🔥" 
	}, 
	"color": "positive" 
	}],
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "🏳" 
	}, 
	"color": "negative" 
		}]]})} 
	); }, 10000); 
}});
cmd.hear(/^(?:Сетевой экран|⏳ Продолжить)$/i, async (message, bot) => {
	let mobs = utils.pick([, `Деморга`, `Альвиона`, `Каронса`, `Форна`, `Эвилона`, `Парнера`, `Коули`, `Эннорда`, `Виверну`, `Змеелова`])
	message.user.active = 3
	let heal = utils.pick([`290`, `340`, `390`, `430`, `480`])
	let uron = utils.pick([`16`, `22`, `28`, `36`, `40`])
	let earn = 0

		if(message.user.se == 0 && message.user.um == 0 && message.user.sm == 0 && message.user.active == 3) {
			saveUsers()
setTimeout(() => {message.send(`
⚙ | Вы, взяв карту, посмотрели на рядом стоящий щит: <<Вам предстоит уничтожить 20 монстров за раз, что-бы пройти эту локацию.>>\nВзяв альмаритовый меч, вы двинулись в путь...`); }, 1);
		}
		if(message.user.se >= 0 && message.user.active == 3) {
			message.user.se += Number(1) 
			message.user.hp_mon = heal
			message.user.sil_mon = uron
			message.user.unite = mobs
setTimeout(() => {message.send(`
> Бродя по окружностям сетевого экрана, вы встретили <<${mobs}>>

🌑 | Здоровье: ${heal} | Сила: ${uron}

🌕 | Вы
Здоровье: ${message.user.vit} | Сила: ${message.user.str}

Атака — 🔥 | Выйти — 🏳`, { 
	keyboard:JSON.stringify( 
	{ 
	"inline": true,
	"buttons": [ 
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "🔥" 
	}, 
	"color": "positive" 
	}],
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "🏳" 
	}, 
	"color": "negative" 
		}]]})} 
	); }, 10000); 
}});
cmd.hear(/^(?:Северный мост|⏳ Продолжить)$/i, async (message, bot) => {
	let mobs = utils.pick([`Кракена`, `Рейзора`, `Еретика`, `Киберзомби`, `Рабомеханика`, `Деморга`])
	message.user.active = 1
	let heal = utils.pick([`100`, `145`, `70`, `50`, `90`])
	let uron = utils.pick([`2`, `8`, `15`, `20`, `10`])
	let earn = 0

		if(message.user.se == 0 && message.user.um == 0 && message.user.sm == 0 && message.user.active == 1) {
			saveUsers()
setTimeout(() => {message.send(`
⚙ | Вы, взяв карту, посмотрели на рядом стоящий щит: <<Вам предстоит уничтожить 20 монстров за раз, что-бы пройти эту локацию.>>\nВзяв плазменный меч, вы двинулись в путь...`); }, 1);
		}
		if(message.user.sm >= 0 && message.user.active == 2) {
			message.user.sm += Number(1) 
			message.user.hp_mon = heal
			message.user.sil_mon = uron
			message.user.unite = mobs
setTimeout(() => {message.send(`
> Бродя по окружностям северного моста, вы встретили <<${mobs}>>

🌑 | Здоровье: ${heal} | Сила: ${uron}

🌕 | Вы
Здоровье: ${message.user.vit} | Сила: ${message.user.str}

Атака — 🔥 | Выйти — 🏳`, { 
	keyboard:JSON.stringify( 
	{ 
	"inline": true,
	"buttons": [ 
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "🔥" 
	}, 
	"color": "positive" 
	}],
	[{ 
	"action": { 
	"type": "text", 
	"payload": "{}", 
	"label": "🏳" 
	}, 
	"color": "negative" 
		}]]})} 
	); }, 10000); 
}});
cmd.hear(/^(?:🔥)$/i, async (message, bot) => {
	let earn = 25
		if(message.user.hp_mon > 1 && message.user.sm >= 1 && message.user.sm <= 20 && message.user.active == 1) {
			message.user.vit -= Number(message.user.sil_mon)
			
			message.user.hp_mon -= Number(message.user.str)
			return message.send(`
💾 | Вы ударили ${message.user.unite}.\n\n💣 | Урон: ${message.user.str} | Здоровье: ${message.user.vit}\n❤ Здоровье монстра: ${message.user.hp_mon}`, { 
				keyboard:JSON.stringify( 
				{ 
				"inline": true,
				"buttons": [ 
				[{ 
				"action": { 
				"type": "text", 
				"payload": "{}", 
				"label": "🔥" 
				}, 
				"color": "positive" 
				}],
				[{ 
				"action": { 
				"type": "text", 
				"payload": "{}", 
				"label": "🏳" 
				}, 
				"color": "negative"
			}]]})}
		)}
		if(message.user.sm >= 20) {
			message.user.balance += Number(earn)
			message.user.hp_mon = 0;
			message.user.sil_mon = 0;
			message.user.exp += Number(10);
			message.user.aspects += Number(5);
			message.user.unite = ``;
			message.user.active = 0;
			message.user.quest_1 = true;
			message.user.sm = 0;
			return message.send(`
Кристоф > Поздравляю с прохождением локации. Я оставил тебе в журнале квест, если захочешь - пройдешь.
🔹 | Награда: 5 льда | 10 EXP | 500 монет.`)
		}
		if(message.user.hp_mon <= 0) {
			message.user.balance += Number(earn)
			message.user.hp_mon = 0;
			message.user.sil_mon = 0;
			message.user.unite = ``;
			return message.send(`🔪 | Вы убили монстра!\n💚 | Ваше здоровье: ${message.user.vit}.`, { 
				keyboard:JSON.stringify( 
				{ 
				"inline": true,
				"buttons": [ 
				[{ 
				"action": { 
				"type": "text", 
				"payload": "{}", 
				"label": "⏳ Продолжить" 
				}, 
				"color": "positive" 
				}],
				[{ 
				"action": { 
				"type": "text", 
				"payload": "{}", 
				"label": "🏳" 
				}, 
				"color": "negative"
			}]]})})
		}
		if(message.user.vit <= 0) {
			message.user.balance += Number(earn)
			message.user.sm = 0
			message.user.active = 0;
			message.user.hp_mon = 0;
			message.user.sil_mon = 0;
			message.user.unite = ``;
		}
		if(message.user.hp_mon > 1 && message.user.um >= 1 && message.user.um <= 20 && message.user.active == 2) {
			message.user.vit -= Number(message.user.sil_mon)
			
			message.user.hp_mon -= Number(message.user.str)
			return message.send(`
💾 | Вы ударили ${message.user.unite}.\n\n💣 | Урон: ${message.user.str} | Здоровье: ${message.user.vit}\n❤ Здоровье монстра: ${message.user.hp_mon}`, { 
				keyboard:JSON.stringify( 
				{ 
				"inline": true,
				"buttons": [ 
				[{ 
				"action": { 
				"type": "text", 
				"payload": "{}", 
				"label": "🔥" 
				}, 
				"color": "positive" 
				}],
				[{ 
				"action": { 
				"type": "text", 
				"payload": "{}", 
				"label": "🏳" 
				}, 
				"color": "negative"
			}]]})}
		)}
		if(message.user.um >= 20) {
			message.user.balance += Number(earn)
			message.user.balance += Number(1500)
			message.user.hp_mon = 0;
			message.user.active = 0
			message.user.sil_mon = 0;
			message.user.exp += Number(30);
			message.user.aspects += Number(15);
			message.user.unite = ``;
			message.user.quest_2 = true;
			message.user.um = 0;
			return message.send(`
Тейлор > А ты амбициозный парень! Глядишь и босса уничтожешь! В твоем журнале появился новый квест.
🔹 | Награда: 15 льда | 30 EXP | 1500 монет.`)
		}
		if(message.user.hp_mon <= 0) {
			message.user.balance += Number(earn)
			message.user.hp_mon = 0;
			message.user.sil_mon = 0;
			message.user.unite = ``;
			return message.send(`🔪 | Вы убили монстра!\n💚 | Ваше здоровье: ${message.user.vit}.`, { 
				keyboard:JSON.stringify( 
				{ 
				"inline": true,
				"buttons": [ 
				[{ 
				"action": { 
				"type": "text", 
				"payload": "{}", 
				"label": "⏳ Продолжить" 
				}, 
				"color": "positive" 
				}],
				[{ 
				"action": { 
				"type": "text", 
				"payload": "{}", 
				"label": "🏳" 
				}, 
				"color": "negative"
			}]]})})
		}
		if(message.user.vit <= 0) {
			message.user.balance += Number(earn)
			message.user.se = 0
			message.user.hp_mon = 0;
			message.user.active = 0
			message.user.sil_mon = 0;
			message.user.unite = ``;
			return message.send(`Ты был близок к успеху, но здоровье твоего персонажа опустилось до нуля.`)
		}
		if(message.user.hp_mon > 1 && message.user.se >= 1 && message.user.se <= 20 && message.user.active == 3) {
			message.user.vit -= Number(message.user.sil_mon)
			
			message.user.hp_mon -= Number(message.user.str)
			return message.send(`
💾 | Вы ударили ${message.user.unite}.\n\n💣 | Урон: ${message.user.str} | Здоровье: ${message.user.vit}\n❤ Здоровье монстра: ${message.user.hp_mon}`, { 
				keyboard:JSON.stringify( 
				{ 
				"inline": true,
				"buttons": [ 
				[{ 
				"action": { 
				"type": "text", 
				"payload": "{}", 
				"label": "🔥" 
				}, 
				"color": "positive" 
				}],
				[{ 
				"action": { 
				"type": "text", 
				"payload": "{}", 
				"label": "🏳" 
				}, 
				"color": "negative"
			}]]})}
		)}
		if(message.user.se >= 20) {
			message.user.balance += Number(earn)
			message.user.balance += Number(3000)
			message.user.hp_mon = 0;
			message.user.active = 0
			message.user.sil_mon = 0;
			message.user.exp += Number(70);
			message.user.aspects += Number(40);
			message.user.unite = ``;
			message.user.quest_3 = true;
			message.user.se = 0;
			return message.send(`
Рони > Не люблю я эти похвалы, короче, в твоем журнале появился новый квест.
🔹 | Награда: 40 льда | 70 EXP | 3000 монет.`)
		}
		if(message.user.hp_mon <= 0) {
			message.user.balance += Number(earn)
			message.user.hp_mon = 0;
			message.user.sil_mon = 0;
			message.user.unite = ``;
			return message.send(`🔪 | Вы убили монстра!\n💚 | Ваше здоровье: ${message.user.vit}.`, { 
				keyboard:JSON.stringify( 
				{ 
				"inline": true,
				"buttons": [ 
				[{ 
				"action": { 
				"type": "text", 
				"payload": "{}", 
				"label": "⏳ Продолжить" 
				}, 
				"color": "positive" 
				}],
				[{ 
				"action": { 
				"type": "text", 
				"payload": "{}", 
				"label": "🏳" 
				}, 
				"color": "negative"
			}]]})})
		}
		if(message.user.vit <= 0) {
			message.user.balance += Number(earn)
			message.user.se = 0
			message.user.hp_mon = 0;
			message.user.active = 0;
			message.user.sil_mon = 0;
			message.user.unite = ``;
			return message.send(`Ты был близок к успеху, но здоровье твоего персонажа опустилось до нуля.`)
		}
});