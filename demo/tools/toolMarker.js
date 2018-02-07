'use strict'

const toolMarker = function(tool, context) {
  let path

  tool.onMouseDown = function(event) {
    path = new Path()

    path.getItem().set({
      strokeColor: 'red',
      strokeWidth: 5
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
