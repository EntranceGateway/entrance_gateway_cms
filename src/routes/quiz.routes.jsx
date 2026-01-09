import { lazy } from "react";

const QuizDashboard = lazy(() => import("@/quiz/pages/QuizDashboard"));
const QuizCategories = lazy(() => import("@/quiz/pages/QuizCategories"));
const QuizCourses = lazy(() => import("@/quiz/pages/QuizCourses"));
const QuizQuestionSets = lazy(() => import("@/quiz/pages/QuizQuestionSets"));
const QuizQuestions = lazy(() => import("@/quiz/pages/QuizQuestions"));
const QuizResults = lazy(() => import("@/quiz/pages/QuizResults"));

export const quizRoutes = [
    { path: "/quiz", element: <QuizDashboard /> },
    { path: "/quiz/categories", element: <QuizCategories /> },
    { path: "/quiz/courses", element: <QuizCourses /> },
    { path: "/quiz/question-sets", element: <QuizQuestionSets /> },
    { path: "/quiz/questions", element: <QuizQuestions /> },
    { path: "/quiz/results", element: <QuizResults /> },
];
