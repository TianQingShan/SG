import { defineStore } from 'pinia'
import { WalletConnectStatus, ProviderName } from '#/types/wallet'
import isMobile from '#/utils/is-mobile'
import { ethers } from 'ethers'
import { login as _login, getLoginRandomCode as _getLoginRandomCode } from '#/request/api/wallet'
import { SG_INFO, SG_LOGIN_DATE, SG_LOGIN_PROVIDERNAME, SG_WALLET_ACCOUNT } from '#/keys/storage'
import clearLoginStorage from '#/utils/clearLoginStorage'
import WalletConnectProvider from '@walletconnect/ethereum-provider'
import { useStore as _messageComponentStore } from '#/store/message-component'
import { toRaw } from 'vue'

let chainId = +import.meta.env.VITE_CHAIN_ID

export const useStore = defineStore('wallet', {
  state: () => ({
    /** 钱包连接状态 */
    connectStatus: WalletConnectStatus.NotConnect,

    /** 控制选择钱包弹框显示隐藏 */
    selectWalletModalVisible: false,

    /** 当前连接的提供商名称 */
    providerName: '' as unknown as ProviderName,

    /** 提供商应用程序 */
    provider: null as unknown as ethers.providers.Web3Provider,

    /** Walletconnect 连接器 */
    connector: null as unknown as WalletConnectProvider,

    /** 已连接钱包账号 */
    account: ''
  }),

  actions: {
    changeSelectWalletModalVisible(visible: boolean) {
      let _this = this

      _this.selectWalletModalVisible = visible
    },

    /** 打开选择钱包提供商弹框 */
    async openSelectModal() {
      let _this = this

      switch (isMobile()) {
        case true:
          await _this.connect()
        break
        case false:
          _this.changeSelectWalletModalVisible(true)
        break
      }
    },

    /**
     * 连接
     * @param providerName 提供商名称
     */
    async connect(providerName?: ProviderName) {
      let _this = this
      let messageComponentStore = _messageComponentStore()

      _this.providerName = providerName!
      _this.connectStatus = WalletConnectStatus.Connecting


      try {
        await _this.saveProvider()
        let provider = _this.getProvider()
        let [account] = await provider.send('eth_requestAccounts', [])

        /** 唤起签名 */
        let { request } = _getLoginRandomCode({ address: account })

        let { walletLoginOnce, verifyStr } = await request()

        let signer = await provider.getSigner()
        let signature = await signer.signMessage(verifyStr)

        /** 调用登录接口 */
        let { request: loginRequest } = _login({
          signature,
          address: account,
          message: walletLoginOnce
        })

        let response = await loginRequest()

        /** 存储登录信息 */
        localStorage.setItem(SG_INFO, JSON.stringify(response))
        localStorage.setItem(SG_LOGIN_DATE, new Date().getTime() + '')
        localStorage.setItem(SG_LOGIN_PROVIDERNAME, providerName as unknown as string)
        localStorage.setItem(SG_WALLET_ACCOUNT, account)
        _this.account = account

        _this.connectStatus = WalletConnectStatus.Connected

        location.reload()
      } catch (error) {
        messageComponentStore.addMessage((error as Error).message)
        _this.providerName = '' as unknown as ProviderName
        _this.connectStatus = WalletConnectStatus.Failed
        localStorage.removeItem('walletconnect')
        localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE')
      }
    },

    /** 调用 Walletconnect */
    async callWalletConnect() {
      let _this = this
      let response = await fetch('https://registry.walletconnect.org/data/wallets.json')
      let json = await response.json()
      let obj = JSON.stringify({ listings: json })
      let blob = new Blob([obj], {type: 'application/json'})
      let url = URL.createObjectURL(blob)

      _this.connector = new WalletConnectProvider({
        chainId,
        rpc: {
          1: 'https://api.mycryptoapi.com/eth',
          80001:'https://matic-mumbai.chainstacklabs.com',
          137: 'https://polygon-rpc.com'
        },
        qrcodeModalOptions: {
          registryUrl: url
        }
      })

      _this.provider = new ethers.providers.Web3Provider(_this.connector)
    },

    /** 保存缓存数据 */
    async saveCachedData() {
      let _this = this

      _this.providerName = localStorage.getItem(SG_LOGIN_PROVIDERNAME) as unknown as ProviderName
      _this.account = localStorage.getItem(SG_WALLET_ACCOUNT)!

      await _this.saveProvider()
    },

    /** 保存提供商 */
    async saveProvider() {
      let _this = this

      switch (isMobile()) {
        case true:
          if (window.ethereum) {
            _this.provider = new ethers.providers.Web3Provider(window.ethereum)
          } else {
            await _this.callWalletConnect()
          }
        break
        case false:
          if ([ProviderName.Walletconnect].includes(_this.providerName)) {
            await _this.callWalletConnect()
          } else {
            if (!window.ethereum) return await _this.callWalletConnect()
            _this.provider = new ethers.providers.Web3Provider(window.ethereum)
          }
        break
      }
    },

    /** 监听钱包各种状态 */
    listen() {
      let _this = this
      let accountChanged = () => {
        clearLoginStorage()
        location.reload()
      }

      let chainChanged = () => {
        location.reload()
      }

      let disconnect = () => {
        clearLoginStorage()
        location.reload()
      }

      let connector = _this.getConnector()

      if (!connector) {
        window.ethereum.on('accountsChanged', (accounts: string[]) => accountChanged())
        window.ethereum.on('chainChanged', (chainId: number) => chainChanged())
      } else {
        connector!.on('accountsChanged', (accounts: string[]) => accountChanged())
        connector!.on('chainChanged', (chainId: number) => chainChanged())
        connector!.on('disconnect', (code: number, reason: string) => disconnect())
      }
    },

    /** 获取连接器 */
    getConnector() {
      let _this = this

      return toRaw(_this.connector)
    },

    /** 获取提供商 */
    getProvider() {
      let _this = this

      return toRaw(_this.provider)
    },

    /** 切换网络 */
    async switchNetwork() {
      let _this = this
      let connector = _this.getConnector()

      if (connector) {
        await connector!.request({
          method: 'wallet_switchEthereumChain',
          params: [
            { chainId: `0x${ chainId.toString(16) }` }
          ]
        })
      } else {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            { chainId: `0x${ chainId.toString(16) }` }
          ]
        })
      }
    },
  }
})
