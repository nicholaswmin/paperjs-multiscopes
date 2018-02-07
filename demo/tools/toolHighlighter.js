'use strict'

const toolHighlighter = function(tool, context) {
  let path

  tool.onMouseDown = function(event) {
    path = new Path()
    path.getItem()
      .set({
        strokeColor: 'yellow',
        strokeWidth: 20,
        opacity: 0.4
      })
  }

  tool.onMouseDrag = function(event) {
    path.getItem()
      .add(event.point)
  }

  tool.onMouseUp = function(event) {
    path.getItem().smooth()
    scopeStack.getScope('sticky')
      .getActiveLayer()
      .addChild(path)
  }

  return tool
}
