"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    ChevronLeft, Clock, CheckCircle2, Circle, AlertTriangle,
    Award, X, ArrowRight, RefreshCw, Target, Briefcase
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Question {
    id: string;
    question: string;
    type: "technical" | "behavioral" | "scenario";
    options?: string[];
    answer: string;
    points: number;
}

interface VerificationResult {
    score: number;
    percentage: number;
    passed: boolean;
    correctAnswers: number;
    totalQuestions: number;
    timeTaken: number;
    weakAreas: string[];
}

// Mock interview questions database (no API calls)
const MOCK_QUESTIONS: { [key: string]: Question[] } = {
    "software engineer": [
        {
            id: "1",
            question: "What is the time complexity of binary search?",
            type: "technical",
            options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
            answer: "O(log n)",
            points: 10
        },
        {
            id: "2",
            question: "Explain the difference between == and === in JavaScript.",
            type: "technical",
            answer: "== checks value equality, === checks both value and type",
            points: 10
        },
        {
            id: "3",
            question: "Describe a situation where you had to debug a complex issue. How did you approach it?",
            type: "behavioral",
            answer: "Any systematic debugging approach with specific tools and resolution",
            points: 15
        },
        {
            id: "4",
            question: "What is REST and what are its main principles?",
            type: "technical",
            answer: "REST is an architectural style for distributed systems. Main principles: stateless, client-server, cacheable, uniform interface",
            points: 15
        },
        {
            id: "5",
            question: "Your project deadline is in 3 days but you're behind schedule. What do you do?",
            type: "scenario",
            answer: "Communicate with stakeholders, prioritize features, consider scope reduction, and adjust timeline",
            points: 15
        },
        {
            id: "6",
            question: "What is the purpose of a Docker container?",
            type: "technical",
            answer: "Docker containers package applications and dependencies to run consistently across environments",
            points: 10
        },
        {
            id: "7",
            question: "Explain the concept of database normalization.",
            type: "technical",
            answer: "Database normalization organizes data to reduce redundancy and improve integrity, typically through 1NF, 2NF, 3NF",
            points: 15
        },
        {
            id: "8",
            question: "How do you handle tight deadlines and multiple priorities?",
            type: "behavioral",
            answer: "Any answer showing prioritization, communication, and time management",
            points: 10
        }
    ],
    "python developer": [
        {
            id: "1",
            question: "What are decorators in Python and how do they work?",
            type: "technical",
            answer: "Decorators are functions that modify the behavior of other functions. They wrap functions to execute code before/after the wrapped function",
            points: 15
        },
        {
            id: "2",
            question: "Explain the difference between list and tuple in Python.",
            type: "technical",
            options: ["Lists are mutable, tuples are immutable", "Tuples are mutable, lists are immutable", "They are the same", "Lists are faster"],
            answer: "Lists are mutable, tuples are immutable",
            points: 10
        },
        {
            id: "3",
            question: "What is a generator in Python?",
            type: "technical",
            answer: "Generators are functions that yield items one at a time using 'yield' keyword, allowing lazy evaluation",
            points: 15
        },
        {
            id: "4",
            question: "Describe how you optimized a slow Python application.",
            type: "behavioral",
            answer: "Any answer profiling code, identifying bottlenecks, and implementing optimizations",
            points: 15
        },
        {
            id: "5",
            question: "What is the Global Interpreter Lock (GIL) in Python?",
            type: "technical",
            answer: "GIL is a mutex that prevents multiple native threads from executing Python bytecodes at once",
            points: 15
        },
        {
            id: "6",
            question: "How do you handle exceptions in Python?",
            type: "technical",
            answer: "Using try-except blocks, with specific exception types and finally blocks for cleanup",
            points: 10
        },
        {
            id: "7",
            question: "Your team member is struggling with a complex task. How do you help?",
            type: "scenario",
            answer: "Any answer showing mentorship, collaboration, and knowledge sharing",
            points: 10
        },
        {
            id: "8",
            question: "Explain list comprehension in Python with an example.",
            type: "technical",
            answer: "List comprehension creates lists using compact syntax. Example: [x**2 for x in range(10)]",
            points: 10
        }
    ],
    "data scientist": [
        {
            id: "1",
            question: "What is the difference between supervised and unsupervised learning?",
            type: "technical",
            answer: "Supervised learning uses labeled data, unsupervised learning finds patterns in unlabeled data",
            points: 15
        },
        {
            id: "2",
            question: "Explain overfitting and how to prevent it.",
            type: "technical",
            answer: "Overfitting is when a model learns training data too well. Prevention: regularization, cross-validation, more data",
            points: 15
        },
        {
            id: "3",
            question: "How do you handle missing values in a dataset?",
            type: "technical",
            answer: "Methods: remove rows, impute with mean/median, use algorithms that handle missing values",
            points: 10
        },
        {
            id: "4",
            question: "Describe a challenging ML project you worked on.",
            type: "behavioral",
            answer: "Any answer showing problem-solving, methodology, and results",
            points: 15
        },
        {
            id: "5",
            question: "What is the purpose of train/test split?",
            type: "technical",
            answer: "Train/test split evaluates model performance on unseen data to prevent overfitting",
            points: 10
        },
        {
            id: "6",
            question: "How do you explain complex ML concepts to non-technical stakeholders?",
            type: "scenario",
            answer: "Any answer showing simplification, use of analogies, and focus on business value",
            points: 15
        },
        {
            id: "7",
            question: "What is cross-validation?",
            type: "technical",
            answer: "Cross-validation splits data into multiple folds to assess model performance robustly",
            points: 10
        },
        {
            id: "8",
            question: "How do you stay updated with new ML techniques?",
            type: "behavioral",
            answer: "Any answer showing continuous learning, research papers, and practical application",
            points: 10
        }
    ],
    "ai engineer": [
        {
            id: "1",
            question: "What is the difference between supervised and reinforcement learning?",
            type: "technical",
            answer: "Supervised uses labeled data, reinforcement learns through trial/error with rewards",
            points: 15
        },
        {
            id: "2",
            question: "Explain transformer architecture in simple terms.",
            type: "technical",
            answer: "Transformers use attention mechanisms to process sequences in parallel, capturing long-range dependencies",
            points: 15
        },
        {
            id: "3",
            question: "What is the difference between training and inference?",
            type: "technical",
            answer: "Training updates model parameters, inference uses trained model to make predictions",
            points: 10
        },
        {
            id: "4",
            question: "Describe how you optimized a model for production deployment.",
            type: "behavioral",
            answer: "Any answer covering quantization, pruning, or latency optimization",
            points: 15
        },
        {
            id: "5",
            question: "What is prompt engineering?",
            type: "technical",
            answer: "Designing effective prompts to guide LLMs toward desired outputs",
            points: 15
        },
        {
            id: "6",
            question: "How do you handle AI model hallucinations?",
            type: "scenario",
            answer: "Methods: fact-checking, RAG, temperature tuning, prompt constraints",
            points: 10
        },
        {
            id: "7",
            question: "Explain RAG (Retrieval-Augmented Generation).",
            type: "technical",
            answer: "RAG combines LLMs with external knowledge retrieval for accurate, up-to-date responses",
            points: 10
        },
        {
            id: "8",
            question: "Your AI model is biased. How do you address it?",
            type: "scenario",
            answer: "Any answer showing bias detection, diverse training data, and fairness metrics",
            points: 10
        }
    ],
    "web developer": [
        {
            id: "1",
            question: "What is the CSS Box Model?",
            type: "technical",
            answer: "Box model includes: content, padding, border, margin - determines element size and spacing",
            points: 10
        },
        {
            id: "2",
            question: "Explain the difference between localStorage and sessionStorage.",
            type: "technical",
            answer: "localStorage persists until deleted, sessionStorage clears when tab closes",
            points: 10
        },
        {
            id: "3",
            question: "What is the purpose of React useEffect?",
            type: "technical",
            answer: "useEffect handles side effects like data fetching, subscriptions, DOM manipulation",
            points: 15
        },
        {
            id: "4",
            question: "How do you optimize website performance?",
            type: "behavioral",
            answer: "Any answer covering: lazy loading, caching, minification, image optimization",
            points: 15
        },
        {
            id: "5",
            question: "What is semantic HTML?",
            type: "technical",
            answer: "Semantic HTML uses meaningful tags (header, nav, article) for accessibility and SEO",
            points: 10
        },
        {
            id: "6",
            question: "Explain CORS (Cross-Origin Resource Sharing).",
            type: "technical",
            answer: "CORS allows servers to specify who can access resources, preventing same-origin policy restrictions",
            points: 15
        },
        {
            id: "7",
            question: "Client wants a feature that impacts performance. What do you do?",
            type: "scenario",
            answer: "Any answer showing trade-off analysis, alternative solutions, and clear communication",
            points: 10
        },
        {
            id: "8",
            question: "How do you ensure web accessibility?",
            type: "behavioral",
            answer: "Any answer covering: ARIA labels, keyboard navigation, alt text, color contrast",
            points: 10
        }
    ]
};

export default function VerificationPage() {
    const params = useParams();
    const resultId = params.resultId as string;
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<string>("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Map<string, string>>(new Map());
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isInterviewActive, setIsInterviewActive] = useState(false);
    const [result, setResult] = useState<VerificationResult | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Timer logic
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isInterviewActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        finishInterview();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isInterviewActive, timeLeft]);

    // Fetch questions (mock - no API calls)
    useEffect(() => {
        const loadQuestions = () => {
            // Try to get role from localStorage or use default
            const savedRole = localStorage.getItem(`verification-role-${resultId}`);
            const roleKey = (savedRole || "software engineer").toLowerCase();
            setRole(roleKey);

            // Get questions from mock database
            const roleQuestions = MOCK_QUESTIONS[roleKey] || MOCK_QUESTIONS["software engineer"];
            setQuestions(roleQuestions);
            setTimeLeft(roleQuestions.length * 90); // 90 seconds per question
            setLoading(false);
        };

        loadQuestions();
    }, [resultId]);

    const handleAnswer = (questionId: string, answer: string) => {
        setAnswers(prev => new Map(prev).set(questionId, answer));
    };

    const calculateScore = useCallback((): VerificationResult => {
        let totalScore = 0;
        let correctAnswers = 0;
        const weakAreas: string[] = [];

        questions.forEach(q => {
            const userAnswer = answers.get(q.id)?.toLowerCase() || "";
            const correctAnswer = q.answer.toLowerCase();

            // Simple keyword matching for open-ended questions
            const isCorrect = q.options
                ? userAnswer === correctAnswer
                : correctAnswer.split(',').some(keyword => userAnswer.includes(keyword.trim()));

            if (isCorrect) {
                totalScore += q.points;
                correctAnswers++;
            } else {
                // Track weak area based on question type
                if (!weakAreas.includes(q.type)) {
                    weakAreas.push(q.type);
                }
            }
        });

        const maxScore: number = questions.reduce((sum: number, q) => sum + q.points, 0);
        const percentage = Math.round((totalScore / maxScore) * 100);

        const result: VerificationResult = {
            score: totalScore,
            percentage,
            passed: percentage >= 70, // 70% threshold
            correctAnswers,
            totalQuestions: questions.length,
            timeTaken: (questions.length * 90) - timeLeft,
            weakAreas
        };
        return result;
    }, [answers, questions, timeLeft]);

    const finishInterview = () => {
        setIsInterviewActive(false);
        const verificationResult = calculateScore();
        setResult(verificationResult);

        // Show modal if didn't pass
        if (!verificationResult.passed) {
            setShowModal(true);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgress = () => {
        return Math.round(((currentQuestion + 1) / questions.length) * 100);
    };

    const restartInterview = () => {
        setCurrentQuestion(0);
        setAnswers(new Map());
        setResult(null);
        setShowModal(false);
        setTimeLeft(questions.length * 90);
        setIsInterviewActive(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-slate-400 text-lg">Preparing interview...</p>
                </div>
            </div>
        );
    }

    if (result) {
        return (
            <div className="min-h-screen pb-20">
                {/* Header */}
                <div className="bg-gradient-to-b from-slate-900/50 to-transparent py-6 px-6 border-b border-white/5">
                    <div className="max-w-4xl mx-auto">
                        <Link href={`/learning/${resultId}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                            <ChevronLeft className="w-5 h-5" /> Back to Learning
                        </Link>
                    </div>
                </div>

                {/* Results */}
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className={`glass-card p-12 rounded-3xl border-2 text-center ${result.passed ? 'border-emerald-500/50' : 'border-red-500/50'}`}>
                        <div className={`w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center ${result.passed ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                            {result.passed ? (
                                <Award className="w-12 h-12 text-emerald-400" />
                            ) : (
                                <X className="w-12 h-12 text-red-400" />
                            )}
                        </div>

                        <h1 className={`text-4xl font-bold mb-4 ${result.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                            {result.passed ? "Congratulations!" : "Keep Learning!"}
                        </h1>

                        <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                            {result.passed
                                ? "You've demonstrated strong readiness for the job market. Your skills and knowledge are at a competitive level."
                                : "You're making progress but need more preparation before entering the job market."}
                        </p>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white/5 rounded-2xl p-6">
                                <div className="text-4xl font-bold text-white mb-2">{result.score}</div>
                                <div className="text-xs text-slate-500 uppercase tracking-widest">Total Score</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6">
                                <div className={`text-4xl font-bold mb-2 ${result.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {result.percentage}%
                                </div>
                                <div className="text-xs text-slate-500 uppercase tracking-widest">Pass Rate</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6">
                                <div className="text-4xl font-bold text-white mb-2">
                                    {result.correctAnswers}/{result.totalQuestions}
                                </div>
                                <div className="text-xs text-slate-500 uppercase tracking-widest">Correct Answers</div>
                            </div>
                        </div>

                        {!result.passed && result.weakAreas.length > 0 && (
                            <div className="bg-white/5 rounded-2xl p-6 mb-8">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-primary" />
                                    Areas to Improve
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.weakAreas.map((area, idx) => (
                                        <span key={idx} className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium capitalize">
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-center gap-4">
                            {result.passed ? (
                                <Link
                                    href="/jobs"
                                    className="btn-primary bg-emerald-600 hover:bg-emerald-500 px-10 py-4 flex items-center gap-2"
                                >
                                    <Briefcase className="w-5 h-5" />
                                    Browse Jobs
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={`/learning/${resultId}`}
                                        className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
                                    >
                                        Continue Learning
                                    </Link>
                                    <Link
                                        href={`/roadmap/result/${resultId}`}
                                        className="btn-primary px-8 py-4 flex items-center gap-2"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                        Adjust Roadmap
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isInterviewActive) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="max-w-3xl mx-auto text-center">
                    <Briefcase className="w-24 h-24 text-primary mx-auto mb-8" />
                    <h1 className="text-5xl font-bold text-white mb-6">Technical Interview</h1>
                    <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                        You'll face {questions.length} questions testing your skills in <strong className="text-white">{role}</strong>.
                        You have {formatTime(questions.length * 90)} to complete the interview.
                        Good luck!
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="glass-card p-6 rounded-2xl border border-white/10">
                            <div className="text-3xl font-bold text-emerald-400 mb-2">{questions.length}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Questions</div>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border border-white/10">
                            <div className="text-3xl font-bold text-primary mb-2">{formatTime(questions.length * 90)}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Total Time</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsInterviewActive(true)}
                        className="btn-primary bg-emerald-600 hover:bg-emerald-500 px-12 py-5 flex items-center gap-2 text-lg group"
                    >
                        <Target className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        Start Interview
                    </button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];

    return (
        <div className="min-h-screen pb-20">
            {/* Header with Timer */}
            <div className="bg-gradient-to-b from-slate-900/50 to-transparent py-6 px-6 border-b border-white/5 sticky top-0 z-10 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={`/learning/${resultId}`} className="text-slate-400 hover:text-white transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Question</div>
                            <div className="text-lg font-bold text-white">{currentQuestion + 1}/{questions.length}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Progress</div>
                            <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${getProgress()}%` }}
                                />
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                            <Clock className="w-5 h-5" />
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Question Area */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="glass-card p-10 rounded-3xl border border-white/10 mb-8">
                    <div className="flex items-center gap-2 mb-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                            currentQ.type === 'technical' ? 'bg-blue-500/10 text-blue-400' :
                            currentQ.type === 'behavioral' ? 'bg-purple-500/10 text-purple-400' :
                            'bg-emerald-500/10 text-emerald-400'
                        }`}>
                            {currentQ.type}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-bold uppercase tracking-widest">
                            {currentQ.points} points
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-6">{currentQ.question}</h2>

                    {currentQ.options ? (
                        <div className="space-y-4">
                            {currentQ.options.map((option, idx) => {
                                const isSelected = answers.get(currentQ.id) === option;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(currentQ.id, option)}
                                        className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                                            isSelected
                                                ? 'border-primary bg-primary/10 text-white'
                                                : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {isSelected ? (
                                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-slate-600 flex-shrink-0" />
                                            )}
                                            <span className="font-medium">{option}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <textarea
                            value={answers.get(currentQ.id) || ""}
                            onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                            placeholder="Type your answer here..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-6 text-white placeholder:text-slate-600 focus:border-primary/50 focus:outline-none transition-all min-h-[150px] resize-none"
                        />
                    )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={prevQuestion}
                        disabled={currentQuestion === 0}
                        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>

                    {currentQuestion === questions.length - 1 ? (
                        <button
                            onClick={finishInterview}
                            className="btn-primary bg-emerald-600 hover:bg-emerald-500 px-10 py-4 flex items-center gap-2"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            Submit Interview
                        </button>
                    ) : (
                        <button
                            onClick={nextQuestion}
                            className="btn-primary px-10 py-4 flex items-center gap-2"
                        >
                            Next
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Adjustment Modal */}
            {showModal && result && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="glass-card p-10 rounded-3xl border border-yellow-500/30 max-w-2xl w-full animate-fade-in">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Almost Ready!</h3>
                                    <p className="text-slate-400 text-sm">Let's fine-tune your roadmap</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-slate-300 mb-8 leading-relaxed">
                            You scored <strong className="text-red-400">{(result as VerificationResult).percentage}%</strong> (threshold: 70%).
                            While you've made great progress, we recommend adjusting your learning roadmap
                            to focus on your weak areas before entering the job market.
                        </p>

                        <div className="bg-white/5 rounded-2xl p-6 mb-8">
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Weak Areas Identified</h4>
                            <div className="flex flex-wrap gap-2">
                                {(result as VerificationResult).weakAreas.map((area, idx) => (
                                    <span key={idx} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 font-medium capitalize">
                                        {area}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
                            >
                                Stay Here
                            </button>
                            <Link
                                href={`/learning/${resultId}`}
                                onClick={() => setShowModal(false)}
                                className="flex-1 btn-primary bg-yellow-600 hover:bg-yellow-500 px-6 py-4 flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Adjust Roadmap
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
