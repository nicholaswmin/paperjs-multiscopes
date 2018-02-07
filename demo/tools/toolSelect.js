'use strict'

const toolSelect = function(tool, context) {
  tool.onMouseDown = function(event) {
    const hit = scopeStack.getActiveScope().hitTest(event.point, {
      fill: true,
      stroke: true
    })

    if (hit) {
      hit.getItem().selected = true

      console.info('selected: ', hit)
      return
    }

    scopeStack.getActiveScope().getActiveLayer().unselectAll()
  }

  return tool
}
