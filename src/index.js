/**
 * Build styles
 */

import './index.css'

import {
  checkInlineMarkdownSyntax,
  ANCHOR,
  insertHtmlAtCaret,
  selectNode,
} from './utils'

/**
 * Import Tool's icon
 */

/**
 * @class Warning
 * @classdesc Warning Tool for Editor.js
 * @property {WarningData} data - Warning Tool`s input and output data
 * @property {object} api - Editor.js API instance
 *
 * @typedef {object} WarningData
 * @description Warning Tool`s input and output data
 * @property {string} title - warning`s title
 * @property {string} message - warning`s message
 *
 * @typedef {object} WarningConfig
 * @description Warning Tool`s initial configuration
 * @property {string} titlePlaceholder - placeholder to show in warning`s title input
 * @property {string} messagePlaceholder - placeholder to show in warning`s message input
 */

export default class Warning {
  /**
   * Get Toolbox settings
   *
   * @public
   * @return {string}
   */
  static get toolbox() {
    return {
      icon: `<svg width="16" height="17" viewBox="0 0 320 294" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M160.5 97c12.426 0 22.5 10.074 22.5 22.5v28c0 12.426-10.074 22.5-22.5 22.5S138 159.926 138 147.5v-28c0-12.426 10.074-22.5 22.5-22.5zm0 83c14.636 0 26.5 11.864 26.5 26.5S175.136 233 160.5 233 134 221.136 134 206.5s11.864-26.5 26.5-26.5zm-.02-135c-6.102 0-14.05 8.427-23.842 25.28l-74.73 127.605c-12.713 21.444-17.806 35.025-15.28 40.742 2.527 5.717 8.519 9.175 17.974 10.373h197.255c5.932-1.214 10.051-4.671 12.357-10.373 2.307-5.702-1.812-16.903-12.357-33.603L184.555 70.281C174.608 53.427 166.583 45 160.48 45zm154.61 165.418c2.216 6.027 3.735 11.967 4.393 18.103.963 8.977.067 18.035-3.552 26.98-7.933 19.612-24.283 33.336-45.054 37.586l-4.464.913H61.763l-2.817-.357c-10.267-1.3-19.764-4.163-28.422-9.16-11.051-6.377-19.82-15.823-25.055-27.664-4.432-10.03-5.235-19.952-3.914-29.887.821-6.175 2.486-12.239 4.864-18.58 3.616-9.64 9.159-20.55 16.718-33.309L97.77 47.603c6.469-11.125 12.743-20.061 19.436-27.158 4.62-4.899 9.562-9.07 15.206-12.456C140.712 3.01 150.091 0 160.481 0c10.358 0 19.703 2.99 27.989 7.933 5.625 3.356 10.563 7.492 15.193 12.354 6.735 7.072 13.08 15.997 19.645 27.12l.142.24 76.986 134.194c6.553 10.46 11.425 19.799 14.654 28.577z"/></svg>`,
      title: this.i18n === 'en' ? 'Warning' : '注意/警告',
    }
  }

  /**
   * Allow to press Enter inside the Warning
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true
  }

  /**
   * Default placeholder for warning title
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_TITLE_PLACEHOLDER() {
    return this.i18n === 'en' ? 'Title' : '标题'
  }

  /**
   * Default placeholder for warning message
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_MESSAGE_PLACEHOLDER() {
    return this.i18n === 'en' ? 'Message' : '描述信息'
  }

  /**
   * Warning Tool`s styles
   *
   * @returns {Object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-warning',
      title: 'cdx-warning__title',
      titleInput: 'cdx-warning__title_input',
      messageInput: 'cdx-warning__message_input',
      message: 'cdx-warning__message',
    }
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {WarningData} data — previously saved data
   * @param {WarningConfig} config — user config for Tool
   * @param {Object} api - Editor.js API
   */
  constructor({ data, config, api }) {
    this.api = api
    this.i18n = config.i18n || 'en'

    this.titlePlaceholder =
      config.titlePlaceholder || Warning.DEFAULT_TITLE_PLACEHOLDER
    this.messagePlaceholder =
      config.messagePlaceholder || Warning.DEFAULT_MESSAGE_PLACEHOLDER

    this.data = {
      title: data.title || this.titlePlaceholder,
      message: data.message || this.messagePlaceholder,
    }
  }

  /**
   * Create Warning Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    // const container = this._make('div', [this.CSS.baseClass, this.CSS.wrapper])
    const container = this._make('div', [this.CSS.wrapper], {})
    const title = this._make('input', [this.CSS.titleInput, this.CSS.title], {
      value: this.data.title || '警告',
    })
    // textarea 会有各种问题，比如 backspace 会回到上一个 block, 比如 autosize 等等
    const message = this._make(
      'code',
      [this.CSS.baseClass, this.CSS.messageInput, this.CSS.message],
      {
        contentEditable: true,
      }
    )

    message.innerText = this.data.message

    this.api.listeners.on(
      message,
      'input',
      ev => this.handleInlineMDShortcut(ev),
      false
    )

    container.appendChild(title)
    container.appendChild(message)

    return container
  }

  /**
   * handle inline markdown syntax like bold, italic, inline-code etc..
   * @return {HTMLDivElement}
   * @private
   */
  handleInlineMDShortcut(ev) {
    const curBlockIndex = this.api.blocks.getCurrentBlockIndex()
    const curBlock = this.api.blocks.getBlockByIndex(curBlockIndex)

    const { isValid, md, html } = checkInlineMarkdownSyntax(curBlock, ev.data)
    if (isValid) {
      const INLINE_MD_HOLDER = `<span id="${ANCHOR.INLINE_MD}" />`

      // 改变 innerHTML 以后光标会到内容的最开始，需要埋一个点，完事后在选中
      insertHtmlAtCaret(INLINE_MD_HOLDER)
      ev.target.innerHTML = ev.target.innerHTML.replace(md, html)
      selectNode(document.querySelector(`#${ANCHOR.INLINE_MD}`))
      document.querySelector(`#${ANCHOR.INLINE_MD}`).remove()

      // 防止插入粗体以后以后输入一直是粗体。。
      insertHtmlAtCaret(ANCHOR.SPACE)
    }
  }

  /**
   * Extract Warning data from Warning Tool element
   *
   * @param {HTMLDivElement} warningElement - element to save
   * @returns {WarningData}
   */
  save(warningElement) {
    const title = warningElement.querySelector(`.${this.CSS.title}`)
    const message = warningElement.querySelector(`.${this.CSS.message}`)

    console.log('save title: ', title)
    console.log('save message: ', message)

    return Object.assign(this.data, {
      title: title.innerHTML,
      message: message.innerHTML,
    })
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {array|string} classNames  - list or name of CSS classname(s)
   * @param  {Object} attributes        - any attributes
   * @return {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    let el = document.createElement(tagName)

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames)
    } else if (classNames) {
      el.classList.add(classNames)
    }

    for (let attrName in attributes) {
      el[attrName] = attributes[attrName]
    }

    return el
  }

  /**
   * Sanitizer config for Warning Tool saved data
   * @return {Object}
   */
  static get sanitize() {
    return {
      title: {},
      message: {},
    }
  }
}
