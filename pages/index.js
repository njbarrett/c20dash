import React from 'react';
import Layout from '../components/Layout.js'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import fx from 'money'
import accounting from 'accounting'

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

            </Layout>
        );
    }
}

export default Index
