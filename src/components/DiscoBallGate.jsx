import { lazy, Suspense, useEffect, useRef, useState } from "react";

const DiscoBallSection = lazy(() => import("./DiscoBallSection.jsx"));

export default function DiscoBallGate() {
  const gateRef = useRef(null);
  const supportsIntersectionObserver =
    typeof window !== "undefined" && "IntersectionObserver" in window;
  const [shouldLoad, setShouldLoad] = useState(
    () => !supportsIntersectionObserver,
  );

  useEffect(() => {
    if (!supportsIntersectionObserver) return undefined;
    const gate = gateRef.current;
    if (!gate) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(gate);
    return () => observer.disconnect();
  }, [supportsIntersectionObserver]);

  return (
    <div
      aria-label="Disco Light Lab"
      aria-busy={!shouldLoad}
      className="disco-gate"
      id="disco-lab"
      ref={gateRef}
      role="region"
    >
      {shouldLoad ? (
        <Suspense
          fallback={
            <div className="disco-loading" role="status">
              PREPARING THE LIGHTS
            </div>
          }
        >
          <DiscoBallSection />
        </Suspense>
      ) : (
        <div aria-hidden="true" className="disco-loading disco-loading-idle" />
      )}
    </div>
  );
}
