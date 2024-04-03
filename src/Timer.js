import './content.css'
import {useState, useEffect} from 'react'
import { useUser } from './UserContext'

const Title = () => {

    const [recordName, setRecordName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [timeSpan, setTimeSpan] = useState('');

    const {user, setUser} = useUser();

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

    const handleSubmit = async (e) => {
        console.log("submitted");
        e.preventDefault();
        if(!user) {
            console.log("使用者未登入")
            return;
        }
        
        const start = new Date(`2024-01-01T${startTime}:00`);
        const end = new Date(`2024-01-01T${endTime}:00`);

        const recordData = {
            recordName,
            start,
            end,
            timeSpan,
            user
        }

        try {
           
            const response = await fetch("http://localhost:8000/api/records/add", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recordData),
            });

            if(response.success) {
                console.log('紀錄添加成功')
            } else {
                console.err('紀錄添加失敗')
            }
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <div className="function">
            <div className="greeting">
                <p className = {user ? "show": "hide"}>Hello! {user ? user.Name: ''}, let's make the day count! </p>
                <p className = {user ? "hide": "show"}>Hello! Login first to start tracking your day </p>
            </div>
            <div className="input-column">
                <form onSubmit={handleSubmit}>
                    <label>Create new work</label>
                    <br />
                    <div className="add-record">
                        <input
                            className='title'
                            type='text'
                            placeholder='Enter record name...'
                            value = {recordName}
                            onChange={(e) => setRecordName(e.target.value)}
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
                </form>
            </div>
        </div>
    );
}
 
export default Title;