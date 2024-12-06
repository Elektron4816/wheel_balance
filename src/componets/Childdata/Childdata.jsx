
import React, { useEffect, useState, useRef } from 'react';
import ru from 'date-fns/locale/ru';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

import './Childdata.css';
import linkIcon from '../../image/link-45deg.svg';

import Slider from './Slider/Slider';
import TextField from '@mui/material/TextField';



function Childdata(props) {
	const { skill, updateData, studentValue, setName, link, setDataLastWheel, dropValues } = props;
	const [visibleDropDown, setVisibleDropDown] = useState(false);
	const [valueName, setValueName] = useState('');
	const [clientData, setClientData] = useState(null);
	const [childrenData, setChildrenData] = useState(null);
	const [dataChildId, setdataChildId] = useState('');
	const [dataClientId, setdataClientId] = useState('');
	const [date, setDate] = useState('');
	const searchRef = useRef(null);


	const [versionWheel, setVersionWheel] = useState(null);


	const handleFocus = () => setVisibleDropDown(true);

	const handleChange = (e) => {
		setValueName(e.target.value);
		setName(e.target.value);
		setChildrenData(null);
		setDate('');
		dropValues();
	};

	const hanldeSearch = (event) => {

		let value = event.target.value;
		const testTest = document.querySelectorAll(".clients-title");
		testTest.forEach((item, index) => {
			if (!item.innerHTML.toLowerCase().includes(value.toLowerCase())) {
				item.classList.add("liveSearchHide");
			} else {
				item.classList.remove("liveSearchHide");
			}
		});

		setVersionWheel(null);
	}

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (searchRef.current && !searchRef.current.contains(event.target)) {
				if (visibleDropDown) {
					setVisibleDropDown(false);
				} else {
					setVisibleDropDown(true);
				}
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};

	}, [visibleDropDown]);

	useEffect(() => {
		fetch('/getClient')
			.then(response => response.json())
			.then(data => setClientData(data));
	}, []);

	return (
		<div className='child-data'>
			<h2>Данные ученика</h2>
			<div className='child-data-input-items'>
				<div className='child-data-input-item dropdown-children-container'>
					<TextField
						onFocus={handleFocus}
						onChange={handleChange}
						onKeyUp={hanldeSearch}
						onInput={handleChange}
						id="name-child" label="Имя ученика"
						variant="filled"
						name={dataChildId}
						fullWidth
						value={valueName}
						slotProps={{
							input: {
								disableUnderline: true,
							},
							htmlInput: {
								'data-client-id': dataClientId,
								'data-child-id': dataChildId
							}
						}} />
					{visibleDropDown && <div ref={searchRef} className='dropdown-children-content take-lesson-dropdown'>
						{clientData && !childrenData ?
							(
								<div style={{ marginTop: "12px" }}>
									<p style={{ fontSize: "18px", textAlign: "center" }}>Выберите клиента</p>
									<DisplayDropdownClient items={clientData} changeChildrenData={setChildrenData} changeParam={{ setValueName: setValueName, setdataChildId: setdataChildId, setVisibleDropDown: setVisibleDropDown, setName: setName, setdataClientId: setdataClientId, setVersionWheel: setVersionWheel }} />
								</div>
							) :
							(
								<div style={{ marginTop: "12px" }}>
									<p style={{ fontSize: "18px", textAlign: "center" }}>Выберите ребенка</p>
									<DisplayManyChildren childrenData={childrenData} changeParam={{ setValueName: setValueName, setdataChildId: setdataChildId, setVisibleDropDown: setVisibleDropDown, setName: setName, setDate: setDate, setVersionWheel: setVersionWheel }} />
								</div>
							)
						}
					</div>}
				</div>

				<div className='child-data-input-item'>
					<TextField id="date-birth" label="Возраст ученика" name='birth_date' variant="filled" value={date} onChange={(e) => setDate(e.target.value)} fullWidth InputProps={{ disableUnderline: true }} />
				</div>
				<div className='child-data-input-item'>

					<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
						<DatePicker
							slotProps={{ textField: { name: 'assessment_date', variant: 'filled', fullWidth: true, InputProps: { disableUnderline: true } } }}
							slots={{ openPickerIcon: CalendarTodayOutlinedIcon }}
							label="Дата диагностики"
							defaultValue={new Date()}
						/>
					</LocalizationProvider>
				</div>
				<div export-ignore='true' style={{ width: "100%" }}>
					<FormControl variant="filled" sx={{ width: "100%" }}>
						<InputLabel id="demo-simple-select-filled-label">Предыдущее колесо</InputLabel>
						{versionWheel && <DisplaySelectOption versionWheel={versionWheel} setDataLastWheel={setDataLastWheel} />}
					</FormControl>
				</div>

			</div>
			<div export-ignore='true' style={{ marginTop: '64px' }}>

				<div className='title-container'>
					<h2>Оцените текущее состояние ученика</h2>
					<a href={link} target='_blank' rel="noreferrer">
						<div className='title-container-link'>
							<img src={linkIcon} alt='link' />
							<p>Критерии оценивания</p>
						</div>
					</a>

				</div>
				<div className='child-data-slider-items'>
					<DisplaySkillSlider data={skill} updateSudentParameter={updateData} studentValue={studentValue} />
				</div>
			</div>
		</div>
	)
}

export default Childdata;

function DisplaySkillSlider(props) {
	const { data, updateSudentParameter, studentValue } = props;

	return (
		data.map((item, index) => {
			return (
				<div className='child-data-slider-item' key={index}>
					<p>{item}</p>
					<Slider onChange={v => updateSudentParameter(item, v)} value={studentValue[item]} name={item} />
				</div>
			)
		})
	)
}

function DisplayDropdownClient(props) {
	const { items, changeChildrenData, changeParam } = props;
	const handleClick = (e) => {
		const changeCursor = document.querySelectorAll(".clients-title");
		changeCursor.forEach(item => item.style.cursor = 'progress');
		changeParam.setdataClientId(e.target.getAttribute('data-client-id'));
		fetch(`/getChild?row_id=${e.target.id}`)
			.then(response => response.json())
			.then(data => {
				changeCursor.forEach(item => item.style.cursor = 'pointer');
				if (data.length === 1) {
					getLastWheele(changeParam.setVersionWheel, data[0].child_id);
					changeParam.setName(data[0].name_yc);
					changeParam.setValueName(data[0].name_yc);
					changeParam.setdataChildId(data[0].child_id);
					changeParam.setVisibleDropDown(false);
				} else if (data.length > 1) {
					changeChildrenData(data);
				}
			});
	}
	return items.map((element, index) => (
		<p key={index}
			id={element.row_id}
			value={element.client_id}
			data-client-id={element.client_id}
			onClick={handleClick}
			className='clients-title'>

			{element.client_name}
		</p>
	))
}

function DisplayManyChildren(props) {
	const { childrenData, changeParam } = props;
	const nowDate = new Date();

	const handleClick = (e) => {
		changeParam.setName(e.target.innerText);
		changeParam.setValueName(e.target.innerText);
		changeParam.setdataChildId(e.target.id);
		changeParam.setVisibleDropDown(false);

		let birthDateChildren = e.target.getAttribute('data-birth-date');
		birthDateChildren = birthDateChildren.trim();
		if (birthDateChildren.length !== 0) {
			const birthDate = new Date(birthDateChildren);
			const diff = nowDate - birthDate;
			const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
			changeParam.setDate(years);
		}
		getLastWheele(changeParam.setVersionWheel, e.target.id);
	}

	return childrenData.map((element, index) => (
		<p key={index}
			id={element.child_id}
			className='children-title'
			data-birth-date={element.birthday_data ? element.birthday_data : ''}
			onClick={handleClick}>
			{element.name_yc}
		</p>
	))
}

function DisplaySelectOption(props) {
	const { versionWheel, setDataLastWheel } = props;
	const [assDate, setAssDate] = useState('');
	const [emptyData, setEmptyData] = useState(false);

	const handleChangeSelect = (event) => {
		setAssDate(event.target.value);
		setTimeout(() => {
			versionWheel.forEach(item => {
				if (item.data.assessment_date === event.target.value) {
					setDataLastWheel(item.data);
				}
			})
		}, 100)
	};

	useEffect(() => {
		if (versionWheel.length === 0) {
			setEmptyData(true);
		}
	}, [versionWheel])

	return (
		<Select
			labelId="demo-simple-select-filled-label"
			id="demo-simple-select-filled"
			value={assDate}
			onChange={handleChangeSelect}
			disableUnderline={true}
			sx={{ borderRadius: "12px", backgroundColor: "#F5F0E7" }}
		>
			{emptyData && <MenuItem value="">
				Нет данных
			</MenuItem>}
			{versionWheel.map((item, index) => (
				<MenuItem key={index} value={item.data.assessment_date}>{item.data.assessment_date}</MenuItem>
			))}
		</Select>
		// return versionWheel.map((item, index) => (
		//     <MenuItem key={index} value={item.data.assessment_date}>{item.data.assessment_date}</MenuItem>
		// ))
	)
}

function getLastWheele(setWheel, childId) {
	//const getLastWheeleUrl = `https://crm.caremybaby.ru/Remotes/wheel/assessment/2c1853b326edeb7834e983c76663d5ce?child_id=${childId}`;
	fetch(`getLastWheele?child_id=${childId}`)
		.then(response => response.json())
		.then(data => {
			console.log(data);
			setWheel(data);
		});
}