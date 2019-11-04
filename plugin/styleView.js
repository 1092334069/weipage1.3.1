const styleView = {
	parseFormStyle: function() {
		let width,height,fontSize,color,backgroundColor,backgroundImage
		if (this.viewData.style) {
			if (this.viewData.style.display === 'none') {
				return 'opacity:0'
			}
			width = 'width:' + this.viewData.style.width + ';'
			height = 'height:' + this.viewData.style.height + ";"
			fontSize = 'fontSize:' + this.viewData.style.fontSize + ';'
			color = 'color:' + this.viewData.style.color + ';'
			backgroundColor = 'backgroundColor:' + this.viewData.style.backgroundColor + ';'
			backgroundImage = 'backgroundImage:url(' + this.viewData.style.backgroundImage + ')'
			return width + height + fontSize + color + backgroundColor + backgroundImage
		} else {
			return ''
		}
	},
	parseImageStyle: function() {
		let width
		if (this.viewData.base) {
			width = 'width:' + this.viewData.base.width
			return width
		} else {
			return ''
		}
	},
	parsePanelStyle: function() {
		let width,height,position
		if (this.viewData.style && this.viewData.base) {
			if (this.viewData.style.display === 'none') {
				return 'display:none'
			}
			width = 'width:' + this.viewData.style.width + ';'
			if (this.viewData.base.type === 'list') {
				height = 'minHeight:' + (2 * this.viewData.style.height) + ';'
			} else {
				height = 'minHeight:' + this.viewData.style.height + ';'
			}
			position = this.parsePosition()
			return width + height + position
		} else {
			return ''
		}
	},
	parsePanelItemStyle: function() {
		let height,margin,padding,borderRadius,transformRotate,border,backgroundColor,backgroundImage,textAlign,fontSize,color,lineHeight,fontWeight,fontStyle
		if (this.viewData.style) {
			height = 'minHeight:' + this.viewData.style.height + ';'
			margin = 'margin:' + this.parseFourSides(this.viewData.style.margin) + ';'
			padding = 'padding:' + this.parseFourSides(this.viewData.style.padding) + ';'
			borderRadius = 'borderRadius:' + this.parseFourSides(this.viewData.style.borderRadius) + ';'
			transformRotate = 'transform:rotate(' + this.viewData.style.transformRotate + 'deg);'
			border = this.parseBorder()  + ';'
			backgroundColor = 'backgroundColor:' + this.viewData.style.backgroundColor + ';'
			backgroundImage = 'backgroundImage:url(' + this.viewData.style.backgroundImage + ');'
			textAlign = 'textAlign:' + this.viewData.style.textAlign + ';'
			fontSize = 'fontSize:' + this.viewData.style.fontSize + ';'
			color = 'color:' + this.viewData.style.color + ';'
			lineHeight = 'lineHeight:' + this.viewData.style.lineHeight + 'px;'
			fontWeight = 'fontWeight:' + this.viewData.style.fontWeight + ';'
			fontStyle = 'fontStyle:' + this.viewData.style.fontStyle
			return height + margin + padding + borderRadius + transformRotate + border + backgroundColor + backgroundImage + textAlign + fontSize + color + lineHeight + fontWeight + fontStyle
		} else {
			return ''
		}
	},
	parseFourSides: function(value) {
		if (typeof value === 'number' || typeof value === 'string') {
			return value + 'px'
		} else if (typeof value === 'object' && value instanceof Array) {
			return value.join('px ') + 'px'
		} else {
			return 0
		}
	},
	parseBorder: function() {
		if (this.viewData.style.border === 'block') {
			const borderWidth = 'borderWidth:' + this.parseFourSides(this.viewData.style.borderWidth) + ';'
			const borderStyle = 'borderStyle:' + this.viewData.style.borderStyle + ';'
			const borderColor = 'borderColor:' + this.viewData.style.borderColor + ''
			return borderWidth + borderStyle + borderColor
		} else {
			return 'border:none'
		}
	},
	parsePosition: function() {
		if (this.viewData.style.position === 'relative') {
			return 'position:relative'
		} else if (this.viewData.style.position === 'absolute') {
			return 'z-index:10;position:absolute;top:' + this.viewData.style.top + 'px;left:' + this.viewData.style.left + 'px'
		} else {
			return 'z-index:20;position:fixed;top:' + (parseFloat(this.viewData.style.top) + 75) + 'px;left:' + (parseFloat(this.viewData.style.left) + 100) + 'px'
		}
	},
	parseTextHtml: function(data) {
		return data.split('↵')
	}
 }

export default styleView
