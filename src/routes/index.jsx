import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/Verification/ProtectedRoute";

// Import route modules
import { authRoutes } from "./auth.routes";
import { adminRoutes } from "./admin.routes";
import { collegeRoutes } from "./college.routes";
import { courseRoutes } from "./course.routes";
import { notesRoutes } from "./notes.routes";
import { syllabusRoutes } from "./syllabus.routes";
import { adsRoutes } from "./ads.routes";
import { blogRoutes } from "./blog.routes";
import { noticeRoutes } from "./notice.routes";
import { quizRoutes } from "./quiz.routes";
import { oldQuestionRoutes } from "./oldQuestions.routes";
import { trainingRoutes } from "./training.routes";

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            {authRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                {[
                    ...adminRoutes,
                    ...collegeRoutes,
                    ...courseRoutes,
                    ...notesRoutes,
                    ...syllabusRoutes,
                    ...adsRoutes,
                    ...blogRoutes,
                    ...noticeRoutes,
                    ...quizRoutes,
                    ...oldQuestionRoutes,
                    ...trainingRoutes,
                ].map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}
            </Route>
        </Routes>
    );
};
