import './Mobile.css';
import logo from '../../image/Logo.svg';

function Mobile() {
    return (
        <div className="App mobile">
            <div className='app-mobile'>
                <img src={logo} className="App-logo" alt="logo" />
                <h1>Работа с колесом баланса возможна только с копьютера или ноутбука</h1>
            </div>
        </div>
    )
}

export default Mobile;