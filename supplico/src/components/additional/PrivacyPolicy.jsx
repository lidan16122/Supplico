import React from "react";
import siteImg from "../../assets/logo.png";

export default function PrivacyPolicy() {
  return (
    <>
      <div className="additional-background">
        <div className="container color-black pt-5 additional">
          <h1 className="additional-title">Privacy Policy</h1>
          <p>Privacy Policy for Supplico</p>
          <p>Effective Date: 1/8/2023</p>
          <p>
            Welcome to Supplico. We are committed to protecting the privacy of
            our customers and users. This Privacy Policy outlines how we
            collect, use, share, and protect your personal information when you
            use our delivery services or visit our website.
          </p>
          <ol style={{textAlign: "start"}}>
            <li>
              Information We Collect
              <ol>
                <li>
                  Personal Information:<br/> We may collect personal information that
                  you provide directly to us, including but not limited to:
                  <ul>
                    <li>Name, address, email address, and phone number</li>
                    <li>Payment information</li>
                    <li>Delivery preferences and instructions</li>
                    <li>Feedback and reviews</li>
                  </ul>
                </li>
                <li>
                  Usage Data:<br/> We may collect information about your use of our
                  website and services, such as IP address, device information,
                  browser type, and pages visited. This information helps us
                  understand how you interact with our services and improve our
                  website's functionality and user experience.
                </li>
              </ol>
            </li>
            <li>
              How We Use Your Information
              <ol>
                <li>
                  Providing Services:<br/> We use the information we collect to
                  process and fulfill your delivery orders, respond to your
                  inquiries, and provide customer support.
                </li>
                <li>
                  2.2 Improving Services:<br/> Your feedback and usage data help us
                  analyze and improve our services, tailor our offerings to your
                  preferences, and enhance our website's performance.
                </li>
                <li>
                  2.3 Communication:<br/> We may use your contact information to send
                  you updates about your delivery status, promotional offers,
                  newsletters, and other relevant information. You can opt-out
                  of marketing communications at any time.
                </li>
                <li>
                  2.4 Legal Compliance:<br/> We may process your information to
                  comply with legal obligations, resolve disputes, and enforce
                  our terms and conditions.
                </li>
              </ol>
            </li>
            <li>
              How We Share Your Information
              <ol>
                <li>
                  Third-Party Service Providers:<br/> We may share your personal
                  information with trusted third-party service providers who
                  assist us in delivering our services, processing payments, or
                  managing our website. These service providers are required to
                  protect your data and are not allowed to use it for their own
                  purposes.
                </li>
                <li>
                  Business Transfers:<br/> In the event of a merger, acquisition, or
                  sale of our company or assets, your information may be
                  transferred to the new entity subject to this Privacy Policy.
                </li>
                <li>
                  Legal Requirements:<br/> We may disclose your information if
                  required by law or in response to a valid legal request.
                </li>
              </ol>
            </li>
            <li>
              Data Security We take data security seriously and employ
              industry-standard measures to safeguard your personal information
              from unauthorized access, loss, misuse, or alteration. However, no
              data transmission over the internet or electronic storage is
              completely secure, and we cannot guarantee absolute security.
            </li>
            <li>
              Your Choices
              <ol>
                <li>
                  Access and Update:<br/> You can access and update your personal
                  information by logging into your account or contacting our
                  customer support.
                </li>
                <li>
                  Marketing Preferences:<br/> You can manage your marketing
                  communication preferences by following the instructions in the
                  emails you receive from us or by contacting us directly.
                </li>
              </ol>
            </li>
            <li>
              Children's Privacy Our services are not intended for children
              under the age of 18. We do not knowingly collect personal
              information from children under 18. If you believe we have
              inadvertently collected such information, please contact us
              immediately.
            </li>
            <li>
              Changes to this Privacy Policy We may update this Privacy Policy
              from time to time to reflect changes in our practices or for other
              operational, legal, or regulatory reasons. We will notify you of
              any material changes through our website or other communication
              channels.
            </li>
            <li>
              Contact Us If you have any questions or concerns about this
              Privacy Policy or our data practices, please contact us at: [Your
              Delivery Company Name] Address: [Your Address] Email: [Your Email]
              Phone: [Your Phone Number] By using our delivery services or
              accessing our website, you agree to the terms outlined in this
              Privacy Policy. Thank you for trusting [Your Delivery Company
              Name] with your deliveries.
            </li>
          </ol>
          <img src={siteImg} alt="site image" />
        </div>
      </div>
    </>
  );
}
