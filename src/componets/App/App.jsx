import './App.css';
import logo from '../../image/Logo.svg';
import saveIcon1 from '../../image/SaveIcon-white.svg';
import saveIcon2 from '../../image/SaveIcon-orange.svg';
import chevronDown from '../../image/chevron-down.svg';

import Childdata from '../Childdata/Childdata';
import ChartBlock from '../ChartBlock/ChartBlock';
import AboutChild from '../AboutChild/AboutChild';
import Mobile from '../Mobile/Mobile';
import ColorContainer from '../ColorContainer/ColorContainer';
import { useState, useCallback, useEffect, useRef } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Alert from '@mui/material/Alert';

const wait = (delay) => new Promise(r => setTimeout(r, delay))

const exportPage = async (title, format) => {
  await wait(100)
  const windowWidth = 1200;

  const onclone = (clonedDocument) => {
    Array.from(
      clonedDocument.querySelectorAll(
        'textarea:not([aria-hidden="true"])'
      )
    ).forEach(textArea => {
      if (textArea.value.length > 0) {
        const div = clonedDocument.createElement('div')
        div.innerText = textArea.value
        div.className = textArea.className
        textArea.replaceWith(div)
      }
    })
  }

  const canvas = await html2canvas(document.body, {
    width: windowWidth,
    windowWidth,
    scrollX: 0,
    scrollY: 0,
    x: 0,
    y: 0,
    ignoreElements: (element) =>
      element.getAttribute('export-ignore') === 'true',
    onclone,
  })
  const canvasDataUrl = canvas.toDataURL('image/png')

  if (format === 'pdf') {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    })
    pdf.addImage(canvasDataUrl, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(`${title}.pdf`)
  } else if (format === 'jpg') {
    const a = document.createElement('a')
    a.href = canvasDataUrl
    a.setAttribute('download', `${title}.jpg`)
    a.click()
    a.remove()
  }
}

const lessonList = [
  { name: "Общее", value: "general" },
  { name: "Английский язык", value: "english" },
  { name: "Логопед", value: "speech" }
];

const defaultInputData = {
  parent_comment: '',
  month_goals: '',
  lesson_comment: '',
  favorite_characters: '',
  interests: '',
  likes_dislikes: ''
}


function App() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState({ parent: false, teacher: false });
  const [link, setLink] = useState("https://disk.yandex.ru/d/7iwYVbLgsXNFDw");
  const [fileFormat, setFileFormat] = useState('pdf');
  const [listLessonSkill, setListLessonItems] = useState(manySkill.general);
  const [studentParametersValues, setSudentParametersValues] = useState(Object.fromEntries(
    listLessonSkill.map(studentParameter => [studentParameter, 1])
  ))
  const [lessonName, setLessonName] = useState({ name: "Общее", value: "general" });
  const [exportingFor, setExportingFor] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [isRotatedLesson, setIsRotatedLesson] = useState(false);
  const lessonRef = useRef(null);
  const [dataLastWheel, setDataLastWheel] = useState(null);
  const [visibleAlert, setVisibleAlert] = useState(false);

  const [inputData, setInputData] = useState(defaultInputData);

  const dropValues = () => {
    setLessonName({ name: "Общее", value: "general" });
    setListLessonItems(manySkill.general);
    setSudentParametersValues(Object.fromEntries(
      manySkill.general.map(studentParameter => [studentParameter, 1])
    ))
    setInputData(defaultInputData);
    document.getElementById("teacher-name").value = '';
  }

  const handleClick = (id) => {
    setIsRotatedLesson(!isRotatedLesson);
    togleVisible(id);
  };

  const updateSudentParameter = (
    parameter,
    value,
  ) =>
    setSudentParametersValues(prev => ({
      ...prev,
      [parameter]: value,
    }))

  useEffect(() => {
    if (dataLastWheel) {
      const data = dataLastWheel.fields;
      console.log(data);

      let obj1 = {};
      for (let i = 0; i < data.length; i++) {
        let key = Object.keys(data[i])[0];
        let value = data[i][key];
        obj1[key] = value;
      }

      setInputData(obj1);

      let obj = {};
      const json = dataLastWheel.perfomance;
      for (let i = 0; i < json.length; i++) {
        let key = Object.keys(json[i])[0];
        let value = json[i][key];
        obj[key] = Number(value);
      }
      document.getElementById("teacher-name").value = dataLastWheel.teacher_name;
      setLessonName(dataLastWheel.subject);
      setListLessonItems(manySkill[dataLastWheel.subject.value]);
      setSudentParametersValues(obj);
    }

  }, [dataLastWheel]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (lessonRef.current && !lessonRef.current.contains(event.target)) {
        const lessonDropdown = document.getElementById("addictionLesson");
        if (lessonDropdown && lessonDropdown.style.display !== "none") {
          lessonDropdown.style.display = "none";
          setIsRotatedLesson(!isRotatedLesson);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isRotatedLesson]);

  const download = useCallback(
    async (exportFor) => {
      // console.log("црфе", exportFor);
      setIsLoading(prevState => ({ ...prevState, [exportFor]: true }))
      setExportingFor(exportFor)
      const title = `Колесо баланса – ${name} (${exportFor === 'parent' ? 'для родителей' : 'для преподавателей'
        })`
      await exportPage(title, fileFormat)
      setExportingFor(null)
      setIsLoading(null)
      setVisibleAlert(false);
    },
    [fileFormat, name]
  )

  return (width >= 1000 ? (<ColorContainer blue={exportingFor === 'parent'}>
    <ThemeProvider theme={customTheme}>
      <Alert severity="success" sx={{
        opacity: visibleAlert ? 1 : 0
      }}>Не забудьте сохранить!</Alert>
      <div className='header'>
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <h1>Колесо баланса ученика</h1>
          <div ref={lessonRef} className='take-lesson-container' onClick={() => handleClick('addictionLesson')} export-ignore='true'>
            <div className='picked-lesson'>
              <p className='picked-lesson-name' id='lesson-subject' name={lessonName.value}>{lessonName.name}</p>
              <img src={chevronDown} alt='chevron' style={{
                transform: isRotatedLesson ? "rotate(180deg)" : "rotate(0deg)"
              }} />
            </div>
            <div className='take-lesson-dropdown' id='addictionLesson' style={{ display: "none" }}>
              <DisplayLessonList setDataSkill={setListLessonItems} setDataName={setLessonName} updateSkillItem={setSudentParametersValues} setLink={setLink} />
            </div>
          </div>
        </div>
      </div>
      <section className='main-content'>
        <Childdata skill={listLessonSkill} updateData={updateSudentParameter} studentValue={studentParametersValues} setName={setName} dropValues={dropValues} link={link} setDataLastWheel={setDataLastWheel} />
      </section>
      <section className='main-content'>
        <ChartBlock label={listLessonSkill} studentValue={studentParametersValues} />
      </section>
      <section className='main-content'>
        <AboutChild exportingFor={exportingFor} inputData={inputData} setInputData={setInputData} />
      </section>
      <footer className='footer' export-ignore='true'>

        <h2>Формат файла</h2>
        <div className='radio-input-container'>
          <div className="classRadio">
            <input
              id="pdf"
              type="radio"
              name="save"
              defaultChecked
              value="pdf"
              onChange={() => setFileFormat('pdf')}
            />
            <label htmlFor="pdf">PDF (рекомендовано)</label>
            <input
              id="jpg"
              type="radio"
              name="save"
              value="jpg"
              onChange={() => setFileFormat('jpg')}
            />
            <label htmlFor="jpg">JPG</label>
          </div>
        </div>
        <div className='button-container'>
          <button onClick={() => { download('teacher'); setVisibleAlert(true) }}>
            {isLoading?.teacher ? (
              <div className="preloader">
                <div className="spinner" style={{ border: "3px solid #f3f3f3", borderTop: " 3px solid transparent" }}></div>
              </div>
            ) : (
              <img src={saveIcon1} alt='save' className='save-icon' />
            )}
            Скачать для педагога
          </button>
          <button onClick={() => { download('parent'); setVisibleAlert(true) }}>
            {isLoading?.parent ? (
              <div className="preloader">
                <div className="spinner" style={{ border: "3px solid #ee7a45", borderTop: " 3px solid transparent" }}></div>
              </div>
            ) : (
              <img src={saveIcon2} alt='save' className='save-icon' />
            )}
            Скачать для родителя
          </button>
        </div>
      </footer>
    </ThemeProvider>
  </ColorContainer>) : (<Mobile />)
  );
}

export default App;

function DisplayLessonList(props) {
  const { setDataSkill, setDataName, updateSkillItem, setLink } = props;
  const handleClick = (value, name) => {
    console.log(value);
    if (value === "english") {
      setLink("https://disk.yandex.ru/i/ybcHm6ctoZrKRw");
    } else if (value === "general") {
      setLink("https://disk.yandex.ru/i/rS-dPURXAmFDtw");
    }
    setDataSkill(manySkill[value]);
    // setDataName(name);
    setDataName({ name: name, value: value });
    updateSkillItem(Object.fromEntries(
      manySkill[value].map(studentParameter => [studentParameter, 1])
    ))
  }
  return lessonList.map((lesson, index) => (
    <p key={index} value={lesson.value} onClick={() => handleClick(lesson.value, lesson.name)}>{lesson.name}</p>
  ))
}

const togleVisible = (id) => {
  const element = document.getElementById(id);
  if (element.style.display === "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
};


const manySkill = {
  general: [
    'Коммуникативные навыки',
    'Математика',
    'Чтение и письмо',
    'Мотивация',
    'Развитие речи/Звукопроизношение',
    'Эмоциональный интеллект и воля',
    'Окружающий мир',
    'Память/Внимание/Мышление',
    'Творчество',
    'Физическое/моторное развитие',
  ],
  english: [
    'Словарный запас',
    'Память/Внимание/Мышление',
    'Мотивация/Интерес к языку',
    'Речь',
    'Восприятие английской речи на слух',
    'Произношение',
  ],
  speech: [
    'Связная речь, мышление',
    'Произношение звуков',
    'Различение звуков на слух',
    'Мелкая моторика, письмо',
    'Эмоциональный интеллект',
    'Словарный запас',
    'Выразительность/темп речи',
    'Составление предложений'
  ]

}

const customTheme = createTheme({
  typography: {
    fontFamily: "Gilroy",
  },
  components: {
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          ".MuiPickersDay-root": {
            "&:not(.Mui-selected)": {
              "&:hover": { backgroundColor: "#FFFBF4" },
            }

          },
          // ".MuiPickersDay-root": {
          //   "&:not(.Mui-selected)": { border: "1px solid red" }
          // }
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontFamily: 'Gilroy',
          fontWeight: '600',
          left: "50%",
          position: "sticky",
          top: "10px",
          transition: "opacity 0.5s ease-in-out",
          opacity: 1,
          zIndex: 5,
          width: "max-content",
          boxShadow: "0 0 8px 0 rgba(0, 0, 0, 0.2)",
          transform: "translateX(-50%)"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          backgroundColor: "#F5F0E7",
          marginTop: "6px",
          padding: "0",
          ".MuiMenu-list": {
            padding: "0px",
          },
          ".MuiMenuItem-root.Mui-selected": {
            backgroundColor: "transparent",
            "&:hover": { backgroundColor: "#FFFBF4" }
          },
          ".MuiMenuItem-root": {
            "&:hover": { backgroundColor: "#FFFBF4" },
            fontFamily: "Gilroy",
            fontWeight: "500",
            lineHeight: "40px",
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Gilroy',
          fontWeight: '500',
          color: "#6b6b6b",
          "&:focus": {
            color: "#6b6b6b",
          },
          ".Mui-focused": {
            color: "#6b6b6b",
          },
          ".MuiInputLabel-formControl.Mui-focused": {
            color: "#6b6b6b",
          }
        },
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontFamily: 'Gilroy',
          fontWeight: '400',
          ".MuiInputBase-root.MuiFilledInput-root": {
            borderRadius: "12px",
            backgroundColor: "#F5F0E7",
          },
          ".MuiSelect-root": {
            borderRadius: "12px",
            backgroundColor: "#F5F0E7",
            fontSize: "26px",
          },
          ".MuiFormLabel-root.Mui-focused": {
            color: "#6b6b6b",
          },
        },
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          ".MuiInputBase-root": {
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#F5F0E7",
            "&:focus": {
              outline: "solid #dbceb7"
            }
          },
          ".MuiInputBase-root.Mui-focused": {
            outline: "solid #dbceb7"
          },
          ".MuiFormLabel-root": {
            fontFamily: 'Gilroy',
            fontWeight: '500',
            color: "#6b6b6b",
          },
          ".MuiFormLabel-root.Mui-focused": {
            color: "#6b6b6b",
          },
          ".MuiInputBase-input": {
            fontFamily: 'Gilroy',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '20.8px',
          }
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          ".MuiSlider-thumb": {
            backgroundColor: '#EE7A45',
            '&:hover': {
              boxShadow: "0 0 0px 8px rgba(238, 122, 69, 0.16)",
            },
            '&::before': {
              content: "unset",
              boxShadow: "0 0 0px 8px rgba(238, 122, 69, 0.16)",
            },
            '&:active': {
              boxShadow: "0 0 0px 14px rgba(238, 122, 69, 0.16)",
            },
          },

          ".Mui-focusVisible": {
            "boxShadow": "0 0 0px 8px rgba(238, 122, 69, 0.16)"
          },

          ".MuiSlider-markLabel": {
            fontFamily: 'Gilroy',
            color: '#999895',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '28px'
          },
          ".MuiSlider-valueLabel": {
            backgroundColor: "#F5F0E7",
            boxShadow: "0 0 8px #35393340",
            fontFamily: 'Gilroy',
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: '20.8px',
            color: '#000000',
            '&:before': {
              display: 'none',
            }
          },
          ".MuiSlider-track": {
            backgroundColor: '#EE7A45',
            border: "none"
          },
          ".MuiSlider-rail": {
            backgroundColor: '#EE7A45',
          },
          ".MuiSlider-mark": {
            display: 'none',
          },
        }

      },
    },
  }
})