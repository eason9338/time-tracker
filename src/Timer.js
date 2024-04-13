import './content.css'
import {useState, useEffect} from 'react'
import { useUser } from './UserContext'

const Title = () => {

    const [recordName, setRecordName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [timeSpan, setTimeSpan] = useState('');

    const [records, setRecords] = useState([]);

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

        const userID = user.ID;
        const formattedStartTime = startTime + ":00";
        const formattedEndTime = endTime + ":00";
        const recordData = {
            record_name: recordName,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            timeSpan,
            userID
        }

        try {
           
            const response = await fetch("http://localhost:8000/api/records/add", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recordData),
            });

            const data = await response.json();
            if(data.success) {
                console.log('紀錄添加成功')
                data.record.record_date = new Date(data.record.record_date).toLocaleDateString({year: 'numeric', month: '2-digit', day: '2-digit' });
                setRecords([...records, data.record]);
            } else {
                console.error('紀錄添加失敗')
            }
        }catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        const fetchRecords = async () => {
            if(user) {
                try {
                    const response = await fetch(`http://localhost:8000/api/records/${user.ID}`)
                    const data = await response.json();
                    if(data.success) {
                        const formattedRecords = data.records.map(record => ({
                            ...record,
                            record_date: new Date(record.record_date).toLocaleDateString({year: 'numeric', month: '2-digit', day: '2-digit' }),
                        }))

                        setRecords(formattedRecords);
                    }else{
                        console.error("紀錄拿取失敗");
                    }
                }catch (err){
                    console.error("獲取紀錄過程發生錯誤：", err);
                }
            }
        }
        fetchRecords()
    }, [user])

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
            <div className="records-list">
            {records ? (
                records.map((record, index) => (
                    <div key={index} className="record">
                        <h3>{record.record_name}</h3>
                        <p>日期：{record.record_date}</p>
                        <p>開始時間: {record.start_time}</p>
                        <p>結束時間: {record.end_time}</p>
                    </div>
                ))
            ) : (
                <p>沒有找到記錄</p>
            )}
            </div>
        </div>
    );
}
 
export default Title;