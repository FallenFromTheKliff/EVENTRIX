import { useState, useEffect, useRef } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&@";
const hiddenStyles = { up: "opacity-0 translate-y-10", right: "opacity-0 translate-x-10", slide: "opacity-0 translate-x-32", reappear: "opacity-0" };
const scramble = (text, solved) => [...text].map((char, i) => i < solved || char === " " ? char : letters[Math.floor(Math.random() * letters.length)]).join("");

export default function Reveal({ children, className = "", variant = "up", ready = true }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [waited, setWaited] = useState(false);
  const [text, setText] = useState("");
  const shown = inView && (ready || waited);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => setWaited(true), 500);
    return () => clearTimeout(timer);
  }, [inView]);

  useEffect(() => {
    if (variant !== "type" || !shown) return;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setText(scramble(children, Math.ceil(children.length * step / 10)));
      if (step === 10) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [variant, shown, children]);

  if (variant === "type") return <span ref={ref} className={`transition-opacity duration-300 ${text === children ? "" : "opacity-70"} ${text ? "" : "invisible"}`}>{text || children}</span>;

  if (variant === "lazy") return (
    <div ref={ref} className={`relative ${className}`}>
      {!shown && <div className="absolute inset-0 z-10 animate-pulse bg-zinc-700" />}
      {children}
    </div>
  );

  return (
    <div ref={ref} className={`${className} transition duration-500 ${shown ? "" : hiddenStyles[variant]}`}>
      {children}
    </div>
  )
}