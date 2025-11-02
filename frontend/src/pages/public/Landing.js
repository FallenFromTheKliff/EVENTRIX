import '../../css/pages/landing.css';
import '../../css/components/auth/collage.css';
import placeholderImg from '../../assets/images/placeholder.jpeg';

import AuthHead from '../../components/auth/AuthHead';

export default function Landing() {
    return (
        <div className="landing">
            <AuthHead />

            <div className="container land">
                <section>
                    <h1>Your next unforgettable</h1>
                    <h1 className="expo">EXPERIENCE</h1>
                    <h1>is just one click away.</h1>
                    <hr />
                    <p>Start your journey today!</p>
                </section>

                <div className="photo-collage">
                    {[1, 2, 3].map((_, i) => (
                        <img
                            key={i}
                            src={placeholderImg}
                            alt="Placeholder"
                            className={`photo ${i === 1 ? 'active' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}