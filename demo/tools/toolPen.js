'use strict'

const toolPen = function(tool, context) {
  let path

  tool.onMouseDown = function(event) {
    path = new Path()

    path.getItem().set({
      strokeColor: 'blue',
      strokeWidth: 1
    })
  }

  tool.onMouseDrag = function(event) {
    path.getItem().add(event.point)
  }

  tool.onMouseUp = function(event) {
    scopeStack.getScope('sticky').getActiveLayer().addChild(path)
  }

  return tool
}
