
/*
	annotation - additional information before main table
	afterText - additional information after table
	color - true/false, to use styles
	
*/

function toHTML(options, obj){

	if(typeof options != 'object')					options = {};

	var html = '<!DOCTYPE HTML><html>';
	var styles = [ {b: '#FFFFFF', t: '#000000'} ];
	var styles_text = '<head><style> table { vertical-align: middle; font-family: Verdana, serif; padding: 1px; font-size: 11px; border-collapse: collapse; white-space:nowrap;} '
					+ '.t {background:#F1F1F1; text-align:center;} .r {background:#F1F1F1; text-align:center;  white-space:normal;} .s {background:#F1F1F1;} ';

	var eTable = obj.table;

	for(var i = 0; i < obj.styles.length; i++){
		styles_text += ' .c' + i + ' { background:' + obj.styles[i].background + '; color:' + obj.styles[i].color + '; }'
	}
	styles_text += '</head></style>'


	if(options.color){
		html += styles_text;
	}


	html += '<body>'

	if(options.annotation){
		html += '<table>';
		for(var i = 0; i < options.annotation.length; i++){
			html += '<tr>';
			if(Array.isArray(options.annotation[i]) ){
				for(var j = 0; j < options.annotation[i].length; j++)
					html += '<td>' + options.annotation[i][j] + '</td>';

			} else {
				html += '<td>' + options.annotation[i] + '</td>';
			}					
			html += '</tr>';
		}
		html += '</table>';
	}

	html += '<table border="1" bordercolor="silver" style="text-align: center;">';

	for( var i = 0; i < eTable.length; i++ ){
		html += '<tr>';
		for(var j = 0; j < eTable[i].length; j++){
			if(eTable[i][j] != undefined){

				var cell = eTable[i][j];
				var sign = '';
				var className;

				html += '<td';

				if(cell.type == 'thead' || cell.type == 'corn'){
					className = 't'
				} else if(cell.type == 'shead'){
					if(cell.l)	className = 's';
					else		className = 'r';
				} else {
					className = 'c' + cell.type; 
				}

				if(cell.alter){
					if(cell.alter.n && options.signPath){
						sign =  cell.alter.n.replace(/▼/g,'m').replace(/▲/g,'p').replace(/-/g,'').replace(/\+/g,'');
						sign = '<img src="' + options.signPath + sign + '.png" alt="' + sign + '" />';
					}
				}
	
				if(className){
					html += ' class="' + className + '"';
				}

				if(cell.cols)	html += ' colspan="' + cell.cols + '"';
				if(cell.rows)	html += ' rowspan="' + cell.rows + '"';

				html += '>' + sign;

				if(cell.type == 'thead'
					|| cell.type == 'corn'
					|| cell.type == 'shead')	html += cell.text;
				else if(cell.text !== '')		html += (cell.text + '').replace(/\./g, obj.separator) + (obj.styles[cell.type].percent ? "%" : '') ;
				html += '</td>';
			}
		}
		html += '</tr>';
	}
	html += '</table>';

	if(options.afterText){
		html += '<table>';
		for(var i = 0; i < options.afterText.length; i++){
			html += '<tr>';
			if(Array.isArray(options.afterText[i]) ){
				for(var j = 0; j < options.afterText[i].length; j++)
					html += '<td>' + options.afterText[i][j] + '</td>';

			} else {
				html += '<td>' + options.afterText[i] + '</td>';
			}					
			html += '</tr>';
		}
		html += '</table>';
	}

	html += '</body></html>';
	return html;
}

function toXLSX(options, input){

	/* verification of options */
	if(!options)									options = {};	
	if(options.oneSheet && input.length == 1)		options.oneSheet = false;	

	// global variables
	var XLSX = {};
	var BOOK = {};
	var OPT = options;
	var INP = input;


	var functions = {
		create: function(){

			// XLSX initializate

			// default folder with "app" and "core"
			XLSX.docProps = {};
			
			//xl folder
			XLSX.xl = {};
			
			// inner folder
			XLSX.xl.media = [];
			XLSX.xl.comments = [];

			XLSX.xl.drawings = [];
			XLSX.xl.drawingsRels = [];
			XLSX.xl.legacyDrawings = [];

			XLSX.xl.sheet = [];
			XLSX.xl.sheet_rels = [];


			// BOOK initializate
			BOOK.sheet = []; //worksheets
			BOOK.ss = []; //shared string 
			BOOK.count = ((OPT.oneSheet)? (1) : (INP.length)) + ((OPT.TOC)? 1 : 0);
			INP = INP;
		},
		names: function(){
			BOOK.names = [];

			function addSheet( obj ){
				return {
					name:	obj.name ? obj.name : 'Default',
					table:	obj.table ? obj.table : '',
					col:	obj.col ? obj.col : 0,
					row:	obj.row ? obj.row : 1,

					colVal: obj.colVal ? obj.colVal : [],

					start:	obj.start ? obj.start : [],
					merge:	obj.merge ? obj.merge : [],

					link:	obj.link ? obj.link : [],
					draw:	obj.draw ? obj.draw : [],
					comments:	obj.comments ? obj.comments : [],
				}
			}

			if(options.TOC){
				BOOK.sheet.push( addSheet({name: 'TOC'}) );
			}

			if(options.oneSheet){
				BOOK.sheet.push( addSheet({name: 'Tables'}) );
			} else {
				var names = [];

				if(!options.sheetNames){
					for(var i = 0; i < INP.length; i++)	names[i] = i + 1;
				} else {
					for(var i = 0; i < INP.length; i++)	names[i] = 0;

					// unique name verification
					for(var i = 0; i < INP.length; i++){
						for(var j = i + 1; j < INP.length; j++){
							if(other.cSheet(INP[i].annotation).toLowerCase() == other.cSheet(INP[j].annotation).toLowerCase())
								names[j] += 1;
						}
					}

					// generate names with serial number
					for(var i = 0; i < INP.length; i++){
						if(names[i]){
							names[i] = other.cSheet(INP[i].annotation, 30 - (names[i] + '').length) + '_' + names[i];
						} else {
							names[i] = other.cSheet(INP[i].annotation, 31);
						}
					}
				}


				for(var i = 0; i < names.length; i++){
					BOOK.sheet.push( addSheet({name: names[i] }) );
				}
			}
		},
		contentType: function(){
			XLSX.content_types = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
						+ '<Default Extension="png" ContentType="image/png"/>'
						+ '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>'
						+ '<Default Extension="vml" ContentType="application/vnd.openxmlformats-officedocument.vmlDrawing"/>'
						+ '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
						+ '<Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>'						
						+ '<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>'
						+ '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
						+ '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
						+ '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>';
		},
		docProps_core: function(){
			var cd = new Date(); //current date
			XLSX.docProps.core = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n <cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" '
						+ 'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>StudyLab Builder</dc:creator>'
						+ '<dcterms:created xsi:type="dcterms:W3CDTF">' + cd.getFullYear() + '-' + (((cd.getMonth() + 1) < 10)? ('0' + (cd.getMonth() + 1)): (cd.getMonth() + 1)) + '-' + ((cd.getDate() < 10)? ('0' + cd.getDate()) : cd.getDate()) 
						+ 'T' + ((cd.getHours() < 10)? ('0' + cd.getHours()) : cd.getHours()) + ':' + ((cd.getMinutes() < 10)? ('0' + cd.getMinutes()) : cd.getMinutes()) + ':00Z</dcterms:created></cp:coreProperties>';
		},
		docProps_app: function(){
			XLSX.docProps.app = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
						+ '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
						+ '<Application>Microsoft Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Sheets</vt:lpstr></vt:variant>'
						+ '<vt:variant><vt:i4>' + BOOK.count + '</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="' + BOOK.count + '" baseType="lpstr">';
		},
		rels: function(){
			XLSX.rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
						+ '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
						+ '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
						+ '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
		},
		xl_rels: function(){
			XLSX.xl.rels = '';
		},
		xl_workbook: function(){
			XLSX.xl.workbook = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
					+ '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x15" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main">'
					+ '<fileVersion appName="xl" lastEdited="7" lowestEdited="7" rupBuild="17329"/><workbookPr defaultThemeVersion="164011"/><mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">'
					+ '<mc:Choice Requires="x15"></mc:Choice></mc:AlternateContent><bookViews><workbookView xWindow="0" yWindow="0" windowWidth="21570" windowHeight="9270"/></bookViews><sheets>';
		},
		xl_rels_workbook: function(){
			var count = 1;
			for( var i = 0; i < BOOK.sheet.length; i++, count++ ){
				XLSX.docProps.app			+= '<vt:lpstr>' + other.rSheet(BOOK.sheet[i].name) + '</vt:lpstr>';
				XLSX.xl.rels				=  '<Relationship Id="rId' + count + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + count + '.xml"/>' + XLSX.xl.rels;
				XLSX.xl.workbook			+= '<sheet name="' + other.rSheet(BOOK.sheet[i].name) + '" sheetId="' + count + '" r:id="rId' + count + '"/>';
			}
			XLSX.xl.workbook += '</sheets><calcPr calcId="0"/></workbook>';
			XLSX.docProps.app += '</vt:vector></TitlesOfParts><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>16.0300</AppVersion></Properties>';
			XLSX.xl.rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
						+ ' <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + XLSX.xl.rels;
			XLSX.xl.rels += '<Relationship Id="rId' + (count) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>'
						+ '<Relationship Id="rId' + (count + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
						+ '<Relationship Id="rId' + (count + 2) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/></Relationships>';
		},
		xl_theme1: function(){
			XLSX.xl.theme1 = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
						+ '<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Тема Office"><a:themeElements><a:clrScheme name="Стандартная"><a:dk1><a:sysClr val="windowText" lastClr="000000"/>'
						+ '</a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2><a:accent1><a:srgbClr val="5B9BD5"/></a:accent1><a:accent2>'
						+ '<a:srgbClr val="ED7D31"/></a:accent2><a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4><a:accent5><a:srgbClr val="4472C4"/></a:accent5><a:accent6>'
						+ '<a:srgbClr val="70AD47"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme><a:fontScheme name="Стандартная"><a:majorFont>'
						+ '<a:latin typeface="Calibri Light" panose="020F0302020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック Light"/><a:font script="Hang" typeface="맑은 고딕"/>'
						+ '<a:font script="Hans" typeface="等线 Light"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" '
						+ 'typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" '
						+ 'typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/>'
						+ '<a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/>'
						+ '<a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" '
						+ 'typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/>'
						+ '<a:font script="Armn" typeface="Arial"/><a:font script="Bugi" typeface="Leelawadee UI"/><a:font script="Bopo" typeface="Microsoft JhengHei"/><a:font script="Java" typeface="Javanese Text"/><a:font script="Lisu" '
						+ 'typeface="Segoe UI"/><a:font script="Mymr" typeface="Myanmar Text"/><a:font script="Nkoo" typeface="Ebrima"/><a:font script="Olck" typeface="Nirmala UI"/><a:font script="Osma" typeface="Ebrima"/><a:font script="Phag" '
						+ 'typeface="Phagspa"/><a:font script="Syrn" typeface="Estrangelo Edessa"/><a:font script="Syrj" typeface="Estrangelo Edessa"/><a:font script="Syre" typeface="Estrangelo Edessa"/><a:font script="Sora" typeface="Nirmala UI"/>'
						+ '<a:font script="Tale" typeface="Microsoft Tai Le"/><a:font script="Talu" typeface="Microsoft New Tai Lue"/><a:font script="Tfng" typeface="Ebrima"/></a:majorFont><a:minorFont><a:latin typeface="Calibri" '
						+ 'panose="020F0502020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="等线"/>'
						+ '<a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/>'
						+ '<a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/>'
						+ '<a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/>'
						+ '<a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/>'
						+ '<a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/>'
						+ '<a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/><a:font script="Armn" typeface="Arial"/><a:font script="Bugi" typeface="Leelawadee UI"/>'
						+ '<a:font script="Bopo" typeface="Microsoft JhengHei"/><a:font script="Java" typeface="Javanese Text"/><a:font script="Lisu" typeface="Segoe UI"/><a:font script="Mymr" typeface="Myanmar Text"/><a:font script="Nkoo" '
						+ 'typeface="Ebrima"/><a:font script="Olck" typeface="Nirmala UI"/><a:font script="Osma" typeface="Ebrima"/><a:font script="Phag" typeface="Phagspa"/><a:font script="Syrn" typeface="Estrangelo Edessa"/>'
						+ '<a:font script="Syrj" typeface="Estrangelo Edessa"/><a:font script="Syre" typeface="Estrangelo Edessa"/><a:font script="Sora" typeface="Nirmala UI"/><a:font script="Tale" typeface="Microsoft Tai Le"/><a:font script="Talu" '
						+ 'typeface="Microsoft New Tai Lue"/><a:font script="Tfng" typeface="Ebrima"/></a:minorFont></a:fontScheme><a:fmtScheme name="Стандартная"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill '
						+ 'rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/><a:tint val="67000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:lumMod val="105000"/>'
						+ '<a:satMod val="103000"/><a:tint val="73000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="109000"/><a:tint val="81000"/></a:schemeClr></a:gs></a:gsLst><a:lin '
						+ 'ang="5400000" scaled="0"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/><a:tint val="94000"/></a:schemeClr></a:gs><a:gs pos="50000">'
						+ '<a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/><a:shade val="100000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="99000"/><a:satMod val="120000"/><a:shade val="78000"/>'
						+ '</a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'
						+ '<a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln>'
						+ '<a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/>'
						+ '</a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="63000"/>'
						+ '</a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/>'
						+ '</a:schemeClr></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs><a:gs pos="50000">'
						+ '<a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/>'
						+ '</a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/><a:extLst><a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}">'
						+ '<thm15:themeFamily xmlns:thm15="http://schemas.microsoft.com/office/thememl/2012/main" name="Office Theme" id="{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}" vid="{4A3C46E8-61CC-4603-A589-7422A47A8E4A}"/></a:ext></a:extLst></a:theme>';
		},
		xl_style: function(){

			/* standart EXCEL types of numbers */

			var styles = {};
			styles.nums = [
				{ percent: 0, round: -1, id: 0 },
				{ percent: 0, round: 0, id: 1 },
				{ percent: 0, round: 2, id: 2 },
				{ percent: 1, round: 0, id: 9 },
				{ percent: 1, round: 2, id: 10 }
			];
			styles.fonts = [
				{ color: '000000', font: "Arial" },
				{ color: '0563C1', font: "Arial" }
			];
			styles.fills = [
				{ pattern: "none", color: undefined },
				{ pattern: "gray125", color: undefined },
				{ pattern: "solid", color: "FFFFFF" },
				{ pattern: "solid", color: "F1F1F1" }
			];
			styles.borders = [
				{ color: undefined },
				{ color: "FFFFFF" },
				{ color: "CCCCCC" }
			];

			styles.cellFx = [];

			// white background - default type of cells
			styles.cellFx.push({
				font: 0,
				fill: 2,
				border: 1,
				num: 0
			});

			// white background with border - default type of TOC worksheet
			styles.cellFx.push({
				font: 0,
				fill: 2,
				border: 2,
				num: 1
			});

			// hyperlink
			styles.cellFx.push({
				font: 1,
				fill: 2,
				border: 1,
				num: 1
			});

			// header
			styles.cellFx.push({
				font: 0,
				fill: 3,
				border: 2,
				num: 1,
				align: {
					h: "center"
				}
			});


			// header with left side
			styles.cellFx.push({
				font: 0,
				fill: 3,
				border: 2,
				num: 1,
				align: {
					h: "left"
				}
			});

			// header with rotate
			styles.cellFx.push({
				font: 0,
				fill: 3,
				border: 2,
				num: 1,
				align: {
					r: 90,
					h: "center"
				}
			});

			// prepare styles
			for(var i = 0; i < INP.length; i++){

				if(!INP[i].object)			continue;
				if(!INP[i].object.styles)		continue;

				for(var j = 0; j < INP[i].object.styles.length; j++){
					INP[i].object.styles[j].background = INP[i].object.styles[j].background.replace(/#/g, '').toUpperCase();
					INP[i].object.styles[j].color = INP[i].object.styles[j].color.replace(/#/g, '').toUpperCase();
				}
			}

			// compering styles
			for(var i = 0; i < INP.length; i++){

				if(!INP[i].object)		continue;

				var obj = INP[i].object;
				obj.eStyles = [];
				for(var j = 0; j < obj.styles.length; j++){
					
					var index = -1;
					
					for(var k = 0; k < styles.cellFx.length; k++){
						if(    styles.fonts[styles.cellFx[k].font].color == obj.styles[j].color
							&& styles.fills[styles.cellFx[k].fill].color == obj.styles[j].background
							&& styles.nums[styles.cellFx[k].num].percent == obj.styles[j].percent
							&& styles.nums[styles.cellFx[k].num].round == obj.styles[j].round
							&& styles.cellFx[k].border == 2
						){
							index = k;
							break;
						}
					}

					if(index == -1){

						var i_num = -1;
						for(var k = 0; k < styles.nums.length; k++){
							if( styles.nums[k].percent == obj.styles[j].percent
								&& styles.nums[k].round == obj.styles[j].round ){
								i_num = k;
								break;
							}
						}
						if(i_num == -1){
							i_num = styles.nums.length;
							styles.nums.push({
								round: obj.styles[j].round,
								percent: obj.styles[j].percent,
								id: (160 + i_num)
							})
						}

						var i_font = -1;
						for(var k = 0; k < styles.fonts.length; k++){
							if( styles.fonts[k].color == obj.styles[j].color ){
								i_font = k;
								break;
							}
						}
						if(i_font == -1){
							i_font = styles.fonts.length;
							styles.fonts.push({
								color: obj.styles[j].color,
								font: 'Arial'
							})
						}

						var i_fill = -1;
						for(var k = 0; k < styles.fills.length; k++){
							if( styles.fills[k].color == obj.styles[j].background ){
								i_fill = k;
								break;
							}
						}
						if(i_fill == -1){
							i_fill = styles.fills.length;
							styles.fills.push({
								color: obj.styles[j].background,
								pattern: 'solid'
							})
						}

						index = styles.cellFx.length;

						styles.cellFx.push({
							fill: i_fill,
							num: i_num,
							font: i_font,
							border: 2,
							align: {
								h: "right"
							}
						});
					}

					obj.eStyles[j] = index;
				}
			}

			// generate string styles
			var s_num = "";
			if(styles.nums.length > 4){
				s_num = '<numFmts count="' + (styles.nums.length - 4) + '">'
				for(var i = 4; i < styles.nums.length; i++){
					var count_of_none = '0.';
					for(var j = 0; j < styles.nums[i].round; j++)
						count_of_none += '0'
					s_num += '<numFmt numFmtId="' + styles.nums[i].id + '" formatCode="' + count_of_none + (styles.nums[i].percent ? '%' : '') + '"/>';
				}
				s_num += '</numFmts>';
			}


			var s_font = '<fonts count="' + styles.fonts.length + '" x14ac:knownFonts="1">';
			for(var i = 0; i < styles.fonts.length; i++){
				s_font += '<font><sz val="10"/><color rgb="FF' + styles.fonts[i].color + '"/><name val="' + styles.fonts[i].font + '"/><family val="2"/><charset val="204"/></font>'
			}
			s_font += '</fonts>';


			var s_fill = '<fills count="' + styles.fills.length + '">';
			for(var i = 0; i < styles.fills.length; i++){
				s_fill += '<fill><patternFill patternType="' + styles.fills[i].pattern + '">';

				if(styles.fills[i].color)
					s_fill += '<fgColor rgb="FF' + styles.fills[i].color + '"/>';

				s_fill += '</patternFill></fill>';
			}
			s_fill += '</fills>';


			var s_border = '<borders count="' + styles.borders.length + '">'
			for(var i = 0; i < styles.borders.length; i++){
				s_border += '<border>'

				if(styles.borders[i].color){
					s_border += '<left style="thin"><color rgb="FF' + styles.borders[i].color + '"/></left>';
					s_border += '<right style="thin"><color rgb="FF' + styles.borders[i].color + '"/></right>';
					s_border += '<top style="thin"><color rgb="FF' + styles.borders[i].color + '"/></top>';
					s_border += '<bottom style="thin"><color rgb="FF' + styles.borders[i].color + '"/></bottom><diagonal/>';
				} else {
					s_border += '<left/><right/><top/><bottom/><diagonal/>';
				}
				s_border += '</border>';
			}
			s_border += '</borders>';


			var s_cellFx = '<cellXfs count="' + styles.cellFx.length + '">';
			for(var i = 0; i < styles.cellFx.length; i++){
				s_cellFx += '<xf' 
					+ ' numFmtId="' + styles.nums[ styles.cellFx[i].num ].id
					+ '" fontId="' + styles.cellFx[i].font
					+ '" fillId="' + styles.cellFx[i].fill
					+ '" borderId="' + styles.cellFx[i].border
					+ '" applyFont="1" applyFill="1"'
					+ ' applyBorder="1" ';
				if(styles.cellFx[i].align){
					s_cellFx += ' applyAlignment="1"><alignment horizontal="' + styles.cellFx[i].align.h 
							+ '" vertical="center" wrapText="1"' + ( (styles.cellFx[i].align.r) ? (' textRotation="' + styles.cellFx[i].align.r +'"') : '' )
							+ '/></xf>';
				} else {
					s_cellFx += '/>'
				}
			}
			s_cellFx += '</cellXfs>';

			BOOK.styles = styles;
			// combine styles
			XLSX.xl.style = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
				+ '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"'
				+ ' mc:Ignorable="x14ac x16r2" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:x16r2="http://schemas.microsoft.com/office/spreadsheetml/2015/02/main">' 
				
				+ s_num

				+ s_font

				+ s_fill 
				
				+ s_border

				+ '<cellStyleXfs count="1">'
				+ '<xf numFmtId="0" fontId="0" fillId="0" applyNumberFormat="0" borderId="0"/>'
				+ '</cellStyleXfs>'

				+ s_cellFx

				+ '<cellStyles count="1">'
				+ '<cellStyle name="Обычный" xfId="0"/>'
				+ '</cellStyles>'

				+ '<dxfs count="0"/>'
				+ '<tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/><extLst>'
				+ '<ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main"><x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/></ext>' 
				+ '<ext uri="{9260A510-F301-46a8-8635-F512D64BE5F5}" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"><x15:timelineStyles defaultTimelineStyle="TimeSlicerStyleLight1"/></ext></extLst></styleSheet>';
		},
		sheets: function(){

			var OPT = options;

			// current sheet counter
			var cs = (OPT.TOC) ? 1 : 0;

			for(var l = 0; l < INP.length; l++){

				// INP object
				var OBJ = INP[l]; //inner object
				
				if(!OBJ.object)			OBJ.object = {};
				if(!OBJ.object.col)		OBJ.object.col = [ 100 ];
				if(!OBJ.object.row)		OBJ.object.row = [ 20 ];
				if(!OBJ.description)	OBJ.description = [];
				if(!OBJ.object.table)	OBJ.object.table = [[{ type: 'corn' }]];

				// current sheet
				var SHT = BOOK.sheet[cs];

				// save start of sheet for TOC table
				if(OPT.TOC){
					SHT.link.push({ position: SHT.row, obj: OBJ, sheet: SHT });
				}

				// selection of large table values
				if( SHT.col < OBJ.object.col.length ){
					SHT.col = OBJ.object.col.length;
					SHT.colVal = OBJ.object.col;
				}

				// writing annotations in front of the table
				for(var j = 0; j < OBJ.description.length; j++){

					// prefix
					var pref = (OPT.descPrefix[j]) ? OPT.descPrefix[j] : '';

					// description
					var desc = pref + ' ' + ((OBJ.description[j]) ? OBJ.description[j] : '');

					SHT.table += '<row r="' + SHT.row
							+ '" spans="1:1" x14ac:dyDescent="0.25"><c r="A' + SHT.row
							+ '" s="0" t="s"><v>' + other.share(desc) + '</v></c></row>';
					SHT.row++;
				}

				// save comments
				if(OPT.annotation){
					SHT.comments.push({
						position: SHT.row,
						value: OBJ.annotation
					});
				}


				// writing main table
				var TABLE = OBJ.object.table;
				for(var i = 0; i < TABLE.length; i++){

					// beginning of line
					SHT.table += '<row r="' + SHT.row
							+ '" spans="1:' + OBJ.object.col.length
							+ '" ht="' + (OBJ.object.row[i])/1.33
							+ '" customHeight="1" x14ac:dyDescent="0.25">';

					for(var j = 0; j < TABLE[i].length; j++){

						if(TABLE[i][j] != undefined){

							var cell = TABLE[i][j];
							if( cell.type == 'corn'
								|| cell.type == 'shead'
								|| cell.type == 'thead'){

								if(cell.type == 'corn')									SHT.table += '<c r="' + (other.ITC(j)) + (SHT.row) + '" s="3" t="s"><v>' + ((OPT.cornerName) ? other.share(OBJ.annotation) : '') + '</v></c>';
								else if(cell.type == 'shead' && cell.l)					SHT.table += '<c r="' + (other.ITC(j)) + (SHT.row) + '" s="4" t="s"><v>' + other.share(cell.text) + '</v></c>';
								else if(cell.type == 'shead' && OBJ.object.orientation)	SHT.table += '<c r="' + (other.ITC(j)) + (SHT.row) + '" s="5" t="s"><v>' + other.share(cell.text) + '</v></c>';
								else if(cell.type == 'thead' || cell.type == 'shead')	SHT.table += '<c r="' + (other.ITC(j)) + (SHT.row) + '" s="3" t="s"><v>' + other.share(cell.text) + '</v></c>';

								if(cell.rows || cell.cols){
									var cl = (cell.cols) ? cell.cols : 1;
									var rw = (cell.rows) ? cell.rows : 1;
									SHT.merge.push( { ref: ((other.ITC(j)) + (SHT.row) + ':' + (other.ITC(j + cl - 1))) + (SHT.row + rw - 1) });
								}
							} else {

								if(typeof cell.text == 'number' && isFinite(cell.text) ){
									SHT.table += '<c r="' + (other.ITC(j)) + (SHT.row)
										+ '" s="' + OBJ.object.eStyles[cell.type] + '"><v>'
										+ ( ( BOOK.styles.nums[BOOK.styles.cellFx[OBJ.object.eStyles[cell.type]].num].percent ) ? (cell.text/100) : cell.text) + '</v></c>';

									if(cell.alter){
										SHT.draw.push({
											i: SHT.row,
											j: j,
											a: cell.alter.a,
											n: cell.alter.n
										})
									}

								} else {
									SHT.table += '<c r="' + (other.ITC(j)) + (SHT.row)
										+ '" s="' + OBJ.object.eStyles[cell.type] + '"/>';
								}
							}
						} else {
							SHT.table += '<c r="' + (other.ITC(j)) + (SHT.row) + '" s="1"><v></v></c>';
						}
					}
					SHT.table += '</row>';
					SHT.row++;
				}

				if(OBJ.afterText){
					for(var i = 0; i < OBJ.afterText.length; i++){
						
						if(!Array.isArray(OBJ.afterText[i]))
							OBJ.afterText[i] = [OBJ.afterText[i]];

						if(SHT.col < OBJ.afterText[i].length){
							SHT.col = OBJ.afterText[i].length;
							for(var j = 0; j < SHT.col; j++){
								if(!SHT.colVal[j])
									SHT.colVal[j] = 100;
							}
						}

						SHT.table += '<row r="' + SHT.row
							+ '" spans="1:' + OBJ.object.col.length
							+ '" x14ac:dyDescent="0.25">';
						
						for(var j = 0; j < OBJ.afterText[i].length; j++){
							SHT.table += '<c r="' + (other.ITC(j)) + (SHT.row)
										+ '" s="0" t="s"><v>' + other.share(OBJ.afterText[i][j]) + '</v></c>';
						}
						SHT.table += '</row>';
						SHT.row++;
					}					
				}

				if(!OPT.oneSheet){
					cs++;
				} else {
					SHT.row++;
				}
			}

			if(OPT.TOC){
				var SHT = BOOK.sheet[0];

				SHT.col = 5;
				SHT.colVal = [ 200, 200, 200, 200, 200 ];

				for(var i = 1; i < BOOK.sheet.length; i++){
					for(var j = 0; j < BOOK.sheet[i].link.length; j++){
						var OBJ = BOOK.sheet[i].link[j].obj;

						SHT.table += '<row r="' + SHT.row
								+ '" spans="1:5" x14ac:dyDescent="0.25"><c r="A' + SHT.row
								+ '" s="2" t="s"><v>' + other.share(OBJ.annotation) + '</v></c>';

						for(var k = 0; k < OBJ.description.length; k++){
							SHT.table += '<c r="' + other.ITC(k + 1) + (SHT.row)
								+ '" s="0" t="s"><v>' + other.share(OBJ.description[k]) + '</v></c>';
						}
						SHT.table += '</row>';

						SHT.link.push({
							row: SHT.row,
							location: ('\'' + other.rSheet( BOOK.sheet[i].name ) + '\'!A' + BOOK.sheet[i].link[j].position ),
							display: ( other.rSheet(OBJ.annotation) )
						});

						SHT.row++;
					}
					BOOK.sheet[i].link = [];
				}
			}
		},
		xl_worksheets: function(){

			for(var l = 0; l < BOOK.sheet.length; l++){

				var sheet = "";
				var SHT = BOOK.sheet[l];

				sheet += '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
						+ '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'
						+ '<dimension ref="A1:' + ( other.ITC(SHT.col) + (SHT.row - 1)) + '"/><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetFormatPr defaultColWidth="12" defaultRowHeight="15" x14ac:dyDescent="0.25"/>';

				sheet += '<cols>';
				for(var i = 0; i < SHT.colVal.length; i++ ){
					sheet += '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + ((SHT.colVal[i])/7) + '" style="0" customWidth="1"/>';
				}
				sheet += '</cols>';

				sheet += '<sheetData>';
				sheet += SHT.table;
				sheet += '</sheetData>';

				if(SHT.merge.length > 0){
					sheet +=  '<mergeCells count="' + SHT.merge.length + '">';
					for(var i = 0; i < SHT.merge.length; i++)
						sheet += '<mergeCell ref="' + SHT.merge[i].ref + '"/>';
					sheet +=  '</mergeCells>';
				}

				if(SHT.link.length > 0){
					sheet += '<hyperlinks>';
					for(var i = 0; i < SHT.link.length; i++){
						sheet += '<hyperlink ref="A' + SHT.link[i].row
							+ '" location="' + SHT.link[i].location
							+ '" display="' + SHT.link[i].display
							+ '" />';
					}
					sheet += '</hyperlinks>'
				}

				sheet += '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>'

				var ID = 1;

				if(SHT.draw.length > 0){

					sheet += '<drawing r:id="rId1"/>';
					ID++;
				}

				if(SHT.comments.length > 0){
					sheet += '<legacyDrawing r:id="rId' + ID + '"/>';
				}

				sheet += '</worksheet>';
				
				XLSX.xl.sheet.push(sheet);
			}
		},
		xl_drawning: function(){
		

			for(var i = 0; i < BOOK.sheet.length; i++){

				var SHT = BOOK.sheet[i];

				if(SHT.comments.length){

					var legacyDraw = '<xml xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><o:shapelayout v:ext="edit">'
										+ '<o:idmap v:ext="edit" data="1"/></o:shapelayout><v:shapetype id="_x0000_t202" coordsize="21600,21600" o:spt="202" path="m,l,21600r21600,l21600,xe">'
										+ '<v:stroke joinstyle="miter"/><v:path gradientshapeok="t" o:connecttype="rect"/></v:shapetype>';

					var comments = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
								+ '<comments xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
								+ '<authors><author>StudyLab</author></authors><commentList>';

					for(var j = 0; j < SHT.comments.length; j++){
						legacyDraw += '<v:shape id="_x0000_s' + (1025 + j) + '" type="#_x0000_t202" style=\'position:absolute; margin-left:90.75pt;margin-top:82.5pt;width:132pt;height:77.25pt;z-index:1; visibility:hidden;mso-wrap-style:tight\' fillcolor="infoBackground [80]"  strokecolor="none [81]" o:insetmode="auto">'
								+ '<v:fill color2="infoBackground [80]"/><v:shadow color="none [81]" obscured="t"/><v:path o:connecttype="none"/><v:textbox style=\'mso-direction-alt:auto\'><div style=\'text-align:left\'></div>'
								+ '</v:textbox><x:ClientData ObjectType="Note"><x:MoveWithCells/><x:SizeWithCells/><x:Anchor>1, 41, 5, 10, 3, 57, 7, 7</x:Anchor><x:AutoFill>False</x:AutoFill>'
								+ '<x:Row>' + (SHT.comments[j].position - 1) + '</x:Row><x:Column>0</x:Column></x:ClientData></v:shape>';

						comments += '<comment ref="A' + SHT.comments[j].position
								+ '" authorId="0" shapeId="0"><text><r><rPr><sz val="11"/><color rgb="FF000000"/>'
								+ '<rFont val="Calibri"/><family val="2"/><charset val="204"/>'
								+ '</rPr><t>' + other.rText(SHT.comments[j].value) + '</t></r></text></comment>';
					}

					comments += '</commentList></comments>';
					legacyDraw += '</xml>';
					
					XLSX.xl.legacyDrawings.push(legacyDraw);
					XLSX.xl.comments.push(comments);

					SHT.c = XLSX.xl.comments.length;
				}

				if(SHT.draw.length){
					var canvas = tools.createHTML({
						tag: 'canvas'
					});
		
					var ctx = canvas.getContext("2d");
					ctx.font = "8pt Arial";

					var aColor = ['000000', 'B10000', '007300'];
					
					var draw = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
							+ '<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" '
							+ 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">';
				
					for(var j = 0; j < SHT.draw.length; j++){

						var width = Math.round(( 6 + ctx.measureText(SHT.draw[j].n).width )*10000);

						

						draw += '<xdr:twoCellAnchor>'
							+ '<xdr:from><xdr:col>' + SHT.draw[j].j + '</xdr:col>'
							+ '<xdr:colOff>20000</xdr:colOff>'
							+ '<xdr:row>' + (SHT.draw[j].i - 1) + '</xdr:row>'
							+ '<xdr:rowOff>20000</xdr:rowOff></xdr:from>'
							+ '<xdr:to><xdr:col>' + SHT.draw[j].j + '</xdr:col>'
							+ '<xdr:colOff>' + width + '</xdr:colOff>'
							+ '<xdr:row>' + (SHT.draw[j].i - 1) + '</xdr:row>'
							+ '<xdr:rowOff>153350</xdr:rowOff></xdr:to>'
							+ '<xdr:sp macro="" textlink=""><xdr:nvSpPr>'
							+ '<xdr:cNvPr id="' + (j + 1) + '" name="' + SHT.draw[j].n + '">'
							+ '<a:extLst><a:ext uri="{FF2B5EF4-FFF2-40B4-BE49-F238E27FC236}">'
							+ '<a16:creationId xmlns:a16="http://schemas.microsoft.com/office/drawing/2014/main" id="{00000000-0008-0000-0200-000005000000}"/>'
							+ '</a:ext>'
							+ '</a:extLst>'
							+ '</xdr:cNvPr>'
							+ '<xdr:cNvSpPr txBox="1"/>'
							+ '</xdr:nvSpPr><xdr:spPr><a:xfrm><a:off x="609600" y="571500"/><a:ext cx="' + width + '" cy="152401"/>'
							+ '</a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr>';

						draw += '<xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" wrap="square" lIns="18000" tIns="18000" rIns="18000" bIns="18000" rtlCol="0" anchor="t"><a:noAutofit/>'
							+ '</a:bodyPr><a:lstStyle/><a:p><a:pPr lvl="0"/><a:r>'
							+ '<a:rPr lang="en-US" sz="800"><a:solidFill><a:srgbClr val="' + aColor[SHT.draw[j].a] + '"/></a:solidFill>'
							+ '<a:latin typeface="Arial" panose="020B0604020202020204" pitchFamily="34" charset="0"/>'
							+ '<a:cs typeface="Arial" panose="020B0604020202020204" pitchFamily="34" charset="0"/>'
							+ '</a:rPr><a:t>' + SHT.draw[j].n + '</a:t></a:r>'
							+ '<a:endParaRPr lang="ru-RU" sz="800"><a:solidFill><a:srgbClr val="' + aColor[SHT.draw[j].a] + '"/></a:solidFill>'
							+ '<a:latin typeface="Arial" panose="020B0604020202020204" pitchFamily="34" charset="0"/>'
							+ '<a:cs typeface="Arial" panose="020B0604020202020204" pitchFamily="34" charset="0"/>'
							+ '</a:endParaRPr></a:p></xdr:txBody></xdr:sp><xdr:clientData/>'
							+ '</xdr:twoCellAnchor>';
					}

					draw += '</xdr:wsDr>';
					
					XLSX.xl.drawings.push(draw);

					SHT.d = XLSX.xl.drawings.length;
				}

				if(SHT.d || SHT.c){
					var sheet_rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
									+ '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
					var count = 1;

					if(SHT.d){
						sheet_rels += '<Relationship Id="rId' + count + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" '
							+ 'Target="../drawings/drawing' + SHT.d + '.xml"/>';
						count++;
					}
					if(SHT.c){
						sheet_rels += '<Relationship Id="rId' + count + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing" Target="../drawings/vmlDrawing' + SHT.c + '.vml"/>';
						sheet_rels += '<Relationship Id="rId' + (count + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments" Target="../comments' + SHT.c + '.xml"/>';
					}
					sheet_rels += '</Relationships>';

					XLSX.xl.sheet_rels[i] = sheet_rels;
				}
			}
			for(var i = 0; i < XLSX.xl.comments.length; i++)
				XLSX.content_types += '<Override PartName="/xl/comments' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml"/>';

			for(var i = 0; i < XLSX.xl.drawings.length; i++)
				XLSX.content_types += '<Override PartName="/xl/drawings/drawing' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>';
		},
		xl_sharedString: function(){
			XLSX.xl.sharedStrings = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
								+'<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="' + BOOK.ss.length + '" uniqueCount="' + BOOK.ss.length + '">';
			for(var i = 0; i < BOOK.ss.length; i++)
				XLSX.xl.sharedStrings += '<si><t>' + BOOK.ss[i] + '</t></si>';
			XLSX.xl.sharedStrings += '</sst>';
		},
		content_types: function(){
			for(var i = 0; i < XLSX.xl.sheet.length; i++)
				XLSX.content_types += '<Override PartName="/xl/worksheets/sheet' + (i + 1)
							+ '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
			XLSX.content_types += '</Types>';
		},
		generate: function(){
			var zip = new JSZip();
			var _rels = zip.folder("_rels");
			var docProps = zip.folder("docProps");
			var xl = zip.folder("xl");
		
			_rels.file(".rels", XLSX.rels);
			zip.file("[Content_Types].xml", XLSX.content_types);
		
			docProps.file("app.xml", XLSX.docProps.app);
			docProps.file("core.xml", XLSX.docProps.core);
		
			var xl_rels = xl.folder("_rels");
			var xl_theme = xl.folder("theme");
			var xl_worksheets = xl.folder("worksheets");
		
			xl.file("sharedStrings.xml", XLSX.xl.sharedStrings);
			xl.file("styles.xml", XLSX.xl.style);
			xl.file("workbook.xml", XLSX.xl.workbook);
		
			xl_rels.file("workbook.xml.rels", XLSX.xl.rels);
			xl_theme.file('theme1.xml', XLSX.xl.theme1);
		
			for(var i = 0; i < XLSX.xl.sheet.length; i++)						xl_worksheets.file('sheet' + (i + 1) + '.xml', XLSX.xl.sheet[i]);

			if(XLSX.xl.drawings.length || XLSX.xl.comments.length){

				var xl_drawings = xl.folder("drawings");

				if(  XLSX.xl.comments.length ){
					for(var i = 0; i < XLSX.xl.legacyDrawings.length; i++)		xl_drawings.file('vmlDrawing' + (i + 1) + '.vml', XLSX.xl.legacyDrawings[i]);
					for(var i = 0; i < XLSX.xl.comments.length; i++)			xl.file('comments' + (i + 1) + '.xml', XLSX.xl.comments[i]);
				}

				if( XLSX.xl.drawings.length ){
				
					for(var i = 0; i < XLSX.xl.drawings.length; i++)			xl_drawings.file('drawing' + (i + 1) + '.xml', XLSX.xl.drawings[i]);
					
				}

				var xl_worksheets_rels = xl_worksheets.folder("_rels");
				for(var i = 0; i < XLSX.xl.sheet_rels.length; i++){
					if(XLSX.xl.sheet_rels[i])
						xl_worksheets_rels.file('sheet' + (i + 1) + '.xml.rels', XLSX.xl.sheet_rels[i]);					
				}
			}
		
			var filename = (options.fileName)? options.fileName : 'default';
			zip.generateAsync({type:"blob"}).then(function(content) {
				saveAs(content, filename + ".xlsx");	// FileSaver.js
			});
		}
	}
	var other = {
		share: function(text){
			var sharedText = other.rText(text);
			var index;
			for(var i = 0; i < BOOK.ss.length; i++){
				if(BOOK.ss[i] == sharedText)
					index = i;
			}
			if(!index){
				index = BOOK.ss.length;
				BOOK.ss[index] = sharedText;
			}
			return index;
		},
		cSheet: function(text, length){
			if(!length)							length = 29;
			if(typeof text != 'string')			return 'error';
			if(text.length > length)			text = text.substring(0, length);
			return text;
		},
		rSheet: function(text){
			if(typeof text == 'number')			text += '';
			else if(typeof text != 'string')	return '';
			text = text.replace(/&/g, '&amp;');
			text = text.replace(/\*/g,'x');
			text = text.replace(/\\/g,'_');
			text = text.replace(/\//g,'_');
			text = text.replace(/`/g,'\'');
			text = text.replace(/</g, '&lt;');
			text = text.replace(/>/g, '&gt;');
			text = text.replace(/\[/g, '(');
			text = text.replace(/\]/g, ')');

			return text;
		},
		rText: function(text){
			if(typeof text != 'string')	return text;
			text = text.replace(/&/g, '&amp;');
			text = text.replace(/\*/g,'&#042;');
			text = text.replace(/</g, '&lt;');
			text = text.replace(/>/g, '&gt;');
			return text;
		},
		rArrow: function(text){
			text = text + '';
			text = text.replace(/▼/g,'m');
			text = text.replace(/▲/g,'p');
			return text;
		},
		ITC: function(value){//integer to char
			var AB = '';
			if(value > 25){
				var new_value = value%26;
				var new_value_rec = (value - new_value)/26;
				AB = other.ITC(new_value_rec - 1);
				value = new_value;
			}
			return (AB + String.fromCharCode(value + 65));
		}
	}

	functions.create(XLSX, BOOK);
	functions.names(BOOK, INP, options);
	functions.contentType(XLSX);
	functions.docProps_core(XLSX);
	functions.docProps_app(XLSX, BOOK.count);
	functions.rels(XLSX);
	functions.xl_rels(XLSX);
	functions.xl_workbook(XLSX);
	functions.xl_rels_workbook(XLSX, BOOK, options);
	functions.xl_theme1(XLSX);
	functions.xl_style(XLSX, BOOK, options);

	functions.sheets(XLSX, BOOK, options);
	functions.xl_worksheets(XLSX, BOOK, options);

	functions.xl_drawning(XLSX, BOOK, options);	
	functions.xl_sharedString(XLSX, BOOK);

	functions.content_types(XLSX);
	functions.generate(XLSX, BOOK, options);
}

function arrayToXLSX(name, array){
	
	var xlsx = {};
	var BOOK = {};
	
	xlsx.docProps = {};
	xlsx.xl = {};
	xlsx.xl.sheet = [];
	xlsx.xl.comments = [];
	xlsx.xl.drawings = [];
	xlsx.xl.sheet_rels = [];

	var sharedStrings = [];
	var cd = new Date(); //current date

	xlsx.content_types = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
						+ '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>'
						+ '<Default Extension="vml" ContentType="application/vnd.openxmlformats-officedocument.vmlDrawing"/>'
						+ '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
						+ '<Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>'						
						+ '<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>'
						+ '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
						+ '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
						+ '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>';
	xlsx.rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
						+ '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
						+ '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
						+ '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
	xlsx.docProps.core = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n <cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" '
						+ 'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>StudyLab Builder</dc:creator>'
						+ '<dcterms:created xsi:type="dcterms:W3CDTF">' + cd.getFullYear() + '-' + (((cd.getMonth() + 1) < 10)? ('0' + (cd.getMonth() + 1)): (cd.getMonth() + 1)) + '-' + ((cd.getDate() < 10)? ('0' + cd.getDate()) : cd.getDate()) 
						+ 'T' + ((cd.getHours() < 10)? ('0' + cd.getHours()) : cd.getHours()) + ':' + ((cd.getMinutes() < 10)? ('0' + cd.getMinutes()) : cd.getMinutes()) + ':00Z</dcterms:created></cp:coreProperties>';
	xlsx.xl.rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';

	BOOK.count = array.length;

	xlsx.docProps.app = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
						+ '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
						+ '<Application>Microsoft Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Sheets</vt:lpstr></vt:variant>'
						+ '<vt:variant><vt:i4>' + BOOK.count + '</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="' + BOOK.count + '" baseType="lpstr">';
	xlsx.xl.workbook = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
						+ '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x15" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main">'
						+ '<fileVersion appName="xl" lastEdited="7" lowestEdited="7" rupBuild="17329"/><workbookPr defaultThemeVersion="164011"/><mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">'
						+ '<mc:Choice Requires="x15"></mc:Choice></mc:AlternateContent><bookViews><workbookView xWindow="0" yWindow="0" windowWidth="21570" windowHeight="9270"/></bookViews><sheets>';

	/* repare sheets names */
	BOOK.names = [];
	BOOK.style = [];

	for(var i = 0; i < array.length; i++)	BOOK.names[i] = 0;
	for(var i = 0; i < array.length; i++){
		for(var j = i + 1; j < array.length; j++){
			if(cut_sheet_name(array[i].name).toLowerCase() == cut_sheet_name(array[j].name).toLowerCase())					BOOK.names[j] += 1;
		}
	}
	for(var i = 0; i < array.length; i++){
		if(BOOK.names[i]){
			BOOK.names[i] = cut_sheet_name(array[i].name, 30 - (BOOK.names[i] + '').length) + '_' + BOOK.names[i];
		} else {
			BOOK.names[i] = cut_sheet_name(array[i].name, 31);
		}
	}

	/* add infornation about sheets names */
	for(var i = 0; i < BOOK.names.length; i++){
		xlsx.docProps.app		+= '<vt:lpstr>' + replaceSheetName(BOOK.names[i]) + '</vt:lpstr>';
		xlsx.xl.rels			+= '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>';
		xlsx.xl.workbook		+= '<sheet name="' + replaceSheetName(BOOK.names[i])  + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>';
	}

	xlsx.xl.workbook += '</sheets><calcPr calcId="0"/></workbook>';
	xlsx.xl.rels += '<Relationship Id="rId' + (BOOK.names.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>'
						+ '<Relationship Id="rId' + (BOOK.names.length + 2) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
						+ '<Relationship Id="rId' + (BOOK.names.length + 3) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/></Relationships>';
	xlsx.docProps.app += '</vt:vector></TitlesOfParts><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>16.0300</AppVersion></Properties>';
	xlsx.xl.theme1 = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
						+ '<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Тема Office"><a:themeElements><a:clrScheme name="Стандартная"><a:dk1><a:sysClr val="windowText" lastClr="000000"/>'
						+ '</a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2><a:accent1><a:srgbClr val="5B9BD5"/></a:accent1><a:accent2>'
						+ '<a:srgbClr val="ED7D31"/></a:accent2><a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4><a:accent5><a:srgbClr val="4472C4"/></a:accent5><a:accent6>'
						+ '<a:srgbClr val="70AD47"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme><a:fontScheme name="Стандартная"><a:majorFont>'
						+ '<a:latin typeface="Calibri Light" panose="020F0302020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック Light"/><a:font script="Hang" typeface="맑은 고딕"/>'
						+ '<a:font script="Hans" typeface="等线 Light"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" '
						+ 'typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" '
						+ 'typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/>'
						+ '<a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/>'
						+ '<a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" '
						+ 'typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/>'
						+ '<a:font script="Armn" typeface="Arial"/><a:font script="Bugi" typeface="Leelawadee UI"/><a:font script="Bopo" typeface="Microsoft JhengHei"/><a:font script="Java" typeface="Javanese Text"/><a:font script="Lisu" '
						+ 'typeface="Segoe UI"/><a:font script="Mymr" typeface="Myanmar Text"/><a:font script="Nkoo" typeface="Ebrima"/><a:font script="Olck" typeface="Nirmala UI"/><a:font script="Osma" typeface="Ebrima"/><a:font script="Phag" '
						+ 'typeface="Phagspa"/><a:font script="Syrn" typeface="Estrangelo Edessa"/><a:font script="Syrj" typeface="Estrangelo Edessa"/><a:font script="Syre" typeface="Estrangelo Edessa"/><a:font script="Sora" typeface="Nirmala UI"/>'
						+ '<a:font script="Tale" typeface="Microsoft Tai Le"/><a:font script="Talu" typeface="Microsoft New Tai Lue"/><a:font script="Tfng" typeface="Ebrima"/></a:majorFont><a:minorFont><a:latin typeface="Calibri" '
						+ 'panose="020F0502020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="等线"/>'
						+ '<a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/>'
						+ '<a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/>'
						+ '<a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/>'
						+ '<a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/>'
						+ '<a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/>'
						+ '<a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/><a:font script="Armn" typeface="Arial"/><a:font script="Bugi" typeface="Leelawadee UI"/>'
						+ '<a:font script="Bopo" typeface="Microsoft JhengHei"/><a:font script="Java" typeface="Javanese Text"/><a:font script="Lisu" typeface="Segoe UI"/><a:font script="Mymr" typeface="Myanmar Text"/><a:font script="Nkoo" '
						+ 'typeface="Ebrima"/><a:font script="Olck" typeface="Nirmala UI"/><a:font script="Osma" typeface="Ebrima"/><a:font script="Phag" typeface="Phagspa"/><a:font script="Syrn" typeface="Estrangelo Edessa"/>'
						+ '<a:font script="Syrj" typeface="Estrangelo Edessa"/><a:font script="Syre" typeface="Estrangelo Edessa"/><a:font script="Sora" typeface="Nirmala UI"/><a:font script="Tale" typeface="Microsoft Tai Le"/><a:font script="Talu" '
						+ 'typeface="Microsoft New Tai Lue"/><a:font script="Tfng" typeface="Ebrima"/></a:minorFont></a:fontScheme><a:fmtScheme name="Стандартная"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill '
						+ 'rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/><a:tint val="67000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:lumMod val="105000"/>'
						+ '<a:satMod val="103000"/><a:tint val="73000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="109000"/><a:tint val="81000"/></a:schemeClr></a:gs></a:gsLst><a:lin '
						+ 'ang="5400000" scaled="0"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/><a:tint val="94000"/></a:schemeClr></a:gs><a:gs pos="50000">'
						+ '<a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/><a:shade val="100000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="99000"/><a:satMod val="120000"/><a:shade val="78000"/>'
						+ '</a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'
						+ '<a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln>'
						+ '<a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/>'
						+ '</a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="63000"/>'
						+ '</a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/>'
						+ '</a:schemeClr></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs><a:gs pos="50000">'
						+ '<a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/>'
						+ '</a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/><a:extLst><a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}">'
						+ '<thm15:themeFamily xmlns:thm15="http://schemas.microsoft.com/office/thememl/2012/main" name="Office Theme" id="{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}" vid="{4A3C46E8-61CC-4603-A589-7422A47A8E4A}"/></a:ext></a:extLst></a:theme>';

	var numFmts =  [{ decimal: 0, id: 1},
					{ decimal: 2, id: 2},
					{ decimal: 0, id: 9},
					{ decimal: 2, id: 10},];
	var cellXfs = [];

	for(var i = 0; i < array.length; i++){
		if(array[i].decimal === undefined)
			array[i].decimal = 3;


		var numFmt_Id = -1;
		for(var k = 0; k < numFmts.length; k++){
			if(numFmts[k].decimal == array[i].decimal){
				numFmt_Id = numFmts[k].id;
				break;
			}
		}
		if(numFmt_Id == -1){
			numFmt_Id = numFmts.length + 160;
			numFmts[numFmts.length] = { decimal: array[i].decimal, id: numFmt_Id};
			cellXfs[cellXfs.length] = { numFmts: numFmt_Id };
		}
		var cellXfs_id = -1;
		for(var k = 0; k < cellXfs.length; k++){
			if(cellXfs[k].numFmts == numFmt_Id){
				cellXfs_id = k;
				break;
			}
		}
		if(cellXfs_id == -1){
			cellXfs_id = cellXfs.length;
			cellXfs[cellXfs_id] = {numFmts: numFmt_Id};
		}
		BOOK.style[i] = cellXfs_id + 1;
	}

	var numFmts_string = '';
	if(numFmts.length > 4){
		numFmts_string = '<numFmts count="' + (numFmts.length - 4) + '">'
		for(var i = 4; i < numFmts.length; i++){
			var count_of_none = '0.';
			for(var j = 0; j < numFmts[i].decimal; j++)
				count_of_none += '0'
			numFmts_string += '<numFmt numFmtId="' + numFmts[i].id + '" formatCode="' + count_of_none + '"/>';
		}
		numFmts_string += '</numFmts>';
	}

	var cellXfs_string = '';
	for(var i = 0; i < cellXfs.length; i++){
		cellXfs_string += '<xf numFmtId="' + cellXfs[i].numFmts + '" fillId="0" fontId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="top" wrapText="1"/></xf>';
	}


	xlsx.xl.style = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
							+ '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"'
							+ ' mc:Ignorable="x14ac x16r2" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:x16r2="http://schemas.microsoft.com/office/spreadsheetml/2015/02/main">' 
							+ numFmts_string
							+ '<fonts count="1" x14ac:knownFonts="1"><font><sz val="10"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/><charset val="204"/></font></fonts>'
							+ '<fills count="2">'
							+ '<fill><patternFill patternType="none"/></fill>'
							+ '<fill><patternFill patternType="gray125"/></fill></fills>'  
							+ '<borders count="1">'
							+ '<border><left/><right/><top/><bottom/><diagonal/></border>' 
							+ '</borders><cellStyleXfs count="1">'
							+ '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>'
							+ '</cellStyleXfs><cellXfs count="' + (1 + cellXfs.length) + '">'
							+ '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>' 
							+ cellXfs_string
							+ '</cellXfs><cellStyles count="1"><cellStyle name="Обычный" xfId="0" builtinId="0" customBuiltin="1"/></cellStyles><dxfs count="0"/>'
							+ '<tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/><extLst>'
							+ '<ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main"><x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/></ext>' 
							+ '<ext uri="{9260A510-F301-46a8-8635-F512D64BE5F5}" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"><x15:timelineStyles defaultTimelineStyle="TimeSlicerStyleLight1"/></ext></extLst></styleSheet>';

	for(var i = 0; i < array.length; i++){
		var sheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
						+ '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" '
						+ 'xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'
						+ '<dimension ref="A1:' + ( integerToChars(array[i].header.length - 1) + (array[i].table.length + 1)) + '"/><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetFormatPr defaultColWidth="12" defaultRowHeight="15" x14ac:dyDescent="0.25"/>';
	
		sheet += '<sheetData>';

		sheet += '<row r="1" spans="1:' + (array[i].header.length) + '" x14ac:dyDescent="0.25">';
		for(var j = 0; j < array[i].header.length; j++)
			sheet += '<c r="' + (integerToChars(j)) + ('1') + '" s="0" t="s"><v>' + shareString(replaceText(array[i].header[j])) + '</v></c>'
		sheet += '</row>';

		for(var k = 0; k < array[i].table.length; k++){
			sheet += '<row r="' + (k + 2) + '" spans="1:' + (array[i].table[k].length) + '" x14ac:dyDescent="0.25">';
			for(var j = 0; j < array[i].table[k].length; j++)
				sheet += '<c r="' + (integerToChars(j)) + (k + 2) + '" s="' + BOOK.style[i] + '"><v>' + array[i].table[k][j] + '</v></c>'
			sheet += '</row>';
		}

		sheet += '</sheetData>';
		sheet += '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/></worksheet>';

		xlsx.xl.sheet.push(sheet);
	}



	xlsx.xl.sharedStrings = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="' + sharedStrings.length + '" uniqueCount="' + sharedStrings.length + '">';
	for(var i = 0; i < sharedStrings.length; i++)	xlsx.xl.sharedStrings += '<si><t>' + sharedStrings[i] + '</t></si>';
	xlsx.xl.sharedStrings += '</sst>';

	for(var i = 0; i < xlsx.xl.sheet.length; i++)	xlsx.content_types += '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
	xlsx.content_types += '</Types>';

	var zip = new JSZip();
	var _rels = zip.folder("_rels");
	var docProps = zip.folder("docProps");
	var xl = zip.folder("xl");

	_rels.file(".rels", xlsx.rels);
	zip.file("[Content_Types].xml", xlsx.content_types);

	docProps.file("app.xml", xlsx.docProps.app);
	docProps.file("core.xml", xlsx.docProps.core);

	var xl_rels = xl.folder("_rels");
	var xl_theme = xl.folder("theme");
	var xl_worksheets = xl.folder("worksheets");

	xl.file("sharedStrings.xml", xlsx.xl.sharedStrings);
	xl.file("styles.xml", xlsx.xl.style);
	xl.file("workbook.xml", xlsx.xl.workbook);

	xl_rels.file("workbook.xml.rels", xlsx.xl.rels);
	xl_theme.file('theme1.xml', xlsx.xl.theme1);

	for(var i = 0; i < xlsx.xl.sheet.length; i++)
		xl_worksheets.file('sheet' + (i + 1) + '.xml', xlsx.xl.sheet[i]);

	var filename = (name)? name : 'default';
	zip.generateAsync({type:"blob"}).then(function(content) {
		saveAs(content, filename + ".xlsx");	// FileSaver.js
	});


	function shareString(string){
		var index;
		for(var i = 0; i < sharedStrings.length; i++){
			if(sharedStrings[i] == string)
				index = i;
		}
		if(!index){
			index = sharedStrings.length;
			sharedStrings[index] = string;
		}
		return index;
	}

	function replaceText(text){
		if(typeof text != 'string')	return text;
		text = text.replace(/&/g, '&amp;');
		text = text.replace(/\*/g,'&#042;');
		text = text.replace(/</g, '&lt;');
		text = text.replace(/>/g, '&gt;');
		return text;
	}
	function replaceSheetName(text){
		if(typeof text == 'number')			text += '';
		else if(typeof text != 'string')	return '';
		text = text.replace(/&/g, '&amp;');
		text = text.replace(/\*/g,'x');
		text = text.replace(/\\/g,'_');
		text = text.replace(/\//g,'_');
		text = text.replace(/`/g,'\'');
		text = text.replace(/</g, '&lt;');
		text = text.replace(/>/g, '&gt;');
		text = text.replace(/\[/g, '(');
		text = text.replace(/\]/g, ')');
		if(text.length > 31) text = text.substring(0, 31);
		return text;
	}
	function cut_sheet_name(text, length){
		if(!length)							length = 29;
		if(typeof text != 'string')			return 'error';
		if(text.length > length)			text = text.substring(0, length);
		return text;
	}
	
	function integerToChars(value){ 	
		var AB = '';
		if(value > 25){
			var new_value = value%26;
			var new_value_rec = (value - new_value)/26;
			AB = integerToChars(new_value_rec - 1);
			value = new_value;
		}
		return (AB + String.fromCharCode(value + 65));
	}
}