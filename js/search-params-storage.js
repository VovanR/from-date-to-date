/**
 * Get/Set URL search params
 * {@link http://jsfiddle.net/VovanR/61a35x9e/}
 * @version 0.1.0
 *
 * @example
 * // Open URL https://localhost/?foo=1
 * const searchParams = new SearchParamsStorage();
 * searchParams.load();
 * //=> {foo: 1}
 * searchParams.save({bar: 55});
 * searchParams.load();
 * //=> {bar: 55}
 */
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
