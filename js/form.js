class Form {
  constructor({
    onChange,
  }) {
    this._onChange = onChange

    this._formElement = document.getElementById('form')

    this._bindHandlers()
  }

  _bindHandlers() {
    this._formElement.addEventListener('change', this._onChange)
  }

  triggerChange() {
    this._formElement.dispatchEvent(new Event('change'))
  }
}

export {
  Form,
}
