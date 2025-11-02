import '../../css/pages/landing.css';
import AuthHead from "../../components/auth/AuthHead";

export default function Support() {
    return (
        <div className="landing">
            <AuthHead />

            <div className="container">
                <div>
                    <h1>Support</h1>
                    <hr/>
                    <p>
                        <strong>Email Support:</strong> <a href="mailto:info@eventrix.com">info@eventrix.com</a><br />
                        <strong>Hotline:</strong> <a href="tel:+639123456789">+63 912 345 6789</a> (Philippines)<br />
                        <strong>Office Address:</strong> 3rd Floor, Eventrix Tower, Makati City, Philippines<br />
                        <strong>Operating Hours:</strong> Monday – Friday, 9:00 AM – 6:00 PM
                    </p>

                    <br/>
                    <h1>FAQs</h1>
                    <hr/>

                    <p><strong>How do I book a ticket on EVENTRIX?</strong><br/>
                    You can browse events on our events page and select the one you’d like to attend with a press of a button!</p>

                    <p><strong>Can I book multiple tickets at once?</strong><br />
                    Yes, you can select multiple seats or adjust ticket quantities before checking out.</p>

                    <p><strong>What payment methods are accepted?</strong><br />
                    We accept most major credit cards, debit cards, and e-wallets such as GCash and PayPal.</p>

                    <p><strong>How will I receive my ticket?</strong><br />
                    After a successful booking, your e-ticket will be sent to your registered email address. 
                    You can also access it anytime under “My Tickets” in your Eventrix account.</p>

                    <p><strong>Do I need to print my ticket?</strong><br />
                    Not necessarily, as most events accept digital tickets. 
                    You can show your e-ticket QR code at the venue entrance.</p>

                    <p><strong>Can I transfer my ticket to someone else?</strong><br />
                    Yes, depending on the event organizer’s policy. 
                    Please check the event’s terms before completing your purchase.</p>

                    <p><strong>Can I cancel or refund my ticket?</strong><br />
                    Cancellations and refunds depend on the event organizer’s rules. 
                    Kindly refer to their refund policy before booking.</p>

                    <p><strong>What happens if I lose my ticket?</strong><br />
                    Your e-ticket is always available under “My Bookings” in your EVENTRIX account. 
                    You can re-download or show it anytime.</p>

                    <p><strong>Why didn’t I receive my ticket via email?</strong><br />
                    Please check your Spam or Promotions folder first. 
                    If it’s not there, contact us at <a href="mailto:info@eventrix.com">info@eventrix.com</a> 
                    with your booking reference number for assistance.</p>

                    <p><strong>Who do I contact for further help?</strong><br />
                    Our support team is always ready to assist. 
                    You can reach us through <a href="mailto:info@eventrix.com">info@eventrix.com</a></p>
                </div>
            </div>
        </div>
    );
}