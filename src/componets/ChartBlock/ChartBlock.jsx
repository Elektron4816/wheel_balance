import Chart from './Chart/Chart';
import './ChartBlock.css';
import { useEffect, useRef, useState } from 'react';


function ChartBlock(props) {
    const { label, studentValue } = props;
    let parametrKit = "ten";
    if (label.length === 8) {
        parametrKit = "eight"
    } else if (label.length === 6) {
        parametrKit = "six";
    }

    const rootElRef = useRef(null);
    const [rootElWidth, setRootElWidth] = useState(1200);
    useEffect(() => {
        const onResize = () => {
            setRootElWidth(rootElRef.current?.offsetWidth);
        }
        onResize()
        window.addEventListener('resize', onResize)

        return () => window.removeEventListener('resize', onResize)
    }, [])

    const chartSize = rootElWidth * 0.52
    const labelFontSize = rootElWidth * 0.024
    const labelLineHeight = rootElWidth * 0.0269

    return (
        <div className="chart-block-container" ref={rootElRef}>
            <div className="chart-block-content">
                {label.map((parameter, index) => {
                    const { top, left, width } = studentParametersPosition[parametrKit][index]
                    return (
                        <div
                            key={parameter}
                            className='skill-title'
                            style={{
                                left: `${left}%`,
                                top: `${top}%`,
                                width: `${width}%`,
                                fontSize: `${labelFontSize}px`,
								lineHeight: `${labelLineHeight}px`,
                            }}
                        >
                            {parameter}
                        </div>
                    )
                })}
            </div>
            <div className="radial-chart" style={{width: `${chartSize}px`, height: `${chartSize}px`}}>
                <Chart ChartProps={{
                    labels: label,
                    data: Object.values(studentValue),
                }} />
            </div>

        </div>

    )
}

export default ChartBlock;


const studentParametersPosition = {
    six: [
        {
            top: 13,
            left: 65,
            width: 30,
        },
        {
            top: 45,
            left: 78,
            width: 20,
        },
        {
            top: 79,
            left: 69,
            width: 15,
        },
        {
            top: 79,
            left: 23,
            width: 22,
        },
        {
            top: 45,
            left: 3,
            width: 20,
        },
        {
            top: 13,
            left: 15,
            width: 23,
        }
    ],
    eight: [
        {
            top: 6,
            left: 60,
            width: 25,
        },
        {
            top: 32,
            left: 76,
            width: 20,
        },
        {
            top: 59,
            left: 77,
            width: 15,
        },
        {
            top: 88,
            left: 60,
            width: 22,
        },
        {
            top: 88,
            left: 22,
            width: 22,
        },
        {
            top: 61,
            left: 9,
            width: 15,
        },
        {
            top: 32,
            left: 3,
            width: 14,
        },
        {
            top: 6,
            left: 23,
            width: 18,
        },
    ],
    ten: [
        {
            top: 4,
            left: 54,
            width: 30,
        },
        {
            top: 25,
            left: 74,
            width: 24,
        },
        {
            top: 46,
            left: 78,
            width: 15,
        },
        {
            top: 72,
            left: 74,
            width: 22,
        },
        {
            top: 88,
            left: 55,
            width: 22,
        },
        {
            top: 88,
            left: 25,
            width: 23,
        },
        {
            top: 71,
            left: 9,
            width: 14,
        },
        {
            top: 43,
            left: 8,
            width: 18,
        },
        {
            top: 25,
            left: 13,
            width: 18,
        },
        {
            top: 2,
            left: 30,
            width: 18,
        },
    ],

}

