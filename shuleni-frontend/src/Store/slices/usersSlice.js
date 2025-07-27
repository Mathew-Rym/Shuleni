// Users management slice for students and teachers
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  students: [],
  teachers: [],
  loading: false,
  error: null,
};

// Mock data for development
const mockStudents = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@student.com',
    avatar: 'https://via.placeholder.com/150/4A90E2/FFFFFF?text=JD',
    class: 'Math',
    grade: 'A',
    attendance: 95,
    dateOfBirth: '2005-05-15',
    parentName: 'Jane Doe',
    phone: '+1234567890',
    address: '123 Main St',
    enrollmentDate: '2024-01-15',
    status: 'active',
    classes: ['Math', 'Science', 'History'],
  },
  {
    id: 2,
    name: 'Alice Smith',
    email: 'alice.smith@student.com',
    avatar: 'https://via.placeholder.com/150/50C878/FFFFFF?text=AS',
    class: 'Science',
    grade: 'B+',
    attendance: 88,
    dateOfBirth: '2005-08-22',
    parentName: 'Bob Smith',
    phone: '+1234567891',
    address: '456 Oak Ave',
    enrollmentDate: '2024-01-20',
    status: 'active',
    classes: ['Science', 'Math', 'English'],
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@student.com',
    avatar: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=MJ',
    class: 'History',
    grade: 'A-',
    attendance: 92,
    dateOfBirth: '2005-03-10',
    parentName: 'Sarah Johnson',
    phone: '+1234567892',
    address: '789 Pine St',
    enrollmentDate: '2024-01-10',
    status: 'active',
    classes: ['History', 'English', 'Geography'],
  },
];

const mockTeachers = [
  {
    id: 1,
    name: 'Ms. Jane',
    email: 'jane@teacher.com',
    avatar: 'https://via.placeholder.com/150/9B59B6/FFFFFF?text=JA',
    subject: 'Mathematics',
    phone: '+1234567893',
    address: '321 Teacher Ave',
    hireDate: '2020-08-15',
    status: 'active',
    classes: ['Math - Grade 10', 'Advanced Math'],
    qualifications: 'M.Ed Mathematics',
    experience: '8 years',
  },
  {
    id: 2,
    name: 'Mr. Jones',
    email: 'jones@teacher.com',
    avatar: 'https://via.placeholder.com/150/3498DB/FFFFFF?text=JO',
    subject: 'Science',
    phone: '+1234567894',
    address: '654 Science Blvd',
    hireDate: '2019-09-01',
    status: 'active',
    classes: ['Physics', 'Chemistry'],
    qualifications: 'M.Sc Physics',
    experience: '12 years',
  },
];

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    
    // Students actions
    setStudents: (state, action) => {
      state.students = action.payload;
      state.loading = false;
    },
    addStudent: (state, action) => {
      state.students.push({
        ...action.payload,
        id: Date.now(), // Mock ID generation
        status: 'active',
        enrollmentDate: new Date().toISOString().split('T')[0],
        avatar: `https://via.placeholder.com/150/4A90E2/FFFFFF?text=${action.payload.name.split(' ').map(n => n[0]).join('')}`,
      });
    },
    updateStudent: (state, action) => {
      const index = state.students.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = { ...state.students[index], ...action.payload };
      }
    },
    deleteStudent: (state, action) => {
      state.students = state.students.filter(s => s.id !== action.payload);
    },
    
    // Teachers actions
    setTeachers: (state, action) => {
      state.teachers = action.payload;
      state.loading = false;
    },
    addTeacher: (state, action) => {
      state.teachers.push({
        ...action.payload,
        id: Date.now(), // Mock ID generation
        status: 'active',
        hireDate: new Date().toISOString().split('T')[0],
        avatar: `https://via.placeholder.com/150/9B59B6/FFFFFF?text=${action.payload.name.split(' ').map(n => n[0]).join('')}`,
      });
    },
    updateTeacher: (state, action) => {
      const index = state.teachers.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.teachers[index] = { ...state.teachers[index], ...action.payload };
      }
    },
    deleteTeacher: (state, action) => {
      state.teachers = state.teachers.filter(t => t.id !== action.payload);
    },
  },
});

// Async actions
export const fetchStudents = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/students');
    // const students = await response.json();
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(setStudents(mockStudents));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const fetchTeachers = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/teachers');
    // const teachers = await response.json();
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(setTeachers(mockTeachers));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const assignClassesToTeacher = (teacherId, classIds) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/teachers/${teacherId}/assign-classes`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ classIds }),
    // });
    // const updatedTeacher = await response.json();
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update the teacher's classes in the store
    const { teachers } = getState().users;
    const index = teachers.findIndex((teacher) => teacher.id === teacherId);
    if (index !== -1) {
      const updatedTeachers = [...teachers];
      updatedTeachers[index] = { 
        ...teachers[index], 
        classes: classIds 
      };
      dispatch(setTeachers(updatedTeachers)); // Re-use the setTeachers action to update the store
    }
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const createStudent = (studentData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/students', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(studentData),
    // });
    // const student = await response.json();
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(addStudent(studentData));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const createTeacher = (teacherData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/teachers', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(teacherData),
    // });
    // const teacher = await response.json();
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(addTeacher(teacherData));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const {
  setLoading,
  setError,
  clearError,
  setStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  setTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
} = usersSlice.actions;

export default usersSlice.reducer;