'use strict'

const toolMarker = function(tool, context) {
  let path

  tool.onMouseDown = function(event) {
    path = new paper.Path()
    path.strokeColor = 'black'
    path.strokeWidth = 5
  }

  tool.onMouseDrag = function(event) {
    path.add(event.point)
  }

  return tool
}
