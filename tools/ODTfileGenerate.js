//=========================================================================================
// Autor:	Makarov Aleksandr, Starostin Vladimir
// Desc:	Translate Tiburon XML to ODT
// Date:	01/11/2016
//=========================================================================================

//=========================================================================================
function runSample()
{
	var xml_text = '<?xml version="1.0" encoding="windows-1251"?><Survey><!--ExtPars="resp/Внешний Id,s/Пол,a/Возраст,sel/Код выборки,cdone/флаг завершения CBC"/-->	<Settings AutoMonadic="true" ShowLogo="false" ExtPars="resp/Внешний Id,s/Пол,a/Возраст,sel/Код выборки" />	<Defaults ShowNextButton="true" ShowPrevButton="false" ShowComment="false" ShowProgress="true"  MaxAnswersDisable="true">		<Ui TextClick="1" ImageBig="b" OptX="1280" OptY="1024" />		<Page>			<CustomText1><![CDATA[ 				<link rel="stylesheet" href="@StoreUrl/t/deman/slimDesign.css"/>				<style type=\'text/css\'>					blockquote{						box-shadow: inset 0 2px 0 rgba(120, 147, 242, 0.7), -5px -4px 25px rgba(0, 0, 0, 0.3);						border-radius:5px;						background: lightyellow;						padding:15px;						text-align:center; 						margin-top:10px; 						font-size:26px;						font-style: italic;						font-weight: normal;						position:relative;						border-left: 15px solid rgb(120, 144, 242);					}									.descr{						text-align:center;					}					.descr-left{						width:300px;						padding-top:30px;						font-size:17px;					}					.description-gray					{						font-weight:normal;						color: #7B7676;					}							a.link-btn{					border: 1px solid #aaaaaa !important;					border-top-color: #aaaaaa !important;					border-bottom-color: #aaaaaa !important;					color: #000 !important;					box-shadow: 0 0 0 1px #aaaaaa !important;					-webkit-box-shadow: 0 0 0 1px #aaaaaa !important;					-moz-box-shadow:0 0 0 1px #aaaaaa !important;					background-color:#aaaaaa !important;					background-image:-webkit-gradient(linear,left top,left bottom,from(#ffffff),to(#ddddff)) !important;					background-image:-webkit-linear-gradient(top,#ffffff,#ddddff) !important;					background-image:-moz-linear-gradient(top,#ffffff,#ddddff) !important;					background-image:-ms-linear-gradient(top,#ffffff,#ddddff) !important;					background-image:-o-linear-gradient(top,#ffffff,#ddddff) !important;					background-image: linear-gradient(to bottom,#ffffff,#ddddff) !important;					padding-top:10px;padding-bottom:10px !important;					text-shadow:none !important;					}										a.link-btn.selected{					border: 1px solid #aaaaaa !important;					border-top-color: #aaaaaa !important;					border-bottom-color: #aaaaaa !important;					color: #000 !important;					box-shadow: 0 0 0 1px #aaaaaa !important;					-webkit-box-shadow: 0 0 0 1px #aaaaaa !important;					-moz-box-shadow:0 0 0 1px #aaaaaa !important;					background-color:#aaaaaa !important;					background-image:-webkit-gradient(linear,left top,left bottom,from(#ddddff),to(ffffff#ddddff)) !important;					background-image:-webkit-linear-gradient(top,#ddddff,#ffffff) !important;					background-image:-moz-linear-gradient(top,#ddddff,#ffffff) !important;					background-image:-ms-linear-gradient(top,#ddddff,#ffffff) !important;					background-image:-o-linear-gradient(top,#ddddff,#ffffff) !important;					background-image: linear-gradient(to bottom,#ddddff,#ffffff) !important;					padding-top:10px;padding-bottom:10px !important;					text-shadow:none !important;					}										div.title{						display:table;						width:100%;					}					.title div.grad-scale5-1, .title div.grad-scale5-2,.title div.grad-scale5-3,.title div.grad-scale5-4,.title div.grad-scale5-5, .title div.grad-scale7-1, .title div.grad-scale7-2,.title div.grad-scale7-3,.title div.grad-scale7-4,.title div.grad-scale7-5,.title div.grad-scale7-6,.title div.grad-scale7-7, div.grad-scale10-1, div.grad-scale10-2, div.grad-scale10-3, div.grad-scale10-4, div.grad-scale10-5, div.grad-scale10-6, div.grad-scale10-7, div.grad-scale10-8, div.grad-scale10-9, div.grad-scale10-10					{						height:40px;						padding:5px;						display:table-cell;						vertical-align:middle;					}					div.grad-scale5-1,div.grad-scale7-1,div.grad-scale10-1{						background:#FE8888;					}										div.grad-scale10-2{						background:#FD9272;					}										div.grad-scale7-2,div.grad-scale10-3{						background:#FCA389;					}										div.grad-scale5-2, div.grad-scale7-3, div.grad-scale10-4{						background:#FCC3A3;					}										div.grad-scale10-5{						background:#FFD961;					}										div.grad-scale5-3, div.grad-scale7-4, div.grad-scale10-6{						background:#FFEB61;					}															div.grad-scale5-4, div.grad-scale7-5, div.grad-scale10-7{						background:#F2FF7E;					}										div.grad-scale7-6, div.grad-scale10-8{						background:#BAFCA3;					}										div.grad-scale10-9{						background:#8DFFA4;					}										div.grad-scale5-5, div.grad-scale7-7, div.grad-scale10-10{						background:#62FD82;					}																													@-webkit-keyframes scaleNum{					to {						font-size:24px;					}				}				@keyframes scaleNumidth{					to {						font-size:24px;					}				}										.selected .scale-num					{						//font-size:24px;						font-weight:bold;						-webkit-animation-name:scaleNum;						-webkit-animation-duration:.15s;						-webkit-animation-fill-mode:forwards;						-webkit-animation-timing-function:linear;						animation-name:scaleNum;						animation-duration:.15s;						animation-fill-mode:forwards;						animation-timing-function:linear;					}								</style>			]]></CustomText1> 		</Page>	</Defaults>	<Page Id="RespInfo">		<Filter>false;</Filter>		<Question Id="Sex" Type="RadioButton">			<Answer Id="1"><Text>Мужской</Text></Answer>			<Answer Id="2"><Text>Женский</Text></Answer>		</Question>				<Question Id="City" Type="RadioButton">			<Answer Id="1"><Text>Москва</Text></Answer>			<Answer Id="2"><Text>Санкт-Петербург</Text></Answer>		</Question>								<Question Id="Age" Type="RadioButton">			<Answer Id="1"><Text>20-32 лет</Text></Answer>			<Answer Id="2"><Text>33-45 лет</Text></Answer>		</Question>							</Page>	<Page Id="s3">		<Question Id="s3" Type="RadioButton">			<Header>S3. Отметьте, пожалуйста, город, в котором Вы проживаете в настоящее время.</Header>			<Answer Id="1"><Text>Москва</Text></Answer>			<Answer Id="2"><Text>Санкт-Петербург</Text></Answer>			<Answer Id="3"><Text>Новосибирск</Text></Answer>			<Answer Id="4"><Text>Нижний Новгород</Text></Answer>			<Answer Id="5"><Text>Самара</Text></Answer>			<Answer Id="6"><Text>Казань</Text></Answer>			<Answer Id="7"><Text>Челябинск</Text></Answer>			<Answer Id="8"><Text>Ростов-на-Дону</Text></Answer>			<Answer Id="9"><Text>Уфа</Text></Answer>			<Answer Id="10"><Text>Волгоград</Text></Answer>			<Answer Id="11"><Text>Пермь</Text></Answer>			<Answer Id="12"><Text>Красноярск</Text></Answer>			<Answer Id="13"><Text>Сочи</Text></Answer>			<Answer Id="14"><Text>Краснодар</Text></Answer>			<Answer Id="98" Type="Text"><Text>Другое</Text></Answer>		</Question>			<Redirect Status="19"><![CDATA[			int age=GetInt(AnswerValue("pre_age","1"));			if (age<20 || age>45) return true;			if (age>=20 && age<=32) { AnswerUpdate("Age","1"); }			if (age>=33 && age<=45) { AnswerUpdate("Age","2"); }			if (AnswerExists("pre_sex","1")) AnswerUpdate("Sex","1");			if (AnswerExists("pre_sex","2")) AnswerUpdate("Sex","2");			if (!AnswerExistsAny("s3","1,2")) return true;			if (AnswerExists("s3","1")) AnswerUpdate("City","1");			if (AnswerExists("s3","2")) AnswerUpdate("City","2");					return false;		]]></Redirect>			</Page>			<Page Id="s4">		<Question Id="s4" Type="RadioButton">			<Header>S4. Как бы Вы могли описать [u]материальное положение[/u] Вашей семьи? </Header>			<Answer Id="1"><Text>Нам не хватает денег даже на питание</Text></Answer>			<Answer Id="2"><Text>На питание денег хватает, но покупка одежды вызывает затруднения</Text></Answer>			<Answer Id="3"><Text>Денег хватает на питание, одежду и мелкую бытовую технику, но купить сейчас телевизор, холодильник или стиральную машину было бы трудно</Text></Answer>			<Answer Id="4"><Text>Денег хватает на крупную бытовую технику, но мы не могли бы купить новую машину</Text></Answer>			<Answer Id="5"><Text>Денег хватает на все, кроме покупки недвижимости (дачи или квартиры) </Text></Answer>			<Answer Id="6"><Text>Материальных затруднений не испытываем. При необходимости могли бы приобрести дачу, квартиру</Text></Answer>			<Answer Id="9"><Text>Затрудняюсь ответить / отказ</Text></Answer>		</Question>			<Redirect Status="19"><![CDATA[			if (AnswerExistsAny("s4","1,2,3,9")) return true;						return false;		]]></Redirect>					</Page>		<Page Id="s5">		<Question Id="s5" Type="RadioButton">			<Header>S5. Кто в Вашей семье обычно [u]покупает продукты[/u] питания? </Header>			<Answer Id="1"><Text>Только Вы сами</Text></Answer>			<Answer Id="2"><Text>Вы и другие члены Вашей семьи в равной степени</Text></Answer>			<Answer Id="3"><Text>Другие члены Вашей семьи</Text></Answer>		</Question>			<Redirect Status="19"><![CDATA[			if (AnswerExists("s5","3")) return true;								return false;		]]></Redirect>			</Page>			<Page Id="s6">		<Question Id="s6" Type="CheckBox" Mix="true">			<Header>S6. Какие из представленных кондитерских изделий Вы лично покупали [u]за последние 3 месяца[/u]?</Header>			<Answer Id="1"><Text>Конфеты в коробках </Text></Answer>			<Answer Id="2"><Text>Шоколад в плитках</Text></Answer>			<Answer Id="3"><Text>Развесные шоколадные конфеты</Text></Answer>			<Answer Id="4"><Text>Шоколадные батончики</Text></Answer>			<Answer Id="5"><Text>Карамель</Text></Answer>			<Answer Id="6"><Text>Желейные конфеты</Text></Answer>			<Answer Id="7"><Text>Торты / пирожные</Text></Answer>			<Answer Id="8"><Text>Халва</Text></Answer>			<Answer Id="9"><Text>Зефир</Text></Answer>			<Answer Id="10"><Text>Мармелад</Text></Answer>			<Answer Id="11"><Text>Печенье</Text></Answer>			<Answer Id="12"><Text>Вафли</Text></Answer>			<Answer Id="13"><Text>Вафельный торт</Text></Answer>			<Answer Id="14"><Text>Кексы / рулеты / бисквиты</Text></Answer>			<Answer Id="99" Fix="true" Reset="true"><Text>Ничего из перечисленного</Text></Answer>		</Question>			<Redirect Status="19"><![CDATA[			if (!AnswerExistsAny("s6","1,2")) return true;								return false;		]]></Redirect>			</Page>			<List Id="s71list">		<Item Id="1"><Text>Cemoi</Text></Item>		<Item Id="2"><Text>Cote d\'Or</Text></Item>		<Item Id="3"><Text>Dumle </Text></Item>		<Item Id="4"><Text>Fazermint</Text></Item>		<Item Id="5"><Text>Ferrero Rocher</Text></Item>		<Item Id="6"><Text>Geisha</Text></Item>		<Item Id="7"><Text>Lindor</Text></Item>		<Item Id="8"><Text>Liqueur Fills</Text></Item>		<Item Id="9"><Text>Merci</Text></Item>		<Item Id="10"><Text>Rafaello</Text></Item>		<Item Id="11"><Text>Комильфо</Text></Item>		<Item Id="12"><Text>А.Коркунов</Text></Item>	</List>	<Page Id="s71">		<Filter><![CDATA[return AnswerExists("s6","1");]]></Filter>		<Question Id="s71" Type="CheckBox" Mix="true">			<Header>S7.1. [u]Конфеты в коробках[/u] каких марок Вы покупали за последние 3 месяца?</Header>			<Ui Extend="ContentOnly" Cols="4"/>			<Repeat List="s71list">				<Answer Id="@ID"><Text>[center][img src="@StoreUrl/s/a203/s71/@ID.jpg"/][br]@Text[/center]</Text></Answer>			</Repeat>			<Answer Id="99" Fix="true" Reset="true"><Ui Isolate="1" Width="450px" Align="center"/><Text>Ничего из перечисленного</Text></Answer>		</Question>		</Page>			<List Id="s72list">		<Item Id="1"><Text>Cote d\'Or</Text></Item>		<Item Id="2"><Text>Dove </Text></Item>		<Item Id="3"><Text>Geisha</Text></Item>		<Item Id="4"><Text>Karl Fazer</Text></Item>		<Item Id="5"><Text>Kinder</Text></Item>		<Item Id="6"><Text>Lindt</Text></Item>		<Item Id="7"><Text>Ritter Sport</Text></Item>		<Item Id="8"><Text>Toblerone</Text></Item>		<Item Id="9"><Text>Вдохновение</Text></Item>		<Item Id="10"><Text>А.Коркунов</Text></Item>	</List>	<Page Id="s72">		<Filter><![CDATA[return AnswerExists("s6","2");]]></Filter>		<Question Id="s72" Type="CheckBox" Mix="true">			<Header>S7.2. [u]Шоколад в плитках[/u] каких марок Вы покупали за последние 3 месяца?</Header>			<Ui Extend="ContentOnly" Cols="4"/>			<Repeat List="s72list">				<Answer Id="@ID"><Text>[center][img src="@StoreUrl/s/a203/s72/@ID.jpg"/][br]@Text[/center]</Text></Answer>			</Repeat>			<Answer Id="99" Fix="true" Reset="true"><Ui Isolate="1" Width="450px" Align="center"/><Text>Ничего из перечисленного</Text></Answer>		</Question>		</Page>			<Page Id="qcheck">		<Filter>false;</Filter>		<Header>quota</Header>		<Redirect Status="19"><![CDATA[			if (!(AnswerExistsAny("s71","1,2,3,4,5,6,7,8,9,10,11,12") || AnswerExistsAny("s72","1,2,3,4,5,6,7,8,9,10"))) return true;								return false;		]]></Redirect>			</Page>	<Page Id="start">		<Header>ВЫ ПРОШЛИ ОТБОРОЧНУЮ ЧАСТЬ ОПРОСА, ТЕПЕРЬ, ПОЖАЛУЙСТА, ОТВЕТЬТЕ НА ОСНОВНЫЕ ВОПРОСЫ АНКЕТЫ.</Header>	</Page>		<Page Id="pre_A">		<Header>Сейчас Вам будет показан рекламный ролик. Посмотрите его, пожалуйста.[br] После этого мы попросим Вас ответить на несколько вопросов о нем.</Header>	</Page>			<Page Id="vid_A" CountProgress="false">		<Defaults ShowProgress="false" ShowNextButton="false"/>   		<Question Id="vid_A" Type="Text" Imperative="false" Hint="">	  	<Ui Extend="MediaPlayer" Type="Video" Align="center" Src="@StoreUrl/s/a203/video/video.mp4,@StoreUrl/s/a203/video/video.webm,@StoreUrl/s/a203/video/video.ogv"  PauseEnable="1" PlayAuto="1" PlayRedirect="1" SeekEnable="0"/>		  	<Answer Id="1" Text="Like" />		  	<Answer Id="2" Text="Dislike" />		</Question>	</Page>			<Page Id="a1">		<Ui HeaderBuiltin="1"/>		<Question Id="a1" Type="Text">			<Header>А1. Укажите, пожалуйста, какая [u]марка[/u] рекламировалась в этом ролике?</Header>			<Answer Id="1"></Answer>		</Question>			<Question Id="a2" Type="Memo">			<Header>А2. Как бы Вы могли своими словами рассказать, [u]о чем этот ролик[/u]? Представьте, пожалуйста, что Вы пересказываете его своим знакомым, которые его не видели ранее.</Header>			<Answer Id="1"></Answer>		</Question>				<Question Id="a3" Type="Memo">			<Header>А3. Как Вам кажется, в чем[u] основная идея[/u] этого ролика?</Header>			<Answer Id="1"></Answer>		</Question>					</Page>			<Page Id="a4">		<!-- <Css Holder="l"/> -->		<Question Id="a4" Type="RadioButton">			<Header>А4. Насколько Вам было [u]понятно или не понятно[/u] то, что происходит в ролике?</Header>			<Ui Extend="ContentOnly" Cols="1"/>			<Answer Id="1"><Text>[div class="grad-scale5-1"]Совершенно НЕ понятно   [/div]</Text></Answer>			<Answer Id="2"><Text>[div class="grad-scale5-2"]НЕ очень понятно[/div]</Text></Answer>			<Answer Id="3"><Text>[div class="grad-scale5-3"]Отчасти понятно, отчасти нет[/div]</Text></Answer>			<Answer Id="4"><Text>[div class="grad-scale5-4"]Скорее понятно[/div]</Text></Answer>			<Answer Id="5"><Text>[div class="grad-scale5-5"]Полностью понятно[/div]</Text></Answer>			</Question>		</Page>			<Page Id="a5">		<Ui Width="1100px"/>		<Question Id="a5" Type="RadioButton">			<Header>А5. Каково Ваше [u]общее впечатление[/u] об этом рекламном ролике в целом, как бы Вы оценили его? Вы можете пользоваться любыми цифрами от 1 до 10, чтобы полнее выразить Ваше отношение к этому ролику. </Header>			<Ui Extend="ContentOnly" Cols="10"/>			<Answer Id="1"><Text>[div class="grad-scale10-1"][span class="scale-num"]1[/span] - [font size="2"]Очень плохой ролик[/font][/div]</Text></Answer>			<Answer Id="2"><Text>[div class="grad-scale10-2"][span class="scale-num"]2[/span][/div]</Text></Answer>			<Answer Id="3"><Text>[div class="grad-scale10-3"][span class="scale-num"]3[/span][/div]</Text></Answer>			<Answer Id="4"><Text>[div class="grad-scale10-4"][span class="scale-num"]4[/span][/div]</Text></Answer>			<Answer Id="5"><Text>[div class="grad-scale10-5"][span class="scale-num"]5[/span][/div]</Text></Answer>			<Answer Id="6"><Text>[div class="grad-scale10-6"][span class="scale-num"]6[/span][/div]</Text></Answer>			<Answer Id="7"><Text>[div class="grad-scale10-7"][span class="scale-num"]7[/span][/div]</Text></Answer>			<Answer Id="8"><Text>[div class="grad-scale10-8"][span class="scale-num"]8[/span][/div]</Text></Answer>			<Answer Id="9"><Text>[div class="grad-scale10-9"][span class="scale-num"]9[/span][/div]</Text></Answer>			<Answer Id="10"><Text>[div class="grad-scale10-10"][span class="scale-num"]10[/span] - [font size="2"]Очень хороший ролик[/font][/div]</Text></Answer>		</Question>		</Page>			<Page Id="a6">		<Css Holder="l"/>		<Question Id="a6" Type="RadioButton">			<Header>А6. Насколько Вам было интересно [u]досмотреть этот ролик до конца[/u]? </Header>			<Ui Extend="ContentOnly" Cols="1"/>			<Answer Id="1"><Text>[div class="grad-scale5-1"]Совершенно НЕ интересно[/div]</Text></Answer>			<Answer Id="2"><Text>[div class="grad-scale5-2"]Скорее НЕ интересно[/div]</Text></Answer>			<Answer Id="3"><Text>[div class="grad-scale5-3"]Отчасти интересно, отчасти нет[/div]</Text></Answer>			<Answer Id="4"><Text>[div class="grad-scale5-4"]Скорее интересно[/div]</Text></Answer>			<Answer Id="5"><Text>[div class="grad-scale5-5"]Очень интересно[/div]</Text></Answer>			</Question>		</Page>				<Page Id="a7">		<Question Id="a7" Type="CheckBox" Mix="true">			<Header>А7. Какие эмоции у Вас [u]вызвал[/u] этот рекламный ролик? </Header>			<Answer Id="1"><Text>Интерес</Text></Answer>			<Answer Id="2"><Text>Радость </Text></Answer>			<Answer Id="3"><Text>Доверие</Text></Answer>			<Answer Id="4"><Text>Удовольствие</Text></Answer>			<Answer Id="5"><Text>Умиление</Text></Answer>			<Answer Id="6"><Text>Уважение</Text></Answer>			<Answer Id="7"><Text>Восхищение</Text></Answer>			<Answer Id="8"><Text>Удивление</Text></Answer>			<Answer Id="9"><Text>Симпатия</Text></Answer>			<Answer Id="10"><Text>Спокойствие</Text></Answer>			<Answer Id="11"><Text>Умиротворение</Text></Answer>			<Answer Id="12"><Text>Безразличие</Text></Answer>			<Answer Id="13"><Text>Скука</Text></Answer>			<Answer Id="14"><Text>Неуверенность</Text></Answer>			<Answer Id="15"><Text>Разочарование</Text></Answer>			<Answer Id="16"><Text>Уныние</Text></Answer>			<Answer Id="17"><Text>Беспокойство</Text></Answer>			<Answer Id="18"><Text>Раздражение</Text></Answer>			<Answer Id="19"><Text>Жалость</Text></Answer>			<Answer Id="20"><Text>Неприязнь</Text></Answer>			<Answer Id="98" Fix="true" Type="Text" Title="nbsp;"><Text>Другое (ЗАПИШИТЕ)</Text></Answer>			<Answer Id="99" Fix="true" Reset="true"><Text>Затрудняюсь ответить</Text></Answer>			</Question>		</Page>			<Page Id="a8">		<Ui HeaderBuiltin="1"/>		<Filter><![CDATA[return AnswerExistsAny("a7","13,14,15,16,17,18,19,20");]]></Filter>		<Header>А8. Почему этот ролик вызвал у Вас негативные эмоции? </Header>		<Question Id="a8" Type="Memo">			<Filter Side="Client"><![CDATA[return !AnswerExists("a8_99","99");]]></Filter>			<Answer Id="1"></Answer>		</Question>				<Question Id="a8_99" Type="CheckBox" Hint="" Imperative="false">			<Answer Id="99"><Ui Isolate="1" Width="450px" Align="center"/><Text>Затрудняюсь ответить</Text></Answer>		</Question>					</Page>			<Page Id="pre_a9">		<Header>Теперь, пожалуйста, посмотрите это ролик ещё раз. Во время просмотра Вы можете выделить понравившиеся и не понравившиеся моменты, [u]нажав и отпустив[/u] соответствующие кнопки под экраном с роликом.</Header>	</Page>		<Page Id="a9" CountProgress="false">		<Defaults ShowProgress="false" ShowNextButton="false"/>   		<Question Id="a9" Type="Text" Imperative="false" Hint="">		<Header>Во время просмотра Вы можете выделить понравившиеся и не понравившиеся моменты, [u]нажав и отпустив[/u] соответствующие кнопки под экраном с роликом.</Header>	  	<Ui Extend="MediaPlayer" Type="Video" Align="center" Src="@StoreUrl/s/a203/video/video.mp4,@StoreUrl/s/a203/video/video.webm,@StoreUrl/s/a203/video/video.ogv"  PauseEnable="1" ButtonLikeEnable="1" ButtonDislikeEnable="1" PlayAuto="1" PlayRedirect="1" SeekEnable="0"/>		  	<Answer Id="1" Text="Like" />		  	<Answer Id="2" Text="Dislike" />		</Question> 	</Page>		<Page Id="a9_1">		<Css Holder="l"/>		<Filter><![CDATA[return AnswerExists("s72","4");]]></Filter>		<Question Id="a9_1" Type="RadioButton">			<Header>А9.1. Как Вы думаете, как этот рекламный ролик [u]повлияет на Вашу покупку шоколада марки Karl Fazer[/u]?</Header>			<Ui Extend="ContentOnly" Cols="1"/>			<Answer Id="1"><Text>[div class="grad-scale5-1"]Точно перестану покупать шоколад марки Karl Fazer [/div]</Text></Answer>			<Answer Id="2"><Text>[div class="grad-scale5-2"]Скорее перестану покупать шоколад марки Karl Fazer [/div]</Text></Answer>			<Answer Id="3"><Text>[div class="grad-scale5-3"]Не уверен(а), продолжу ли покупать шоколад марки Karl Fazer[/div]</Text></Answer>			<Answer Id="4"><Text>[div class="grad-scale5-4"]Скорее продолжу покупать шоколад марки Karl Fazer[/div]</Text></Answer>			<Answer Id="5"><Text>[div class="grad-scale5-5"]Точно продолжу покупать шоколад марки Karl Fazer[/div]</Text></Answer>			</Question>		</Page>	 		<Page Id="a9_2">		<Css Holder="l"/>		<Filter><![CDATA[return !AnswerExists("s72","4");]]></Filter>		<Question Id="a9_2" Type="RadioButton">			<Header>А9.2. Как Вы думаете, как этот рекламный ролик [u]повлияет на Вашу покупку шоколада марки Karl Fazer[/u]?</Header>			<Ui Extend="ContentOnly" Cols="1"/>			<Answer Id="1"><Text>[div class="grad-scale5-1"]Точно НЕ буду пробовать шоколад марки Karl Fazer [/div]</Text></Answer>			<Answer Id="2"><Text>[div class="grad-scale5-2"]Скорее НЕ буду пробовать шоколад марки Karl Fazer [/div]</Text></Answer>			<Answer Id="3"><Text>[div class="grad-scale5-3"]Не уверен(а), буду ли пробовать шоколад марки Karl Fazer[/div]</Text></Answer>			<Answer Id="4"><Text>[div class="grad-scale5-4"]Скорее попробую шоколад марки Karl Fazer в ближайшее время[/div]</Text></Answer>			<Answer Id="5"><Text>[div class="grad-scale5-5"]Точно попробую шоколад марки Karl Fazer в ближайшее время[/div]</Text></Answer>			</Question>		</Page>	 		<Page Id="a10">		<Css Holder="l"/>		<Question Id="a10" Type="RadioButton">			<Header>A10. Насколько этот рекламный ролик [u]отличается от роликов[/u] других марок шоколада (кажется Вам уникальным, непохожим на другие)?</Header>			<Ui Extend="ContentOnly" Cols="1"/>			<Answer Id="1"><Text>[div class="grad-scale5-1"]Совсем НЕ отличается[/div]</Text></Answer>			<Answer Id="2"><Text>[div class="grad-scale5-2"]Скорее НЕ отличается[/div]</Text></Answer>			<Answer Id="3"><Text>[div class="grad-scale5-3"]Отчасти отличается, отчасти нет[/div]</Text></Answer>			<Answer Id="4"><Text>[div class="grad-scale5-4"]Скорее отличается[/div]</Text></Answer>			<Answer Id="5"><Text>[div class="grad-scale5-5"]Очень отличается[/div]</Text></Answer>			</Question>		</Page>		<Page Id="a11">		<Css Holder="l"/>		<Question Id="a11" Type="RadioButton">			<Header>A11. Как Вам кажется, насколько этот рекламный ролик[u] подходит марке Karl Fazer[/u]? </Header>			<Ui Extend="ContentOnly" Cols="1"/>			<Answer Id="1"><Text>[div class="grad-scale5-1"]Совершенно НЕ подходит[/div]</Text></Answer>			<Answer Id="2"><Text>[div class="grad-scale5-2"]Скорее НЕ подходит[/div]</Text></Answer>			<Answer Id="3"><Text>[div class="grad-scale5-3"]Отчасти подходит, отчасти нет[/div]</Text></Answer>			<Answer Id="4"><Text>[div class="grad-scale5-4"]Скорее подходит[/div]</Text></Answer>			<Answer Id="5"><Text>[div class="grad-scale5-5"]Полностью подходит[/div]</Text></Answer>			</Question>		</Page>				<Page Id="a12">		<Ui HeaderBuiltin="1"/>		<Question Id="a12" Type="RadioButton" Mix="true">			<Header>А12. Какое из этих слов лучше всего характеризует этот рекламный ролик?</Header>			<Ui Extend="ContentOnly" Cols="4"/>			<Answer Id="1"><Text>Приятный</Text></Answer>			<Answer Id="2"><Text>Интересный</Text></Answer>			<Answer Id="3"><Text>Скучный</Text></Answer>			<Answer Id="4"><Text>Раздражающий</Text></Answer>			</Question>			<Question Id="a13" Type="RadioButton" Mix="true">			<Filter Side="Client"><![CDATA[return AnswerExistsAny("a12","1,2,3,4");]]></Filter>			<Header>А13. А из этих?</Header>			<Ui Extend="ContentOnly" Cols="4"/>			<Answer Id="5"><Text>Умиротворяющий</Text></Answer>			<Answer Id="6"><Text>Выделяющийся</Text></Answer>			<Answer Id="7"><Text>Заурядный</Text></Answer>			<Answer Id="8"><Text>Неприятный</Text></Answer>			</Question>			<Question Id="a14" Type="RadioButton" Mix="true">			<Filter Side="Client"><![CDATA[return AnswerExistsAny("a12","1,2,3,4") && AnswerExistsAny("a13","5,6,7,8");]]></Filter>			<Header>А14. А из этих? </Header>			<Ui Extend="ContentOnly" Cols="4"/>			<Answer Id="9"><Text>Мягкий</Text></Answer>			<Answer Id="10"><Text>Захватывающий</Text></Answer>			<Answer Id="11"><Text>Слабый</Text></Answer>			<Answer Id="12"><Text>Вызывающий беспокойство</Text></Answer>		</Question>						</Page>		<List Id="a15list">		<Item Id="1"><Text>Герои</Text></Item>		<Item Id="2"><Text>Общая атмосфера, настроение ролика</Text></Item>		<Item Id="3"><Text>Сюжет </Text></Item>		<Item Id="4"><Text>Место действия</Text></Item>		<Item Id="5"><Text>Слоган (У вкуса есть имя. Karl Fazer)</Text></Item>		<Item Id="6"><Text>Изображение продукта</Text></Item>		<Item Id="7"><Text>Музыка</Text></Item>	</List>	<Page Id="a15">		<Repeat List="a15list">			<Question Id="a15_@ID" Type="RadioButton"><Text>@Text</Text></Question>		</Repeat>		<Question Id="a15d" Type="RadioButton" TextWidth="30" Visible="false" Union="$repeat(a15list){a15_@ID[,]}" UnionMix="true" Orientation="Horizontal">			<Header>А15. Оцените, пожалуйста, по 5-балльной шкале, насколько Вам понравились следующие[u] элементы [/u]ролика? </Header>			<Ui Extend="Ball" />			<Answer Id="1"><Text>1 - Совсем не понравилось</Text></Answer>			<Answer Id="2"><Text>2</Text></Answer>			<Answer Id="3"><Text>3</Text></Answer>			<Answer Id="4"><Text>4</Text></Answer>			<Answer Id="5"><Text>5 - Очень понравилось</Text></Answer>				<Answer Id="9"><Text>[font color="999999"]Затрудняюсь ответить[/font]</Text></Answer>			</Question>		</Page>			<List Id="a16list">		<Item Id="1"><Text>Марка, которой можно доверять</Text></Item>		<Item Id="2"><Text>Престижная марка</Text></Item>		<Item Id="3"><Text>Качественный продукт</Text></Item>		<Item Id="4"><Text>Вкусный продукт</Text></Item>		<Item Id="5"><Text>Современная марка</Text></Item>	</List>	<Page Id="a16">		<Repeat List="a16list">			<Question Id="a16_@ID" Type="RadioButton"><Text>@Text</Text></Question>		</Repeat>		<Question Id="a16d" Type="RadioButton" TextWidth="30" Visible="false" Union="$repeat(a16list){a16_@ID[,]}" UnionMix="true" Orientation="Horizontal">			<Header>А16. Посмотрите, пожалуйста, на высказывания других людей [u]о шоколаде марки[/u] Karl Fazer после того, как они увидели этот ролик. Насколько Вы согласны или не согласны с каждым из них? </Header>			<Ui Extend="Ball" />			<Answer Id="1"><Text>1 - Совершенно НЕ согласны</Text></Answer>			<Answer Id="2"><Text>2</Text></Answer>			<Answer Id="3"><Text>3</Text></Answer>			<Answer Id="4"><Text>4</Text></Answer>			<Answer Id="5"><Text>5 - Полностью согласны</Text></Answer>				<Answer Id="9"><Text>[font color="999999"]Затрудняюсь ответить[/font]</Text></Answer>			</Question>		</Page>			<Page Id="d1">		<Question Id="d1" Type="RadioButton">			<Header>В заключение несколько вопросов о Вас и Вашей семье для статистики.[br][br]D1. Скажите, пожалуйста, какое у Вас семейное положение?  </Header>			<Answer Id="1"><Text>Замужем / женат / живем вместе</Text></Answer>			<Answer Id="2"><Text>Не замужем / не женат, живу с родителями</Text></Answer>			<Answer Id="3"><Text>Не замужем / не женат, живу отдельно</Text></Answer>			<Answer Id="4"><Text>Разведен(а) / живем отдельно / вдова / вдовец</Text></Answer>			<Answer Id="9"><Text>Нет ответа</Text></Answer>		</Question>					<Question Id="d2" Type="RadioButton">			<Header>D2. Сколько всего человек в  Вашей семье, включая Вас (проживает вместе с Вами и ведут совместное хозяйство)? </Header>			<Ui Extend="ContentOnly" Cols="5"/>			<Answer Id="1"><Text>1</Text></Answer>			<Answer Id="2"><Text>2</Text></Answer>			<Answer Id="3"><Text>3</Text></Answer>			<Answer Id="4"><Text>4</Text></Answer>			<Answer Id="5"><Text>5+</Text></Answer>		</Question>				<Question Id="d3" Type="RadioButton">			<Filter Side="Client"><![CDATA[return AnswerExistsAny("d2","2,3,4,5");]]></Filter>			<Header>D3. Сколько в Вашей семье детей до 16 лет включительно (проживает вместе с Вами)? </Header>			<Ui Extend="ContentOnly" Cols="4"/>			<Answer Id="1"><Text>0</Text></Answer>			<Answer Id="2"><Text>1</Text></Answer>			<Answer Id="3"><Text>2</Text><Filter Side="Client"><![CDATA[return AnswerExistsAny("d2","3,4,5");]]></Filter></Answer>			<Answer Id="4"><Text>3+</Text><Filter Side="Client"><![CDATA[return AnswerExistsAny("d2","4,5");]]></Filter></Answer>		</Question>					<Question Id="d4" Type="RadioButton">			<Header>D4. Какое у Вас образование?</Header>			<Answer Id="1"><Text>Неполное среднее</Text></Answer>			<Answer Id="2"><Text>Среднее / среднее-специальное</Text></Answer>			<Answer Id="3"><Text>Неполное высшее</Text></Answer>			<Answer Id="4"><Text>Высшее / ученая степень</Text></Answer>			<Answer Id="9"><Text>Нет ответа</Text></Answer>		</Question>							<Question Id="d5" Type="RadioButton">			<Header>D5. В настоящее время Вы: </Header>			<Answer Id="1"><Text>Только учитесь</Text></Answer>			<Answer Id="2"><Text>Учитесь и работаете</Text></Answer>			<Answer Id="3"><Text>Только работаете</Text></Answer>			<Answer Id="4"><Text>Не учитесь и не работаете</Text></Answer>		</Question>			<Question Id="d6_0" Type="RadioButton">			<Filter><![CDATA[				return false;			]]></Filter>			<Header>D6. Какой у Вас род деятельности (Ваша должность)? </Header>			<Answer Id="9"><Text>Учащийся / студент</Text></Answer>			<Answer Id="98" Type="Text"><Text>Другое</Text></Answer>			<Answer Id="99"><Text>Нет ответа</Text></Answer>		</Question>				<Question Id="d6_1" Type="RadioButton">			<Filter Side="Client"><![CDATA[return AnswerExistsAny("d5","4");]]></Filter>			<Header>D6. Какой у Вас род деятельности (Ваша должность)? </Header>			<Answer Id="10"><Text>Домохозяйка, выполняю работу по дому</Text></Answer>			<Answer Id="11"><Text>Пенсионер</Text></Answer>			<Answer Id="12"><Text>Безработный (нет работы, но ищу работу)</Text></Answer>			<Answer Id="13"><Text>Нахожусь в декретном отпуске</Text></Answer>			<Answer Id="98" Type="Text"><Text>Другое</Text></Answer>			<Answer Id="99"><Text>Нет ответа</Text></Answer>		</Question>					<Question Id="d6_2" Type="RadioButton">			<Filter Side="Client"><![CDATA[return AnswerExistsAny("d5","2,3");]]></Filter>			<Header>D6. Какой у Вас род деятельности (Ваша должность)? </Header>			<Answer Id="1"><Text>Руководитель предприятия, организации</Text></Answer>			<Answer Id="2"><Text>Руководитель подразделения (отдела и т.д.)</Text></Answer>			<Answer Id="3"><Text>Специалист с высшим образованием </Text></Answer>			<Answer Id="4"><Text>Служащий без высшего образования</Text></Answer>			<Answer Id="5"><Text>Рабочий</Text></Answer>			<Answer Id="6"><Text>Технический или обслуживающий персонал</Text></Answer>			<Answer Id="7"><Text>Малый бизнес, индивидуальная трудовая деятельность</Text></Answer>			<Answer Id="8"><Text>Военнослужащий / пожарный / полицейский</Text></Answer>			<Answer Id="98" Type="Text"><Text>Другое</Text></Answer>			<Answer Id="99"><Text>Нет ответа</Text></Answer>		</Question>			<Question Id="d7" Type="RadioButton">			<Header>D7. К какой из следующих групп Ваша семья принадлежит по среднемесячному доходу на одного человека (сложите, пожалуйста, все зарплаты, стипендии, премии и другие доходы и поделите на количество человек в Вашей семье)? </Header>			<Answer Id="1"><Text>10 000 и менее рублей на члена семьи в месяц</Text></Answer>			<Answer Id="2"><Text>10 001 – 20 000 рублей</Text></Answer>			<Answer Id="3"><Text>20 001 – 30 000 рублей</Text></Answer>			<Answer Id="4"><Text>30 001 – 40 000 рублей</Text></Answer>			<Answer Id="5"><Text>40 001 – 50 000 рублей</Text></Answer>			<Answer Id="6"><Text>50 001 – 70 000 рублей</Text></Answer>			<Answer Id="7"><Text>70 001 – 90 000 рублей</Text></Answer>			<Answer Id="8"><Text>Более 90 000 рублей</Text></Answer>			<Answer Id="9"><Text>Затрудняюсь ответить / отказ</Text></Answer>		</Question>			<Redirect><![CDATA[		if (AnswerExists("d5","1")) AnswerUpdate("d6_0","9");			return false;	]]></Redirect>	<Redirect Status="18"/>	</Page></Survey>		';

	var xml = $.parseXML( xml_text ); 
	var XmlDoc = $( xml );

	createOdt(XmlDoc, "Example");
}
//=========================================================================================
 //start function
function createOdt(XmlDoc, fileName)
{
	var zip = new JSZip();	//create zip file
	additionalFileGenerate (zip);//create META-INF,meta.xml,mimetype and style.xml files

	var contentStyle = TextStyleGenerate (); //generate head and styles

	contentStyle += '<office:body>' + 
					'<office:text text:use-soft-page-breaks="true">';

	var odt = { };
	odt.PageOrientation = '';
	odt.content = '';

	createWord(odt, XmlDoc);//create odt content

	odt.content = raplaceSpecialSymbolAndTag(odt); //replace &, [br] and other symbol and tags

	odt.content = contentStyle + odt.content; //merge strings

	AddImgFiles(odt, zip, fileName);	 // replace img files on images
}

//=========================================================================================
//function addition images
function AddImgFiles(odt, zip, fileName)
{
	var imglinks = [];	//links arrow
	var j = 1; //img index

	while (odt.content.indexOf('[img') != -1)
	{
		//Search img strings
		var value ='';
		value = odt.content.substring(odt.content.indexOf('[img'),odt.content.indexOf(']',odt.content.indexOf('[img'))+1);
			
		var src = value.substring(value.indexOf('\'',value.indexOf('src'))+1,value.indexOf('\'',value.indexOf('\'',value.indexOf('src'))+1)) || value.substring(value.indexOf('\"',value.indexOf('src'))+1,value.indexOf('\"',value.indexOf('\"',value.indexOf('src'))+1));
	
		imglinks[j] = { //add in arrow
			start: odt.content.indexOf('[img'),
			src: src,
			width: -1,
			height: -1};
	
		//remove img string
		odt.content = odt.content.substring(0 , odt.content.indexOf('[img')) + odt.content.substring(odt.content.indexOf(']',odt.content.indexOf('[img')) + 1, odt.content.length);
		j++;
	}

	if (imglinks.length != 0)
	{ //srart download images
		for (var i = 1; i < imglinks.length; i++)
			LoadImg( imglinks, odt, i, zip, fileName);
	}
	else
	{
		endCreate(imglinks, odt, zip, fileName);
	}
}

//=========================================================================================
//function download image files
function LoadImg(imglinks, odt, i, fileName)
{
	var img = new Image();

	img.onload = function()	{
		imglinks[i].width = this.width;
		imglinks[i].height = this.height;
	
		endCreate(imglinks, odt, zip, fileName );//after load finish sorting
	};
	img.onerror = function() {
		imglinks[i].width = 0;
		imglinks[i].height = 0;
	
		imglinks.splice(i,1);//remote error link
	
		endCreate(imglinks, odt, zip, fileName );//after load finish sorting
	};

	img.src = imglinks[i].src;
}

//=========================================================================================
// Writting img in file and unloading 
function endCreate(imglinks, odt, zip, fileName)
{
	var allimgwasload = true;
	for(var i = 1; i < imglinks.length; i++)
	{
		if(imglinks[i].width == -1)
			allimgwasload = false;
	}

	if(allimgwasload)
	{
		for( var i = (imglinks.length - 1); i > 0 ; i--)//writting size
		{
			if ((Math.floor(imglinks[i].width * 100) / 10000) > 7)
			{
				imglinks[i].height = Math.floor((imglinks[i].height/( imglinks[i].width/7))*10000)/10000;
				imglinks[i].width = 7;
			}
			else
			{
				imglinks[i].width = (Math.floor(imglinks[i].width*100)/10000);
				imglinks[i].height = (Math.floor(imglinks[i].height*100)/10000);
			}
			//writtin img container
			odt.content = odt.content.substring(0 , imglinks[i].start ) + '<draw:frame draw:style-name="a0" draw:name="Picture ' + i + '" text:anchor-type="as-char" svg:width="' + imglinks[i].width + 'in" svg:height="' + imglinks[i].height +'in" svg:x="0in" svg:y="0in" style:rel-width="scale" style:rel-height="scale"> <draw:image xlink:href="' + imglinks[i].src + '" xlink:type="simple" xlink:show="embed" xlink:actuate="onLoad"/> <svg:title/> <svg:desc/> </draw:frame>' + odt.content.substring(imglinks[i].start , odt.content.length); 
		}

		odt.content += '</office:text></office:body></office:document-content>';
		zip.file("content.xml", odt.content );
		zip.generateAsync({type:"blob"}).then(function(content) {
			saveAs(content, fileName + ".odt");	// FileSaver.js
		});
	}}

//=========================================================================================
//replace special symbols and tags
function raplaceSpecialSymbolAndTag(odt)
{
	var t;
	t = odt.content.replace(/&nbsp;/g," ");
	t = t.replace(/<o:p>/g," ");
	t = t.replace(/<\/o:p>/g," ");
	t = t.replace(/&/g,"♥");
	t = t.replace(/♥/g,"&amp;");
	t = t.replace(/\n/g,"");
	t = t.replace(/\r/g,"");
	t = t.replace(/\[br\]\[center\]/g,"[center]");
	t = t.replace(/\[br\]/g,"<text:line-break/>");
	t = t.replace(/\[u\]/g,'<text:span text:style-name="Tu">');
	t = t.replace(/\[\/u\]/g,'</text:span>');
	t = t.replace(/\[center\]/g,'</text:p><text:p text:style-name="P6c">');

	t = t.replace(/@StoreUrl/g, 'http://storage.survstat.ru/Content');

	while(t.indexOf('[center') != -1 )
		t = t.substring(0  ,t.indexOf('[center')) + '</text:p><text:p text:style-name="P6c">' + t.substring(t.indexOf(']',t.indexOf('[center')) + 1, t.length);
	while(t.indexOf('[') != -1 ){
		var f_i = t.indexOf('[');
		var l_i = t.indexOf(']',f_i);
		if(l_i != -1)
			t = t.substring(0, f_i) + t.substring(l_i + 1, t.length);
		else
			t = t.substring(0, f_i) + t.substring(f_i + 1, t.length);			
	}

	return t;
}

//=========================================================================================
//parsing xml
function createWord(odt, XmlDoc) {
	odt.content = '';

	var page_node;
	var survey_node = XmlDoc.find('Survey');
	var page_nodes = survey_node.children('Page')
	for (var i = 0; i < page_nodes.length; i++)
	{
		page_node = page_nodes.eq(i);
		var filter = page_node.children('Filter'); //searching Filter in page
		var repeat = page_node.find('Repeat');	//searching repeat in page
		if (filter.length != 0 || repeat.length != 0)	//check on Filters and Repeats tegs
		{
			if (repeat.length == 0)
			{
				if (filter[0].innerHTML != 'false;')
					wordPage(odt, page_node);
			}
		}
		else
		{
			wordPage(odt, page_node);
		}
	}
}

//=========================================================================================
// getting attributes pages and questions
function GetAllAtr(node)
{
	var returnstring = '';
	var value = '';

	value = node.attr('Reverse') || '';
	if(value != '')
		returnstring += 'Reverse = ' + value + ' ; ';

	value = node.attr('Mix') || '';
	if(value != '')
		returnstring += 'Mix = ' + value + ' ; ';

	value = node.attr('TextWidth') || '';
	if(value != '')
		returnstring += 'TextWidth = ' + value + ' ; ';

	value = node.attr('Imperative') || '';
	if(value != '')
		returnstring += 'Imperative = ' + value + ' ; ';

	value = node.attr('End') || '';
	if(value != '')
		returnstring += 'End = ' + value + ' ; ';

	value = node.attr('ButtonTimeout') || '';
	if(value != '')
		returnstring += 'BT = ' + value + ' ;';

	value = node.attr('PostbackTimeout') || '';
	if(value != '')
		returnstring += 'PT = ' + value + ' ;';

	return returnstring ;
}

//=========================================================================================
// making Headers and top - bot footers
function wordPage(odt, page_node)
{
	var question_nodes = page_node.children('Question');
	var answer_collection = [];
	var answer_nodes = [];
	var union_nodes = [];
	var question_node;
	var settingstring = '';
	var unionquestions = '';
	var collcount = 0;

	var newcollcount = 0;
	for (var i = 0; i < question_nodes.length; i++)
	{
		if (question_nodes.eq(i).children != 0)
		{
			if ( (question_nodes.eq(i)).attr('Orientation') == 'Horizontal')
				newcollcount = question_nodes.eq(i).children('Answer').length + 2;
			else
			{
				unionquestions = (question_nodes.eq(i)).attr('Union') || '';
				if (unionquestions != '')
				{
					unionquestions = unionquestions.split(',');
					newcollcount = 3 + unionquestions.length;
					if ( (question_nodes.eq(i)).attr('Visible') == 'False')
						newcollcount = newcollcount - 1;
				}
				else
				{
					newcollcount = 2;
				}
			}
		}
		if(newcollcount > collcount)
			collcount = newcollcount;
	}

	if (collcount > 7 && odt.PageOrientation != 'g')	// actually page orientation
	{
		odt.PageOrientation = 'g';
		odt.content += '<text:p text:style-name="Pmg"/>';
	}
	else if (collcount < 8 && odt.PageOrientation != 'v')
	{
		odt.PageOrientation = 'v';
		odt.content += '<text:p text:style-name="Pmv"/>';
	}

	var value = page_node.attr('Id');	//id
	var note = page_node.attr('Note') || '';	//page header
	if (note != '')
		value += ". " + note;

	odt.content += '<text:p text:style-name="P1">' + value + '</text:p>';

	value = page_node.attr('Header') || '';
	if (value != '')
		odt.content += '<text:p text:style-name="P1s">' + value + '</text:p>';

	//parse question
	for (var i = 0; i < question_nodes.length; i++)
	{
		question_node = question_nodes.eq(i);

		answer_collection = question_node.children('Answer');
		if (answer_collection.length != 0)
		{
			for (var j = 0; j < answer_collection.length; j++)
				answer_nodes.push(answer_collection.eq(j));
		
			unionquestions = question_node.attr('Union') || '';
			if (unionquestions != '')
			{
				unionquestions = unionquestions.split(',');
				union_nodes = [];
				for (var f = 0; f < unionquestions.length; f++)
				{
					for (var l = 0; l < question_nodes.length; l++)
					{
						if ((question_nodes.eq(l)).attr('Id') == unionquestions[f])
							union_nodes.push(question_nodes.eq(l));
					}
				}
			}
			else
			{
				union_nodes.push(question_node);
			}

			wordQuestion(odt, question_node, union_nodes, answer_nodes, collcount);
			union_nodes = [];
			answer_nodes = [];
		
			settingstring = GetAllAtr(question_node);//getting attributes from questions
		}   
	}

	if(GetAllAtr(page_node) != '' || settingstring != '')//getting attributes from page and writting
		odt.content += '<text:p text:style-name="Pul">{' + GetAllAtr(page_node) + ' ' + settingstring + '}</text:p>';
	 
	 //toolfooter
	value = page_node.attr('Notice') || '';
	if(value != '')
		odt.content += '<text:p text:style-name="P1s">' + value + '</text:p>';

	odt.content += '<text:p text:style-name="P3"></text:p>';
}

//=========================================================================================
//writting header and launch next function
function wordQuestion(odt, question_node, union_nodes, answer_nodes, collcount)
{
	collcount = union_nodes.length + 2;
	if (question_node.attr('Orientation') == 'Horizontal')
		collcount = answer_nodes.length + 2;

	//write question iq and header
	var value =  '<text:p text:style-name="P2"><text:span text:style-name="Tb">' + question_node.attr('Id') + '. </text:span>' ;

	var Note = question_node.attr('Note') || '';
	if (Note != '')
		value +=  '<text:span text:style-name="Tg">' + Note +  '. </text:span></text:p><text:p text:style-name="P2">';

	var header = question_node.attr('Header') || '';
	if (header != '')
		value +=  header;

	odt.content += value + '</text:p>';
	
	// hint
	value = question_node.attr('Hint') || '';
	if (value != '')
		odt.content += '<text:p text:style-name="P2s">' + value + '</text:p>';

	//Search ui nodes and launch writte questions and answers
	var ui_nodes = question_node.children('Ui[Extend]');
	if (ui_nodes.length == 0)
		wordQuestionTable(odt, question_node, union_nodes, answer_nodes, collcount);
	else
	{
		var ui_node = ui_nodes.eq(0);
		var ui_node_extend = ui_node.attr('Extend');
	   
		if (ui_node_extend)
			ui_node_extend = ui_node_extend.toLowerCase();

		//ui node
		if (ui_node_extend == 'slider')
			wordQuestionSlider(odt, union_nodes, answer_nodes, ui_node, collcount); 
		else if (ui_node_extend == 'dragitem')
			wordQuestionDragItem(odt, union_nodes, answer_nodes, ui_node, collcount);
		else if (ui_node_extend == 'contentonly')
			wordQuestionContentOnly(odt, union_nodes, answer_nodes, ui_node, collcount);
		else if (ui_node_extend == 'clickpoint')
			wordQuestionClickPoint(odt, union_nodes, answer_nodes, ui_node, collcount);
		else if (ui_node_extend == 'mediaplayer')
		   wordQuestionMediaPlayer(odt, union_nodes, answer_nodes, ui_node);
	}
}

//=========================================================================================
//question type
function QuestionType(node){
	var name = node[0].nodeName;
	if (name == 'Question') {
		question_type = node.attr('Type') || '';
		if (question_type)
			question_type = question_type.toLowerCase();
		if (question_type == 'radiobutton')
			return '<text:s text:c="3"/> ⃝';
		else if (question_type == 'checkbox')
			return '<text:s text:c="3"/> ⃞';
		else if (question_type == 'text' || question_type == 'memo')
			return 'Abc...';
		else if (question_type == 'number' || question_type == 'integer')
			return '123...';
		else if (question_type == 'date')
			return 'dd.mm.yy';
		else
			return '';
	}
}

//=========================================================================================
function wordQuestionTable(odt, question_node, question_nodes, answer_nodes, collcount)
{
	var col_node;
	var row_node;
	var col_nodes = question_nodes;
	var row_nodes = answer_nodes;
	var textwidth = question_node.attr('TextWidth') || '';

	// Orientation
	var orientation = question_node.attr('Orientation') || '';
	if (orientation == 'Horizontal')
	{
		col_nodes = answer_nodes;
		row_nodes = question_nodes;
	}

	// question table
	if(odt.PageOrientation == 'v')
		odt.content += '<table:table table:style-name="Table1"><table:table-columns>';
	if(odt.PageOrientation == 'g')
		odt.content += '<table:table table:style-name="Table2"><table:table-columns>';
	for (var i = 0 ; i < collcount - 1; i++)
	{
		//columns width
		if( textwidth < 15 && textwidth != 0 && i == 0)
			odt.content += '<table:table-column table:style-name="TableColumn1"/>';
		else if( textwidth > 75 && textwidth != 0 && i == 0)
			odt.content += '<table:table-column table:style-name="TableColumnBig"/>';
		else if( textwidth > 75 && textwidth != 0 && i > 0)
			odt.content += '<table:table-column table:style-name="TableColumn7"/>';
		else
			odt.content += '<table:table-column table:style-name="TableColumn' + collcount + '"/>';
	}
	odt.content += '<table:table-column table:style-name="TableColumn1"/></table:table-columns>';

	//Questions Id
	odt.content += '<table:table-row table:style-name="TableRow1">' + 
				   '<table:table-cell table:style-name="TableCell1">' +
				   '<text:p text:style-name="Pg"></text:p></table:table-cell>';

	var value;
	for (var i = 0; i < col_nodes.length; i++) {
		col_node = col_nodes[i];
		value = col_node.attr('Id');
		if (value)
			odt.content += '<table:table-cell table:style-name="TableCell1"><text:p text:style-name="Pg">' + value + '</text:p></table:table-cell>';
	}	

	odt.content += '<table:table-cell table:style-name="TableCell1"><text:p text:style-name="Pg">' +
				   '</text:p></table:table-cell></table:table-row>';
		
	//headlines exist
	var AnswerExists = false;
	for (var i = 0; i < col_nodes.length; i++)
	{
		col_node = col_nodes[i];
		value = col_node.attr('Text') || '';
		if(value != '')
			AnswerExists = true;
	}

	//headlines
	if (AnswerExists)
	{
		odt.content += '<table:table-row table:style-name="TableRow1">';
		odt.content += '<table:table-cell table:style-name="TableCellBR"><text:p text:style-name="P6c"></text:p></table:table-cell>';
		for (var i = 0; i < col_nodes.length; i++)
		{
			col_node = col_nodes[i];
			value = col_node.attr('Text') || '';
			if(value != '')
				odt.content += '<table:table-cell table:style-name="TableCellBLRg"><text:p text:style-name="P6c">' + value + '</text:p></table:table-cell>';
			else
				odt.content += '<table:table-cell table:style-name="TableCellBLRg"><text:p text:style-name="P6a">Answer ' + (i + 1) + '</text:p></table:table-cell>';
		}
		odt.content += '<table:table-cell table:style-name="TableCellBL"><text:p text:style-name="Pgr">' +
					   '</text:p></table:table-cell></table:table-row>';
	}

	for (var i = 0; i < row_nodes.length; i++)
	{
		//rows
		var cellstyle = 'TB';
		if(i == (row_nodes.length - 1))
			cellstyle = 'T';
		else if( i == 0 && AnswerExists == false)
			cellstyle = 'B';
		if( row_nodes.length == 1)
			cellstyle = '';
	
		row_node = row_nodes[i];
		odt.content += '<table:table-row table:style-name="TableRow1">';

		var input_letter = QuestionType(row_node)
		value = row_node.attr('Text') || '';
	
		if (value != '')//rows name
			odt.content += '<table:table-cell table:style-name="TableCell' + cellstyle + 'R">' +
						   '<text:p text:style-name="P6l">' + value + '</text:p></table:table-cell>';
		else
			odt.content += '<table:table-cell table:style-name="TableCell' + cellstyle + 'R">' +
						   '<text:p text:style-name="P6a"></text:p></table:table-cell>';

		for (var j = 0; j < col_nodes.length; j++) {
			input_letter = QuestionType(col_nodes[j]) || input_letter; //question type 
			odt.content += '<table:table-cell table:style-name="TableCell' + cellstyle + 'LR"><text:p text:style-name="P6a">' + 
						   input_letter + '</text:p></table:table-cell>';
		}
	
		value = row_node.attr('Id');//rows id
		odt.content += '<table:table-cell table:style-name="TableCell' + cellstyle + 'L">' +
					   '<text:p text:style-name="Pgr">' + value + '</text:p></table:table-cell></table:table-row>';
	}		
	odt.content += '</table:table><text:p text:style-name="Pgr"></text:p>';
}

//=========================================================================================
function wordQuestionSlider(odt, question_nodes, answer_nodes, ui_node, collcount)
{
	var question_node = '';
	var left_text = '';
	var right_text = '';

	collcount = collcount - 2;// columns count
	odt.content += '<table:table table:style-name="TableNoSize"><table:table-columns><table:table-column table:style-name="TableColumnS"/><table:table-column table:style-name="TableColumnS"/>';

	//create table
	for( var i = 0 ; i < collcount; i++)
		odt.content += '<table:table-column table:style-name="TableColumnS' + collcount + '"/><table:table-column table:style-name="TableColumnS' + collcount + '"/>';
	//colls width
	odt.content += '<table:table-column table:style-name="TableColumnS"/><table:table-column table:style-name="TableColumnS"/>' +
				   '</table:table-columns><table:table-row table:style-name="TableRow1">' +
				   '<table:table-cell table:style-name="TableCellN"><text:p text:style-name="P6c"></text:p></table:table-cell>' +
				   '<table:table-cell table:style-name="TableCellN"><text:p text:style-name="P6c"></text:p></table:table-cell>';

	//answers id and name
	for( var i = 0; i < collcount; i++)	{
		value = answer_nodes[i].attr('Text') || '';
		answer_id =	answer_nodes[i].attr('Id');
		odt.content += '<table:table-cell table:style-name="TableCellN" table:number-columns-spanned="2"><text:p text:style-name="Pg">' 
					+ answer_id + '</text:p><text:p text:style-name="P6c">' + value + '</text:p></table:table-cell><table:covered-table-cell/>';
	}

	odt.content += '<table:table-cell table:style-name="TableCellN"><text:p text:style-name="P6c">' +
				   '</text:p></table:table-cell><table:table-cell table:style-name="TableCellN"><text:p text:style-name="P6c">' +
				   '</text:p></table:table-cell></table:table-row>';

	for (var f = 0 ; f < question_nodes.length ; f++)
	{
		question_node = question_nodes[f];
		left_text = question_node.attr('Text') || '';
		right_text = question_node.attr('EndText') || '';

		//slider drawing
		odt.content += '<table:table-row table:style-name="TableRowS"><table:table-cell table:style-name="TableCellNtop" ' +
					   'table:number-columns-spanned="3" table:number-rows-spanned="4"><text:p text:style-name="P6c">' + left_text + 
					   '</text:p></table:table-cell><table:covered-table-cell/><table:covered-table-cell/>';

		for (var i = 1; i < collcount; i++)
		{
			odt.content += '<table:table-cell table:style-name="TableCellN"><text:p text:style-name="Pgs"/></table:table-cell>' +
						   '<table:table-cell table:style-name="TableCellN"><text:p text:style-name="Pg"/></table:table-cell>';
		}
		odt.content += '<table:table-cell table:style-name="TableCellNtop" table:number-columns-spanned="3" table:number-rows-spanned="4">' +
					   '<text:p text:style-name="P6c">' + right_text + '</text:p></table:table-cell><table:covered-table-cell/><table:covered-table-cell/></table:table-row>';

		//slider creation
		for (var j = 0 ; j < 3; j++)
		{
			odt.content += '<table:table-row table:style-name="TableRowS"><table:covered-table-cell><text:p text:style-name="Pgs"/>' +
						   '</table:covered-table-cell><table:covered-table-cell/><table:covered-table-cell/>';

			//differ style for each row
			for( var i = 1; i < collcount; i++)
			{
				if (j == 0)
				{
					odt.content += '<table:table-cell table:style-name="TableCellSLB"><text:p text:style-name="Pgs"/></table:table-cell>' +
								   '<table:table-cell table:style-name="TableCellSBR"><text:p text:style-name="Pgs"/></table:table-cell>';
				}
				else if (j == 1)
				{
					odt.content += '<table:table-cell table:style-name="TableCellSLT"><text:p text:style-name="Pgs"/></table:table-cell>' +
								   '<table:table-cell table:style-name="TableCellSTR"><text:p text:style-name="Pgs"/></table:table-cell>';
				}
				else
				{
					odt.content += '<table:table-cell table:style-name="TableCellN"><text:p text:style-name="Pg"/></table:table-cell>' +
								   '<table:table-cell table:style-name="TableCellN"><text:p text:style-name="Pg"/></table:table-cell>';
				}
			}
			//closing cells
			odt.content += '<table:covered-table-cell/><table:covered-table-cell/><table:covered-table-cell/></table:table-row>';
		}
	}
	odt.content += '</table:table><text:p text:style-name="Pgr"></text:p>';
}

//=========================================================================================
function wordQuestionDragItem(odt, union_nodes, answer_nodes, ui_node, collcount)
{
	collcount = union_nodes.length;	//columns count
	if (union_nodes[union_nodes.length - 1].attr('Visible') == 'False')
		collcount = union_nodes.length - 1;

	odt.content += '<table:table table:style-name="TableNoSize"><table:table-columns>';//draw questions table
	for( var i = 0 ; i < collcount; i++)
		odt.content += '<table:table-column table:style-name="TableColumn1"/>';
	odt.content += '</table:table-columns><table:table-row table:style-name="TableRow1">';

	var value =	'';
	var answer_id =	'';

	for (var i = 0; i < collcount; i++)
	{
		value = union_nodes[i].attr('Text') || '';
		answer_id =	union_nodes[i].attr('Id');
		odt.content += '<table:table-cell table:style-name="TableCellTBLR"><text:p text:style-name="Pg">' + answer_id + 
					   '</text:p><text:p text:style-name="P6c">' + value + '</text:p></table:table-cell>';
	}
	odt.content += '</table:table-row></table:table><text:p text:style-name="Pg"/>';


	collcount = answer_nodes.length;
	odt.content += '<table:table table:style-name="Table1"><table:table-columns><table:table-column table:style-name="TableColumnDI' + collcount + '"/>';

	for( var i = 1 ; i < collcount; i++)
		odt.content += '<table:table-column table:style-name="TableColumn1"/><table:table-column table:style-name="TableColumnDI' + collcount + '"/>';

	odt.content += '</table:table-columns><table:table-row table:style-name="TableRow1">';

	//draw answers table
	value = answer_nodes[0].attr('Text') || '';
	answer_id =	answer_nodes[0].attr('Id');
	odt.content += '<table:table-cell table:style-name="TableCellN"><text:p text:style-name="Pg">' + answer_id + 
				   '</text:p><text:p text:style-name="P6c">' + value + '</text:p></table:table-cell>';

	for (var i = 1; i < collcount; i++)
	{
		value = answer_nodes[i].attr('Text') || '';
		answer_id =	answer_nodes[i].attr('Id');
		odt.content += '<table:table-cell table:style-name="TableCellN"></table:table-cell><table:table-cell table:style-name="TableCellN">' +
					   '<text:p text:style-name="Pg">' + answer_id + '</text:p><text:p text:style-name="P6c">' + value + '</text:p></table:table-cell>';
	}

	odt.content += '</table:table-row><table:table-row table:style-name="TableRowDI"><table:table-cell table:style-name="TableCellTBLR">' +
				   '<text:p text:style-name="P6c"></text:p></table:table-cell>';

	for (var i = 1; i < collcount; i++)
	{
		value = answer_nodes[i].attr('Text') || '';
		odt.content += '<table:table-cell table:style-name="TableCellN"></table:table-cell><table:table-cell table:style-name="TableCellTBLR">' +
					   '<text:p text:style-name="P6c"></text:p></table:table-cell>';
	}

	odt.content += '</table:table-row></table:table><text:p text:style-name="Pgr"></text:p>';
}

//=========================================================================================
//ui content only
function wordQuestionContentOnly(odt, union_nodes, answer_nodes, ui_node)
{
	collcount = 4;// default cols count
	var value = ui_node.attr('Cols') || '';
	if (value != '')
		collcount = value;// real cols count

	odt.content += '<table:table table:style-name="TableNoSize"><table:table-columns>';//draw table column

	for( var i = 0 ; i < collcount; i++)
		odt.content += '<table:table-column table:style-name="TableColumnCO' + collcount + '"/>';

	odt.content += '</table:table-columns>';

	//genarate rows
	for (var i = 0; i < Math.round(answer_nodes.length / collcount) ; i++)
	{
		odt.content += '<table:table-row table:style-name="TableRow1">';
		var dev = collcount;
		if( ( i + 1 ) * collcount > answer_nodes.length)
			dev = answer_nodes.length - i * collcount;

		for (var j = 0; j < dev; j++)
		{
			value = answer_nodes[i * collcount + j].attr('Text') || '';//answer id
			var answer_id = answer_nodes[ i * collcount + j ].attr('Id');// with answer 'text'
			odt.content += '<table:table-cell table:style-name="TableCellTBLR"><text:p text:style-name="Pg">' + answer_id + 
						   '</text:p><text:p text:style-name="P6c">' + value + '</text:p></table:table-cell>';
		}
		odt.content += '</table:table-row>';
	}
	odt.content += '</table:table>';
}

//=========================================================================================
//ui click point
function wordQuestionClickPoint(odt, union_nodes, answer_nodes, ui_node, collcount)
{
	var value = ui_node.attr('ClickPointImage') || '';
	var answer_id = '';
	//draw img
	odt.content += '<text:p text:style-name="P6c"> \[img src=\'' + value + '\']</text:p><text:p text:style-name="Pg"></text:p>';

	collcount = answer_nodes.length;

	//answer cell
	odt.content += '<table:table table:style-name="TableNoSize"><table:table-columns>';	
	for( var i = 0 ; i < collcount; i++)
		odt.content += '<table:table-column table:style-name="TableColumn1"/>';
	odt.content += '</table:table-columns>';

	odt.content += '<table:table-row table:style-name="TableRow1">';

	for (var i = 0; i < collcount ; i++)
	{
		value = answer_nodes[i].attr('Text') || '';
		answer_id =	answer_nodes[i].attr('Id');
		if (ui_node.attr('ClickPointBack') == 'Green' )// green/red/blue cell style
			odt.content += '<table:table-cell table:style-name="TableCellGC"><text:p text:style-name="Pgw">' + answer_id + 
						   '</text:p><text:p text:style-name="P6w">' + value + '</text:p></table:table-cell>';
		else if (ui_node.attr('ClickPointBack') == 'Blue' )
			odt.content += '<table:table-cell table:style-name="TableCellBC"><text:p text:style-name="Pgw">' + answer_id + 
						   '</text:p><text:p text:style-name="P6w">' + value + '</text:p></table:table-cell>';
		else 
			odt.content += '<table:table-cell table:style-name="TableCellRC"><text:p text:style-name="Pgw">' + answer_id + 
						   '</text:p><text:p text:style-name="P6w">' + value + '</text:p></table:table-cell>';	   
	}

	odt.content += '</table:table-row></table:table>';
}

//=========================================================================================
//ui media player
function wordQuestionMediaPlayer(odt, union_nodes, answer_nodes, ui_node)
{
	var value = ui_node.attr('Src') || '';
	var arr = value.split(',');
	value = '';
	for(var i = 0 ; i < arr.length ; i++){
		value += ';[br]src = <text:a xlink:href="' + arr[i] + '" office:target-frame-name="_top" xlink:show="replace">' + arr[i] + '"</text:a>';
	}//draw gray table and parse paths 
	odt.content += '<table:table table:style-name="TableNoSize"><table:table-columns><table:table-column table:style-name="TableColumnUnsize"/>' +
				   '</table:table-columns><table:table-row table:style-name="TableRowBig"><table:table-cell table:style-name="TableCellTBLRb">' +
				   '<text:p text:style-name="P6w">MediaPlayer' + value + '</text:p></table:table-cell></table:table-row></table:table>';
}

//=========================================================================================
function TextStyleGenerate()
{
	var s = '';

	s+= '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n' + 
		'<office:document-content xmlns:anim="urn:oasis:names:tc:opendocument:xmlns:animation:1.0" xmlns:chart="urn:oasis:names:tc:opendocument:xmlns:chart:1.0" xmlns:config="urn:oasis:names:tc:opendocument:xmlns:config:1.0" xmlns:db="urn:oasis:names:tc:opendocument:xmlns:database:1.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dr3d="urn:oasis:names:tc:opendocument:xmlns:dr3d:1.0" xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" xmlns:form="urn:oasis:names:tc:opendocument:xmlns:form:1.0" xmlns:grddl="http://www.w3.org/2003/g/data-view#" xmlns:math="http://www.w3.org/1998/Math/MathML" xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" xmlns:number="urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0" xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:presentation="urn:oasis:names:tc:opendocument:xmlns:presentation:1.0" xmlns:script="urn:oasis:names:tc:opendocument:xmlns:script:1.0" xmlns:smil="urn:oasis:names:tc:opendocument:xmlns:smil-compatible:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:xforms="http://www.w3.org/2002/xforms" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink" office:version="1.2">' +
		'<office:font-face-decls>' +
		'<style:font-face style:name="Calibri" svg:font-family="Calibri" style:font-family-generic="swiss" style:font-pitch="variable" svg:panose-1="2 15 5 2 2 2 4 3 2 4"/>' +
		'<style:font-face style:name="Times New Roman" svg:font-family="Times New Roman" style:font-family-generic="roman" style:font-pitch="variable" svg:panose-1="2 2 6 3 5 4 5 2 3 4"/>' +
		'<style:font-face style:name="Calibri Light" svg:font-family="Calibri Light" style:font-family-generic="swiss" style:font-pitch="variable" svg:panose-1="2 15 3 2 2 2 4 3 2 4"/>' +
		'<style:font-face style:name="Cambria Math" svg:font-family="Cambria Math" style:font-family-generic="roman" style:font-pitch="variable" svg:panose-1="2 4 5 3 5 4 6 3 2 4"/>' +
		'</office:font-face-decls>' +
		'<office:automatic-styles>';

	//general paragraf style
	s+= '<style:style style:name="Pmv" style:parent-style-name="Normal" style:master-page-name="MPv" style:family="paragraph">' +
		'<style:paragraph-properties fo:margin-top="0.25in" fo:margin-bottom="0in" fo:line-height="100%"/>' +
		'<style:text-properties  fo:color="#B8B8B8" fo:font-size="9pt" style:font-size-asian="9pt" style:font-size-complex="9pt" fo:language="en" fo:country="US"/>' +
		'</style:style>';

	s+= '<style:style style:name="Pmg" style:parent-style-name="Normal" style:master-page-name="MPg" style:family="paragraph">' +
		'<style:paragraph-properties fo:margin-top="0in" fo:margin-bottom="0in" fo:line-height="100%"/>' +
		'<style:text-properties  fo:color="#B8B8B8" fo:font-size="9pt" style:font-size-asian="9pt" style:font-size-complex="9pt" fo:language="en" fo:country="US"/>' +
		'</style:style>';

	//Big header text
	s+= '<style:style style:name="P1" style:parent-style-name="Normal" style:family="paragraph">' +
		'<style:paragraph-properties  fo:keep-with-next="always" fo:keep-together="always" fo:border-top="0.0069in solid #A6A6A6" fo:border-left="none" fo:border-bottom="none" fo:border-right="none" fo:padding="0in" style:shadow="none" fo:margin-bottom="0in" fo:background-color="#F2F2F2"/>' +
		'<style:text-properties fo:font-style="italic" style:font-style-asian="italic" fo:color="#000000" fo:font-size="14pt" style:font-size-asian="14pt" style:font-size-complex="14pt" fo:language="en" fo:country="US"/>' +
		'</style:style>';

	s+= '<style:style style:name="P1s" style:parent-style-name="Normal" style:family="paragraph">' +
		'<style:paragraph-properties fo:text-align="left" fo:keep-with-next="always" fo:keep-together="always" fo:margin-top="0.06in" fo:margin-bottom="0.06in" fo:line-height="100%"/>' +
		'<style:text-properties  fo:font-style="italic" style:font-style-asian="italic" fo:font-size="14pt" style:font-size-asian="14pt" style:font-size-complex="14pt"/>' +
		'</style:style>';

	s+= '<style:style style:name="P2" style:parent-style-name="DefaultParagraphFont" style:family="text">' +
		'<style:paragraph-properties fo:text-align="left" fo:keep-with-next="always" fo:keep-together="always" fo:margin-top="0.06in" fo:margin-bottom="0.06in" fo:line-height="100%"/>' +
		'<style:text-properties fo:font-size="15pt" style:font-size-asian="15pt" style:font-size-complex="15pt"/>' +
		'</style:style>';

	s+= '<style:style style:name="P3" style:parent-style-name="DefaultParagraphFont" style:family="text">' +
		'<style:paragraph-properties fo:text-align="left" fo:margin-top="0.06in" fo:margin-bottom="0.06in" fo:line-height="100%"/>' +
		'<style:text-properties fo:font-size="15pt" style:font-size-asian="15pt" style:font-size-complex="15pt"/>' +
		'</style:style>';

	//text style
	s+= '<style:style style:name="Tb">' +
		'<style:text-properties fo:font-weight="bold" style:font-weight-asian="bold" />' +
		'</style:style>';

	s+= '<style:style style:name="Tg">' +
		'<style:text-properties fo:color="#AAAAAA"/>' +
		'</style:style>';

	s+= '<style:style style:name="Tu" >' +
		'<style:text-properties fo:color="#0b66b5"/>' +
		'</style:style>';

	s+= '<style:style style:name="P2s" style:parent-style-name="Normal" style:family="paragraph">' +
		'<style:paragraph-properties fo:text-align="left" fo:keep-with-next="always" fo:keep-together="always" fo:margin-top="0.06in" fo:margin-bottom="0.06in" fo:line-height="100%"/>' +
		'<style:text-properties  fo:font-style="italic" style:font-style-asian="italic" fo:font-size="12pt" style:font-size-asian="12pt" style:font-size-complex="12pt" fo:language="en" fo:country="US"/>' +
		'</style:style>';

	s+= '<style:style style:name="Pul" style:parent-style-name="Normal" style:family="paragraph">' +
		'<style:paragraph-properties fo:text-align="right" fo:margin-top="0.06in" fo:margin-bottom="0.06in" fo:line-height="100%"/>' +
		'<style:text-properties fo:font-style="italic" style:font-style-asian="italic" fo:font-size="10pt" style:font-size-asian="10pt" style:font-size-complex="10pt" style:text-underline-type="single" style:text-underline-style="solid" style:text-underline-width="auto" style:text-underline-mode="continuous" fo:language="en" fo:country="US"/>' +
		'</style:style>';

	//table text style
	s+= '<style:style style:name="P6a" style:parent-style-name="DefaultParagraphFont" style:family="text">' +
		'<style:paragraph-properties fo:text-align="center" fo:margin-bottom="0in" fo:margin-top="0in" fo:line-height="100%"/>' +
		'<style:text-properties style:font-name="Cambria Math" fo:color="#A5A5A5" style:font-name-complex="Cambria Math" fo:font-size="8pt" style:font-size-asian="8pt" style:font-size-complex="8pt" fo:language="en" fo:country="US"/>' +
		'</style:style>';

	s+= '<style:style style:name="P6w" style:parent-style-name="DefaultParagraphFont" style:family="text">' +
		'<style:paragraph-properties  fo:keep-with-next="always" fo:keep-together="always" fo:text-align="center" fo:margin-bottom="0.05in" fo:margin-top="0.05in" fo:line-height="100%"/>' +
		'<style:text-properties style:font-name="Arial" style:font-name-complex="Arial" fo:color="#FFFFFF" fo:font-weight="bold" style:font-weight-asian="bold" fo:font-size="10pt" style:font-size-asian="10pt" style:font-size-complex="10pt" fo:language="en" fo:country="US"/>' +
		'</style:style>';

	s+= '<style:style style:name="P6c" style:parent-style-name="Normal" style:family="paragraph">' +
		'<style:paragraph-properties  fo:keep-with-next="always" fo:keep-together="always" fo:text-align="center" fo:margin-bottom="0.05in" fo:margin-top="0.05in" fo:line-height="100%"/>' +
		'<style:text-properties  fo:font-size="10pt" style:font-size-asian="10pt" style:font-size-complex="10pt" fo:language="en" fo:country="US"/>' +
		'</style:style>';

	s+= '<style:style style:name="P6l" style:parent-style-name="Normal" style:family="paragraph">' +
		'<style:paragraph-properties fo:text-align="left" fo:margin-bottom="0.05in" fo:margin-top="0.05in" fo:line-height="100%"/>' +
		'<style:text-properties  fo:font-size="10pt" style:font-size-asian="10pt" style:font-size-complex="10pt" fo:language="en" fo:country="US"/>' +
		'</style:style>';

	//small gray text
	s+= '<style:style style:name="Pg" style:parent-style-name="Normal" style:family="paragraph">' +
		'<style:paragraph-properties fo:keep-with-next="always" fo:keep-together="always" fo:text-align="center" fo:margin-bottom="0in" fo:line-height="100%"/>' +
		'<style:text-properties style:font-name="Arial" fo:color="#9A9A9A" style:font-name-complex="Arial" fo:font-size="7pt" style:font-size-asian="5pt" style:font-size-complex="5pt"/>' +
		'</style:style>';

	s+= '<style:style style:name="Pgw" style:parent-style-name="Normal" style:family="paragraph">' +
		'<style:paragraph-properties fo:keep-with-next="always" fo:keep-together="always" fo:margin-top="0.05in" fo:text-align="center" fo:margin-bottom="0in" fo:line-height="100%"/>' +
		'<style:text-properties style:font-name="Arial" style:font-name-complex="Arial" fo:color="#FFFFFF" fo:font-size="7pt" style:font-size-asian="5pt" style:font-size-complex="5pt"/>' +
		'</style:style>';

	s+= '<style:style style:name="Pgs" style:parent-style-name="Normal" style:family="paragraph">' +
		'<style:paragraph-properties fo:keep-with-next="always" fo:keep-together="always" fo:text-align="center" fo:margin-bottom="0in" fo:line-height="100%"/>' +
		'<style:text-properties style:font-name="Arial" fo:color="#9A9A9A" style:font-name-complex="Arial" fo:font-size="3pt" style:font-size-asian="3pt" style:font-size-complex="3pt"/>' +
		'</style:style>';

	s+= '<style:style style:name="Pgr" style:parent-style-name="Normal" style:family="paragraph">' +
		'<style:paragraph-properties fo:text-align="center" fo:margin-bottom="0in" fo:line-height="100%"/>' +
		'<style:text-properties style:font-name="Arial" fo:color="#9A9A9A" style:font-name-complex="Arial" fo:font-size="7pt" style:font-size-asian="5pt" style:font-size-complex="5pt"/>' +
		'</style:style>';

	//table style
	s+= '<style:style style:name="Table1" style:family="table" >' +
		'<style:table-properties style:width="7.48031in" fo:margin-left="0in" table:align="left"/>' +
		'</style:style>';

	s+= '<style:style style:name="TableNoSize" style:family="table" >' +
		'<style:table-properties style:width="7.48031in" fo:margin-left="0in" table:align="left"/>' +
		'</style:style>';

	s+= '<style:style style:name="Table2" style:family="table" >' +
		'<style:table-properties style:width="11.1in" fo:margin-left="0in" table:align="left"/>' +
		'</style:style>';

	s+= '<style:style style:family="graphic" style:name="a0" style:parent-style-name="Graphics">' +
		'<style:graphic-properties fo:border="none" fo:background-color="transparent"/>' +
		'</style:style>';

	//cell style
	var coll = ['L','LR','R'];
	var	row = ['T','TB','B',''];
	var collVal = ['fo:border-left="0.0069in dashed #AEAAAA" fo:border-right="none"','fo:border-left="0.0069in dashed #AEAAAA" fo:border-right="0.0069in dashed #AEAAAA"','fo:border-left="none" fo:border-right="0.0069in dashed #AEAAAA"'];
	var rowVal = ['fo:border-top="0.0069in dashed #AEAAAA" fo:border-bottom="none"','fo:border-top="0.0069in dashed #AEAAAA" fo:border-bottom="0.0069in dashed #AEAAAA"','fo:border-top="none" fo:border-bottom="0.0069in dashed #AEAAAA"','fo:border-top="none" fo:border-bottom="none"'];

	for (var i = 0; i < 3; i++)
	{
		for (var j = 0; j < 4; j++)
		{
			s += '<style:style style:name="TableCell' + row[j] + coll[i] + '" style:family="table-cell">' + 
				 '<style:table-cell-properties '+ rowVal[j]  + ' ' + collVal[i] + ' style:writing-mode="lr-tb" ' +
				 ' style:vertical-align="middle" fo:padding-top="0in" fo:padding-left="0in" fo:padding-bottom="0in"' +
				 ' fo:padding-right="0in"/></style:style>';
		}
	}

	s+= '<style:style style:name="TableCellBLRg" style:family="table-cell">' +
		'<style:table-cell-properties fo:background-color="#F2F2F2" fo:border-left="0.0069in dashed #AEAAAA" fo:border-right="0.0069in dashed #AEAAAA" fo:border-top="none" fo:border-bottom="0.0069in dashed #AEAAAA" style:writing-mode="lr-tb" style:vertical-align="middle" fo:padding-top="0in" fo:padding-left="0in" fo:padding-bottom="0in" fo:padding-right="0in"/>' +
		'</style:style>';

	s+= '<style:style style:name="TableCellTBLRb" style:family="table-cell">' +
		'<style:table-cell-properties fo:background-color="#777777" fo:border-left="0.0069in dashed #AEAAAA" fo:border-right="0.0069in dashed #AEAAAA" fo:border-top="0.0069in dashed #AEAAAA" fo:border-bottom="0.0069in dashed #AEAAAA" style:writing-mode="lr-tb" style:vertical-align="middle" fo:padding-top="0in" fo:padding-left="0in" fo:padding-bottom="0in" fo:padding-right="0in"/>' +
		'</style:style>';

	s+= '<style:style style:name="TableCellN" style:family="table-cell">' +
		'<style:table-cell-properties fo:border-left="none" fo:border-right="none" fo:border-top="none" fo:border-bottom="none" style:writing-mode="lr-tb" style:vertical-align="middle" fo:padding-top="0in" fo:padding-left="0in" fo:padding-bottom="0in" fo:padding-right="0in"/>' +
		'</style:style>';

	s+= '<style:style style:name="TableCellNtop" style:family="table-cell">' +
		'<style:table-cell-properties fo:border-left="none" fo:border-right="none" fo:border-top="none" fo:border-bottom="none" style:writing-mode="lr-tb" style:vertical-align="top" fo:padding-top="0in" fo:padding-left="0in" fo:padding-bottom="0in" fo:padding-right="0in"/>' +
		'</style:style>';

	s+= '<style:style style:name="TableCellSBR" style:family="table-cell">' +
		'<style:table-cell-properties fo:border-left="none" fo:border-right="0.015in solid #808080" fo:border-top="none" fo:border-bottom="0.015in solid #92D050" style:writing-mode="lr-tb" style:vertical-align="middle" fo:padding-top="0in" fo:padding-left="0in" fo:padding-bottom="0in" fo:padding-right="0in"/>' +
		'</style:style>';

	s+= '<style:style style:name="TableCellSB" style:family="table-cell">' +
		'<style:table-cell-properties fo:border-left="none" fo:border-right="none" fo:border-top="none" fo:border-bottom="0.015in solid #92D050" style:writing-mode="lr-tb" style:vertical-align="middle" fo:padding-top="0in" fo:padding-left="0in" fo:padding-bottom="0in" fo:padding-right="0in"/>' +
		'</style:style>';

	s+= '<style:style style:name="TableCellSLB" style:family="table-cell">' +
		'<style:table-cell-properties fo:border-right="none" fo:border-left="0.015in solid #808080" fo:border-top="none" fo:border-bottom="0.015in solid #92D050" style:writing-mode="lr-tb" style:vertical-align="middle" fo:padding-top="0in" fo:padding-left="0in" fo:padding-bottom="0in" fo:padding-right="0in"/>' +
		'</style:style>';

	s+= '<style:style style:name="TableCellSTR" style:family="table-cell">' +
		'<style:table-cell-properties fo:border-left="none" fo:border-right="0.015in solid #808080" fo:border-bottom="none" fo:border-top="0.015in solid #92D050" style:writing-mode="lr-tb" style:vertical-align="middle" fo:padding-top="0in" fo:padding-left="0in" fo:padding-bottom="0in" fo:padding-right="0in"/>' +
		'</style:style>';

	s+= '<style:style style:name="TableCellST" style:family="table-cell">' +
		'<style:table-cell-properties fo:border-left="none" fo:border-right="none" fo:border-bottom="none" fo:border-top="0.015in solid #92D050" style:writing-mode="lr-tb" style:vertical-align="middle" fo:padding-top="0in" fo:padding-left="0in" fo:padding-bottom="0in" fo:padding-right="0in"/>' +
		'</style:style>';

	s+= '<style:style style:name="TableCellSLT" style:family="table-cell">' +
		'<style:table-cell-properties fo:border-right="none" fo:border-left="0.015in solid #808080" fo:border-bottom="none" fo:border-top="0.015in solid #92D050" style:writing-mode="lr-tb" style:vertical-align="middle" fo:padding-top="0in" fo:padding-left="0in" fo:padding-bottom="0in" fo:padding-right="0in"/>' +
		'</style:style>';

	s+= '<style:style style:name="TableCellRC" style:family="table-cell">' +
		'<style:table-cell-properties fo:border="0.0069in solid #000000" fo:background-color="#FF5555" style:writing-mode="lr-tb" fo:padding-top="0in" fo:padding-left="0.075in" fo:padding-bottom="0in" fo:padding-right="0.075in"/>' +
		'</style:style>';

	s+= '<style:style style:name="TableCellGC" style:family="table-cell">' +
		'<style:table-cell-properties fo:border="0.0069in solid #000000" fo:background-color="#55FF55" style:writing-mode="lr-tb" fo:padding-top="0in" fo:padding-left="0.075in" fo:padding-bottom="0in" fo:padding-right="0.075in"/>' +
		'</style:style>';

	s+= '<style:style style:name="TableCellBC" style:family="table-cell">' +
		'<style:table-cell-properties fo:border="0.0069in solid #000000" fo:background-color="#5555FF" style:writing-mode="lr-tb" fo:padding-top="0in" fo:padding-left="0.075in" fo:padding-bottom="0in" fo:padding-right="0.075in"/>' +
		'</style:style>';

	//column style, width
	s+= '<style:style style:name="TableColumn1" style:family="table-column">' +
		'<style:table-column-properties style:column-width="0.45in"/>' +
		'</style:style>';

	s+= '<style:style style:name="TableColumnS" style:family="table-column">' +
		'<style:table-column-properties style:column-width="0.5in"/>' +
		'</style:style>';

	s+= '<style:style style:name="TableColumnBig" style:family="table-column">' +
		'<style:table-column-properties style:column-width="5.45in"/>' +
		'</style:style>';

	s+= '<style:style style:name="TableColumnUnsize" style:family="table-column">' +
		'<style:table-column-properties style:column-width="7in"/>' +
		'</style:style>';

	var widthg = 10.61969; //table Horizontal
	var widthv = 7.0243;//table Vertical

	for (var i = 2; i < 8; i++)
	{
		s += '<style:style style:name="TableColumn' + i + '" style:family="table-column">' +
			 '<style:table-column-properties style:column-width="' +  (Math.round( (widthv / ( i - 1 )) * 10000) / 10000)  + 'in"/>' +
			 '</style:style>';
	}
	
	for (var i = 8; i < 15; i++)
	{
		s += '<style:style style:name="TableColumn' + i + '" style:family="table-column">' +
			 '<style:table-column-properties style:column-width="' +  (Math.round( (widthg / ( i - 1 )) * 10000) / 10000)  + 'in"/>' +
			 '</style:style>';
	}
	
	for (var i = 2; i < 7; i++)
	{
		s += '<style:style style:name="TableColumnS' + i + '" style:family="table-column">' +
			 '<style:table-column-properties style:column-width="' +  (Math.round( ( 5.4137 ) / ( i*2 ) * 10000)) / 10000  + 'in"/>' +
			 '</style:style>';
	}	
	
	for (var i = 1; i < 7; i++)
	{
		s += '<style:style style:name="TableColumnDI' + i + '" style:family="table-column">' +
			 '<style:table-column-properties style:column-width="' +  (Math.round( ( 7.48031 - 0.45 * ( i - 1) ) / ( i ) * 10000)) / 10000  + 'in"/>' +
			 '</style:style>';
	}

	for (var i = 1; i < 11; i++)
	{
		s += '<style:style style:name="TableColumnCO' + i + '" style:family="table-column">' +
			 '<style:table-column-properties style:column-width="' +  (Math.round( ( 7.48031 / i ) * 10000)) / 10000  + 'in"/>' +
			 '</style:style>';
	}	

	s+= '<style:style style:name="TableCell1" style:family="table-cell">' +
		'<style:table-cell-properties style:vertical-align="middle" fo:border="none" style:writing-mode="lr-tb" fo:padding-top="0in" fo:padding-left="0in" fo:padding-bottom="0in" fo:padding-right="0in"/>' +
		'</style:style>';

	//row style
	s+= '<style:style style:name="TableRow1" style:family="table-row">' +
		'<style:table-row-properties style:min-row-height="0.25in" />' +
		'</style:style>';

	s+= '<style:style style:name="TableRowBig" style:family="table-row">' +
		'<style:table-row-properties style:min-row-height="4in" />' +
		'</style:style>';

	s+= '<style:style style:name="TableRowDI" style:family="table-row">' +
		'<style:table-row-properties style:min-row-height="1.0in" />' +
		'</style:style>';

	s+= '<style:style style:name="TableRowS" style:family="table-row">' +
		'<style:table-row-properties style:min-row-height="0.05in" />' +
		'</style:style>';

	s += '</office:automatic-styles>';

	return s;
}

//=========================================================================================
function additionalFileGenerate(zip)
{
	//manifest file
	var s = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0">' +
			'<manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.text"/>' +
			'<manifest:file-entry manifest:full-path="settings.xml" manifest:media-type="text/xml"/><manifest:file-entry manifest:full-path="content.xml" ' +
			'manifest:media-type="text/xml"/><manifest:file-entry manifest:full-path="styles.xml" manifest:media-type="text/xml"/>' +
			'<manifest:file-entry manifest:full-path="meta.xml" manifest:media-type="text/xml"/></manifest:manifest>';

	var META = zip.folder("META-INF");
	META.file("manifest.xml",s);
	var time = new Date();

	s = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><office:document-meta xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" ' +
		'xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
		'office:version="1.2"><office:meta><meta:generator>StudyLab .ODT file generator</meta:generator><dc:title></dc:title><dc:description> ' +
		'</dc:description><meta:initial-creator>StudyLab Builder</meta:initial-creator><dc:creator>StudyLab Builder</dc:creator>' +
		'<meta:creation-date>' + time.getFullYear() + '-' + time.getMonth() + '-' + time.getDate() + 'T' + time.getHours() + ':' + time.getMinutes() + ':00Z</meta:creation-date>' +
		'<dc:date>' + time.getFullYear() + '-' + time.getMonth() + '-' + time.getDate() + 'T' + time.getHours() + ':' + time.getMinutes() + ':00Z</dc:date><meta:template xlink:href="Normal.dotm" xlink:type="simple"/>' +
		'<meta:document-statistic meta:page-count="1" meta:paragraph-count="0" meta:word-count="0" meta:character-count="0" meta:row-count="0" ' +
		'meta:non-whitespace-character-count="0"/></office:meta></office:document-meta>';

	//meta file
	zip.file("meta.xml", s);

	s = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><office:document-settings xmlns:anim="urn:oasis:names:tc:opendocument:xmlns:animation:1.0" xmlns:chart="urn:oasis:names:tc:opendocument:xmlns:chart:1.0" xmlns:config="urn:oasis:names:tc:opendocument:xmlns:config:1.0" xmlns:db="urn:oasis:names:tc:opendocument:xmlns:database:1.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dr3d="urn:oasis:names:tc:opendocument:xmlns:dr3d:1.0" xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" xmlns:form="urn:oasis:names:tc:opendocument:xmlns:form:1.0" xmlns:grddl="http://www.w3.org/2003/g/data-view#" xmlns:math="http://www.w3.org/1998/Math/MathML" xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" xmlns:number="urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0" xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:presentation="urn:oasis:names:tc:opendocument:xmlns:presentation:1.0" xmlns:script="urn:oasis:names:tc:opendocument:xmlns:script:1.0" xmlns:smil="urn:oasis:names:tc:opendocument:xmlns:smil-compatible:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:xforms="http://www.w3.org/2002/xforms" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink" office:version="1.2"/>';
	zip.file("settings.xml", s);
	//setting file

	zip.file("mimetype", "application/vnd.oasis.opendocument.text");

	s = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
		'<office:document-styles xmlns:anim="urn:oasis:names:tc:opendocument:xmlns:animation:1.0" ' + 
		'xmlns:chart="urn:oasis:names:tc:opendocument:xmlns:chart:1.0" xmlns:config="urn:oasis:names:tc:opendocument:xmlns:config:1.0" ' + 
		'xmlns:db="urn:oasis:names:tc:opendocument:xmlns:database:1.0" xmlns:dc="http://purl.org/dc/elements/1.1/" ' + 
		'xmlns:dr3d="urn:oasis:names:tc:opendocument:xmlns:dr3d:1.0" xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0" ' + 
		'xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" xmlns:form="urn:oasis:names:tc:opendocument:xmlns:form:1.0" ' + 
		'xmlns:grddl="http://www.w3.org/2003/g/data-view#" xmlns:math="http://www.w3.org/1998/Math/MathML" ' + 
		'xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" xmlns:number="urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0" ' + 
		'xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:presentation="urn:oasis:names:tc:opendocument:xmlns:presentation:1.0" ' + 
		'xmlns:script="urn:oasis:names:tc:opendocument:xmlns:script:1.0" xmlns:smil="urn:oasis:names:tc:opendocument:xmlns:smil-compatible:1.0" ' + 
		'xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0" ' + 
		'xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" ' + 
		'xmlns:xforms="http://www.w3.org/2002/xforms" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink" office:version="1.2">' +
		'<office:font-face-decls>' + 
		'<style:font-face style:name="Calibri" svg:font-family="Calibri" style:font-family-generic="swiss" style:font-pitch="variable" svg:panose-1="2 15 5 2 2 2 4 3 2 4"/>' +
		'<style:font-face style:name="Times New Roman" svg:font-family="Times New Roman" style:font-family-generic="roman" style:font-pitch="variable" svg:panose-1="2 2 6 3 5 4 5 2 3 4"/>' +
		'<style:font-face style:name="Arial" svg:font-family="Arial" style:font-family-generic="swiss" style:font-pitch="variable" svg:panose-1="2 11 6 4 2 2 2 2 2 4"/>' +
		'<style:font-face style:name="Calibri Light" svg:font-family="Calibri Light" style:font-family-generic="swiss" style:font-pitch="variable" svg:panose-1="2 15 3 2 2 2 4 3 2 4"/>' +
		'<style:font-face style:name="Cambria Math" svg:font-family="Cambria Math" style:font-family-generic="roman" style:font-pitch="variable" svg:panose-1="2 4 5 3 5 4 6 3 2 4"/>' +
		'</office:font-face-decls>' +
		'<office:styles>' +
		'<style:default-style style:family="table">'+
		'<style:table-properties fo:margin-left="0in" table:border-model="collapsing" style:writing-mode="lr-tb" table:align="left"/>' +
		'</style:default-style>' +
		'<style:default-style style:family="table-column">' +
		'<style:table-column-properties style:use-optimal-column-width="true"/>' +
		'</style:default-style>' +
		'<style:default-style style:family="table-row">'+
		'<style:table-row-properties style:min-row-height="0in" style:use-optimal-row-height="true" fo:keep-together="auto"/>'+
		'</style:default-style>' +
		'<style:default-style style:family="table-cell">' +
		'<style:table-cell-properties fo:background-color="transparent" style:glyph-orientation-vertical="auto" style:vertical-align="top" fo:wrap-option="wrap"/>' +
		'</style:default-style>' +
		'<style:default-style style:family="paragraph">' +
		'<style:paragraph-properties fo:keep-with-next="auto" fo:keep-together="auto" fo:widows="2" fo:orphans="2" fo:break-before="auto" text:number-lines="true" fo:border="none" fo:padding="0in" style:shadow="none" style:line-break="strict" style:punctuation-wrap="hanging" style:text-autospace="ideograph-alpha" style:snap-to-layout-grid="true" fo:text-align="start" style:writing-mode="lr-tb" fo:margin-bottom="0.1111in" fo:line-height="107%" fo:background-color="transparent" style:tab-stop-distance="0.4916in"/>' +
		'<style:text-properties style:font-name="Calibri" style:font-name-asian="Calibri" style:font-name-complex="Times New Roman" fo:font-weight="normal" style:font-weight-asian="normal" style:font-weight-complex="normal" fo:font-style="normal" style:font-style-asian="normal" style:font-style-complex="normal" fo:text-transform="none" fo:font-variant="normal" style:text-line-through-type="none" style:text-outline="false" style:font-relief="none" style:use-window-font-color="true" fo:letter-spacing="normal" style:text-scale="100%" style:letter-kerning="false" style:text-position="0% 100%" fo:font-size="11pt" style:font-size-asian="11pt" style:font-size-complex="11pt" fo:background-color="transparent" style:text-underline-type="none" style:text-underline-color="font-color" style:text-emphasize="none" fo:language="ru" fo:country="RU" style:language-asian="en" style:country-asian="US" style:language-complex="ar" style:country-complex="SA" style:text-combine="none" fo:hyphenate="true"/>' +
		'</style:default-style>' +
		'<style:style style:name="Normal" style:display-name="Normal" style:family="paragraph">' +
		'<style:text-properties fo:hyphenate="false"/>' +
		'</style:style>' +
		'<style:style style:name="DefaultParagraphFont" style:display-name="Default Paragraph Font" style:family="text"/>' +
		'<text:notes-configuration text:note-class="footnote" text:start-value="0" style:num-format="1" text:start-numbering-at="document" text:footnotes-position="page"/>' +
		'<text:notes-configuration text:note-class="endnote" text:start-value="0" style:num-format="i" text:start-numbering-at="document" text:footnotes-position="document"/>' +
		'<style:default-page-layout>' +
		'<style:page-layout-properties style:layout-grid-standard-mode="true"/>' +
		'</style:default-page-layout>' +
		'<style:default-style style:family="graphic">' +
		'<style:graphic-properties draw:fill="solid" draw:fill-color="#5b9bd5" draw:opacity="100%" draw:stroke="solid" svg:stroke-width="0.01389in" svg:stroke-color="#41719c" svg:stroke-opacity="100%" draw:stroke-linejoin="miter" svg:stroke-linecap="butt"/>' +
		'</style:default-style>' +
		'</office:styles>' +
		'<office:automatic-styles>' +
		'<style:page-layout style:name="PLv">' +
		'<style:page-layout-properties fo:page-width="8.268in" fo:page-height="11.693in" style:print-orientation="portrait" fo:margin-top="0.2952in" fo:margin-left="0.2952in" fo:margin-bottom="0.2952in" fo:margin-right="0.2952in" style:num-format="1" style:writing-mode="lr-tb">' +
		'<style:footnote-sep style:width="0.007in" style:rel-width="33%" style:color="#000000" style:line-style="solid" style:adjustment="left"/>' +
		'</style:page-layout-properties>' +
		'</style:page-layout>' +
		'<style:page-layout style:name="PLg">' +
		'<style:page-layout-properties fo:page-width="11.693in" fo:page-height="8.268in" style:print-orientation="landscape" fo:margin-top="0.2952in" fo:margin-left="0.2952in" fo:margin-bottom="0.2952in" fo:margin-right="0.2952in" style:num-format="1" style:writing-mode="lr-tb">' +
		'<style:footnote-sep style:width="0.007in" style:rel-width="33%" style:color="#000000" style:line-style="solid" style:adjustment="left"/>' +
		'</style:page-layout-properties>' +
		'</style:page-layout>' +
		'</office:automatic-styles>' +
		'<office:master-styles>' +
		'<style:master-page style:name="MPv" style:page-layout-name="PLv"/>' +
		'<style:master-page style:name="MPg" style:page-layout-name="PLg"/>' +
		'</office:master-styles>' +
		'</office:document-styles>';
	//style file

	zip.file("styles.xml", s);
}