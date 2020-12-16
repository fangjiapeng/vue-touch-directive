function createPoster() {
    const canvas = document.createElement('canvas')
    const targetDom = this.$refs.posterElement
    const width = targetDom.offsetWidth // 获取dom 宽度
    const height = targetDom.offsetHeight // 获取dom 高度
    const scale = 2 // 定义任意放大倍数 支持小数
    canvas.width = width * scale
    canvas.height = height * scale
    canvas.getContext('2d').scale(scale, scale)
    const rect = targetDom.getBoundingClientRect() 
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    html2canvas(targetDom, { // 转换为图片
        logging: false,
        scrollY: 0,
        scale: scale, // 添加的scale 参数
        width: width, // dom 原始宽度
        height: height,
        useCORS: true, // 开启跨域
        dpi: window.devicePixelRatio * 2
    }).then(canvas => {
        const context = canvas.getContext('2d')
        // 关闭抗锯齿
        context.mozImageSmoothingEnabled = false
        context.msImageSmoothingEnabled = false
        context.imageSmoothingEnabled = false
        this.posterUrl = canvas.toDataURL('image/jpeg')
    })
}