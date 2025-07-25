import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="d-flex align-items-center mb-4">
              <Button 
                variant="outline-primary" 
                onClick={() => navigate(-1)}
                className="me-3"
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Back
              </Button>
              <div>
                <h1 className="mb-2">
                  <FontAwesomeIcon icon={faShieldAlt} className="me-2 text-primary" />
                  Privacy Policy
                </h1>
                <p className="text-muted mb-0">Last updated: December 2024</p>
              </div>
            </div>

            <div className="bg-white rounded shadow-sm p-4">
              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">1. Introduction</h2>
                <p>
                  At Shuleni, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                  school management platform.
                </p>
                <p>
                  By using Shuleni, you consent to the data practices described in this Privacy Policy. If you do not agree 
                  with this policy, please do not use our services.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">2. Information We Collect</h2>
                
                <h5 className="mb-3">Personal Information</h5>
                <ul className="mb-4">
                  <li>Name, email address, phone number</li>
                  <li>School affiliation and role (student, teacher, administrator)</li>
                  <li>Educational records and academic information</li>
                  <li>Profile pictures and other uploaded content</li>
                  <li>Communication logs and chat messages within the platform</li>
                </ul>

                <h5 className="mb-3">Usage Information</h5>
                <ul className="mb-4">
                  <li>Log data including IP addresses, browser type, and device information</li>
                  <li>Platform usage patterns and feature interactions</li>
                  <li>Session information and login/logout times</li>
                  <li>Performance metrics and error reports</li>
                </ul>

                <h5 className="mb-3">School-Related Information</h5>
                <ul>
                  <li>Class schedules and attendance records</li>
                  <li>Assignment submissions and grades</li>
                  <li>Parent/guardian contact information</li>
                  <li>Emergency contact details</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">3. How We Use Your Information</h2>
                <ul>
                  <li><strong>Educational Services:</strong> To provide and maintain our school management platform</li>
                  <li><strong>Communication:</strong> To facilitate communication between students, teachers, and parents</li>
                  <li><strong>Academic Management:</strong> To track academic progress, attendance, and performance</li>
                  <li><strong>Platform Improvement:</strong> To analyze usage patterns and improve our services</li>
                  <li><strong>Safety & Security:</strong> To ensure platform security and user safety</li>
                  <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">4. Information Sharing and Disclosure</h2>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:</p>
                
                <h5 className="mb-3">Within Your School</h5>
                <ul className="mb-4">
                  <li>Information is shared with authorized school personnel as necessary for educational purposes</li>
                  <li>Teachers can access student academic information for their classes</li>
                  <li>Administrators have access to platform-wide data for management purposes</li>
                </ul>

                <h5 className="mb-3">Service Providers</h5>
                <ul className="mb-4">
                  <li>We may share information with trusted third-party service providers who assist in platform operations</li>
                  <li>These providers are bound by confidentiality agreements and data protection requirements</li>
                </ul>

                <h5 className="mb-3">Legal Requirements</h5>
                <ul>
                  <li>We may disclose information when required by law or to protect rights, property, or safety</li>
                  <li>In case of suspected child abuse or other mandatory reporting situations</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">5. Data Security</h2>
                <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
                <ul>
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Employee training on data protection practices</li>
                  <li>Incident response procedures for security breaches</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">6. Data Retention</h2>
                <p>
                  We retain your personal information for as long as necessary to provide our services and comply with legal obligations:
                </p>
                <ul>
                  <li>Student records are retained according to school policies and local regulations</li>
                  <li>Communication logs are kept for one academic year unless required longer by law</li>
                  <li>Account information is deleted within 30 days of account closure request</li>
                  <li>Backup data may be retained for up to 90 days for disaster recovery purposes</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">7. Your Rights</h2>
                <p>Depending on your location, you may have the following rights regarding your personal information:</p>
                <ul>
                  <li><strong>Access:</strong> Request access to your personal data</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Objection:</strong> Object to certain types of data processing</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent for data processing (where applicable)</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">8. Children's Privacy</h2>
                <p>
                  Shuleni is designed to be used in educational settings and may collect information from students under 18. 
                  We comply with applicable children's privacy laws including:
                </p>
                <ul>
                  <li>COPPA (Children's Online Privacy Protection Act) in the United States</li>
                  <li>GDPR protections for children in the European Union</li>
                  <li>Local privacy laws in other jurisdictions</li>
                </ul>
                <p>
                  Schools are responsible for obtaining appropriate consent for student data collection and ensuring 
                  compliance with local regulations.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">9. International Data Transfers</h2>
                <p>
                  Your information may be processed and stored in countries other than your own. We ensure that such 
                  transfers comply with applicable data protection laws and implement appropriate safeguards.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">10. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by 
                  posting the new policy on our platform and updating the "Last updated" date. Continued use of our 
                  services after such changes constitutes acceptance of the new policy.
                </p>
              </section>

              <section>
                <h2 className="h4 text-primary mb-3">11. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className="bg-light p-3 rounded">
                  <p className="mb-2"><strong>Shuleni Privacy Team</strong></p>
                  <p className="mb-2">Email: privacy@shuleni.com</p>
                  <p className="mb-2">Phone: +254-700-PRIVACY (+254-700-774-8229)</p>
                  <p className="mb-0">Address: 123 Education Avenue, Nairobi, Kenya</p>
                </div>
              </section>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
