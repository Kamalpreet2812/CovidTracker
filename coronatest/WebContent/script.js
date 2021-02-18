var confirmedcases = document.getElementById("confirmedcases");
var recoveredcases = document.getElementById("recoveredcases");
var deathcases = document.getElementById("deathcases");
var newconfirmedcases = document.getElementById("newconfirmedcases");
var newrecoveredcases = document.getElementById("newrecoveredcases");
var newdeathcases = document.getElementById("newdeathcases");
var countries = document.getElementById("country");
var cname = document.getElementById("cname");
var tc=0,tcp;
AOS.init();
var url1 = "https://api.coronatracker.com/v3/stats/worldometer/global" 
var url = "https://api.coronatracker.com/v3/stats/worldometer/country";
var global = '';
var allcountries = '';

var currentTime = new Date();
var currentTime1 = new Date();
var pd = currentTime.getDate(currentTime.setDate(currentTime.getDate()-14));
var pm = currentTime.getMonth(currentTime.setDate(currentTime.getDate()-0))+1;
var py = currentTime.getFullYear(currentTime.setDate(currentTime.getDate()-0));

var cd = currentTime1.getDate();
var cm = currentTime1.getMonth()+1;
var cy = currentTime1.getFullYear();

if(cm<=9) cm = "0"+cm;
if(pm<=9) pm = "0"+pm;
if(cd<=9) cd = "0"+cd;
if(pd<=9) pd = "0"+pd;


$.getJSON(url1,function(data){
        global=data;
        document.getElementById("spinner-border").style.display="none";
        confirmedcases.innerHTML = data.totalConfirmed;
        recoveredcases.innerHTML = data.totalRecovered;
        deathcases.innerHTML = data.totalDeaths;
        newconfirmedcases.innerHTML = data.totalNewCases;
        newrecoveredcases.innerHTML = data.totalActiveCases;
        newdeathcases.innerHTML = data.totalNewDeaths;
        cname.innerHTML='<i class="fa fa-globe" aria-hidden="true"></i>Global';
        var recoveryrate = global.totalRecovered * 100 / global.totalConfirmed;
        document.getElementById("recoveryRate").innerHTML='<div class="recoveryprogressbar"><div class="circle" id="circle"><div></div></div></div>';
        progressbar(recoveryrate,'.recoveryprogressbar','.circle','circle','green');
        var fatalityrate = global.totalDeaths * 100 / global.totalConfirmed;
        document.getElementById("fatalityRate").innerHTML='<div class="fatalityprogressbar"><div class="circle1" id="circle1"><div></div></div></div>';
        progressbar(fatalityrate,'.fatalityprogressbar','.circle1','circle1','#fb4f14');
        pie();
});

$.getJSON(url,function(data){
    allcountries = data;
    data.forEach(function(event){
        var option = document.createElement("option");
        option.setAttribute("id",event.countryCode);
        option.value = event.country;
        countries.appendChild(option);
    });
    table(data);
});

function table(data)
{
    var table = document.getElementById("table");
    table.innerHTML+="<thead><tr><th>Countries</th><th>Confirmed</th><th>Recovered</th><th>Deaths</th></tr></thead>"
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    data.forEach(function(event){
        var tr = document.createElement("tr");
        tr.setAttribute("id",event.country);
        tr.setAttribute("onclick","Search(this.id)");
        var td1 = document.createElement("td");
        var i =document.createElement("i");
       
        if(event.countryCode!==null)
            i.classList.add("flag-icon","flag-icon-"+event.countryCode.toLowerCase());  
        else
            i.classList.add("fas","fa-flag");
        
        td1.appendChild(i);
        td1.innerHTML+=" "+event.country;
        tr.appendChild(td1);
        var td = "<td>"+event.totalConfirmed+"</td><td>"+event.totalRecovered+"</td><td>"+event.totalDeaths+"</td>";
        tr.innerHTML+=td;
        tbody.appendChild(tr);
        
        tc+=event.totalCritical;
    });
    tcp = tc*100/global.totalConfirmed;
        tcp = tcp.toPrecision(2);
        document.getElementById("totalCritical").innerHTML='<h5>Critical Cases</h5><h2>'+tc+'</h2><p style="color:red;">'+tcp+'% of total cases</p>';
        document.getElementById("totalConfirmedPerMillionPopulation").innerHTML='<h5>Total Confirmed</h5><h2>'+global.totalCasesPerMillionPop+'</h2><p style="color:red;">Per Million Population</p>';
        
        var param = {limit:9};
        news(param);
}


var search = document.getElementById("search");
search.addEventListener("submit",function(e){
    var input = document.getElementById("Country").value;
    Search(input);    
    e.preventDefault();
});

function Search(input){
    input = input.toUpperCase();
    var flag=0;
    var cc;
    var arr = allcountries.filter(function(event){
        var c = event.country.toUpperCase();
        if(input===c)
        {
            cc=event.countryCode;
            flag=1;
            return true;
        }
    });
    
    if(flag==0){
        cname.innerHTML='<i class="fa fa-globe" aria-hidden="true"></i>Global';
         confirmedcases.innerHTML = global.totalConfirmed;
        recoveredcases.innerHTML = global.totalRecovered;
        deathcases.innerHTML = global.totalDeaths;
        newconfirmedcases.innerHTML = global.totalNewCases;
        newrecoveredcases.innerHTML = global.totalActiveCases;
        newdeathcases.innerHTML = global.totalNewDeaths; 
        var recoveryrate = global.totalRecovered * 100 / global.totalConfirmed;
         document.getElementById("recoveryRate").innerHTML="";
        document.getElementById("recoveryRate").innerHTML='<div class="recoveryprogressbar"><div class="circle" id="circle"><div></div></div></div>';
        progressbar(recoveryrate,'.recoveryprogressbar','.circle','circle','green');
        var fatalityrate = global.totalDeaths * 100 / global.totalConfirmed;
        document.getElementById("fatalityRate").innerHTML="";
        document.getElementById("fatalityRate").innerHTML='<div class="fatalityprogressbar"><div class="circle1" id="circle1"><div></div></div></div>';
        progressbar(fatalityrate,'.fatalityprogressbar','.circle1','circle1','#fb4f14');

    
        document.getElementById("totalCritical").innerHTML='<h5>Critical Cases</h5><h2>'+tc+'</h2><p style="color:red;">'+tcp+'% of total cases</p>';
        document.getElementById("totalConfirmedPerMillionPopulation").innerHTML='<h5>Total Confirmed</h5><h2>'+global.totalCasesPerMillionPop+'</h2><p style="color:red;">Per Million Population</p>';
        
        var param = {limit:9};
        news(param);
        pie();
    } 
    else{
        var i =document.createElement("i");  
        if(cc!==null)
            i.classList.add("flag-icon","flag-icon-"+cc.toLowerCase());  
        else
            i.classList.add("fas","fa-flag");
        cname.innerHTML="";
        cname.appendChild(i);
        cname.innerHTML+=input;
        confirmedcases.innerHTML = arr[0].totalConfirmed;
        recoveredcases.innerHTML = arr[0].totalRecovered;
        deathcases.innerHTML = arr[0].totalDeaths;
        newconfirmedcases.innerHTML = arr[0].dailyConfirmed;
        newrecoveredcases.innerHTML = arr[0].activeCases;
        newdeathcases.innerHTML = arr[0].dailyDeaths;
        var recoveryrate = arr[0].totalRecovered * 100 / arr[0].totalConfirmed;
        document.getElementById("recoveryRate").innerHTML="";
        document.getElementById("recoveryRate").innerHTML='<div class="recoveryprogressbar"><div class="circle" id="circle"><div></div></div></div>';
        progressbar(recoveryrate,'.recoveryprogressbar','.circle','circle','green');
        var fatalityrate = arr[0].totalDeaths * 100 / arr[0].totalConfirmed;
        document.getElementById("fatalityRate").innerHTML="";
        document.getElementById("fatalityRate").innerHTML='<div class="fatalityprogressbar"><div class="circle1" id="circle1"><div></div></div></div>';
        progressbar(fatalityrate,'.fatalityprogressbar','.circle1','circle1','#fb4f14');

        var cp = arr[0].totalCritical * 100 / arr[0].totalConfirmed;
        cp = cp.toPrecision(2);
        document.getElementById("totalCritical").innerHTML='<h5>Critical Cases</h5><h2>'+arr[0].totalCritical+'</h2><p style="color:red;">'+cp+'% of total cases</p>';
        document.getElementById("totalConfirmedPerMillionPopulation").innerHTML='<h5>Total Confirmed</h5><h2>'+arr[0].totalConfirmedPerMillionPopulation+'</h2><p style="color:red;">Per Million Population</p>';
    
    var param = {limit:9,country:arr[0].country,countryCode:arr[0].countryCode};
    news(param);
    var param1 = {countryCode:arr[0].countryCode,startDate:py+"-"+pm+"-"+pd,endDate:cy+"-"+cm+"-"+cd};
    charts(param1);

    }
};


function news(param){
    var newsurl = "https://api.coronatracker.com/news/trending?"+$.param(param);
    document.getElementById("newsrow").innerHTML="";    
    $.getJSON(newsurl,function(data){
    console.log(data);
    data.items.forEach(function(event){
        // var a = document.createElement("a");
        
        var divv1 = document.createElement("a");
        divv1.setAttribute("href",event.url);
        divv1.classList.add("row");
        divv1.setAttribute("data-aos","fade-up");
        divv1.style.padding="10px"
        divv1.style.border="1px solid grey";
        divv1.style.textDecoration = "none";
        divv1.style.color="grey";
        divv1.style.boxShadow="10px 10px 8px -6px #888888";

        
        var divv11 = document.createElement("div");
        divv11.classList.add("col-md-4");
        
        var divv12 = document.createElement("div");
        divv12.classList.add("col-md-8");
        
        var img = document.createElement("img");
        img.setAttribute("src",event.urlToImage);
        img.classList.add("newsimg");
        
        divv11.appendChild(img);
        divv12.innerHTML = '<h2>'+event.title+'</h2><h5>'+event.description+'</h5>';
        divv1.appendChild(divv11);
        divv1.appendChild(divv12);
        // divv1.appendChild(a);
        document.getElementById("newsrow").appendChild(divv1);
    });
        console.log(document.getElementById("newsrow"));

});
}

function charts(param1){
    var charturl = "https://api.coronatracker.com/v5/analytics/trend/country?"+$.param(param1);
    var tconfirmed=[];
    var tdeath=[];
    var trecovered=[];
    var dates=[];
    $.getJSON(charturl,function(data){
        console.log(data);
        data.forEach(function(event){
            var d = event.last_updated.slice(0, 10);
            dates.push(d);
            tconfirmed.push(parseInt(event.total_confirmed));
            tdeath.push(event.total_deaths);
            trecovered.push(event.total_recovered);
        });
        printchart(dates,tconfirmed,tdeath,trecovered);
    });
}

function printchart(dates,tconfirmed,tdeath,trecovered){
    var chart = document.getElementById("lineChart");
    
    document.getElementById('piechart').style.display="none";
    document.getElementById('lineChart').style.display="block";
    // chart.innerHTML="";
    let lineChart = new Chart(chart,{
        type:'bar',
        data: {
        labels: dates,
        datasets: [
            {
            label: "Confirmed",
            backgroundColor: "blue",
            data: tconfirmed,
        },
        {
            label: "Death",
            backgroundColor: "red",
            data: tdeath,
        },
        {
            label: "Recovered",
            backgroundColor: "green",
            data: trecovered
        }
        ]
    }    

    });
}

function pie()
{
    document.getElementById('piechart').style.display="block";
    document.getElementById('lineChart').style.display="none";
    google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {

        var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Confirmed', global.totalConfirmed],
          ['Deaths',  global.totalDeaths],
          ['Recovered', global.totalRecovered],
        ]);
        var chart1 = new google.visualization.PieChart(document.getElementById('piechart'));
        chart1.draw(data);
      }
}

function progressbar(percentagee,classes,ids,id,c){
    var percent = document.getElementById(id);
    percent.setAttribute("data-percent",percentagee);
    console.log()
	$(document).ready(function ($) 
    {
		function animateElements() 
        {
			$(classes).each(function ()
            {
				var elementPos = $(this).offset().top;
				var topOfWindow = $(window).scrollTop();
				var percent = $(this).find(ids).attr('data-percent');
				var percentage = parseInt(percent, 10) / parseInt(100, 10);
				var animate = $(this).data('animate');
				if (elementPos < topOfWindow + $(window).height() - 30 && !animate) 
                {
					$(this).data('animate', true);
					$(this).find(ids).circleProgress(
                    {
						startAngle: -Math.PI / 2,
						value: percent / 100,
						size: 180,
						thickness: 30,
						emptyFill: "rgba(0,0,0, .2)",
						fill: {color: c}
					}).on('circle-animation-progress', function (event, progress, stepValue)                     {
						$(this).find('div').text((stepValue*100).toFixed(1) + "%");
					}).stop();
				}
			});
		}
		animateElements();
		$(window).scroll(animateElements);
	}); //end document ready 
}