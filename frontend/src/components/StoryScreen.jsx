import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StoryScreen.css";

function StoryScreen() {
  const canvasRef = useRef(null);
  const navigate = useNavigate(); // To navigate to another route

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@$%&".split("");
    const fontSize = 11;
    let columns = canvas.width / fontSize;
    const drops = Array.from({ length: columns }, () => 1);
    const speeds = Array.from({ length: columns }, () => Math.random() + 0.5);

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
      ctx.font = fontSize + "px arial";
      drops.forEach((drop, i) => {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drop * fontSize);

        if (drop * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += speeds[i];
      });
    }

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);
  const startGame = () => {
    // Navigate to the game screen or another route
    navigate("/story"); // Adjust the route to match your application
  };
  return (
    <>
      <canvas ref={canvasRef}></canvas>
      <div id="title">Cybernetic Sabotage</div>
      <div id="start-button" onClick={startGame}>
        &gt;_ START
      </div>
    </>
  );
}

export default StoryScreen;
