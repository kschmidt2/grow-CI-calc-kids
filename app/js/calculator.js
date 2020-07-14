var calculator = new Vue({
    el: '#calculator',
    data: {
      principal: 0,
      frequency:365,
      contribution: 1,
      yearsToGrow: 0,
      interestRate: 7,
      totalPrincipal: '',
      totalReturn: '',
      futureBalance: '',

    },
    methods: {
      // functions go here
      getResults: function () {
        let P = this.principal,
            r = this.interestRate/100,
            n = this.frequency,
            t = 18-this.yearsToGrow,
            PMT = this.contribution,
            totalContributions = P + (PMT*t),
            fvOfPrincipal = P,
            fvOfContributions = 0,
            totalReturn,
            totalInvestment,
            combined,
            iData = [],
            rData = [],
            catArray = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18"],
            tickInterval = 5.

        for (i=0; i<n*t; i++) {
            fvOfPrincipal = fvOfPrincipal*(1+r/n);
            fvOfContributions = (fvOfContributions+PMT)*(1+r/n);
            combined = fvOfPrincipal + fvOfContributions;
            totalInvestment = PMT*(i+1) + P;
            totalReturn = Math.round(combined - totalInvestment);
            iData.push(totalInvestment);
            rData.push(totalReturn);

        }


        iData.unshift(P);
        rData.unshift(0);
        

        iData = iData.filter((element, index) => {
            return index % 365 === 0;
        })
        rData = rData.filter((element, index) => {
            return index % 365 === 0;
        })

        this.yearsToGrow = Number(this.yearsToGrow)

        console.log(this.yearsToGrow)

        catArray = catArray.slice(this.yearsToGrow)
        catArray.unshift("Age " + this.yearsToGrow);
        

        console.log(catArray)


        if (iData.length > 21) {
            tickInterval = 10;
        } else if (iData.length < 6) {
            tickInterval = 1;
        }

        this.drawChart(iData,rData,catArray,tickInterval);

        this.futureBalance = fvOfPrincipal + fvOfContributions;

        totalReturn = this.futureBalance - totalContributions;

        if (this.futureBalance > 999999999) {
            const suffixes = ["", " billion"," trillion"];
            let suffixNum = 0;
            this.futureBalance /= 999999999;
            suffixNum++;
        
            this.futureBalance = this.futureBalance.toPrecision(3);
        
            this.futureBalance += suffixes[suffixNum];
        }

        this.futureBalance = this.futureBalance.toLocaleString(undefined,
            {'minimumFractionDigits':0,'maximumFractionDigits':0});

      },
      drawChart: function(iData,rData,catArray,tickInterval) {

        Highcharts.setOptions({
            lang: {
              thousandsSep: ',',
              numericSymbols: [null, "M", "G", "T", "P", "E"]
            }
        });

        function drawHighcharts() {
            Highcharts.chart('chart-container-CIcalc', {
                chart: {
                    type: 'column',
                    styledMode: true,
                    spacingBottom: 0,
                    spacingRight: 20,
                    spacingLeft: 20,
                    animation: false
                }, 
                title: {
                    text: null
                },
                series: [{
                    name: 'Return',
                    data: rData
                }, {
                    name: 'Investment',
                    data: iData
                }],
                // for line charts only
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    },
                    series: {
                        groupPadding: 0.1
                    }
                },
                legend: {
                    align: 'left',
                    symbolRadius: 0,
                    verticalAlign: 'top',
                    x: -18,
                    itemMarginTop: -10,
                },
                xAxis: {
                    labels: {
                        style: {
                            whiteSpace: 'nowrap',
                        },
                    },
                    categories: catArray,
                    tickLength: 5,
                    tickInterval: tickInterval
                },
                yAxis: {
                    title: false,
                    labels: {
                        overflow: 'allow',
                        formatter: function () {
                            return '$' + Highcharts.numberFormat(this.value,0,'.',',');
                        },
                    },
                    tickAmount: 5,
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    shadow: false,
                    padding: 10,
                    shared: true,
                    valuePrefix: '$'
                },
            })
        }
        
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            drawHighcharts();
        } else {
            document.addEventListener("DOMContentLoaded", drawHighcharts);
        }

      }
    },
    mounted: function(){
        this.getResults()
     },
  })

  function limitNumber () {
    if (this.value.length > this.maxLength) {
        this.value = this.value.slice(0, this.maxLength);
        type = "number"
        maxlength = "2"
    }
  }