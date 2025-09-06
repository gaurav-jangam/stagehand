
"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BrainCircuit, LoaderCircle, Sparkles } from 'lucide-react';
import { musicAssistant } from '@/ai/flows/music-assistant-flow';
import ReactMarkdown from 'react-markdown';

export function AssistantPage() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setAnswer('');

        try {
            const result = await musicAssistant({ query });
            setAnswer(result.answer);
        } catch (error) {
            console.error(error);
            setAnswer("Sorry, I couldn't fetch an answer. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <Card className='backdrop-blur-[2px] bg-transparent'>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                       <BrainCircuit className='h-6 w-6' /> Your Question
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Textarea
                            placeholder="e.g., Tell me about the movie 'The Matrix' and its main actors..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            rows={4}
                            disabled={loading}
                            className='bg-background/50'
                        />
                        <Button type="submit" disabled={loading || !query.trim()}>
                            {loading ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Thinking...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Ask Assistant
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            { (loading || answer) && (
                 <Card className='backdrop-blur-[2px] bg-transparent'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <Sparkles className='h-6 w-6 text-primary' /> AI Response
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading && !answer ? (
                            <div className='flex items-center gap-2 text-muted-foreground'>
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                <span>The assistant is searching for the answer...</span>
                            </div>
                        ) : (
                            <div className="prose prose-invert max-w-none">
                                <ReactMarkdown>{answer}</ReactMarkdown>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
