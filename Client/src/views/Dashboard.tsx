// src/components/Dashboard.tsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

interface Question {
    id: number;
    text: string;
    responses: string[];
}

const Dashboard: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    return (
        <div>
            <h1>Dashboard</h1>
            {questions.map((question) => (
                <div key={question.id}>
                    <h2>{question.text}</h2>
                    {question.responses.map((response, index) => (
                        <p key={index}>{response}</p>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Dashboard;
