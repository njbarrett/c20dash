import React from 'react';
import Layout from '../components/Layout.js'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import fx from 'money'
import accounting from 'accounting'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import AmCharts from '@amcharts/amcharts3-react';

const styles = theme => ({
  card: {
    minWidth: 275,
  },
  pos: {
      marginBottom: 12,
      color: theme.palette.text.secondary,
  },
});

// Generate random data
function generateData() {
  var firstDate = new Date();

  var dataProvider = [];

  for (var i = 0; i < 100; ++i) {
    var date = new Date(firstDate.getTime());

    date.setDate(i);

    dataProvider.push({
      date: date,
      value: Math.floor(Math.random() * 100)
    });
  }

  return dataProvider;
}

class Index extends React.Component {

    static async getInitialProps() {
        let c20Data, top25Data, exchangeData

        try {
            const crypto20 = await fetch('https://crypto20.com/status')
            const top25 = await fetch('https://api.coinmarketcap.com/v1/ticker/?limit=25')
            const exchange = await fetch('https://api.fixer.io/latest?symbols=USD,AUD')

            c20Data = await crypto20.json()
            top25Data = await top25.json()
            exchangeData = await exchange.json()
        } catch(e) {
            console.log(e)
        }

        return {
            c20Data: c20Data,
            top25Data: top25Data,
            rates: exchangeData.rates
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            c20Tokens: 0,
            dataProvider: generateData(),
            timer: null
        }
    }

    componentDidMount() {
      this.setState({
        // Update the chart dataProvider every 3 seconds
        timer: setInterval(() => {
          this.setState({
            dataProvider: generateData()
          });
        }, 3000)
      });
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    update() {
        this.setState({
            c20Tokens: this.c20.value
        })
    }

    render() {
        if (typeof this.props.c20Data === 'undefined' || typeof this.props.rates === 'undefined') {
            return <p>Loading...</p>
        }

        const { classes } = this.props;
        fx.rates = this.props.rates
        const usdValue = this.props.c20Data.nav_per_token * this.state.c20Tokens

        const InputProps = {
          inputProps: {
            step: 1,
            onKeyUp: this.update.bind(this)
          },
        };

        const config = {
  "type": "serial",
  "theme": "light",
  "marginRight": 40,
  "marginLeft": 40,
  "autoMarginOffset": 20,
  "mouseWheelZoomEnabled": true,
  "valueAxes": [{
    "id": "v1",
    "axisAlpha": 0,
    "position": "left",
    "ignoreAxisWidth": true
  }],
  "balloon": {
    "borderThickness": 1,
    "shadowAlpha": 0
  },
  "graphs": [{
    "id": "g1",
    "balloon":{
      "drop": true,
      "adjustBorderColor": false,
      "color":"#ffffff"
    },
    "bullet": "round",
    "bulletBorderAlpha": 1,
    "bulletColor": "#FFFFFF",
    "bulletSize": 5,
    "hideBulletsCount": 50,
    "lineThickness": 2,
    "title": "red line",
    "useLineColorForBulletBorder": true,
    "valueField": "value",
    "balloonText": "<span style='font-size:18px;'>[[value]]</span>"
  }],
  "chartScrollbar": {
    "graph": "g1",
    "oppositeAxis": false,
    "offset":30,
    "scrollbarHeight": 80,
    "backgroundAlpha": 0,
    "selectedBackgroundAlpha": 0.1,
    "selectedBackgroundColor": "#888888",
    "graphFillAlpha": 0,
    "graphLineAlpha": 0.5,
    "selectedGraphFillAlpha": 0,
    "selectedGraphLineAlpha": 1,
    "autoGridCount": true,
    "color":"#AAAAAA"
  },
  "chartCursor": {
    "pan": true,
    "valueLineEnabled": true,
    "valueLineBalloonEnabled": true,
    "cursorAlpha":1,
    "cursorColor":"#258cbb",
    "limitToGraph":"g1",
    "valueLineAlpha":0.2,
    "valueZoomable": true
  },
  "valueScrollbar":{
    "oppositeAxis": false,
    "offset":50,
    "scrollbarHeight":10
  },
  "categoryField": "date",
  "categoryAxis": {
    "parseDates": true,
    "dashLength": 1,
    "minorGridEnabled": true
  },
  "dataProvider": this.state.dataProvider
};

        return (
            <Layout>
            <div style={{ padding: 20 }}>
              <Grid container spacing={40}>
              <Grid item xs>
                  <Card>
                    <CardContent>
                      <Typography type="headline" component="h2">
                        C20 Owned
                      </Typography>
                      <Typography component="div">
                          <TextField id="c20_owned" type="number" inputRef={(c20) => { this.c20 = c20 }} InputProps={InputProps} />
                      </Typography>
                    </CardContent>
                  </Card>
              </Grid>
              <Grid item xs>
                  <Card>
                    <CardContent>
                      <Typography type="headline" component="h2">
                        ${accounting.toFixed(usdValue, 2)}
                      </Typography>
                      <Typography className={classes.pos}>$USD Value of Your Tokens</Typography>
                    </CardContent>
                  </Card>
              </Grid>
              <Grid item xs>
                  <Card>
                    <CardContent>
                      <Typography type="headline" component="h2">
                        ${accounting.toFixed(fx(usdValue).from('USD').to('AUD'), 2)}
                      </Typography>
                      <Typography className={classes.pos}>$AUD Value of Your Tokens</Typography>
                    </CardContent>
                  </Card>
              </Grid>
              <Grid item xs>
                  <Card>
                    <CardContent>
                      <Typography type="headline" component="h2">
                        ${accounting.toFixed(this.props.c20Data.nav_per_token, 3)}
                      </Typography>
                      <Typography className={classes.pos}>Net Asset Value $USD per Token</Typography>
                    </CardContent>
                  </Card>
              </Grid>
              <Grid item xs>
                  <Card>
                    <CardContent>
                      <Typography type="headline" component="h2">
                        ${accounting.toFixed(fx(this.props.c20Data.nav_per_token).from('USD').to('AUD'), 3)}
                      </Typography>
                      <Typography className={classes.pos}>Net Asset Value $AUD per Token</Typography>
                    </CardContent>
                  </Card>
              </Grid>
              <Grid item lg>
                <AmCharts.React style={{ width: "100%", height: "500px" }} options={config} />
              </Grid>
              </Grid>
            </div>


            </Layout>
        );
    }
}

export default withStyles(styles)(Index);
