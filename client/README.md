# SWEETY TIME🍰

[參考大專程式撰寫規範](https://www.notion.so/1184b10c925180e3962fe374f8a6c7c5)

## GIT
1. 每次開發新功能時請從`develop`設定分支`feature`。
2. 請用自己的名字當開頭命名分支。
例如: `ZRT-feature-header-addCartNumber`
3. 合併前請先確認develop是否有新版本rebase後再合併。
4. commit 文字規範請參考

## STYLE
### 使用全域的css變數
若要在自己的module.scss中使用全域變數，請使用`@import '@/styles/globals-var.scss';`先引入變數才可以做使用。
如果有更多style模組可以參考，請參閱檔案`globals-var-scss`
### test-mode
使用 className=`test-mode` 可以將頁面新增開發用的邊框以便切板時確認位置。
### 置中容器內物件的方法
使用 className=`zrt-center` 用於置中容器內部元素
### 套用主字體
使用 className=`text-Major`套用主字體
### 套用副字體(英文大寫)
使用 className=`text-Bebas`套用主字體