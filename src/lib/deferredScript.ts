type ScriptAttributes = Record<string, string | boolean | undefined>;

interface ScriptState {
  promise: Promise<HTMLScriptElement>;
  status: 'pending' | 'resolved' | 'rejected';
}

const scriptCache = new Map<string, ScriptState>();

export function loadScriptOnce(
  url: string,
  attrs: ScriptAttributes = {}
): Promise<HTMLScriptElement> {
  const cached = scriptCache.get(url);
  
  if (cached && cached.status !== 'rejected') {
    return cached.promise;
  }

  const promise = new Promise<HTMLScriptElement>((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${url}"]`) as HTMLScriptElement;
    if (existingScript) {
      scriptCache.set(url, { promise: Promise.resolve(existingScript), status: 'resolved' });
      return resolve(existingScript);
    }

    const script = document.createElement('script');
    script.src = url;

    Object.entries(attrs).forEach(([key, value]) => {
      if (value === true) {
        script.setAttribute(key, '');
      } else if (value !== false && value !== undefined) {
        script.setAttribute(key, String(value));
      }
    });

    script.onload = () => {
      const state = scriptCache.get(url);
      if (state) state.status = 'resolved';
      resolve(script);
    };

    script.onerror = () => {
      scriptCache.delete(url);
      reject(new Error(`Failed to load script: ${url}`));
    };

    document.head.appendChild(script);
  });

  scriptCache.set(url, { promise, status: 'pending' });

  return promise;
}

export function loadOnInteraction(
  url: string,
  attrs: ScriptAttributes = {},
  target?: HTMLElement
): Promise<HTMLScriptElement> {
  return new Promise((resolve) => {
    const load = () => {
      cleanup();
      resolve(loadScriptOnce(url, attrs));
    };

    const interactionEvents = ['mousedown', 'touchstart', 'keydown', 'scroll'];
    const cleanup = () => {
      interactionEvents.forEach((e) => window.removeEventListener(e, load));
      if (observer && target) observer.unobserve(target);
    };

    interactionEvents.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));

    let observer: IntersectionObserver | undefined;
    if (target && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            load();
          }
        },
        { rootMargin: '200px' }
      );
      observer.observe(target);
    }
  });
}
