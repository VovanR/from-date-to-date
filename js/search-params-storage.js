class SearchParamsStorage {
  constructor() {
    this._prevData = null
  }

  _parseSearchParamsToJSON() {
    const searchParams = new URLSearchParams(window.location.search)
    const data = {}
    for (const [key, value] of searchParams) {
      if (value) {
        data[key] = value
      }
    }
    return data
  }

  load() {
    return this._parseSearchParamsToJSON()
  }

  _isChanged(data) {
    return JSON.stringify(data) !== JSON.stringify(this._prevData)
  }

  save(data) {
    if (!this._isChanged(data)) {
      return
    }

    const newData = {}
    const newSearchParams = new URLSearchParams()

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        newData[key] = value
        newSearchParams.set(key, value)
      }
    })

    this._prevData = newData

    const url = window.location.pathname + '?' + newSearchParams.toString()
    window.history.pushState(null, null, url)
  }
}

export {
  SearchParamsStorage,
}
