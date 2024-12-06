import React from 'react'

const ColorContainer = (props) => {
	const {children, blue} = props
	return (
		<div className="App" style={{backgroundColor: blue ? "#D8E7E5" : "#F5F0E7"}}>
            {children}
		</div>
	)
}

export default ColorContainer