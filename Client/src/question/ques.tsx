export const questions = [
    {
        id: 1,
        type: "single-choice",
        text: "What is the capital of France?",
        options: [
            {
                optionId: 1,
                text: "Paris",
                type: "text",
            },
            {
                optionId: 2,
                text: "Berlin",
                type: "text",
            },
            {
                optionId: 3,
                text: "Madrid",
                type: "text",
            },
            {
                optionId: 4,
                text: "Rome",
                type: "text",
            },
        ],
        responseType: "select-one",
    },
    {
        id: 2,
        type: "multiple-choice",
        text: "Select all the prime numbers.",
        options: [
            {
                optionId: 1,
                text: "2",
                type: "text",
            },
            {
                optionId: 2,
                text: "3",
                type: "text",
            },
            {
                optionId: 3,
                text: "4",
                type: "text",
            },
            {
                optionId: 4,
                text: "5",
                type: "text",
            },
        ],
        responseType: "select-multiple",
    },
    {
        id: 3,
        type: "text-input",
        text: "Describe your experience with our product.",
        responseType: "text",
    },
    {
        id: 4,
        type: "drawing-response",
        text: "Place the square in corner.",
        responseType: "canvas",
    },
    {
        id: 5,
        type: "image-choice",
        text: "Which symbol represents peace?",
        options: [
            {
                optionId: 1,
                image: "path/to/peace-sign.jpg",
                type: "image",
            },
            {
                optionId: 2,
                image: "path/to/dove.jpg",
                type: "image",
            },
            {
                optionId: 3,
                image: "path/to/olive-branch.jpg",
                type: "image",
            },
            {
                optionId: 4,
                image: "path/to/white-flag.jpg",
                type: "image",
            },
        ],
        responseType: "select-one",
    },
];
