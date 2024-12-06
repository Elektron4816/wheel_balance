import './Slider.css';
import ReactSlider from '@mui/material/Slider';


function Slider(props) {
    return (
        <ReactSlider
            defaultValue={1}
            value={props.value}
            min={1}
            max={10}
            marks={marks}
            valueLabelDisplay="auto"
            onChange={(_, newValue) => props.onChange(newValue)}
            name={props.name}
        />
    )
}


export default Slider;

const marks = [
    { value: 1, label: '1' },
    { value: 10, label: '10' },
]