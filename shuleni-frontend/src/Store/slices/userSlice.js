// User management slice for handling all users data across the app
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  students: [],
  teachers: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    setTeachers: (state, action) => {
      state.teachers = action.payload;
    },
    updateStudentPhoto: (state, action) => {
      const { studentId, photoUrl } = action.payload;
      const student = state.students.find(s => s.id === studentId);
      if (student) {
        student.avatar = photoUrl;
        student.photo = photoUrl;
      }
    },
    updateTeacherPhoto: (state, action) => {
      const { teacherId, photoUrl } = action.payload;
      const teacher = state.teachers.find(t => t.id === teacherId);
      if (teacher) {
        teacher.avatar = photoUrl;
        teacher.photo = photoUrl;
      }
    },
    updateStudentData: (state, action) => {
      const { studentId, data } = action.payload;
      const index = state.students.findIndex(s => s.id === studentId);
      if (index !== -1) {
        state.students[index] = { ...state.students[index], ...data };
      }
    },
    updateTeacherData: (state, action) => {
      const { teacherId, data } = action.payload;
      const index = state.teachers.findIndex(t => t.id === teacherId);
      if (index !== -1) {
        state.teachers[index] = { ...state.teachers[index], ...data };
      }
    },
    addStudent: (state, action) => {
      state.students.push(action.payload);
    },
    addTeacher: (state, action) => {
      state.teachers.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setStudents,
  setTeachers,
  updateStudentPhoto,
  updateTeacherPhoto,
  updateStudentData,
  updateTeacherData,
  addStudent,
  addTeacher,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;
