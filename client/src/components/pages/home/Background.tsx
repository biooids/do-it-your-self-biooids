"use client";

import { useState, useEffect } from "react";

function Background() {
  // State to store the mouse coordinates
  const [mousePosition, setMousePosition] = useState({ x: -500, y: -500 });

  useEffect(() => {
    // Handler to update the mouse position state
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    // Add event listener when the component mounts
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    // Use 'fixed' positioning to ensure the background covers the entire viewport
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      {/* Layer 1: The static multi-colored grid */}
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#ff00c41a_1px,transparent_1px),linear-gradient(to_right,#00c4ff20_1px,transparent_1px),linear-gradient(to_bottom,#6a0dad33_1px,transparent_1px)] bg-[size:4rem_4rem,2rem_2rem,2rem_2rem]" />

      {/* Layer 2: The interactive, cursor-following blob */}
      {/* This div is styled to be a large, circular, multi-colored gradient.
          - The 'blur-3xl' and 'opacity-20' classes give it a soft, ethereal look.
          - 'transition-transform' and 'duration-300' make its movement smooth.
          - The inline style uses CSS transform to position the blob's center on the cursor.
            The offset (-192px) is half of the blob's width/height (w-96/h-96 = 24rem = 384px).
      */}
      <div
        className="absolute h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,_#00c4ff80_0%,_#6a0dad60_50%,_#ff00c440_100%)] opacity-20 blur-3xl transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 192}px, ${
            mousePosition.y - 192
          }px)`,
        }}
      />
    </div>
  );
}

export default Background;
