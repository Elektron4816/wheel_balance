import "./PopUp.css";
import closeBtn from "../../../image/CloseBlack.svg";

import Alert from '@mui/material/Alert';
import { useState } from "react";

function PopUp(props) {
    const { setDisplayPopUp } = props;
    const [showAlert, setShowAlert] = useState({ succsess: false, fail: false });
    const [errorMessage, setErrorMessage] = useState('');

    function handleClose(e) {
        if (e.target.id === "popup") {
            setDisplayPopUp(false);
            document.body.style.overflow = 'auto';
        }
    }
    const handleClick = () => {
        const obj = {
            perfomance: [],
            fields: [],
        };
        const allInputsRange = document.querySelectorAll("input[type=range]");
        const allTextareas = document.querySelectorAll("textarea[aria-invalid]");
        const allInputText = document.querySelectorAll("input[type=text]");
        const childNameInput = document.getElementById("name-child");
        const subjectElement = document.getElementById("lesson-subject");
        obj.client_id = childNameInput.getAttribute('data-client-id');
        obj.child_id = childNameInput.getAttribute('data-child-id');
        obj.subject = { value: subjectElement.getAttribute("name"), name: subjectElement.innerText };
        let checkValid = true;
        allInputText.forEach((item) => {
            if (item.value === "") {
                checkValid = false;
            }
            if (item.name) {
                obj[item.name] = item.value;
            }
        })

        allTextareas.forEach((item) => {
            if (item.name) {
                obj.fields.push({ [item.name]: item.value });
            }
        })

        allInputsRange.forEach((item) => {
            if (item.name) {
                obj.perfomance.push({ [item.name]: item.value });
            }
        })
        console.log(obj);
        if (checkValid) {
            fetch("/sendChild", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(obj),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setShowAlert(prevState => ({ ...prevState, succsess: true }));
                        setTimeout(() => {
                            setShowAlert(prevState => ({ ...prevState, succsess: false }));
                            setDisplayPopUp(false);
                        }, 3000)
                    } else {
                        setShowAlert(prevState => ({...prevState, fail: true }));
                        setTimeout(() => {
                            setShowAlert(prevState => ({...prevState, fail: false }));
                            setDisplayPopUp(false);
                        }, 3000)
                        setErrorMessage(data.show_text);
                    }
                    console.log('return', data);
                })
                .catch(error => console.error('Error:', error));
        } else {
            console.log("Заполните поля");
            setErrorMessage("Не все поля заполнены");
            setShowAlert(prevState => ({ ...prevState, fail: true }));

            setTimeout(() => {
                setShowAlert(prevState => ({ ...prevState, fail: false }));
                setDisplayPopUp(false);
            }, 3000)
        }

        document.body.style.overflow = 'auto';
    }

    return (
        <div className="popup" id="popup" onClick={(e) => handleClose(e)}>
            <Alert severity="success" sx={{
                position: "absolute",
                top: "0",
                transition: "opacity 0.5s ease-in-out",
                opacity: showAlert.succsess ? 1 : 0,
            }}>Успешно отправлено</Alert>

            <Alert severity="error" sx={{
                position: "absolute",
                top: "0",
                transition: "opacity 0.5s ease-in-out",
                opacity: showAlert.fail ? 1 : 0,
            }}>Ошибка при отправке: {errorMessage}</Alert>

            <div className="popup-content">
                <div className="popup-close-button">
                    <img src={closeBtn} alt="closeBtn" onClick={() => { setDisplayPopUp(false); document.body.style.overflow = 'auto'; }} />
                </div>
                <p>Сохранить текущую версию колеса баланса?</p>
                <button onClick={handleClick}>Сохранить</button>
                <button className="back-to-edit" onClick={() => { setDisplayPopUp(false); document.body.style.overflow = 'auto'; }}>Нет, вернуться к редактированию</button>
            </div>
        </div>
    );
}

export default PopUp;