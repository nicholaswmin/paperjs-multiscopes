'use strict'

const toolPen = function(tool) {
  let path

  tool.onMouseDown = function(event) {
    path = new paper.Path()
    path.strokeColor = 'blue'
    path.strokeWidth = 1
  }

  tool.onMouseDrag = function(event) {
    path.add(event.point)
  }

  return tool
}
