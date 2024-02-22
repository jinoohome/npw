const fetchPost = async (endpoint:string, data:any) => {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('API 요청 실패');

        return await response.json();
    } catch (err) {
        throw err;
    }
};

export { fetchPost };