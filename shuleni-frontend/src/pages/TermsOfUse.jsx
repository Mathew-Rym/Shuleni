import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const TermsOfUse = () => {
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
                  <FontAwesomeIcon icon={faFileContract} className="me-2 text-primary" />
                  Terms of Use
                </h1>
                <p className="text-muted mb-0">Last updated: December 2024</p>
              </div>
            </div>

            <div className="bg-white rounded shadow-sm p-4">
              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">1. Acceptance of Terms</h2>
                <p>
                  Welcome to Shuleni, a comprehensive school management platform. By accessing or using our service, 
                  you agree to be bound by these Terms of Use ("Terms"). If you disagree with any part of these terms, 
                  then you may not access our service.
                </p>
                <p>
                  These Terms apply to all visitors, users, and others who access or use the Shuleni platform, 
                  including students, teachers, administrators, and parents.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">2. Description of Service</h2>
                <p>
                  Shuleni provides a cloud-based school management platform that includes but is not limited to:
                </p>
                <ul>
                  <li>Student information management</li>
                  <li>Class and course management</li>
                  <li>Communication tools for teachers, students, and parents</li>
                  <li>Assignment and grade management</li>
                  <li>Attendance tracking</li>
                  <li>Resource sharing and document management</li>
                  <li>Video conferencing and virtual classroom capabilities</li>
                  <li>Analytics and reporting tools</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">3. User Accounts and Registration</h2>
                
                <h5 className="mb-3">Account Creation</h5>
                <ul className="mb-4">
                  <li>Schools must register and create accounts for their institution</li>
                  <li>Individual users (teachers, students, administrators) receive accounts through their school</li>
                  <li>You must provide accurate and complete information during registration</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                </ul>

                <h5 className="mb-3">Account Responsibility</h5>
                <ul>
                  <li>You are responsible for all activities that occur under your account</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                  <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
                  <li>Schools are responsible for managing their users' accounts and ensuring compliance</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">4. Acceptable Use Policy</h2>
                
                <h5 className="mb-3">Permitted Uses</h5>
                <ul className="mb-4">
                  <li>Educational activities and school management purposes</li>
                  <li>Communication related to academic and administrative matters</li>
                  <li>Sharing educational resources and materials</li>
                  <li>Collaboration on school projects and assignments</li>
                </ul>

                <h5 className="mb-3">Prohibited Uses</h5>
                <p>You may not use Shuleni to:</p>
                <ul>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Transmit harmful, offensive, or inappropriate content</li>
                  <li>Harass, intimidate, or discriminate against others</li>
                  <li>Share copyrighted material without permission</li>
                  <li>Attempt to gain unauthorized access to the system</li>
                  <li>Distribute malware, viruses, or other harmful code</li>
                  <li>Use the platform for commercial purposes not related to education</li>
                  <li>Share login credentials with unauthorized individuals</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">5. Content and Intellectual Property</h2>
                
                <h5 className="mb-3">User Content</h5>
                <ul className="mb-4">
                  <li>You retain ownership of content you create and upload to the platform</li>
                  <li>You grant Shuleni a license to use your content solely for providing our services</li>
                  <li>You are responsible for ensuring you have rights to any content you share</li>
                  <li>We may remove content that violates these Terms or our policies</li>
                </ul>

                <h5 className="mb-3">Shuleni's Intellectual Property</h5>
                <ul>
                  <li>The Shuleni platform, software, and related materials are our intellectual property</li>
                  <li>You may not copy, modify, distribute, or reverse engineer our platform</li>
                  <li>Our trademarks and logos may not be used without written permission</li>
                  <li>Any feedback or suggestions you provide may be used by us without compensation</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">6. Privacy and Data Protection</h2>
                <p>
                  Your privacy is important to us. Our use of your personal information is governed by our Privacy Policy, 
                  which is incorporated into these Terms by reference. By using Shuleni, you consent to the collection 
                  and use of your information as described in our Privacy Policy.
                </p>
                <p>
                  Schools are responsible for ensuring they have appropriate consent for student data collection and 
                  processing in accordance with applicable laws such as FERPA, COPPA, and GDPR.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">7. Service Availability and Modifications</h2>
                <ul>
                  <li>We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service</li>
                  <li>We may perform scheduled maintenance that temporarily affects service availability</li>
                  <li>We reserve the right to modify, suspend, or discontinue any part of our service</li>
                  <li>We will provide reasonable notice of significant changes to our service</li>
                  <li>We may update these Terms from time to time, and continued use constitutes acceptance</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">8. Payment Terms (For Paid Plans)</h2>
                <ul>
                  <li>Fees are payable in advance and are non-refundable except as required by law</li>
                  <li>Price changes will be communicated with 30 days advance notice</li>
                  <li>Failure to pay may result in service suspension or termination</li>
                  <li>Schools are responsible for all taxes related to their use of the service</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">9. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, Shuleni shall not be liable for any indirect, incidental, 
                  special, consequential, or punitive damages, including without limitation, loss of profits, data, 
                  use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul>
                  <li>Your use or inability to use the service</li>
                  <li>Unauthorized access to or alteration of your transmissions or data</li>
                  <li>Statements or conduct of any third party on the service</li>
                  <li>Any other matter relating to the service</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">10. Indemnification</h2>
                <p>
                  You agree to defend, indemnify, and hold harmless Shuleni and its employees, contractors, directors, 
                  suppliers, and representatives from and against any and all claims, damages, obligations, losses, 
                  liabilities, costs, and expenses (including attorney's fees) arising from:
                </p>
                <ul>
                  <li>Your use of and access to the service</li>
                  <li>Your violation of any term of these Terms</li>
                  <li>Your violation of any third party right, including intellectual property rights</li>
                  <li>Any claim that your content caused damage to a third party</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">11. Termination</h2>
                <ul>
                  <li>You may terminate your account at any time by contacting your school administrator</li>
                  <li>Schools may terminate their subscription with 30 days written notice</li>
                  <li>We may terminate or suspend accounts immediately for violations of these Terms</li>
                  <li>Upon termination, your right to use the service will cease immediately</li>
                  <li>Data retention and deletion will follow our Privacy Policy guidelines</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">12. Governing Law and Dispute Resolution</h2>
                <p>
                  These Terms shall be interpreted and governed by the laws of Kenya. Any disputes arising from 
                  these Terms or your use of Shuleni shall be resolved through binding arbitration in Nairobi, Kenya, 
                  except that we may seek injunctive relief in any court of competent jurisdiction.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 text-primary mb-3">13. Severability</h2>
                <p>
                  If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions 
                  will remain in full force and effect. The invalid provision will be replaced with a valid provision 
                  that most closely matches the intent of the original provision.
                </p>
              </section>

              <section>
                <h2 className="h4 text-primary mb-3">14. Contact Information</h2>
                <p>If you have any questions about these Terms of Use, please contact us:</p>
                <div className="bg-light p-3 rounded">
                  <p className="mb-2"><strong>Shuleni Legal Team</strong></p>
                  <p className="mb-2">Email: legal@shuleni.com</p>
                  <p className="mb-2">Phone: +254-700-SHULENI (+254-700-748-5364)</p>
                  <p className="mb-0">Address: 123 Education Avenue, Nairobi, Kenya</p>
                </div>
                <p className="mt-3 text-muted">
                  By using Shuleni, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.
                </p>
              </section>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TermsOfUse;
