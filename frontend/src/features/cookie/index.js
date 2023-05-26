export const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  )

export const destroyCookieValue = (name) => {
    console.log()
    document.cookie = name+'=; Max-Age=-1;';
}