import React, { useState } from 'react';

export const App: React.FC = () => {
    const [name, setName] = useState('worlddd');
    return (
        <>
            <input value={name} onChange={e => setName(e.target.value)} />
            <h1>Hello, {name}!</h1>
        </>
    );
};
