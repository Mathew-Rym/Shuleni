import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row>
            <Col>
              <h1 className="display-4 fw-bold">Privacy Policy</h1>
              <p className="lead">How we protect and handle your information</p>
              <p className="mb-0">Last updated: July 2025</p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Content */}
      <Container className="py-5">
        <Row>
          <Col lg={10} className="mx-auto">
            <div className="bg-white p-5 rounded shadow-sm">
              
              <section className="mb-5">
                <h2 className="text-primary mb-3">Introduction</h2>
                <p>
                  Shuleni School Management Platform ("we," "our," or "us") is committed to protecting the privacy 
                  and security of your personal information. This Privacy Policy explains how we collect, use, 
                  disclose, and safeguard your information when you use our school management platform designed 
                  for Kenyan educational institutions.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Information We Collect</h2>
                
                <h4>Student Information</h4>
                <ul>
                  <li>Full names, admission numbers, and identification details</li>
                  <li>Academic records, grades, and performance data</li>
                  <li>Attendance records and disciplinary information</li>
                  <li>Parent/guardian contact information</li>
                  <li>Health and emergency contact details</li>
                </ul>

                <h4>Staff Information</h4>
                <ul>
                  <li>Professional credentials and employment history</li>
                  <li>Contact information and emergency contacts</li>
                  <li>Teaching schedules and class assignments</li>
                  <li>Performance evaluations and training records</li>
                </ul>

                <h4>School Administrative Data</h4>
                <ul>
                  <li>School registration and licensing information</li>
                  <li>Financial records and fee structures</li>
                  <li>Curriculum and examination data</li>
                  <li>Communication logs and system usage data</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">How We Use Your Information</h2>
                <p>We use the collected information for the following purposes:</p>
                <ul>
                  <li><strong>Educational Management:</strong> Managing student records, tracking academic progress, and facilitating communication between teachers, students, and parents</li>
                  <li><strong>Administrative Operations:</strong> Processing admissions, managing fees, generating reports, and maintaining school records</li>
                  <li><strong>Communication:</strong> Sending notifications, updates, and important announcements to relevant stakeholders</li>
                  <li><strong>Compliance:</strong> Meeting regulatory requirements set by the Ministry of Education and other relevant Kenyan authorities</li>
                  <li><strong>System Improvement:</strong> Analyzing usage patterns to improve our platform and provide better services</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Data Security</h2>
                <p>
                  We implement robust security measures to protect your information:
                </p>
                <ul>
                  <li>End-to-end encryption for data transmission</li>
                  <li>Secure cloud storage with regular backups</li>
                  <li>Access controls and user authentication</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Compliance with international data protection standards</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Data Sharing and Disclosure</h2>
                <p>We may share your information in the following circumstances:</p>
                <ul>
                  <li><strong>Educational Partners:</strong> With authorized educational institutions for student transfers or collaborations</li>
                  <li><strong>Government Authorities:</strong> When required by Kenyan law or educational regulations</li>
                  <li><strong>Emergency Situations:</strong> To protect the safety and welfare of students and staff</li>
                  <li><strong>Service Providers:</strong> With trusted third-party vendors who assist in platform operations (under strict confidentiality agreements)</li>
                </ul>
                <p>We never sell your personal information to third parties for marketing purposes.</p>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Your Rights</h2>
                <p>Under Kenyan data protection laws, you have the right to:</p>
                <ul>
                  <li>Access your personal information held by us</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your data (subject to legal and educational requirements)</li>
                  <li>Object to certain processing of your information</li>
                  <li>Request data portability for your records</li>
                </ul>
                <p>To exercise these rights, please contact our Data Protection Officer at privacy@shuleni.co.ke</p>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Data Retention</h2>
                <p>
                  We retain your information for as long as necessary to provide our services and comply with 
                  legal obligations. Student academic records are typically retained for a minimum of 7 years 
                  after graduation as required by Kenyan educational regulations.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Cookies and Tracking</h2>
                <p>
                  Our platform uses cookies and similar technologies to enhance user experience, maintain 
                  session security, and analyze platform usage. You can control cookie settings through 
                  your browser preferences.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Children's Privacy</h2>
                <p>
                  We recognize the importance of protecting children's privacy. For students under 18 years, 
                  we require parental or guardian consent for data collection and processing. Parents have 
                  the right to review, modify, or request deletion of their child's information.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Updates to This Policy</h2>
                <p>
                  We may update this Privacy Policy periodically to reflect changes in our practices or 
                  legal requirements. We will notify users of significant changes through our platform 
                  or email notifications.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Contact Information</h2>
                <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className="bg-light p-3 rounded">
                  <p className="mb-1"><strong>Shuleni Solutions Ltd.</strong></p>
                  <p className="mb-1">Email: privacy@shuleni.co.ke</p>
                  <p className="mb-1">Phone: +254 </p>
                  <p className="mb-0">Address: AppleWood, 7th Floor, Ngong Road, Nairobi, Kenya</p>
                </div>
              </section>

              <div className="text-center mt-5">
                <Button as={Link} to="/" variant="outline-primary" size="lg">
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Home
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;