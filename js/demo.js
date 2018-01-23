class Demo {
    constructor ({
        dom,
        data,
        showBorder = false,
        titleColor = '#fff',
        titleFontSize = 20
    }) {
        if (!dom) {
            console.error('请传入dom')
            return
        }
        createjs.Ticker.timingMode = createjs.Ticker.RAF
        this.showBorder = showBorder
        this.dom = dom
        this.data = data
        this.titleFontSize = titleFontSize
        this.titleColor = titleColor
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.dom.offsetWidth
        this.canvas.height = this.dom.offsetHeight
        this.dom.appendChild(this.canvas)
        // 创建舞台
        this.stage = new createjs.Stage(this.canvas)
        createjs.Ticker.on('tick', this.stage)
        this.nodeMap = {
            containerArr: [],
            picArr: [], 
            titleArr: [],
            rectArr: []
        }
        this.drawPic = []
        this.drawSelf = 0
        this.createContent()
        this.resize()
        this.addEvent()
    }
    // 创建容器
    createContent () {
        this.data.forEach(d => {
            // 容器
            let container = new createjs.Container()
            // 图形
            let pic = new createjs.Shape()
            // 名字
            let title = new createjs.Text()
            pic.name = title.name = d.name
            container.addChild(pic, title)
            this.stage.addChild(container)
            this.nodeMap.containerArr.push(container)
            this.nodeMap.picArr.push(pic)
            this.nodeMap.titleArr.push(title)
            if (this.showBorder) {
                let rect = new createjs.Shape();
                this.stage.addChild(rect);
                this.nodeMap.rectArr.push(rect);
            }
        })
    }
    // 布局
    initLayout () {
        this.data.forEach((d, i) => {
            let container = this.nodeMap.containerArr[i]
            container.x = d.layout[0]
            container.y = d.layout[1]
            container.width = d.size[0]
            container.height = d.size[1]
            // 图形
            let pic = this.nodeMap.picArr[i]
            d.pic.forEach((p, index) => {
                if (index === 0) {
                    pic.graphics.setStrokeStyle(d.lineWidth, 'round').beginStroke("#fff").beginFill("#666").mt(p[0], p[1])
                } else {
                    pic.graphics.lt(p[0], p[1])
                }
            })
            // 边框
            if (this.showBorder) {
                let rect = this.nodeMap.rectArr[i]
                rect.graphics.clear().beginStroke('red').rect(container.x, container.y, container.width, container.height);
            }
            // 标题
            // let title = this.nodeMap.titleArr[i]
            // title.x = d.titlePos[0]
            // title.y = d.titlePos[1]
            // title.textAlign = 'center';
            // title.textBaseline = 'top';
            // title.font = `${this.titleFontSize}px Arial`;
            // title.text = d.name;
            // title.color = this.titleColor;
            // title.textBaseline = 'bottom';
        })
    }
    // 添加事件
    addEvent () {
        this.stage.addEventListener('click', function(e) {
            alert('点击了图形' + e.target.name)
            console.log(e.target.name);
        })
        // 鼠标画
        // mousemove事件，按下添加事件，抬起解绑事件
        let mousemove = (e) => {
            this.newDrawPic.push([
                e.offsetX, e.offsetY
            ])
        }
        this.dom.addEventListener('mousedown', e => {
            this.newDrawPic = []
            this.dom.addEventListener('mousemove', mousemove)
        })
        this.dom.addEventListener('mouseup', e => {
            this.dom.removeEventListener('mousemove', mousemove)
            if (this.newDrawPic.length <= 1) {
                return
            }
            this.newDrawPic.push(this.newDrawPic[0])
            let x = []
            let y = []
            this.newDrawPic.forEach(p => {
                x.push(p[0])
                y.push(p[1])
            })
            let minX = Math.min(...x),
                maxX = Math.max(...x),
                minY = Math.min(...y),
                maxY = Math.max(...y);
            this.data.push({
                name: '自画' + ++this.drawSelf,
                layout: [0, 0],
                lineWidth: 2,
                size: [this.canvas.width, this.canvas.height],
                pic: this.newDrawPic,
                titlePos: [minX + 50, minY + 50]
            })
            this.nodeMap = {
                containerArr: [],
                picArr: [], 
                titleArr: [],
                rectArr: []
            }
            this.createContent()
            this.initLayout()
        })
    }
    // 自适应
    resize () {
        this.canvas.width = this.dom.offsetWidth
        this.canvas.height = this.dom.offsetHeight
        this.initLayout();
    }
}
