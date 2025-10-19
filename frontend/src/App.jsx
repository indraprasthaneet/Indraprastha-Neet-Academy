import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { SidebarProvider } from "./contexts/SidebarContext";
import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AllCourses from "./pages/AllCourses";
import ViewCourse from "./pages/ViewCourse";
import EnrolledCourse from "./pages/EnrolledCourse";
import ViewLecture from "./pages/ViewLecture";
import SearchWithAi from "./pages/SearchWithAi";
import PYQBundle from "./pages/PYQBundle";
import QuestionBank from "./pages/QuestionBank";
import QuestionChapterPage from "./pages/QuestionChapterPage";
import VideoSolution from "./pages/VideoSolution";
import MCQOfTheDay from "./pages/MCQOfTheDay";
import Pearl from "./pages/Pearl";
import SidebarTest from "./pages/SidebarTest";
import TestSeriesCreate from "./pages/TestSeriesCreate";
import TestSeriesList from "./pages/TestSeriesList";
import TestSeriesAttempt from "./pages/TestSeriesAttempt";
// Add this import for the Playground page
import Playground from "./pages/Playground";
// Add this import for the TestQuestionBank page
import TestQuestionBank from "./pages/TestQuestionBank";
// Add imports for new note pages
import TeacherNotepad from "./pages/TeacherNotepad";
import StudentNotesView from "./pages/StudentNotesView";

// Admin
import Dashboard from "./pages/admin/Dashboard";
import Courses from "./pages/admin/Courses";
import AddCourses from "./pages/admin/AddCourses";
import CreateCourse from "./pages/admin/CreateCourse";
import CreateLecture from "./pages/admin/CreateLecture";
import EditLecture from "./pages/admin/EditLecture";

// Hooks
import useGetCurrentUser from "./customHooks/useGetCurrentUser";
// import getCouseData from "./customHooks/getCouseData";
// import getCreatorCourseData from "./customHooks/getCreatorCourseData";
// import getAllReviews from "./customHooks/getAllReviews";

// Components
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthDemo from "./components/AuthDemo";

export const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function App() {
  const { userData } = useSelector((state) => state.user);
  const { initializing } = useSelector((state) => state.user);
  
  // Custom ProtectedRoute component for basic authentication
  const SimpleProtectedRoute = ({ children }) => {
    return userData ? children : <Navigate to="/login" />;
  };
  
  // Call hooks directly - they handle their own useEffect internally
  useGetCurrentUser();
  // getCouseData();
  // getCreatorCourseData();
  // getAllReviews();

  return (
    <SidebarProvider>
      <ToastContainer />
      <ScrollToTop />
      <Layout>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/signup"
          element={
            // wait until initializing finishes; during that time show signup so user isn't bounced
            initializing ? <SignUp /> : (!userData ? <SignUp /> : <Navigate to="/" />)
          }
        />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        
        {/* Auth Demo Route - Public for testing */}
        <Route path="/auth-demo" element={<AuthDemo />} />
       

        {/* Student Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/allcourses"
          element={
            <ProtectedRoute>
              <AllCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewcourse/:courseId"
          element={
            <ProtectedRoute>
              <ViewCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editprofile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enrolledcourses"
          element={
            <ProtectedRoute>
              <EnrolledCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewlecture/:courseId"
          element={
            <ProtectedRoute>
              <ViewLecture />
            </ProtectedRoute>
          }
        />
        <Route
          path="/searchwithai"
          element={
            <ProtectedRoute>
              <SearchWithAi />
            </ProtectedRoute>
          }
        />

        {/* New Sidebar Routes */}
        <Route
          path="/question-bank"
          element={
            <ProtectedRoute>
              <QuestionBank />
            </ProtectedRoute>
          }
        />
        {/* Add this route for question chapter pages */}
        <Route
          path="/question-bank/:classNumber/:subject/:chapter"
          element={
            <ProtectedRoute>
              <QuestionChapterPage />
            </ProtectedRoute>
          }
        />
        {/* Add this route for the playground */}
        <Route
          path="/playground/:questionId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Playground />
            </ProtectedRoute>
          }
        />
        {/* Test route for Question Bank components */}
        <Route
          path="/test-question-bank"
          element={
            <ProtectedRoute>
              <TestQuestionBank />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video-solution"
          element={
            <ProtectedRoute>
              <VideoSolution />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mcq-of-the-day"
          element={
            <ProtectedRoute>
              <MCQOfTheDay />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pearl"
          element={
            <ProtectedRoute>
              <Pearl />
            </ProtectedRoute>
          }
        />

        {/* Test Series Routes */}
        <Route
          path="/test-series"
          element={
            <ProtectedRoute>
              <TestSeriesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-series/create"
          element={
            <ProtectedRoute allowedRoles={["educator"]}>
              <TestSeriesCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-series/:id"
          element={
            <ProtectedRoute>
              <TestSeriesAttempt />
            </ProtectedRoute>
          }
        />

        <Route path="/sidebar-demo" element={<div className="p-6"><h1 className="text-2xl font-bold">Sidebar Demo</h1><p>Use the sidebar toggle to test responsive behavior!</p></div>} />
        <Route path="/sidebar-test" element={<SidebarTest />} />

        {/* Educator Protected Routes */}
        <Route
          path="/dashboard"
          element={
            userData?.role === "educator" ? (
              <Dashboard />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route
          path="/courses"
          element={
            userData?.role === "educator" ? (
              <Courses />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route
          path="/addcourses/:courseId"
          element={
            userData?.role === "educator" ? (
              <AddCourses />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route
          path="/createcourses"
          element={
            userData?.role === "educator" ? (
              <CreateCourse />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route
          path="/createlecture/:courseId"
          element={
            userData?.role === "educator" ? (
              <CreateLecture />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route
          path="/editlecture/:courseId/:lectureId"
          element={
            userData?.role === "educator" ? (
              <EditLecture />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route
     path="/pyq-bundles"
  element={
    <ProtectedRoute isLoggedIn={!!userData}>
      <PYQBundle />
    </ProtectedRoute>
  }
/>

        {/* Teacher Notepad Route */}
        <Route
          path="/notepad/:bundleId"
          element={
            <ProtectedRoute>
              <TeacherNotepad />
            </ProtectedRoute>
          }
        />

        {/* Student Notes View Route */}
        <Route
          path="/view-notes/:bundleId"
          element={
            <ProtectedRoute>
              <StudentNotesView />
            </ProtectedRoute>
          }
        />


        {/* Future Test Series Route */}
        {/* Additional routes can be added here */}
        </Routes>
      </Layout>
    </SidebarProvider>
  );
}

export default App;
