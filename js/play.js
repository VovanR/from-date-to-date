class Play {
  constructor({
    onTick,
    canPlay,
  }) {
    this._onTick = onTick
    this._canPlay = canPlay

    this._requestId = null

    this._start()
  }

  _start() {
    this._requestId = window.requestAnimationFrame(this._step.bind(this))
  }

  _step() {
    if (this._canPlay()) {
      this._onTick()
      this._start()
    }
  }

  _stop() {
    window.cancelAnimationFrame(this._requestId)
  }

  start() {
    this._stop()
    this._start()
  }
}

export {
  Play,
}
