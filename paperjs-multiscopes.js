'use strict'

class ScopeStack {
  constructor(scopes, opts = {}) {
    this._scopes = scopes
    this._opts = opts
    this.scopes = {}
    this.tools = {}
    this.selectedTool = null
  }

  setup(defaultOpts = {}) {
    this._scopes.forEach(this._setupPaperScope.bind(this))
    this._scopes.forEach(this._setupScopeTools.bind(this))

    if (defaultOpts.defaultTool)
      this.selectTool(defaultOpts.defaultTool)
  }

  selectTool({ toolName, scopeName }) {
    const tool = this._getToolForScopeName(scopeName, toolName)

    this._deactivateAllTools()
    this._activateToolForScope(scopeName, toolName)
    this._setCanvasCursor(tool.cursor)
    this._setSelectedTool(toolName)
  }

  setCanvasCursor(cursorPath) {
    if (!cursorPath) return

    Object.keys(this.scopes).forEach(scopeName => {
      this.scopes[scopeName].view.element.style.cursor = cursorPath ?
        `url(${cursorPath}), auto` :
        'auto'
    })
  }

  isTouchDevice() {
    return 'ontouchstart' in window
  }

  _setupScopeTools(scope) {
    this.tools[scope.name] = scope.tools.reduce((obj, toolDef) => {
      const tool = this._installToolOnScope(toolDef.function, scope.name)
      tool.cursor = toolDef.cursor

      ;[
        ['mousedown', 'onMouseDown'],
        ['mouseup', 'onMouseUp'],
        ['mousedrag', 'onMouseDrag'],
        ['mousemove', 'onMouseMove'],
        ['keydown', 'onKeyDown'],
        ['keyup', 'onKeyUp']
      ].forEach(actionPair => {
        const cb = this._opts.on[actionPair[1]]
        if (cb) tool.on(actionPair[0], cb)
      })

      obj[toolDef.name] = Object.assign(tool, {
        cursor: toolDef.cursor
      })

      return obj
    }, {})
  }

  _installToolOnScope(toolFunc, scopeName) {
    this.scopes[scopeName].activate()

    return toolFunc(new paper.Tool(), this, this._opts.context)
  }

  _setupPaperScope(scope) {
    this.scopes[scope.name] = new paper.PaperScope()
    this.scopes[scope.name].setup(scope.canvas)
    this.scopes[scope.name]._fakeTool = new paper.Tool()
  }

  _activateToolForScope(scopeName, toolName)  {
    const tool = this._getToolForScopeName(scopeName, toolName)
    const scope = this._getScope(scopeName)
    scope.activate()
    tool.activate()
    tool.view.element.classList.add('is-active')
  }

  _deactivateToolForScope(toolName, scopeName) {
    const tool = this._getToolForScopeName(scopeName, toolName)
    const scope = this._getScope(scopeName)

    scope.activate()
    tool.emit('deactivate')
    tool.view.element.classList.remove('is-active')
  }

  _deactivateAllTools() {
    Object.keys(this.tools).forEach(scopeName => {
      Object.keys(this.tools[scopeName]).forEach(toolName => {
        this._deactivateToolForScope(toolName, scopeName)
      })
    })

    Object.keys(this.scopes).forEach(scopeName => {
      this._getScope(scopeName)._fakeTool.activate()
    })
  }

  _setCanvasCursor(cursorPath) {
    Object.keys(this.scopes).forEach(scopeName => {
      this.scopes[scopeName].view.element.style.cursor = cursorPath ?
        `url(${cursorPath}), auto` :
        'auto'
    })
  }

  _getToolForScopeName(scopeName, toolName) {
    return this.tools[scopeName][toolName]
  }

  _getScope(scopeName) {
    return this.scopes[scopeName]
  }

  _setSelectedTool(toolName) {
    if (this._opts.on.toolChange)
      this._opts.on.toolChange(toolName)

    this.selectedTool = toolName
  }
}
