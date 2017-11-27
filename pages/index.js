import React from 'react';
import Layout from '../components/Layout.js'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import fx from 'money'
import accounting from 'accounting'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

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
            c20Tokens: 0
        }
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

        fx.rates = this.props.rates
        const usdValue = this.props.c20Data.nav_per_token * this.state.c20Tokens

        const data = [
              {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
              {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
              {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
              {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
              {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
              {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
              {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
        ];

        return (
            <Layout>
            <h1>Crypto20 Dashboard</h1>

            <label>Number of C20 Tokens owned:</label>
            <input type="text" ref={(c20) => { this.c20 = c20 }} onKeyUp={this.update.bind(this)} />

            <ul>
                <li>USD Net Asset Value (per token): ${accounting.toFixed(this.props.c20Data.nav_per_token, 3)}</li>
                <li>USD Value of your Tokens: ${accounting.toFixed(usdValue, 2)}</li>
                <li>AUD Value of your Tokens: ${accounting.toFixed(fx(usdValue).from('USD').to('AUD'), 2)}</li>
            </ul>

            <AreaChart width={600} height={400} data={data}
                margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Area type='monotone' dataKey='uv' stroke='#8884d8' fill='#8884d8' />
            </AreaChart>

            </Layout>
        );
    }
}

export default Index
