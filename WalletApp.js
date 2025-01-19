/*
{
  "name": "Wallet",
  "description": "Manage your crypto wallet and assets",
  "version": "1.0.0",
  "author": "Hyperfy",
  "icon": "💰",
  "category": "Finance",
  "permissions": [
    "storage",
    "network",
    "wallet.read",
    "wallet.write",
    "wallet.sign"
  ],
  "dependencies": {
    "@firebolt-dev/css": "^1.0.0",
    "@solana/web3.js": "^1.0.0"
  },
  "minOSVersion": "1.0.0",
  "supportedDevices": ["all"],
  "apiEndpoints": [
    "https://api.hyperfy.io/wallet",
    "https://api.solana.com"
  ],
  "securityLevel": "high",
  "encryptionRequired": true
}
*/
import { css } from '@firebolt-dev/css'
import { useState, useEffect } from 'react'

export function WalletApp({
  user,
  solBalance,
  tokens,
  nfts,
  prices,
  setPrices,
  selectedAssetInfo,
  setSelectedAssetInfo,
  showSendPanel,
  setShowSendPanel,
  showReceiveModal,
  setShowReceiveModal,
  handleSend,
  handleReceive
}) {
  const [walletTab, setWalletTab] = useState('tokens')

  // Calculate total portfolio value
  const calculatePortfolioValue = () => {
    let total = 0
    
    // Add SOL value
    if (prices?.SOL && solBalance) {
      total += prices.SOL * parseFloat(solBalance)
    }
    
    // Add token values
    if (tokens?.length) {
      tokens.forEach(token => {
        if (token.amount && prices[token.symbol]) {
          total += prices[token.symbol] * parseFloat(token.amount)
        }
      })
    }
    
    return total.toFixed(2)
  }

  // Fetch prices from CoinGecko
  useEffect(() => {
    const fetchPrices = async () => {
      if (!user?.address) return
      
      try {
        // Fetch SOL price first
        const solResponse = await fetch('https://api.allorigins.win/get?url=' + 
          encodeURIComponent('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'))
        
        if (!solResponse.ok) {
          console.error('Failed to fetch SOL price')
          return
        }
        
        const solData = JSON.parse(solResponse.contents)
        if (!solData?.solana?.usd) {
          console.error('Invalid price data format')
          return
        }
        
        setPrices(prev => ({
          ...prev,
          SOL: solData.solana.usd
        }))
        
        // Get list of token symbols
        const tokenSymbols = tokens
          ?.filter(t => t.symbol)
          ?.map(t => t.symbol.toLowerCase())
          ?.join(',')
        
        if (tokenSymbols) {
          // Fetch token prices
          const tokenResponse = await fetch('https://api.allorigins.win/get?url=' + 
            encodeURIComponent(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenSymbols}&vs_currencies=usd`))
          
          if (!tokenResponse.ok) {
            console.error('Failed to fetch token prices')
            return
          }
          
          const tokenData = JSON.parse(tokenResponse.contents)
          if (!tokenData) {
            console.error('Invalid token price data')
            return
          }
          
          // Update prices state with token prices
          setPrices(prev => ({
            ...prev,
            ...Object.keys(tokenData).reduce((acc, key) => {
              // Convert from coingecko id to token symbol
              const symbol = tokens.find(t => 
                t.symbol.toLowerCase() === key
              )?.symbol
              
              if (symbol) {
                acc[symbol] = tokenData[key].usd
              }
              return acc
            }, {})
          }))
        }
      } catch (err) {
        console.error('Error fetching prices:', err)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000) // Refresh every minute
    
    return () => clearInterval(interval)
  }, [user?.address, tokens])

  return (
    <div css={css`
      display: flex;
      flex-direction: column;
      height: 100%;
    `}>
      {/* Portfolio Value */}
      <div css={css`
        padding: 20px;
        text-align: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      `}>
        <div css={css`
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 5px;
        `}>
          Portfolio Value
        </div>
        <div css={css`
          font-size: 24px;
          color: white;
          font-weight: 500;
        `}>
          ${calculatePortfolioValue()}
        </div>
      </div>

      {/* Wallet Tabs */}
      <div css={css`
        display: flex;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      `}>
        {['tokens', 'nfts'].map(tab => (
          <button
            key={tab}
            css={css`
              flex: 1;
              background: none;
              border: none;
              color: ${walletTab === tab ? 'white' : 'rgba(255, 255, 255, 0.6)'};
              padding: 15px;
              font-size: 14px;
              cursor: pointer;
              position: relative;
              text-transform: uppercase;
              letter-spacing: 1px;
              transition: all 0.15s ease-out;
              
              &:after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: #551bf9;
                transform: scaleX(${walletTab === tab ? 1 : 0});
                transition: transform 0.15s ease-out;
              }
              
              &:hover {
                color: white;
              }
            `}
            onClick={() => setWalletTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div css={css`
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        
        /* Custom Scrollbar */
        &::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        &::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        
        &::-webkit-scrollbar-thumb {
          background: rgba(85, 27, 249, 0.3);
          border-radius: 4px;
          
          &:hover {
            background: rgba(85, 27, 249, 0.5);
          }
        }
      `}>
        {walletTab === 'tokens' ? (
          <div css={css`
            display: flex;
            flex-direction: column;
            gap: 10px;
          `}>
            {/* SOL Balance */}
            <div
              css={css`
                background: rgba(0, 0, 0, 0.2);
                border-radius: 12px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.15s ease-out;
                
                &:hover {
                  background: rgba(0, 0, 0, 0.3);
                }
              `}
              onClick={() => setSelectedAssetInfo({
                type: 'token',
                symbol: 'SOL',
                amount: solBalance,
                price: prices?.SOL
              })}
            >
              <div css={css`
                display: flex;
                align-items: center;
                gap: 12px;
              `}>
                <img
                  src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
                  alt="SOL"
                  css={css`
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                  `}
                />
                <div css={css`flex: 1;`}>
                  <div css={css`
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 4px;
                  `}>
                    <div css={css`
                      color: white;
                      font-weight: 500;
                    `}>
                      SOL
                    </div>
                    <div css={css`
                      color: white;
                    `}>
                      {parseFloat(solBalance).toFixed(4)}
                    </div>
                  </div>
                  <div css={css`
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  `}>
                    <div css={css`
                      color: rgba(255, 255, 255, 0.6);
                      font-size: 12px;
                    `}>
                      Solana
                    </div>
                    <div css={css`
                      color: rgba(255, 255, 255, 0.6);
                      font-size: 12px;
                    `}>
                      ${prices?.SOL ? (prices.SOL * parseFloat(solBalance)).toFixed(2) : '0.00'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Token List */}
            {tokens?.length > 0 ? tokens.map((token, i) => (
              <div
                key={i}
                css={css`
                  background: rgba(0, 0, 0, 0.2);
                  border-radius: 12px;
                  padding: 15px;
                  cursor: pointer;
                  transition: all 0.15s ease-out;
                  
                  &:hover {
                    background: rgba(0, 0, 0, 0.3);
                  }
                `}
                onClick={() => setSelectedAssetInfo({
                  type: 'token',
                  ...token,
                  price: prices[token.symbol]
                })}
              >
                <div css={css`
                  display: flex;
                  align-items: center;
                  gap: 12px;
                `}>
                  <img
                    src={token.image || 'https://hyperfy.xyz/logo-icon.svg'}
                    alt={token.symbol}
                    css={css`
                      width: 32px;
                      height: 32px;
                      border-radius: 50%;
                    `}
                  />
                  <div css={css`flex: 1;`}>
                    <div css={css`
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      margin-bottom: 4px;
                    `}>
                      <div css={css`
                        color: white;
                        font-weight: 500;
                      `}>
                        {token.symbol}
                      </div>
                      <div css={css`
                        color: white;
                      `}>
                        {parseFloat(token.amount).toFixed(4)}
                      </div>
                    </div>
                    <div css={css`
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    `}>
                      <div css={css`
                        color: rgba(255, 255, 255, 0.6);
                        font-size: 12px;
                      `}>
                        {token.name}
                      </div>
                      <div css={css`
                        color: rgba(255, 255, 255, 0.6);
                        font-size: 12px;
                      `}>
                        ${prices[token.symbol] ? (prices[token.symbol] * parseFloat(token.amount)).toFixed(2) : '0.00'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div css={css`
                text-align: center;
                color: rgba(255, 255, 255, 0.6);
                padding: 20px;
              `}>
                No tokens found
              </div>
            )}
          </div>
        ) : (
          <div css={css`
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          `}>
            {nfts?.length > 0 ? nfts.map((nft, i) => (
              <div
                key={i}
                css={css`
                  background: rgba(0, 0, 0, 0.2);
                  border-radius: 12px;
                  overflow: hidden;
                  cursor: pointer;
                  transition: all 0.15s ease-out;
                  
                  &:hover {
                    background: rgba(0, 0, 0, 0.3);
                  }
                `}
                onClick={() => setSelectedAssetInfo({
                  type: 'nft',
                  ...nft
                })}
              >
                <div css={css`
                  aspect-ratio: 1;
                  background: rgba(0, 0, 0, 0.1);
                `}>
                  <img
                    src={nft.image || 'https://hyperfy.xyz/logo-icon.svg'}
                    alt={nft.name}
                    css={css`
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                    `}
                  />
                </div>
                <div css={css`
                  padding: 10px;
                `}>
                  <div css={css`
                    color: white;
                    font-size: 12px;
                    font-weight: 500;
                    margin-bottom: 2px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  `}>
                    {nft.name || 'Unnamed NFT'}
                  </div>
                  <div css={css`
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 10px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  `}>
                    {nft.collection || 'Unknown Collection'}
                  </div>
                </div>
              </div>
            )) : (
              <div css={css`
                text-align: center;
                color: rgba(255, 255, 255, 0.6);
                padding: 20px;
                grid-column: span 2;
              `}>
                No NFTs found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Send/Receive Buttons */}
      <div css={css`
        display: flex;
        gap: 10px;
        padding: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      `}>
        <button
          css={css`
            flex: 1;
            background: rgba(85, 27, 249, 0.1);
            border: 1px solid rgba(85, 27, 249, 0.2);
            color: #551bf9;
            padding: 12px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.15s ease-out;
            
            &:hover {
              background: rgba(85, 27, 249, 0.2);
              border-color: rgba(85, 27, 249, 0.3);
            }
          `}
          onClick={handleReceive}
        >
          Receive
        </button>
        <button
          css={css`
            flex: 1;
            background: #551bf9;
            border: none;
            color: white;
            padding: 12px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.15s ease-out;
            
            &:hover {
              background: #6633ff;
            }
          `}
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  )
} 