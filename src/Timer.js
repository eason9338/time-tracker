import './style/content.css'
import './style/Timer.css'
import {useState, useEffect} from 'react'
import { useUser } from './UserContext'

const Title = () => {

    const [recordName, setRecordName] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [timeSpan, setTimeSpan] = useState('');

    const [records, setRecords] = useState([]);

    const {user, setUser} = useUser();

    const padTime = (num) => num.toString().padStart(2, '0');

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
        return `${padTime(hour)}:${padTime(minute)}:00`;

    }

    const handleSubmit = async (e) => {
        console.log("submitted");
        e.preventDefault();
        if(!user) {
            console.log("使用者未登入")
            return;
        }

        const userID = user.user_id
        const currentDate = new Date().toISOString().slice(0, 10);
        const formattedStartTime = `${currentDate}T${startTime}:00`;
        const formattedEndTime = `${currentDate}T${endTime}:00`;
        const duration = calculateTimeSpan(); // 調用函數並使用返回的值
        const recordData = {
            record_name: recordName,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            duration: duration,
            user_id: userID,
            tag_id: parseInt(selectedTag, 10),
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
                fetchRecords();
            } else {
                console.error('紀錄添加失敗')
            }
        }catch(err) {
            console.error(err);
        }
    }

    const handleNewTagSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/tags/add', {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
                body: JSON.stringify({tag_name: newTag}),
            })
            const data = response.json();
            if(data.success) {
                setNewTag('')
                console.log('標籤新增成功');
                fetchTags();
            } else {
                console.error('標籤添加失敗');
            }
        } catch (err) {
            console.error('添加標籤過程發生錯誤', err);
        }
    }

    const fetchTags = async () => {
        if (!user) {
            console.log('No user logged in.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/tags/${user.user_id}`);
            const data = await response.json();
            if(data.success) {
                setTags(data.tags);
                console.log('使用者標籤取得成功');
            } else {
                console.error('使用者標籤取得失敗')
            }
        } catch (err) {
            console.error('讀取標籤過程發生錯誤', err);
        }
    }

    const fetchRecords = async () => {
        if(user) {
            try {
                const response = await fetch(`http://localhost:8000/api/records/${user.user_id}`)
                const data = await response.json();
                if(data.success) {
                    if(data.records) {
                        const formattedRecords = data.records.map(record => ({
                            ...record,
                            record_date: new Date(record.record_date).toLocaleDateString('en-GB', {year: 'numeric', month: '2-digit', day: '2-digit'}),
                            start_time: new Date(record.start_time).toLocaleTimeString('zh-TW', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false,
                                timeZone: 'UTC'
                            }),
                            end_time: new Date(record.end_time).toLocaleTimeString('zh-TW', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false,
                                timeZone: 'UTC'
                            }),
                        }))
    
                        setRecords(formattedRecords);
                        console.log('使用者紀錄取得成功');
                    }
                    console.log('使用者紀錄取得成功，但紀錄為空');
                }else{
                    console.error("紀錄拿取失敗");
                }
            }catch (err){
                console.error("獲取紀錄過程發生錯誤：", err);
            }
        } else {
            console.log('使用者未登入，無法加載紀錄');
        }
    }

    useEffect(() => {
        console.log(user)
        fetchRecords()
        fetchTags()
    }, [user])


    return (
        <div className="function">
            <div className="greeting">
                <p className = {user ? "show": "hide"}>Hello! {user ? user.user_name: ''}, let's make the day count! </p>
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
                            value = {selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                        >
                            {tags && tags.map((tag, index) => {
                                return <option key={index} value={tag.tag_id}>{tag.tag_name}</option>
                            })}
                            <option value="new-tag">... New Tag</option>
                        </select>
                        {/* {selectedTag === '' && (
                            <div className="new-tag-input">
                                <input
                                    type='text'
                                    placeholder='Enter new tag...'
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                ></input>
                                <button onClick={handleNewTagSubmit}>Add tag</button>
                            </div>
                        )} */}
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
                        <div className="records-title">
                            <p className='record-date'>日期：{record.record_date}</p>
                            <p className='record-duration'>{record.duration}</p>
                        </div>
                        <div className="records-time">
                            <h3 className='record-name'>{record.record_name}</h3>
                            <p className='record-tag'>{record.tag_name}</p>
                            <p className='record-starttime'>{record.start_time}</p>
                            <p>-</p>
                            <p className='record-endtime'>{record.end_time}</p>
                        </div>

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