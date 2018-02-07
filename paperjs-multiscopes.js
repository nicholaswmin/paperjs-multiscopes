'use strict'

class ScopeStack {
  constructor(scopes, opts = {}) {
    this._opts = opts
    this._scopes = scopes
    this.scopes = []
  }

  setup(defaultOpts = {}) {
    this.scopes = this._scopes.map(scope => new Scope(scope))
    this.scopes.forEach(scope => {
      Object.values(scope.tools).forEach(tool => {
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
      })
    })
    this.selectToolForScope(defaultOpts.defaultTool)
  }

  selectToolForScope({ toolName, scopeName }) {
    this.scopes.forEach(scope => scope.deactivate())
    const scope = this.getScope(scopeName)
    const tool = scope.selectTool(toolName)
  }

  getScope(name) {
    return this.scopes.find(scope => scope.name === name)
  }

  getActiveScope() {
    return this.scopes.find(scope => scope.active)
  }
}

class Scope {
  constructor(opts) {
    this._opts = opts
    this.name = opts.name
    this.item = new paper.PaperScope()
    this.item.setup(opts.canvas)
    this.item.settings = Object.assign(this.item.settings, opts.settings)

    this.activeLayer = new Layer(this.item.project.activeLayer)
    this.active = false

    this.tools = this._setupTools(opts.tools)
    this._fakeTool = new paper.Tool()
  }

  _setupTools(tools) {
    return tools.reduce((obj, toolDef) => {
      const tool = this._installToolOnScope(toolDef.function, this.name)
      tool.name = toolDef.name
      tool.cursor = toolDef.cursor

      obj[toolDef.name] = Object.assign(tool, {
        cursor: toolDef.cursor
      })

      return obj
    }, {})
  }

  _installToolOnScope(toolFunc, scopeName) {
    this.activate()

    return toolFunc(new paper.Tool(), this, this._opts.context)
  }

  selectTool(name) {
    const tool = this.tools[name]

    if (tool) {
      this.activate()
      tool.activate()

      return tool
    }
  }

  activate() {
    this.active = true
    this.item.activate()
    this.item.view.element.classList.add('is-active')
  }

  deactivate() {
    this.active = false
    this.item.view.element.classList.remove('is-active')
  }

  getActiveLayer() {
    return this.activeLayer
  }

  hitTest(point, opts) {
    const hitTest = this.item.project.hitTest(point, opts)

    if (hitTest) {
      return this.getActiveLayer().findChildById(hitTest.item.data.id)
    }
  }
}

class Layer {
  constructor(item) {
    this.item = item
    this.children = []
  }

  addChild(child) {
    this.children.push(child)
    this.item.addChild(child.getItem())
  }

  findChildById(id) {
    return this.children.find(child => child.id === id)
  }

  removeChild(child) {
    this.children = this.children.filter(c => c.id !== child.id)
    child.getItem().remove()
  }

  unselectAll() {
    this.children.forEach(child => child.getItem().selected = false)
  }
}

class Item {
  constructor(opts, item) {
    this.item = item
    this.id = opts.id || Math.floor(Math.random() * 1000000)
    this.item.data.id = this.id
  }

  getItem() {
    return this.item
  }
}

class Path extends Item {
  constructor(opts = {}) {
    super(opts, new paper.Path())
  }
}
