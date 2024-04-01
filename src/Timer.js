import './content.css'
import {useState, useEffect} from 'react'

const Title = () => {

    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [timeSpan, setTimeSpan] = useState('');

    const calculateTimeSpan = () => {
        if(!startTime || !endTime) return;
        const start = new Date(`2024-01-01T${startTime}:00`);
        const end = new Date(`2024-01-01T${endTime}:00`);
        if(start.getTime() > end.getTime()) {
            setTimeSpan("wrong time format");
            return;
        }
        const diff = end - start;
        const hour = Math.floor(diff / 1000 / 60 / 60);
        const minute = Math.floor(diff / 1000 / 60 ) % 60;

        setTimeSpan(`${hour}小時 ${minute}分鐘`);
    }
    return (
        <div className="input-column">
            <label>Create new work</label>
            <br />
            <div className="add-record">
                <input
                    className='title'
                    type='text'
                    placeholder='Enter record name...'
                    required
                ></input>
                <select
                    className='tag'
                >
                    <option>working</option>
                    <option>entertaining</option>
                </select>
                <input
                    type='time'
                    value = {startTime}
                    onChange = {(e) => setStartTime(e.target.value)}
                    required
                ></input>
                <p>to</p>
                <input
                    type='time'
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    onBlur = {calculateTimeSpan}
                    required
                ></input>
                <p className='time-span'>{timeSpan}</p>
                <button>Add</button>
            </div>
        </div>
    );
}
 
export default Title;