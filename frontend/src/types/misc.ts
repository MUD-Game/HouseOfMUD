
export interface DisplaysMessageProps {
    setMessage: (error: string) => void;
    message: string;
}

export interface SendsMessagesProps {
    messageCallback: (message: string) => void;
}
