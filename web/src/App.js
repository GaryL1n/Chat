import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
    // 設置message跟name
    const [state, setState] = useState({ message: '', name: '' });
    const [chat, setChat] = useState([]);

    const socketRef = useRef();

    useEffect(() => {
        // 與後端的連接
        socketRef.current = io.connect('http://localhost:4000');
        socketRef.current.on('message', ({ name, message }) => {
            setChat([...chat, { name, message }]);
        });
        return () => socketRef.current.disconnect();
    }, [chat]);

    const onTextChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    //點擊表單提交時
    const onMessageSubmit = (e) => {
        const { name, message } = state;
        // 要在後端(message 自己設置的)那邊傳入{ name, message }
        socketRef.current.emit('message', { name, message });
        // 把原有默認提交功能停止
        e.preventDefault();
        setState({ message: '', name });
    };

    // 渲染聊天室
    const renderChat = () => {
        return chat.map(({ name, message }, index) => (
            <div key={index}>
                <h3>
                    {name}: <span>{message}</span>
                </h3>
            </div>
        ));
    };

    return (
        <div className="card">
            <form onSubmit={onMessageSubmit}>
                <h1>Messenger</h1>
                <div className="name-field">
                    <input
                        name="name"
                        // 當內容改變時執行
                        onChange={(e) => onTextChange(e)}
                        value={state.name}
                        label="Name"
                    />
                </div>
                <div>
                    <input
                        name="message"
                        onChange={(e) => onTextChange(e)}
                        value={state.message}
                        // style
                        id="outlined-multiline-static"
                        label="Message"
                    />
                </div>
                <button>Send</button>
            </form>
            <div className="render-chat">
                <h1>Chat</h1>
                {/* 訊息都會顯示在這裡 */}
                {renderChat()}
            </div>
        </div>
    );
}

export default App;
