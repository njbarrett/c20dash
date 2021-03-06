const lookup = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'BCH': 'bitcoin-cash',
    'XRP': 'ripple',
    'DASH': 'dash',
    'LTC': 'litecoin',
    'MIOTA': 'iota',
    'XMR': 'monero',
    'NEO': 'neo',
    'XEM': 'nem',
    'ETC': 'ethereum-classic',
    'LSK': 'lisk',
    'QTUM': 'qtum',
    'EOS': 'eos',
    'ZEC': 'zcash',
    'OMG': 'omisego',
    'ADA': 'cardano',
    'HSR': 'hshare',
    'XLM': 'stellar',
    'WAVES': 'waves',
    'PPT': 'populous',
    'STRAT': 'stratis',
    'BTS': 'bitshares',
    'ARK': 'ark',
    'BTG': 'bitcoin-gold'
}

export const symbolToPath = (symbol) => {
    return lookup[symbol];
}
