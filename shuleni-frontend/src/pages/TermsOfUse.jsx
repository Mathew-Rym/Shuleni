import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const TermsOfUse = () => {
  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row>
            <Col>
              <h1 className="display-4 fw-bold">Terms of Use</h1>
              <p className="lead">Terms and conditions for using Shuleni platform</p>
              <p className="mb-0">Last updated: January 2025</p>
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
                <h2 className="text-primary mb-3">Agreement to Terms</h2>
                <p>
                  By accessing and using the Shuleni School Management Platform, you accept and agree to be 
                  bound by the terms and provision of this agreement. If you do not agree to abide by the 
                  above, please do not use this service.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Description of Service</h2>
                <p>
                  Shuleni is a comprehensive school management platform designed specifically for educational 
                  institutions in Kenya. Our services include but are not limited to:
                </p>
                <ul>
                  <li>Student information management and academic tracking</li>
                  <li>Teacher and staff management systems</li>
                  <li>Attendance tracking and reporting</li>
                  <li>Examination and grading management</li>
                  <li>Fee management and financial tracking</li>
                  <li>Communication tools for school communities</li>
                  <li>Report generation and analytics</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">User Accounts and Responsibilities</h2>
                
                <h4>Account Creation</h4>
                <ul>
                  <li>Schools must provide accurate and complete information during registration</li>
                  <li>Users are responsible for maintaining the confidentiality of their login credentials</li>
                  <li>Each user account should be used by one individual only</li>
                  <li>Schools are responsible for managing user access and permissions</li>
                </ul>

                <h4>User Conduct</h4>
                <p>Users agree to:</p>
                <ul>
                  <li>Use the platform only for legitimate educational purposes</li>
                  <li>Respect the privacy and rights of other users</li>
                  <li>Not attempt to gain unauthorized access to any part of the system</li>
                  <li>Not upload or share inappropriate, harmful, or illegal content</li>
                  <li>Comply with all applicable Kenyan laws and educational regulations</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Data and Privacy</h2>
                <ul>
                  <li>Schools retain ownership of all data entered into the platform</li>
                  <li>Shuleni acts as a data processor and is committed to protecting user privacy</li>
                  <li>Data handling practices are governed by our Privacy Policy</li>
                  <li>Schools are responsible for obtaining necessary consents for student data</li>
                  <li>Users must comply with Kenyan data protection laws</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Payment Terms</h2>
                <ul>
                  <li>Subscription fees are billed according to the agreed payment schedule</li>
                  <li>All fees are payable in Kenyan Shillings unless otherwise agreed</li>
                  <li>Late payment may result in service suspension</li>
                  <li>Refunds are provided according to our refund policy</li>
                  <li>Price changes will be communicated with 30 days notice</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Service Availability</h2>
                <p>
                  While we strive to provide uninterrupted service, we cannot guarantee 100% uptime. 
                  Scheduled maintenance will be communicated in advance. We are not liable for 
                  temporary service interruptions due to:
                </p>
                <ul>
                  <li>System maintenance and updates</li>
                  <li>Internet connectivity issues</li>
                  <li>Force majeure events</li>
                  <li>Third-party service dependencies</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Intellectual Property</h2>
                <ul>
                  <li>Shuleni platform and its features are proprietary to Shuleni Solutions Ltd.</li>
                  <li>Users may not copy, modify, or distribute our software without permission</li>
                  <li>Schools retain ownership of their data and content</li>
                  <li>Any feedback or suggestions become property of Shuleni Solutions Ltd.</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Limitation of Liability</h2>
                <p>
                  Shuleni Solutions Ltd. shall not be liable for any indirect, incidental, special, 
                  consequential, or punitive damages, including but not limited to:
                </p>
                <ul>
                  <li>Loss of data or information</li>
                  <li>Loss of revenue or profits</li>
                  <li>Business interruption</li>
                  <li>Damage to reputation</li>
                </ul>
                <p>
                  Our total liability shall not exceed the amount paid by the school for the service 
                  in the 12 months preceding the claim.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Termination</h2>
                <p>
                  Either party may terminate this agreement with 30 days written notice. Upon termination:
                </p>
                <ul>
                  <li>Access to the platform will be discontinued</li>
                  <li>Schools can export their data within 30 days</li>
                  <li>All outstanding fees become immediately due</li>
                  <li>Confidentiality obligations remain in effect</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Compliance with Laws</h2>
                <p>
                  Users must comply with all applicable laws and regulations, including:
                </p>
                <ul>
                  <li>Kenyan Education Act and regulations</li>
                  <li>Data Protection laws</li>
                  <li>Children's rights and protection laws</li>
                  <li>Employment and labor laws</li>
                  <li>Financial and tax regulations</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Governing Law</h2>
                <p>
                  These terms are governed by the laws of Kenya. Any disputes will be resolved 
                  through the Kenyan legal system. The courts of Nairobi shall have exclusive 
                  jurisdiction over any legal proceedings.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. Significant changes 
                  will be communicated through email or platform notifications. Continued use 
                  of the service after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="text-primary mb-3">Contact Information</h2>
                <p>For questions about these Terms of Use, please contact us:</p>
                <div className="bg-light p-3 rounded">
                  <p className="mb-1"><strong>Shuleni Solutions Ltd.</strong></p>
                  <p className="mb-1">Email: legal@shuleni.co.ke</p>
                  <p className="mb-1">Phone: +254</p>
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

export default TermsOfUse;