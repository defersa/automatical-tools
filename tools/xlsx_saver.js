

function object_to_xlsx(setting, array){
	var xlsx = {};
	if(!setting)									setting = {};	
	if(setting.oneSheet && array.length == 1)		setting.oneSheet = false;
	
	xlsx.docProps = {};
	xlsx.xl = {};
	xlsx.xl.sheet = [];
	xlsx.xl.comments = [];
	xlsx.xl.drawings = [];
	xlsx.xl.sheet_rels = [];

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

	var sheet_amount = ((setting.oneSheet)? (1) : (array.length)) + ((setting.TOC)? 1 : 0);

	xlsx.docProps.app = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
						+ '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
						+ '<Application>Microsoft Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Sheets</vt:lpstr></vt:variant>'
						+ '<vt:variant><vt:i4>' + sheet_amount + '</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="' + sheet_amount + '" baseType="lpstr">';
	xlsx.xl.workbook = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
						+ '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x15" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main">'
						+ '<fileVersion appName="xl" lastEdited="7" lowestEdited="7" rupBuild="17329"/><workbookPr defaultThemeVersion="164011"/><mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">'
						+ '<mc:Choice Requires="x15"></mc:Choice></mc:AlternateContent><bookViews><workbookView xWindow="0" yWindow="0" windowWidth="21570" windowHeight="9270"/></bookViews><sheets>';

	var sheet_names = [];
	if(!setting.sheetNames){
		for(var i = 0; i < array.length; i++)	sheet_names[i] = i + 1;
	} else {
		for(var i = 0; i < array.length; i++)	sheet_names[i] = 0;
		for(var i = 0; i < array.length; i++){
			for(var j = i + 1; j < array.length; j++){
				if(cut_sheet_name(array[i].annotation).toLowerCase() == cut_sheet_name(array[j].annotation).toLowerCase())					sheet_names[j] += 1;
			}
		}
		for(var i = 0; i < array.length; i++){	sheet_names[i] = cut_sheet_name(array[i].annotation) + ((sheet_names[i] != 0) ? ('_' + sheet_names[i]) : '');	}
	} 

	var count = 1;
	if(setting.TOC){
		xlsx.docProps.app			+= '<vt:lpstr>TOC</vt:lpstr>';
		xlsx.xl.rels				+= '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>';
		xlsx.xl.workbook			+= '<sheet name="TOC" sheetId="1" r:id="rId1"/>';
		count++;
	}
	if(setting.oneSheet){
		xlsx.docProps.app			+= '<vt:lpstr>Sheet</vt:lpstr>';
		xlsx.xl.rels				+= '<Relationship Id="rId' + count + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + count + '.xml"/>';
		xlsx.xl.workbook			+= '<sheet name="sheet" sheetId="' + count + '" r:id="rId' + count + '"/>';
		count++;
	} else {
		for(var i = 0; i < sheet_names.length; i++)
			xlsx.docProps.app		+= '<vt:lpstr>' + replaceSheetName(sheet_names[i]) + '</vt:lpstr>';
		for(var supreme = array.length + count, start = count; count < supreme; count++){
			xlsx.xl.rels			+= '<Relationship Id="rId' + count + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + count + '.xml"/>';
			xlsx.xl.workbook		+= '<sheet name="' + replaceSheetName(sheet_names[count - start])  + '" sheetId="' + count + '" r:id="rId' + count + '"/>';
		}
	}

	xlsx.xl.workbook += '</sheets><calcPr calcId="0"/></workbook>';
	xlsx.xl.rels += '<Relationship Id="rId' + (count) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>'
						+ '<Relationship Id="rId' + (count + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
						+ '<Relationship Id="rId' + (count + 2) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/></Relationships>';
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

	var numFmts =  [{symbol: "", round: 0, id: 1},
					{symbol: "", round: 2, id: 2},
					{symbol: "%", round: 0, id: 9},
					{symbol: "%", round: 2, id: 10},];
	var cellXfs = [];

	for(var i = 0; i < array.length; i++){
		if(array[i].object == undefined) array[i].object = {};
		if(array[i].object.round_types != undefined){
			array[i].object.styles = [];

			for(var j = 0; j < array[i].object.round_types.length; j++){

				if(array[i].object.units_types[j] == undefined)
					array[i].object.units_types[j] = '';

				var numFmt_Id = -1;
				for(var k = 0; k < numFmts.length; k++){
					if(numFmts[k].symbol == array[i].object.units_types[j] && numFmts[k].round == array[i].object.round_types[j]){
						numFmt_Id = numFmts[k].id;
						break;
					}
				}
				if(numFmt_Id == -1){
					numFmt_Id = numFmts.length + 160;
					numFmts[numFmts.length] = {symbol: array[i].object.units_types[j], round: array[i].object.round_types[j], id: numFmt_Id};
				}
				var cellXfs_id = -1;
				for(var k = 0; k < cellXfs.length; k++){
					if(cellXfs[k].numFmts == numFmt_Id && cellXfs[k].type == j){
						cellXfs_id = k;
						break;
					}
				}
				if(cellXfs_id == -1){
					cellXfs_id = cellXfs.length;
					cellXfs[cellXfs_id] = {numFmts: numFmt_Id, type: j};
				}

				array[i].object.styles[j] = cellXfs_id + 6;
			}
		}
	}

	var numFmts_string = '';
	if(numFmts.length > 4){
		numFmts_string = '<numFmts count="' + (numFmts.length - 4) + '">'
		for(var i = 4; i < numFmts.length; i++){
			var count_of_none = '0.';
			for(var j = 0; j < numFmts[i].round; j++)
				count_of_none += '0'
			numFmts_string += '<numFmt numFmtId="' + numFmts[i].id + '" formatCode="' + count_of_none + numFmts[i].symbol + '"/>';
		}
		numFmts_string += '</numFmts>';
	}

	var cellXfs_string = '';
	var additional_text = ' fontId="0" borderId="3" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1" applyNumberFormat="1"><alignment horizontal="right" vertical="top" wrapText="1"/></xf>';
	for(var i = 0; i < cellXfs.length; i++){
		if(cellXfs[i].type == 0 )			cellXfs_string += '<xf numFmtId="' + cellXfs[i].numFmts + '" fillId="3"' + additional_text;
		else if(cellXfs[i].type == 1 )		cellXfs_string += '<xf numFmtId="' + cellXfs[i].numFmts + '" fillId="4"' + additional_text;
		else if(cellXfs[i].type == 2 )		cellXfs_string += '<xf numFmtId="' + cellXfs[i].numFmts + '" fillId="5"' + additional_text;
		else if(cellXfs[i].type == 3 )		cellXfs_string += '<xf numFmtId="' + cellXfs[i].numFmts + '" fillId="6"' + additional_text;
		else if(cellXfs[i].type == 4 )		cellXfs_string += '<xf numFmtId="' + cellXfs[i].numFmts + '" fillId="3"' + additional_text;
		else if(cellXfs[i].type == 5 )		cellXfs_string += '<xf numFmtId="' + cellXfs[i].numFmts + '" fillId="3"' + additional_text;
		else if(cellXfs[i].type == 6 )		cellXfs_string += '<xf numFmtId="' + cellXfs[i].numFmts + '" fillId="6"' + additional_text;
	}
	var colors = (setting.background) ? ['FFFFFF','E5FBFF','FFECF1','FFFCEC','F1F1F1'] : ['FFFFFF','FFFFFF','FFFFFF','FFFFFF','FFFFFF'] ;

	xlsx.xl.style = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
							+ '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"'
							+ ' mc:Ignorable="x14ac x16r2" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:x16r2="http://schemas.microsoft.com/office/spreadsheetml/2015/02/main">' 
							+ numFmts_string + '<fonts count="3" x14ac:knownFonts="1"><font><sz val="10"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/><charset val="204"/></font><font><u/>'
							+ '<sz val="10"/><color rgb="FF0563C1"/><name val="Arial"/><family val="2"/><charset val="204"/></font><font>' 
							+ '<sz val="8"/><color rgb="FF000000"/><name val="Verdana"/><family val="2"/><charset val="204"/></font></fonts>'
							+ '<fills count="7">'
							+ '<fill><patternFill patternType="none"/></fill>'
							+ '<fill><patternFill patternType="gray125"/></fill>'  
							+ '<fill><patternFill patternType="solid"><fgColor rgb="FF' + colors[4] + '"/><bgColor rgb="FF' + colors[4] + '"/></patternFill></fill>' 
							+ '<fill><patternFill patternType="solid"><fgColor rgb="FF' + colors[0] + '"/><bgColor rgb="FF' + colors[0] + '"/></patternFill></fill>'
							+ '<fill><patternFill patternType="solid"><fgColor rgb="FF' + colors[1] + '"/><bgColor rgb="FF' + colors[1] + '"/></patternFill></fill>' 
							+ '<fill><patternFill patternType="solid"><fgColor rgb="FF' + colors[2] + '"/><bgColor rgb="FF' + colors[2] + '"/></patternFill></fill>' 
							+ '<fill><patternFill patternType="solid"><fgColor rgb="FF' + colors[3] + '"/><bgColor rgb="FF' + colors[3] + '"/></patternFill></fill></fills>' 
							+ '<borders count="4">'
							+ '<border><left/><right/><top/><bottom/><diagonal/></border>' 
							+ '<border><left style="thin"><color rgb="FFCCCCCC"/></left><right style="thin"><color rgb="FFCCCCCC"/></right><top style="thin"><color rgb="FFCCCCCC"/></top><bottom style="thin"><color rgb="FFCCCCCC"/></bottom><diagonal/></border>' 
							+ '<border><left style="thin"><color rgb="FFFFFFFF"/></left><right style="thin"><color rgb="FFFFFFFF"/></right><top style="thin"><color rgb="FFFFFFFF"/></top><bottom style="thin"><color rgb="FFFFFFFF"/></bottom><diagonal/></border>' 
							+ '<border><left style="thin"><color rgb="FFCCCCCC"/></left><right style="thin"><color rgb="FFCCCCCC"/></right><top style="thin"><color rgb="FFCCCCCC"/></top><bottom style="thin"><color rgb="FFCCCCCC"/></bottom><diagonal/></border>'
							+ '</borders><cellStyleXfs count="2">'
							+ '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>'
							+ '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0"/>'
							+ '</cellStyleXfs><cellXfs count="' + (5 + cellXfs.length) + '">'
							+ '<xf numFmtId="0" fontId="0" fillId="0" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>' 
							+ '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="1" applyFont="1" applyFill="1" applyBorder="1"/>'
							+ '<xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="1" applyFont="1" applyFill="1" applyBorder="1"/>'
							+ '<xf numFmtId="0" fontId="0" fillId="2" borderId="3" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>'
							+ '<xf numFmtId="0" fontId="0" fillId="2" borderId="3" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf>'
							+ '<xf numFmtId="0" fontId="0" fillId="2" borderId="3" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" textRotation="90" wrapText="1"/></xf>'

							+ cellXfs_string

							+ '</cellXfs><cellStyles count="2"><cellStyle name="Hyperlink" xfId="1"/><cellStyle name="Обычный" xfId="0" builtinId="0" customBuiltin="1"/></cellStyles><dxfs count="0"/>'
							+ '<tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/><extLst>'
							+ '<ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main"><x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/></ext>' 
							+ '<ext uri="{9260A510-F301-46a8-8635-F512D64BE5F5}" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"><x15:timelineStyles defaultTimelineStyle="TimeSlicerStyleLight1"/></ext></extLst></styleSheet>';


	var sharedStrings = [];		var merg = [];
	var annotation_cell = [];	var link_cell = [];
	var row = 1;
	var sheet = '';

	for(var l = 0; l < array.length; l++){
		
		if(!array[l].object)		array[l].object = {};
		if(!array[l].object.col)	array[l].object.col = [];
		if(!array[l].description)	array[l].description = [];
		
		link_cell[l] = row;
		if(array[l].object.col.length > 0 && !setting.oneSheet){
			sheet += '<cols>';
			for(var i = 1; i <= array[l].object.col.length; i++)
				sheet += '<col min="' + (i) + '" max="' + (i) + '" width="' + ((array[l].object.col[i - 1])/7) + '" style="0" customWidth="1"/>';
			sheet += '</cols>';
		}
		if(!setting.oneSheet)		sheet += '<sheetData>'

		for(var j = 0; j < array[l].description.length; j++){
			var prefix = (setting.descPrefix[j])? setting.descPrefix[j] : '';
			var string = prefix + ' ' + ((array[l].description[j])? array[l].description[j] : '');

			sheet += '<row r="' + row + '" spans="1:1" x14ac:dyDescent="0.25"><c r="A' + row + '" s="0" t="s"><v>' + shareString(replaceText(string)) + '</v></c></row>';
			row++;
		}	
		annotation_cell[l] = row;

		if(array[l].object.array){
			var table = [];
			for(var i = 0; i < array[l].object.row.length; i++){
				table[i] = [];
				for(var j = 0; j < array[l].object.array[i].length; j++)
					table[i][array[l].object.array[i][j].j] = array[l].object.array[i][j];
			}

			for(var i = 0; i < table.length; i++){
				sheet += '<row r="' + row + '" spans="1:' + array[l].object.col.length + '" x14ac:dyDescent="0.25">'; // ht="' + (array[l].object.row[i]) + '" customHeight="1"
				for(var j = 0; j < array[l].object.col.length; j++){
					if(table[i][j] != undefined){

						var cell = table[i][j];
						if(cell.type == 'header' || cell.type == 'header vert' || cell.type == 'header left' || cell.type == 'corner'){

							if(cell.type == 'corner')						sheet += '<c r="' + (integerToChars(cell.j)) + (row) + '" s="3" t="s"><v>' + ((setting.cornerName) ? shareString(replaceText(array[l].annotation)) : '') + '</v></c>';
							else if(cell.type == 'header')					sheet += '<c r="' + (integerToChars(cell.j)) + (row) + '" s="3" t="s"><v>' + shareString(replaceText(cell.text)) + '</v></c>';
							else if(cell.type == 'header left')				sheet += '<c r="' + (integerToChars(cell.j)) + (row) + '" s="4" t="s"><v>' + shareString(replaceText(cell.text)) + '</v></c>';
							else if(cell.type == 'header vert')				sheet += '<c r="' + (integerToChars(cell.j)) + (row) + '" s="5" t="s"><v>' + shareString(replaceText(cell.text)) + '</v></c>';
							 							
							if(cell.rowspan != 1 || cell.colspan != 1)
								merg[merg.length] = '<mergeCell ref="' + (integerToChars(cell.j)) + (row) + ':' + (integerToChars(cell.j + cell.colspan - 1)) + (row + cell.rowspan - 1) + '"/>';
						} else {
							if(typeof cell.text == 'number'){
								if(cell.type == 0 || cell.type == 3 || cell.type == 5 || cell.type == 6)		sheet += '<c r="' + (integerToChars(cell.j)) + (row) + '" s="' + array[l].object.styles[cell.type] + '"><v>' + parseFloat(cell.text) + '</v></c>';
								if(cell.type == 1 || cell.type == 2)											sheet += '<c r="' + (integerToChars(cell.j)) + (row) + '" s="' + array[l].object.styles[cell.type] + '"><v>' + ((array[l].object.units_types[cell.type])? (parseFloat(cell.text)/100) : parseFloat(cell.text)) + '</v></c>';
							} else																				sheet += '<c r="' + (integerToChars(cell.j)) + (row) + '" s="' + array[l].object.styles[cell.type] + '"/>';
						}
					} else {
						var cell_style = array[l].object.styles[cell.type];
						if(cell_style == undefined)							cell_style = 3;

						sheet += '<c r="' + (integerToChars(j)) + (row) + '" s="1"><v></v></c>';
					}
				}
				sheet += '</row>';
				row++;
			}			
		} else if(setting.annotation){
			sheet += '<row r="' + row + '" spans="1:1" x14ac:dyDescent="0.25"><c r="A' + row + '" s="3" t="s"><v>' + ((setting.cornerName)? shareString(replaceText(array[l].annotation)) : '') + '</v></c></row>';
			row++;
		}

		if(!setting.oneSheet){
			sheet += '</sheetData>';
			if(merg.length > 0){
				sheet +=  '<mergeCells count="' + merg.length + '">';
				for(var i = 0; i < merg.length; i++)
					sheet +=  merg[i];
				sheet +=  '</mergeCells>';
			}
			var col_length = ((array[l].object.col != 0)? (array[l].object.col.length - 1) : (0));
			sheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
						+ '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'
						+ '<dimension ref="A1:' + ( integerToChars(col_length) + (row - 1)) + '"/><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetFormatPr defaultColWidth="12" defaultRowHeight="15" x14ac:dyDescent="0.25"/>' + sheet
						+ '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>' + ( (setting.annotation)? '<legacyDrawing r:id="rId1"/>' : '' ) + '</worksheet>';
		
			xlsx.xl.sheet.push(sheet);
			
			row = 1;
			merg = [];
			sheet = '';
		} else row++;
	}
	if(setting.oneSheet){
		sheet += '</sheetData>';
		if(merg.length > 0){
			sheet +=  '<mergeCells count="' + merg.length + '">';
			for(var i = 0; i < merg.length; i++)	sheet +=  merg[i];
			sheet +=  '</mergeCells>';
		}
		var col_length = 1;
		for(var i = 0; i < array.length; i++){
			if(array[i].object.col.length > col_length)
				col_length = array[i].object.col.length;
		}
		var cols = '<cols>';
		for(var i = 1; i < col_length; i++)	sheet += '<col min="' + (i) + '" max="' + (i) + '" width="15" style="0" customWidth="1"/>';
		cols += '</cols>';
		
		sheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
					+ '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'
					+ '<dimension ref="A1:' + ( integerToChars(col_length) + (row - 2)) + '"/><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetFormatPr defaultColWidth="12" defaultRowHeight="15" x14ac:dyDescent="0.25"/><sheetData>' + cols + sheet
					+ '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>' + ( (setting.annotation)? '<legacyDrawing r:id="rId1"/>' : '' ) + '</worksheet>';
	
		xlsx.xl.sheet.push(sheet);
	}

	if(setting.TOC){
		xlsx.xl.sheet.splice(0, 0, '');
		xlsx.xl.sheet[0] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
						+ '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'
						+ '<dimension ref="A1:E' + array.length + '"/><sheetViews><sheetView tabSelected="1" workbookViewId="0"/></sheetViews><sheetFormatPr defaultRowHeight="15" x14ac:dyDescent="0.25"/>'
						+ '<cols><col min="1" max="5" width="28.5703125" style="1" customWidth="1"/><col min="6" max="16384" width="9.140625" style="1"/></cols><sheetData>';

		for(var i = 0; i < array.length; i++){
			if(!array[i].description)	array[i].description = [];
			var sheet_name = (setting.sheetNames)? sheet_names[i] : ('Table ' + sheet_names[i]);
			xlsx.xl.sheet[0] +=  '<row r="' + (i + 1) + '" spans="1:5" x14ac:dyDescent="0.25"><c r="A' + (i + 1) + '" s="2" t="s">	<v>' + shareString(replaceSheetName(sheet_name)) + '</v></c>';
			for(var j = 0; j < array[i].description.length; j++)	xlsx.xl.sheet[0] += '<c r="' + integerToChars(j + 1) + (i + 1) + '" s="1" t="s"><v>' + shareString(replaceText(array[i].description[j])) + '</v></c>';
			xlsx.xl.sheet[0] += '</row>';
		}
		xlsx.xl.sheet[0] += '</sheetData><hyperlinks>';

		if(setting.oneSheet){
			for(var i = 0; i < array.length; i++)		xlsx.xl.sheet[0] += '<hyperlink ref="A' + (i + 1) +'" location="sheet!A' + link_cell[i] + '" display="sheet!A' + link_cell[i] + '" />';
		} else {
			for(var i = 0; i < array.length; i++)		xlsx.xl.sheet[0] += '<hyperlink ref="A' + (i + 1) +'" location="\'' + replaceText( sheet_names[i]) + '\'!A1" display="' + replaceText((setting.sheetNames)? sheet_names[i] : ('Table ' + sheet_names[i])) + '"/>';
		}
		xlsx.xl.sheet[0] += '</hyperlinks><pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/></worksheet>';
	}

	if(setting.annotation){
		if(setting.oneSheet){
			xlsx.xl.drawings[0] = '<xml xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><o:shapelayout v:ext="edit">'
									+ '<o:idmap v:ext="edit" data="' + (i + 1) + '"/></o:shapelayout><v:shapetype id="_x0000_t202" coordsize="21600,21600" o:spt="202" path="m,l,21600r21600,l21600,xe">'
									+ '<v:stroke joinstyle="miter"/><v:path gradientshapeok="t" o:connecttype="rect"/></v:shapetype>';
			for(var i = 0; i < array.length; i++){
				xlsx.xl.drawings[0] += '<v:shape id="_x0000_s' + (1025 + i) + '" type="#_x0000_t202" style=\'position:absolute; margin-left:90.75pt;margin-top:82.5pt;width:132pt;height:77.25pt;z-index:1; visibility:hidden;mso-wrap-style:tight\' fillcolor="infoBackground [80]"  strokecolor="none [81]" o:insetmode="auto">'
									+ '<v:fill color2="infoBackground [80]"/><v:shadow color="none [81]" obscured="t"/><v:path o:connecttype="none"/><v:textbox style=\'mso-direction-alt:auto\'><div style=\'text-align:left\'></div>'
									+ '</v:textbox><x:ClientData ObjectType="Note"><x:MoveWithCells/><x:SizeWithCells/><x:Anchor>1, 41, 5, 10, 3, 57, 7, 7</x:Anchor><x:AutoFill>False</x:AutoFill>'
									+ '<x:Row>' + (annotation_cell[i] - 1) + '</x:Row><x:Column>0</x:Column></x:ClientData></v:shape>';
			}
			xlsx.xl.drawings[0] += '</xml>';
		} else {
			for(var i = 0; i < array.length; i++){
				xlsx.xl.drawings[i] = '<xml xmlns:v="urn:schemas-microsoft-com:vml"xmlns:o="urn:schemas-microsoft-com:office:office"xmlns:x="urn:schemas-microsoft-com:office:excel"><o:shapelayout v:ext="edit"><o:idmap v:ext="edit" data="' + (i + 1) + '"/>'
									+ '</o:shapelayout><v:shapetype id="_x0000_t202" coordsize="21600,21600" o:spt="202"path="m,l,21600r21600,l21600,xe"><v:stroke joinstyle="miter"/><v:path gradientshapeok="t" o:connecttype="rect"/></v:shapetype>'
									+ '<v:shape id="_x0000_s1025" type="#_x0000_t202" style=\'position:absolute; margin-left:90.75pt;margin-top:82.5pt;width:132pt;height:77.25pt;z-index:1; visibility:hidden;mso-wrap-style:tight\' fillcolor="infoBackground [80]"  strokecolor="none [81]" o:insetmode="auto">'
									+ '<v:fill color2="infoBackground [80]"/><v:shadow color="none [81]" obscured="t"/><v:path o:connecttype="none"/><v:textbox style=\'mso-direction-alt:auto\'><div style=\'text-align:left\'></div>'
									+ '</v:textbox><x:ClientData ObjectType="Note"><x:MoveWithCells/><x:SizeWithCells/><x:Anchor>1, 41, 5, 10, 3, 57, 7, 7</x:Anchor><x:AutoFill>False</x:AutoFill>'
									+ '<x:Row>' + (annotation_cell[i] - 1) + '</x:Row><x:Column>0</x:Column></x:ClientData></v:shape></xml>';
			}
		}
		
		if(setting.oneSheet){
			xlsx.xl.comments[0] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><comments xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><authors><author>StudyLab</author></authors><commentList>';
			for(var i = 0; i < array.length; i++)
				xlsx.xl.comments[0] += '<comment ref="A' + annotation_cell[i] + '" authorId="0" shapeId="0"><text><r><rPr><sz val="11"/><color rgb="FF000000"/><rFont val="Calibri"/><family val="2"/><charset val="204"/>'
									+ '</rPr><t>' + replaceText(array[i].annotation) + '</t></r></text></comment>';			
			xlsx.xl.comments[0] += '</commentList></comments>';
			xlsx.xl.sheet_rels[0] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
									+ '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments" Target="../comments1.xml"/>'
									+ '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing" Target="../drawings/vmlDrawing1.vml"/></Relationships>';
		} else {
			for(var i = 0; i < array.length; i++)
				xlsx.xl.comments[i] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><comments xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
									+ '<authors><author>StudyLab</author></authors><commentList><comment ref="A' + annotation_cell[i] + '" authorId="0" shapeId="0">'
									+ '<text><r><rPr><sz val="11"/><color rgb="FF000000"/><rFont val="Calibri"/><family val="2"/><charset val="204"/>'
									+ '</rPr><t>' + replaceText(array[i].annotation) + '</t></r></text></comment></commentList></comments>';
			for(var i = 0; i < array.length; i++)
				xlsx.xl.sheet_rels[i] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
									+ '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments" Target="../comments' + (i + 1) + '.xml"/>'
									+ '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing" Target="../drawings/vmlDrawing' + (i + 1) + '.vml"/></Relationships>';
		}
				
		for(var i = 0; i < xlsx.xl.comments.length; i++)
			xlsx.content_types += '<Override PartName="/xl/comments' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml"/>';
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

	for(var i = 0; i < xlsx.xl.sheet.length; i++)						xl_worksheets.file('sheet' + (i + 1) + '.xml', xlsx.xl.sheet[i]);
	if(setting.annotation){
		var xl_drawings = xl.folder("drawings");
		for(var i = 0; i < xlsx.xl.drawings.length; i++)				xl_drawings.file('vmlDrawing' + (i + 1) + '.vml', xlsx.xl.drawings[i]);
		for(var i = 0; i < xlsx.xl.comments.length; i++)				xl.file('comments' + (i + 1) + '.xml', xlsx.xl.comments[i]);

		var xl_worksheets_rels = xl_worksheets.folder("_rels");
		for(var i = 0; i < xlsx.xl.sheet_rels.length; i++){
			if(xlsx.xl.sheet_rels.length != xlsx.xl.sheet.length)		xl_worksheets_rels.file('sheet' + (i + 2) + '.xml.rels', xlsx.xl.sheet_rels[i]);
			else 														xl_worksheets_rels.file('sheet' + (i + 1) + '.xml.rels', xlsx.xl.sheet_rels[i]);
		}
	}

	var filename = (setting.fileName)? setting.fileName : 'default';
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
	function cut_sheet_name(text){
		if(typeof text != 'string')			return 'error';
		if(text.length > 29)				text = text.substring(0, 29);
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
