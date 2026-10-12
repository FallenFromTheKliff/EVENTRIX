import { useState, useEffect, useRef } from "react";

export default function Reveal({ children, className }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className} transition duration-500 ${visible ? "" : "opacity-0 translate-y-10"}`}>
      {children}
    </div>
  )
}