// 開新視窗並置中於瀏覽器中央的函式，facebook use it
// https://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
export function popupCenter(url, title, w, h) {
  var userAgent = navigator.userAgent,
    mobile = function () {
      return (
        /\b(iPhone|iP[ao]d)/.test(userAgent) ||
        /\b(iP[ao]d)/.test(userAgent) ||
        /Android/i.test(userAgent) ||
        /Mobile/i.test(userAgent)
      )
    },
    screenX =
      typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft,
    screenY =
      typeof window.screenY != 'undefined' ? window.screenY : window.screenTop,
    outerWidth =
      typeof window.outerWidth != 'undefined'
        ? window.outerWidth
        : document.documentElement.clientWidth,
    outerHeight =
      typeof window.outerHeight != 'undefined'
        ? window.outerHeight
        : document.documentElement.clientHeight - 22,
    targetWidth = mobile() ? null : w,
    targetHeight = mobile() ? null : h,
    V = screenX < 0 ? window.screen.width + screenX : screenX,
    left = parseInt(V + (outerWidth - targetWidth) / 2, 10),
    right = parseInt(screenY + (outerHeight - targetHeight) / 2.5, 10),
    features = []
  if (targetWidth !== null) {
    features.push('width=' + targetWidth)
  }
  if (targetHeight !== null) {
    features.push('height=' + targetHeight)
  }
  features.push('left=' + left)
  features.push('top=' + right)
  features.push('scrollbars=1')

  var newWindow = window.open(url, title, features.join(','))

  if (window.focus) {
    newWindow.focus()
  }

  return newWindow
}

// 自訂事件用
export function subscribe(eventName, listener) {
  document.addEventListener(eventName, listener)
}

// 自訂事件用
export function unsubscribe(eventName, listener) {
  document.removeEventListener(eventName, listener)
}

// 自訂事件用
export function publish(eventName, data) {
  const event = new CustomEvent(eventName, { detail: data })
  document.dispatchEvent(event)
}

// call and close popwindow
// default is window
// export function closeWindow(windowRef = window) {
//   windowRef.opener = null
//   windowRef.open('', '_self')
//   windowRef.close()
//   //top.close()
//   setTimeout(window.close, 5000)
//   windowRef.history.go(-1)
//   document.body.hide()
//   window.open('', '_parent', '')
//   window.close()
// }
