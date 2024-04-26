import {useEffect, useState} from 'react';
import {useUser} from '../context/UserContext';
import {fetchTags} from '../api/fetchTags';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import '../style/homepage.css'

const ManageTag = () => {

    const {user} = useUser();
    const [tags, setTags] = useState([]);

    const [newTag, setNewTag] = useState('');
    
    useEffect(() => {
        if(!user) {
            console.log("使用者未登入")
            return;
        }
        fetchTags(user.user_id, setTags);
    }, [user]) 

    const handleTagDelete = async (tag_id) => {
        const response = await fetch(`http://localhost:8000/api/tags/${tag_id}`, {
            method: 'DELETE',
        })
        const data = await response.json();
        if(data.success) {
            console.log('標籤刪除成功')
            fetchTags(user.user_id, setTags);
        } else {
            console.error('標籤刪除失敗')
        }
    }

    const handleTagAdd = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:8000/api/tags/add", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tag_name: newTag,
                user_id: user.user_id
            })
        })
        const data = await response.json();
        if(data.success) {
            console.log('標籤新增成功')
            fetchTags(user.user_id, setTags);
        } else {
            console.error('標籤新增失敗')
        }
    }

    return (
        <div className='manage-tag-page'>
            <h3>Current Tags</h3>
            {tags.map((tag, index) => {
                return <div className='tags-list' key={index}>
                    <p>{tag.tag_name}</p>
                    <button className='delete-tag-button' onClick={() => handleTagDelete(tag.tag_id)}>
                        <FontAwesomeIcon icon={faXmark} className='icon'></FontAwesomeIcon>
                    </button>
                </div>
            })}
            <h3>Add New Tag</h3>
            <form className='new-tag-form' onSubmit={handleTagAdd}>
                <input 
                    type="text"
                    className='new-tag-input'
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    required
                />
                <button className='add-tag-button'>
                <FontAwesomeIcon icon={faCirclePlus} className='icon' />
                </button>
            </form>
        </div>
    );
}
 
export default ManageTag;
