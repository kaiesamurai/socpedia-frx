// https://docs.chain.link/resources/link-token-contracts
export const TOKEN_SUPPORTED: Record<any, any> = {
  // Scroll sepolia
  '534351': {
    '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE': {
      name: 'ETH',
      image: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png',
      dataFeed: '0x59F1ec1f10bD7eD9B938431086bC1D9e233ECf41',
      dataFeedName: 'ETH / USD',
    },
    '0x231d45b53C905c3d6201318156BDC725c9c3B9B1': {
      name: 'LINK',
      image: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1975.png',
      dataFeed: '0xaC3E04999aEfE44D508cB3f9B972b0Ecd07c1efb',
      dataFeedName: 'LINK / USD',
    },
    '0xFa94dA175bE505B915187EdC8aE2f62F4Ccbf848': {
      name: 'DAI',
      image: 'https://s2.coinmarketcap.com/static/img/coins/128x128/4943.png',
      dataFeed: '0x9388954B816B2030B003c81A779316394b3f3f11',
      dataFeedName: 'DAI / USD',
    },
    '0x1eeb32A00Bd1746c9389F2E7B5cb7c8262Bf70Ce': {
      name: 'WBTC',
      image: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1.png',
      dataFeed: '0x87dce67002e66C17BC0d723Fe20D736b80CAaFda',
      dataFeedName: 'WBTC / USD',
    },
  },
}
