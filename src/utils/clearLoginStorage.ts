import { SG_INFO, SG_LOGIN_DATE, SG_LOGIN_PROVIDERNAME, SG_WALLET_ACCOUNT } from '#/keys/storage'

export default function() {
  localStorage.removeItem(SG_INFO)
  localStorage.removeItem(SG_LOGIN_DATE)
  localStorage.removeItem(SG_LOGIN_PROVIDERNAME)
  localStorage.removeItem(SG_WALLET_ACCOUNT)
  localStorage.removeItem('walletconnect')
}
