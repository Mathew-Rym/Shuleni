import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  classes: [],
  subjects: [],
  classSubjects: [], // Junction table for class-subject relationships
  loading: false,
  error: null,
};

// Mock classes data
const mockClasses = [
  {
    id: 1,
    name: 'Grade 6A',
    level: 'Grade 6',
    teacherId: null,
    teacherName: '',
    studentsCount: 0,
    students: [],
    schedule: 'Mon-Fri 8:00 AM - 2:00 PM',
    classroom: 'Room 101',
    createdAt: '2024-01-15',
    status: 'active'
  },
  {
    id: 2,
    name: 'Form 1B',
    level: 'Form 1',
    teacherId: null,
    teacherName: '',
    studentsCount: 0,
    students: [],
    schedule: 'Mon-Fri 8:00 AM - 4:00 PM',
    classroom: 'Room 201',
    createdAt: '2024-01-15',
    status: 'active'
  }
];

// Mock subjects data
const mockSubjects = [
  {
    id: 1,
    name: 'Mathematics',
    code: 'MATH',
    description: 'Core mathematics curriculum',
    category: 'Core',
    gradeLevels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Form 1', 'Form 2', 'Form 3', 'Form 4'],
    credits: 4,
    isActive: true
  },
  {
    id: 2,
    name: 'English',
    code: 'ENG',
    description: 'English language and literature',
    category: 'Core',
    gradeLevels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Form 1', 'Form 2', 'Form 3', 'Form 4'],
    credits: 4,
    isActive: true
  },
  {
    id: 3,
    name: 'Kiswahili',
    code: 'KIS',
    description: 'Kiswahili language',
    category: 'Core',
    gradeLevels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Form 1', 'Form 2', 'Form 3', 'Form 4'],
    credits: 4,
    isActive: true
  },
  {
    id: 4,
    name: 'Science',
    code: 'SCI',
    description: 'General science curriculum',
    category: 'Core',
    gradeLevels: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'],
    credits: 4,
    isActive: true
  },
  {
    id: 5,
    name: 'Physics',
    code: 'PHY',
    description: 'Physics curriculum',
    category: 'Science',
    gradeLevels: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    credits: 4,
    isActive: true
  },
  {
    id: 6,
    name: 'Chemistry',
    code: 'CHE',
    description: 'Chemistry curriculum',
    category: 'Science',
    gradeLevels: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    credits: 4,
    isActive: true
  },
  {
    id: 7,
    name: 'Biology',
    code: 'BIO',
    description: 'Biology curriculum',
    category: 'Science',
    gradeLevels: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    credits: 4,
    isActive: true
  },
  {
    id: 8,
    name: 'Geography',
    code: 'GEO',
    description: 'Geography curriculum',
    category: 'Humanities',
    gradeLevels: ['Grade 6', 'Grade 7', 'Grade 8', 'Form 1', 'Form 2', 'Form 3', 'Form 4'],
    credits: 3,
    isActive: true
  },
  {
    id: 9,
    name: 'History',
    code: 'HIS',
    description: 'History curriculum',
    category: 'Humanities',
    gradeLevels: ['Grade 6', 'Grade 7', 'Grade 8', 'Form 1', 'Form 2', 'Form 3', 'Form 4'],
    credits: 3,
    isActive: true
  },
  {
    id: 10,
    name: 'Computer Science',
    code: 'CS',
    description: 'Computer science and ICT',
    category: 'Technology',
    gradeLevels: ['Grade 6', 'Grade 7', 'Grade 8', 'Form 1', 'Form 2', 'Form 3', 'Form 4'],
    credits: 3,
    isActive: true
  }
];

// Mock class-subject relationships
const mockClassSubjects = [
  { id: 1, classId: 1, subjectId: 1, teacherId: null }, // Grade 6A - Mathematics
  { id: 2, classId: 1, subjectId: 2, teacherId: null }, // Grade 6A - English
  { id: 3, classId: 1, subjectId: 3, teacherId: null }, // Grade 6A - Kiswahili
  { id: 4, classId: 2, subjectId: 1, teacherId: null }, // Form 1B - Mathematics
  { id: 5, classId: 2, subjectId: 2, teacherId: null }, // Form 1B - English
  { id: 6, classId: 2, subjectId: 5, teacherId: null }, // Form 1B - Physics
];

const classSubjectSlice = createSlice({
  name: 'classSubject',
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
    
    // Classes
    setClasses: (state, action) => {
      state.classes = action.payload;
      state.loading = false;
    },
    addClass: (state, action) => {
      const newClass = {
        ...action.payload,
        id: Date.now(),
        studentsCount: 0,
        students: [],
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      state.classes.push(newClass);
    },
    updateClass: (state, action) => {
      const index = state.classes.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.classes[index] = { ...state.classes[index], ...action.payload };
      }
    },
    deleteClass: (state, action) => {
      state.classes = state.classes.filter(c => c.id !== action.payload);
      // Also remove associated class-subject relationships
      state.classSubjects = state.classSubjects.filter(cs => cs.classId !== action.payload);
    },
    
    // Subjects
    setSubjects: (state, action) => {
      state.subjects = action.payload;
      state.loading = false;
    },
    addSubject: (state, action) => {
      const newSubject = {
        ...action.payload,
        id: Date.now(),
        isActive: true
      };
      state.subjects.push(newSubject);
    },
    updateSubject: (state, action) => {
      const index = state.subjects.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.subjects[index] = { ...state.subjects[index], ...action.payload };
      }
    },
    deleteSubject: (state, action) => {
      state.subjects = state.subjects.filter(s => s.id !== action.payload);
      // Also remove associated class-subject relationships
      state.classSubjects = state.classSubjects.filter(cs => cs.subjectId !== action.payload);
    },
    
    // Class-Subject Relationships
    setClassSubjects: (state, action) => {
      state.classSubjects = action.payload;
      state.loading = false;
    },
    addClassSubject: (state, action) => {
      const newRelation = {
        ...action.payload,
        id: Date.now()
      };
      state.classSubjects.push(newRelation);
    },
    updateClassSubject: (state, action) => {
      const index = state.classSubjects.findIndex(cs => cs.id === action.payload.id);
      if (index !== -1) {
        state.classSubjects[index] = { ...state.classSubjects[index], ...action.payload };
      }
    },
    removeClassSubject: (state, action) => {
      state.classSubjects = state.classSubjects.filter(cs => cs.id !== action.payload);
    },
    
    // Assign teacher to class-subject
    assignTeacherToClassSubject: (state, action) => {
      const { classId, subjectId, teacherId } = action.payload;
      const relation = state.classSubjects.find(cs => cs.classId === classId && cs.subjectId === subjectId);
      if (relation) {
        relation.teacherId = teacherId;
      }
    },
    
    // Remove teacher from class-subject
    removeTeacherFromClassSubject: (state, action) => {
      const { classId, subjectId } = action.payload;
      const relation = state.classSubjects.find(cs => cs.classId === classId && cs.subjectId === subjectId);
      if (relation) {
        relation.teacherId = null;
      }
    },
    
    // Bulk assign subjects to class
    assignSubjectsToClass: (state, action) => {
      const { classId, subjectIds, teacherId } = action.payload;
      
      // Remove existing subjects for this class
      state.classSubjects = state.classSubjects.filter(cs => cs.classId !== classId);
      
      // Add new subject assignments
      subjectIds.forEach(subjectId => {
        state.classSubjects.push({
          id: Date.now() + Math.random(),
          classId,
          subjectId,
          teacherId: teacherId || null
        });
      });
    },
    
    // Add students to class
    addStudentsToClass: (state, action) => {
      const { classId, studentIds } = action.payload;
      const classIndex = state.classes.findIndex(c => c.id === classId);
      if (classIndex !== -1) {
        const existingStudents = state.classes[classIndex].students || [];
        const newStudents = studentIds.filter(id => !existingStudents.includes(id));
        state.classes[classIndex].students = [...existingStudents, ...newStudents];
        state.classes[classIndex].studentsCount = state.classes[classIndex].students.length;
      }
    },
    
    // Remove students from class
    removeStudentsFromClass: (state, action) => {
      const { classId, studentIds } = action.payload;
      const classIndex = state.classes.findIndex(c => c.id === classId);
      if (classIndex !== -1) {
        state.classes[classIndex].students = state.classes[classIndex].students.filter(
          id => !studentIds.includes(id)
        );
        state.classes[classIndex].studentsCount = state.classes[classIndex].students.length;
      }
    }
  },
});

// BACKEND TODO: Implement GET /api/classes endpoint
export const fetchClasses = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // BACKEND INTEGRATION: Replace with actual API call
    // const response = await fetch('/api/classes');
    // const classes = await response.json();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(setClasses(mockClasses));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// BACKEND TODO: Implement GET /api/subjects endpoint
export const fetchSubjects = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // BACKEND INTEGRATION: Replace with actual API call
    // const response = await fetch('/api/subjects');
    // const subjects = await response.json();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(setSubjects(mockSubjects));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// BACKEND TODO: Implement GET /api/class-subjects endpoint
export const fetchClassSubjects = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // BACKEND INTEGRATION: Replace with actual API call
    // const response = await fetch('/api/class-subjects');
    // const classSubjects = await response.json();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(setClassSubjects(mockClassSubjects));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// BACKEND TODO: Implement POST /api/classes endpoint
export const createClass = (classData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // BACKEND INTEGRATION: Replace with actual API call
    // const response = await fetch('/api/classes', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(classData),
    // });
    // const newClass = await response.json();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(addClass(classData));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// BACKEND TODO: Implement POST /api/subjects endpoint
export const createSubject = (subjectData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // BACKEND INTEGRATION: Replace with actual API call
    // const response = await fetch('/api/subjects', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(subjectData),
    // });
    // const newSubject = await response.json();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(addSubject(subjectData));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// BACKEND TODO: Implement POST /api/class-subjects endpoint
export const createClassSubject = (relationData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // BACKEND INTEGRATION: Replace with actual API call
    // const response = await fetch('/api/class-subjects', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(relationData),
    // });
    // const relation = await response.json();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(addClassSubject(relationData));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const {
  setLoading,
  setError,
  clearError,
  setClasses,
  addClass,
  updateClass,
  deleteClass,
  setSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
  setClassSubjects,
  addClassSubject,
  updateClassSubject,
  removeClassSubject,
  assignTeacherToClassSubject,
  removeTeacherFromClassSubject,
  assignSubjectsToClass,
  addStudentsToClass,
  removeStudentsFromClass,
} = classSubjectSlice.actions;

export default classSubjectSlice.reducer;
