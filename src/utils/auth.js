import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getImfo() {
  return Cookies.get('imfo')
}
export function setImfo(imfo) {
  return Cookies.set('imfo', imfo)
}
export function romoveImfo() {
  return Cookies.remove('imfo')
}
