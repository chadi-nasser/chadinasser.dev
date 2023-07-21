import React, { useEffect, useState } from "react";
import Giscus from "@giscus/react";
import { GISCUS_CONFIG } from "@/config";

export const CommentSection = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="px-4 py-3 dark:bg-[#0D1117] rounded-md border">
      <Giscus
        {...{
          ...GISCUS_CONFIG,
          theme: isDarkMode ? "dark_protanopia" : "light",
        }}
      />
    </section>
  );
};
