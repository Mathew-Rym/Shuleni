import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faHome, 
  faUser, 
  faBook, 
  faClipboardList, 
  faGraduationCap, 
  faChalkboardTeacher, 
  faCalendarAlt, 
  faChartBar, 
  faComments, 
  faFileAlt,
  faSchool,
  faCog,
  faSignOutAlt,
  faBell,
  faCheckCircle,
  faExclamationCircle,
  faQuestionCircle,
  faInfoCircle,
  faTasks,
  faUsers
} from '@fortawesome/free-solid-svg-icons';

// Add any icons you want to use in your app
library.add(
  faHome,
  faUser,
  faBook,
  faClipboardList,
  faGraduationCap,
  faChalkboardTeacher,
  faCalendarAlt,
  faChartBar,
  faComments,
  faFileAlt,
  faSchool,
  faCog,
  faSignOutAlt,
  faBell,
  faCheckCircle,
  faExclamationCircle,
  faQuestionCircle,
  faInfoCircle,
  faTasks,
  faUsers
);

// Icon mapping for sidebar items
export const sidebarIcons = {
  dashboard: faHome,
  profile: faUser,
  myClasses: faBook,
  resources: faFileAlt,
  attendance: faCalendarAlt,
  grades: faChartBar,
  exams: faClipboardList,
  chat: faComments,
  schools: faSchool,
  teachers: faChalkboardTeacher,
  students: faGraduationCap,
  settings: faCog
};

// Export for use in components
export { 
  faHome, 
  faUser, 
  faBook, 
  faClipboardList, 
  faGraduationCap, 
  faChalkboardTeacher,
  faCalendarAlt,
  faChartBar,
  faComments,
  faFileAlt,
  faSchool,
  faCog,
  faSignOutAlt,
  faBell,
  faCheckCircle,
  faExclamationCircle,
  faQuestionCircle,
  faInfoCircle,
  faTasks,
  faUsers
};
