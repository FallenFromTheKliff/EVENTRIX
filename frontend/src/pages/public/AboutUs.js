import '../../css/pages/landing.css';
import AuthHead from "../../components/auth/AuthHead";

export default function AboutUs() {
    return (
        <div className="landing">
            <AuthHead />

            <div className="container">
                <div>
                    <h1>About Us</h1>
                    <hr/>
                    <p>
                        <strong>EVENTRIX</strong> is your gateway to unforgettable experiences across the Philippines. 
                        We make it easy to explore, discover, and book tickets for concerts, festivals, theater shows, and 
                        live performances happening on stages nationwide.
                    </p>

                    <p>
                        Whether you're a music lover, theater enthusiast, or just looking for something exciting to do, 
                        Eventrix connects you directly with events that bring people together through art, culture, and entertainment.
                    </p>

                    <p>
                        Our mission is to provide a seamless and secure ticketing experience — from browsing your favorite 
                        shows to confirming your spot in seconds. With Eventrix, your next big moment is only a few clicks away.
                    </p>
                </div>
            </div>
        </div>
    );
}