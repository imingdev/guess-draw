<template>
  <canvas
    ref="drawBoard"
    width="700"
    height="400"
    @mousedown="onCanvasMousedown"
    @mousemove="onCanvasMousemove"
    @mouseup="onCanvasMouseup"
    style="border: 1px solid #000;"
  />
</template>
<script type="text/javascript">
  export default {
    data() {
      return {
        stageInfo: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        },
        wsInstance: null,
        canvasContext: null,
        isDraw: false
      }
    },
    methods: {
      init() {
        this.wsInstance = new WebSocket('ws://localhost:9999')
        this.$nextTick(() => {
          const canvasInstance = this.$refs.drawBoard
          this.canvasContext = canvasInstance.getContext('2d')
          this.stageInfo = canvasInstance.getBoundingClientRect()
        })
      },
      onCanvasMousedown(event) {
        const {canvasContext, stageInfo, wsInstance} = this
        if (!canvasContext) return false

        const beginX = event.pageX - stageInfo.left
        const beginY = event.pageY - stageInfo.top

        const strokeStyle = '#' + '0123456789abcdef'.split('').map((v, i, a) => i > 5 ? null : a[Math.floor(Math.random() * 16)]).join('')

        const lineWidth = (Math.random() * 10 + 1).toFixed(0)

        canvasContext.strokeStyle = strokeStyle
        canvasContext.lineWidth = lineWidth

        canvasContext.beginPath()
        canvasContext.moveTo(beginX, beginY)
        this.isDraw = true

        const params = {
          methods: [{
            name: 'beginPath'
          }, {
            name: 'moveTo',
            data: [beginX, beginY]
          }],
          attrs: [{
            name: 'strokeStyle',
            data: strokeStyle
          }, {
            name: 'lineWidth',
            data: lineWidth
          }]
        }
        wsInstance.send(JSON.stringify(params))
      },
      onCanvasMousemove(event) {
        const {isDraw, canvasContext, stageInfo, wsInstance} = this
        if (!isDraw) return false
        if (!canvasContext) return false

        const endX = event.pageX - stageInfo.left
        const endY = event.pageY - stageInfo.top
        canvasContext.lineTo(endX, endY)
        canvasContext.stroke()

        const params = {
          methods: [{
            name: 'lineTo',
            data: [endX, endY]
          }, {
            name: 'stroke'
          }]
        }
        wsInstance.send(JSON.stringify(params))
      },
      onCanvasMouseup() {
        this.isDraw = false
      }
    },
    created() {
      this.init()
    }
  }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
</style>
