import { useState, useEffect } from 'react';
import './Whiteboard.css';

const Whiteboard = ({ notes, onAddNote, onUpdateNote, theme, defaultAuthor }) => {
    const [author, setAuthor] = useState(defaultAuthor || '');
    const [text, setText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        if (defaultAuthor) {
            setAuthor(defaultAuthor);
        }
    }, [defaultAuthor]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim() || !author.trim()) return;

        onAddNote({
            text: text.trim(),
            author: author.trim(),
            team: theme
        });

        setText('');
    };

    const startEditing = (note) => {
        setEditingId(note.id);
        setEditText(note.text);
    };

    const saveEdit = (id) => {
        if (editText.trim()) {
            onUpdateNote(id, { text: editText.trim() });
            setEditingId(null);
            setEditText('');
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    // Sort notes by newest first
    const safeNotes = Array.isArray(notes) ? notes : [];
    const sortedNotes = [...safeNotes].sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    );

    return (
        <div className="whiteboard-container">
            <div className="whiteboard-header">
                <h2>📝 Trash Talk & Cheers Board 📢</h2>
                <p>Leave a note for everyone to see!</p>
            </div>

            <div className="whiteboard-input-section">
                <form onSubmit={handleSubmit} className="note-form">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="note-input author-input"
                            maxLength={20}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            placeholder="Type your message..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="note-input text-input"
                            maxLength={100}
                            required
                        />
                    </div>
                    <button type="submit" className="post-button">
                        Pin It! 📌
                    </button>
                </form>
            </div>

            <div className="notes-grid">
                {sortedNotes.length > 0 ? (
                    sortedNotes.map(note => (
                        <div
                            key={note.id}
                            className={`sticky-note ${note.team === 'patriots' ? 'patriots-note' : 'seahawks-note'}`}
                        >
                            <div className="note-content">
                                {editingId === note.id ? (
                                    <div className="edit-mode">
                                        <textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className="edit-textarea"
                                            maxLength={100}
                                        />
                                        <div className="edit-actions">
                                            <button onClick={() => saveEdit(note.id)} className="save-btn">💾</button>
                                            <button onClick={cancelEdit} className="cancel-btn">❌</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        "{note.text}"
                                        {defaultAuthor && note.author === defaultAuthor && (
                                            <button
                                                onClick={() => startEditing(note)}
                                                className="edit-btn"
                                                title="Edit Note"
                                            >
                                                ✏️
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="note-footer">
                                <span className="note-author">- {note.author}</span>
                                <span className="note-time">
                                    {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="pin">📍</div>
                        </div>
                    ))
                ) : (
                    <div className="empty-board">
                        <p>No notes yet. Be the first to post!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Whiteboard;
