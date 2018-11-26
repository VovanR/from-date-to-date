const INPUT_ACTIVE_CLASS_NAME = 'active'

const removeActiveClassName = element => element.classList.remove(INPUT_ACTIVE_CLASS_NAME)
const addActiveClassName = element => element.classList.add(INPUT_ACTIVE_CLASS_NAME)

class ActiveInput {
  constructor({
    initialActive,
    inputElements,
    onChange,
  }) {
    this._activeInputElement = initialActive
    this._inputElements = inputElements
    this._onChange = onChange

    this._bindHandlers()
  }

  _bindHandlers() {
    this._inputElements.forEach(element => {
      element.addEventListener('focus', ({target}) => {
        this._activeInputElement = target
        target.closest('.js-form__inputs').querySelectorAll(`.${INPUT_ACTIVE_CLASS_NAME}`).forEach(removeActiveClassName)
        addActiveClassName(target.closest('.js-form__row'))

        this._onChange(this._activeInputElement)
      })
    })
  }

  getActiveElement() {
    return this._activeInputElement
  }
}

export {
  ActiveInput,
}
