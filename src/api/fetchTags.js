export const fetchTags = async (user_id, setTags) => {
    try {
        const response = await fetch(`http://localhost:8000/api/tags/${user_id}`);
        const data = await response.json();
        if(data.success) {
            setTags(data.tags); 
            console.log('使用者標籤取得成功');
        } else {
            console.error('使用者標籤取得失敗');
            setTags([]);
        }
    } catch (err) {
        console.error('讀取標籤過程發生錯誤', err);
        setTags([]);
    }
}
