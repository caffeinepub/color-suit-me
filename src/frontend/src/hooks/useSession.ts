import { useEffect, useRef } from "react";
import { useActor } from "./useActor";

const SESSION_KEY = "colorSuitMe_sessionId";

export function getOrCreateSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function useSession() {
  const sessionId = useRef<string>(getOrCreateSessionId());
  const initialized = useRef(false);
  const { actor } = useActor();

  useEffect(() => {
    if (initialized.current || !actor) return;
    initialized.current = true;
    const id = sessionId.current;
    (async () => {
      try {
        await actor.createSession(id);
      } catch {
        // silent fail
      }
    })();
  }, [actor]);

  return sessionId.current;
}
