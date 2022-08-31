import Vue from 'vue'
import moment from 'moment-timezone';
import store from '@/store';

import * as _ from 'underscore';

import bootstrapCss from "!!raw-loader!@/styles/bootstrapCSS.css";

Vue.filter('truncate-text', function (text, stop: number) {
	if(text){
		return (stop < text.length) ? text.slice(0, stop) + '...' : text
	}
	else
		return ''
})

Vue.filter('iso-date', function(date){
	if(date)
		return	moment(date).format('YYYY-MM-DD');
	else
		return ''
})

Vue.filter('beautify-date-mm-dd-yyyy', function(date){
	enum MonthList {'Jan' = 1, 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'}
	if(date)
		return date.substr(8,2) + ' ' + MonthList[Number(date.substr(5,2))] + ' ' + date.substr(0,4);
	else
		return ''
})

Vue.filter('beautify-date', function(date){
	enum MonthList {'Jan' = 1, 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'}
	if(date)
		return MonthList[Number(date.substr(5,2))] + ' ' +date.substr(8,2) + ' ' +  date.substr(0,4);
	else
		return 'unknown'
})

Vue.filter('beautify-date-month', function(date){
	enum MonthList {'January' = 1, 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'}
	if(date)
		return MonthList[Number(date.substr(5,2))] + ' ' +date.substr(8,2) + ', ' +  date.substr(0,4);
	else
		return 'unknown'
})

Vue.filter('beautify-date-month-year', function(date){
	enum MonthList {'January' = 1, 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'}
	
	if(date){

		let dayText = '';
		const dayFirstDigit = Number(date.substr(8,1));		
		const daySecondDigit = Number(date.substr(9,1));
		
		if (daySecondDigit == 1){
			dayText = 'st';
		} else if (daySecondDigit == 3){
			dayText = 'rd';
		} else {
			dayText = 'th';
		}

		const dayName = (dayFirstDigit == 0)?(daySecondDigit + dayText):(Number(date.substr(8,2)) + dayText);

		return dayName + ' day of ' + MonthList[Number(date.substr(5,2))] + ', ' +  date.substr(0,4);
	}
	else
		return 'unknown'
})

Vue.filter('beautify-time', function(time){	
	if(time)
		return time.substr(11,2) + ':' +  time.substr(14,2);
	else
		return ''
})

Vue.filter('convert-time24to12', function(time) {
    const time12 = (Number(time.substr(0,2)) % 12 || 12 ) + time.substr(2,3)
    
    if (Number(time.substr(0,2))<12) {
      return time12 +' AM'
    } else {
      return time12 +' PM'
    }  
})

Vue.filter('beautify-date-blank', function(date){
	enum MonthList {'Jan' = 1, 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'}
	if(date)
		return MonthList[Number(date.substr(5,2))] + ' ' +date.substr(8,2) + ' ' +  date.substr(0,4);
	else
		return ' '
})

Vue.filter('beautify-date-weekday-time', function(date){
	if(date)
		return	moment(date).format('ddd MMM DD, YYYY HH:mm');
	else
		return ''
})

Vue.filter('beautify-date-weekday', function(date){
	if(date)
		return	moment(date).format('ddd, MMM DD, YYYY');
	else
		return ''
})

Vue.filter('beautify-date-weekday-month-day', function(date){
	if(date)
		return	moment(date).format('ddd, MMM DD');
	else
		return ''
})

Vue.filter('scrollToLocation', function(locationName){
	if(locationName){
		Vue.nextTick(()=>{
			const el = document.getElementsByName(locationName)
			if(el[0]) el[0].scrollIntoView();
		})
	}
})

Vue.filter('styleTitle',function(title){
	return "<div style='display:inline; color:#29877c'>" + title + "</div>"
})

Vue.filter('getFullName',function(nameObject){
	if (nameObject) {
		return nameObject.first? nameObject.first: '' +
			" " +
			nameObject.middle? nameObject.middle: '' +
			" " +
			nameObject.last? nameObject.last: '';
	} else{
		return " "
	}
})

Vue.filter('fullName',function(first,last){
	if (first || last) {
		return (
			(first? first+' ': '') +
			(last? last: ''));
	} else{
		return " "
	}
})

Vue.filter('fullAddress',function(address,city,state,postcode){	
	return 	(
		(address?(address +", "):'') +
		(city?(city +", "):'') +
		(state?(state +", "):'') +		
		(postcode?(postcode ):' ')
	);	
})

Vue.filter('getFullAddress',function(nameObject){

	if (nameObject && Object.keys(nameObject).length) {
		return 	(nameObject.street?(nameObject.street +", "):'') +
				(nameObject.city?(nameObject.city +", "):'') +
				(nameObject.state?(nameObject.state +", "):'') +
				(nameObject.country?(nameObject.country +", "):'') +
				(nameObject.postcode?(nameObject.postcode ):' ');
	} else{
		return " "
	}
})

Vue.filter('getFullContactInfo',function(nameObject){
	const pre = "<div style='display:inline; color:#10669c'>"
	const post = "</div>"
	if (nameObject && Object.keys(nameObject).length) {
		return pre+"Phone: "+post+
			(nameObject.phone? nameObject.phone:' - ') +
			" "+pre+"Email: "+post+
			(nameObject.email? nameObject.email:' - ');			
	} else{
		return " "
	}
})

Vue.filter('verifyPhone', function(phone){	
	const phoneFormat = /^[0-9]{3}[\-\.\ ][0-9]{3}[\-\.\ ][0-9]{4}((\s\x[0-9]{4})|)?$/;
	return phoneFormat.test(phone?.trim())
})

Vue.filter('beautify-phone-no', function(num){
	if(num?.trim().length==12)
		return	'('+num.slice(0,3)+') '+num.slice(4,7)+'-'+num.slice(8,12);
	else
		return num
})

Vue.filter('capitalize', function(str: string){
	
	if(str)
		return str.charAt(0).toUpperCase() + (str.slice(1)).toLowerCase();
	else
		return ''
	
})

Vue.filter('capitalizefirst', function(str: string){
	
	if(str)
		return str.charAt(0).toUpperCase() + (str.slice(1));
	else
		return ''
	
})

Vue.filter('initials', function(str: string){	
	if(str){
		const parts = str.split(' ');
		let init = ''
		for(const part of parts){
			init = init + part.trim().charAt(0).toUpperCase() +'.'
		}
		return init
	}
	else
		return ''
	
})




Vue.filter('printPdf', function(html, pageFooterLeft, pageFooterRight){

	const body = 
		`<!DOCTYPE html>
		<html lang="en">
		<head>		
		<meta charset="UTF-8">
		<title>Court Interpreter Scheduling</title>`+
		`<style>`+
			`@page {
				size: 8.5in 11in !important;
				margin: 1.1in 0.4in 0.9in 0.4in !important;
				font-size: 10pt !important;			
				@bottom-left {
					content:`+ pageFooterLeft +
					`white-space: pre;
					font-size: 7pt;
					color: #606060;
				}
				@bottom-right {
					content:`+pageFooterRight+` "  Page " counter(page) " of " counter(pages);
					font-size: 7pt;
					color: #606060;
				}
			}`+
			`@media print{
				div.court-header {
					position: fixed;
					top: -0.7in;
					width:100%; 
					display:inline-block;
				}
				.new-page{
					page-break-before: always;
					position: relative; top: 8em;
				}
				section{
					page-break-inside: avoid;
				}
				.print-block{
					page-break-inside: avoid;
				}
			}`+ //bootstrapCss+
			`@page label{font-size: 9pt;}
			.container {				
				padding: 0 !important; 
				margin: 0 !important;				
				width: 100% !important;
				max-width: 740px !important;
				min-width: 740px !important;			
				font-size: 10pt !important;
				font-family: BCSans !important;
				color: #313132 !important;
			}
			`+
			`td.border-dark {border: 1px solid #313132 !important;}`+
			`th.border-dark {border: 1px solid #313132 !important;}`+
			`th.bg-light {background-color: #EEE !important;}`+
			`td.border-top-0{border-top: 0px solid #FFF !important;border-bottom: 1px solid #313132 !important;border-left: 1px solid #313132 !important; border-right: 1px solid #313132 !important;}`+
			`th.border-bottom-0{border-top: 1px solid #313132 !important;border-bottom: 0px solid #FFF !important;border-left: 1px solid #313132 !important; border-right: 1px solid #313132 !important;}`+
			`tr{height: 1.5rem;}`+
			`table.fullsize {table-layout: fixed; width: 100%; margin-top:0.5rem;}`+
			`table.fullsize tr{border:1px solid #313132; height: 1.0rem;}`+
			`table.fullsize td{padding:0 0 0 .5rem; color: #313132;}`+

			`table.compactfullsize {table-layout: fixed; width: 100%; margin-top:0rem;}`+
			`table.compactfullsize tr{border:1px solid #313132;}`+
			`table.compactfullsize td{padding:0 0 0 .5rem; color: #313132;}`+

			`table.flexsize {table-layout:unset; width: 100%; margin-top:1rem;}`+
			`table.flexsize tr{height: 1.0rem;}`+
			`table.flexsize tr.spacer{height: 0.25rem !important;}`+
			`table.flexsize th{color: #313132;}`+
			`table.flexsize td{color: #313132;}`+		

			`.answer{color: #000; display:inline; font-size:10pt;}`+
			`.answerbox{color: #000; font-size:11pt; display:block; text-indent:0px; margin:0.5rem 0 0.5rem 0 !important;}`+
    		`.answer-record{color: #000; display:inline; font-size:8.5pt;}`+
			`.answer-record-sm{color: #000; display:inline; font-size:7.5pt;}`+
			`.answer-payment{color: #000; font-size:9.5pt; text-align:center!important;}`+
			`.uline{text-decoration: underline; display: inline;}`+
			`.form-header{display:block; margin:0 0 5rem 0;}`+
			`.form-header-po{display:block; margin:0 0 3.25rem 0;}`+
			`.form-header-ppm{display:block; margin:0 0 5.25rem 0;}`+
			`.form-header-cm{display:block; margin:0 0 7rem 0;}`+
			`.form-header-reloc{display:block; margin:0 0 5.25rem 0;}`+
			`.form-one-header{display:block; margin:0 0 3.25rem 0;}`+
			`.form-header-ea{display:block; margin:0 0 6rem 0;}`+
			`.form-header-enf{display:block; margin:0 0 4.5rem 0;}`+
			`.checkbox{margin:0 1rem 0 0;}`+
			`.marginleft{margin:0 0 0 0.07rem;}`+
			`.marginleftminus{margin:0 0 0 -1rem;}`+
			`.marginleftplus{margin:0 0 0 1rem !important;}`+
			`.margintopminus{margin-top:-0.5rem !important;}`+

			`.radio-circle {height:0.73rem; width:0.73rem; display: inline-block; border: 1px solid #BBB;border-radius: 50%;transform:translate(1px,3px);line-height:1rem;}`+			
			`.radio-circle-fill {height: 0.6rem;width: 0.6rem;display: inline-block;border: 1px solid #FFF;border-radius: 50%; transform:translate(0px,-2.5px);}`+
			`section{ counter-increment: question-counter; text-indent: -17px; text-align: justify; text-justify: inter-word; margin: 0.5rem 0.5rem 0.5rem 1rem;}`+ 
			`section:before {font-weight: bolder; content:counter(question-counter) ".";}`+
			`section.resetquestion{counter-reset: question-counter;}`+
			
			`ol.resetcounter{list-style: none;counter-reset: bracket-counter;}`+
			`ol li.bracketnumber{text-indent: -25px;text-align: justify;text-justify: inter-word;margin:1rem 0;counter-increment: bracket-counter;}`+
			`ol li.bracketnumber:before {content:"(" counter(bracket-counter) ") ";font-weight: bold;}`+
			`ol.resetlist {list-style: none;counter-reset: list-counter;}`+
			`ol li.listnumber{text-indent: -25px;text-align: justify;text-justify: inter-word;margin:1rem 0;counter-increment: list-counter;}`+
			`ol li.listnumber:before {content:counter(list-counter) ". ";font-weight: bold;}`+
			`ol.resetcounteralpha {list-style: none;counter-reset: alpha-counter;}`+
			`ol li.bracketalpha{text-indent: -20px;margin:0.075rem 0;counter-increment: alpha;}`+
			`ol li.bracketalpha:before {content:counter(alpha, lower-alpha)") ";}`+				
			`ol.resetcounterroman {list-style: none;counter-reset: roman-counter;}`+			  
			`ol li.bracketroman {text-indent: -20px;margin:0.25rem 0;counter-increment: roman;}`+
			`ol li.bracketroman:before {content:counter(roman, lower-roman)") ";}`+
						
			`
			body{				
				font-family: BCSans;
			}
			`+
		`</style>
		</head>
		<body>
			
				<div class="container">
					`+html+
		`</div></body></html>`	 
	// console.log(body)
	return body
})