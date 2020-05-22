<template>
  <canvas
    ref="drawBoard"
    width="700"
    height="400"
    style="border: 1px solid #000;"
  />
</template>
<script type="text/javascript">
  export default {
    data() {
      return {
        canvasContext: null,

        isDraw: true
      }
    },
    methods: {
      draw(methods = [], attrs = []) {
        const {canvasContext} = this
        if (!canvasContext) return false

        attrs.length && attrs.forEach(({name, data}) => {
          canvasContext[name] = data
        })
        methods.length && methods.forEach(({name, data}) => {
          const canvasAction = canvasContext[name]
          if (canvasAction) canvasAction.apply(canvasContext, data || [])
        })
      },
      init() {
        const {$nextTick, draw} = this
        const wsInstance = new WebSocket('ws://localhost:9999')
        $nextTick(() => {
          const canvasInstance = this.$refs.drawBoard
          const canvasContext = canvasInstance.getContext('2d')

          this.canvasContext = canvasContext

          wsInstance.onmessage = ({data}) => {
            const {methods, attrs} = JSON.parse(data) || {}

            draw(methods, attrs)
          }
        })
      }
    },
    created() {
      this.init()
    }
  }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
</style>
