'use strict'

const toolHighlighter = function(tool) {
  let path

  tool.onMouseDown = function(event) {
    path = new paper.Path()
    path.strokeColor = 'yellow'
    path.strokeWidth = 20
    path.opacity = 0.4
  }

  tool.onMouseDrag = function(event) {
    path.add(event.point)
  }

  return tool
}
