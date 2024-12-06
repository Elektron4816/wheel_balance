import './AboutChild.css';
import { useEffect, useState } from 'react';
import PopUp from "./PopUp/PopUp";

import TextField from '@mui/material/TextField'

function AboutChild(props) {
    const [displayPopUp, setDisplayPopUp] = useState(false);
    // const [inputData, setInputData] = useState({ parent_comment: '', month_goals: '', lesson_comment: '' });

    const { exportingFor, inputData, setInputData } = props;
    // console.log("1", exportingFor);
    useEffect(() => {
        const textarea = document.querySelectorAll(".textarea");
        textarea.forEach((item) => {
            item.addEventListener("input", function () {
                this.style.height = "auto";
                this.style.height = this.scrollHeight + "px";
            })
        })
    });

    const handleChange = (event) => {
        setInputData(prevState => ({ ...prevState, [event.target.name]: event.target.value }));
        // console.log(inputData);
    };

    // const handleClick = () => {
    //     const obj = {
    //         perfomance: [],
    //         fields: [],
    //     };
    //     const allInputsRange = document.querySelectorAll("input[type=range]");
    //     const allTextareas = document.querySelectorAll("textarea[aria-invalid]");
    //     const allInputText = document.querySelectorAll("input[type=text]");
    //     const childNameInput = document.getElementById("name-child");
    //     const subject = document.getElementById("lesson-subject");
    //     obj.client_id = childNameInput.getAttribute('data-client-id');
    //     obj.child_id = childNameInput.getAttribute('data-child-id');
    //     obj.subject = subject.getAttribute("name");
    //     allInputText.forEach((item) => {
    //         if (item.name) {
    //             obj[item.name] = item.value;
    //         }
    //     })

    //     allTextareas.forEach((item) => {
    //         if (item.name) {
    //             obj.fields.push({ [item.name]: item.value });
    //         }
    //     })

    //     allInputsRange.forEach((item) => {
    //         if (item.name) {
    //             obj.perfomance.push({ [item.name]: item.value });
    //         }
    //     })
    //     console.log(obj);
    //     fetch("/sendChild", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(obj),
    //     })
    //         .then(res => res.json())
    //         .then(data => console.log('Success:', data))
    //         .catch(error => console.error('Error:', error));

    // }

    return (
        <div className='about-child'>
            <div className='about-child-info' export-ignore={(exportingFor === 'parent').toString()}>
                <h2>Об ученике</h2>
                <Textaria data={dataImport.about} inputData={inputData} handleChange={handleChange} />
            </div>
            <div className='about-child-info'>
                <h2>Комментарии и пожелания</h2>

                {/* <Textaria data={dataImport.comment} /> */}
                <div className='textaria-container' export-ignore={(exportingFor === 'parent').toString()}>
                    <TextField
                        label="Комментарий/цель от родителя"
                        name="parent_comment"
                        value={inputData.parent_comment}
                        onChange={handleChange}
                        id="parent_comment"
                        variant="filled"
                        fullWidth
                        multiline
                        slotProps={{
                            input: {
                                disableUnderline: true,
                            }
                        }}
                    />
                </div>
                <div className='textaria-container'>
                    <TextField
                        label='Цели на ближайший месяц'
                        name="month_goals"
                        variant="filled"
                        value={inputData.month_goals}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        slotProps={{
                            input: {
                                disableUnderline: true,
                            }
                        }}
                    />
                </div>
                <div className='textaria-container' export-ignore={(exportingFor === 'parent').toString()}>
                    <TextField
                        label="Как прошел урок"
                        name="lesson_comment"
                        variant="filled"
                        value={inputData.lesson_comment}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        slotProps={{
                            input: {
                                disableUnderline: true,
                            }
                        }}
                    />
                </div>
                <div className='about-child-accept'>
                    <p>Ваш заботливый учитель</p>
                    <input type='text' id="teacher-name" className="inputTeacher" name="teacher_name" placeholder='Ваше имя и фамилия' />
                    {/* <div className='child-data-input-item'>
                        <label htmlFor="date-live" className="inp">
                            <input type="text" className="liveInput" id='date-live' name='date-live' placeholder="&nbsp;" />
                            <span className="label">Дата текущей диагностики</span>
                        </label>
                    </div> */}
                    {/* <button export-ignore='true' id='save-data-child'>Сохранить как новую версию</button> */}
                </div>
                <button export-ignore='true' id='save-data-child' onClick={() => { setDisplayPopUp(true); document.body.style.overflow = 'hidden'; }}>Сохранить как новую версию</button>
            </div>
            {displayPopUp && <PopUp setDisplayPopUp={setDisplayPopUp} />}
        </div>
    )
}

export default AboutChild;


function Textaria(props) {
    const { data, inputData, handleChange } = props;
    return data.map((item, index) => (
        <div className='textaria-container' key={index}>
            <TextField
                label={item.value}
                name={item.name}
                value={inputData[item.name]}
                onChange={handleChange}
                variant="filled"
                fullWidth
                multiline
                slotProps={{
                    input: {
                        disableUnderline: true,
                    }
                }}
            />
        </div>
    ))
}

const dataImport = {
    about: [
        {
            value: 'Интересы ребёнка/как увлечь',
            name: 'interests'
        },
        {
            value: 'Любимые персонажи',
            name: 'favorite_characters'
        },
        {
            value: 'Что любит / что не любит',
            name: 'likes_dislikes'
        },
    ],
    comment: [
        {
            value: 'Комментарий/цель от родителя',
            name: 'parent_comment'
        },
        {
            value: 'Цели на ближайший месяц',
            name: 'month_goals'
        },
        {
            value: 'Как прошел урок',
            name: 'lesson_comment'
        }
    ]
}